const createHttpError = require("http-errors");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const config = require("../config/config");
const { sendSignupApprovalRequest } = require("../utils/mailer");
const Role = require("../models/roleModel");
const UserAuditLog = require("../models/userAuditLogModel");
const { permissions: permissionCatalog, allPermissions, roleDefaults, getEffectivePermissions } = require("../utils/rbac");

const normalizeUser = (user) => {
    const result = user.toObject ? user.toObject() : user;
    delete result.password;
    delete result.approvalToken;
    delete result.authVersion;
    return result;
};

const audit = (req, action, targetUserId = null, details = {}, outcome = "success", reason = "") => {
    req.auditLogged = true;
    return UserAuditLog.create({
        actorId: req.user?._id || null,
        targetUserId,
        action,
        outcome,
        reason,
        details,
    });
};

const passwordIsStrong = (password) =>
    typeof password === "string" &&
    password.length >= 12 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

const isSuperAdmin = (user) => String(user?.role || "").trim().toLowerCase() === "super admin";

const setAccessCookie = (res, user) => {
    const token = jwt.sign({ _id: user._id, authVersion: user.authVersion }, config.accessTokenSecret, {
        expiresIn: "1d",
    });
    const isProd = config.nodeEnv === "production";
    const cookieOptions = {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: isProd ? "none" : "lax",
        secure: isProd,
    };
    if (config.cookieDomain) cookieOptions.domain = config.cookieDomain;
    res.cookie("accessToken", token, cookieOptions);
};

const validatePermissionDelegation = (req, permissions = []) => {
    if (!Array.isArray(permissions) || permissions.some((p) => !allPermissions.includes(p))) {
        return "One or more permissions are invalid.";
    }
    if (String(req.user.role).toLowerCase() !== "super admin" &&
        permissions.some((permission) => !req.permissions.includes(permission))) {
        return "You cannot grant permissions you do not have.";
    }
    return null;
};

const register = async (req, res, next) => {
    try {

        const { name, phone, email, password, role } = req.body;
        const allowedRoles = ["Waiter", "Cashier", "Admin", "Accountant", "Asset Manager", "Read Only"];

        if(!name || !phone || !email || !password || !role){
            const error = createHttpError(400, "All fields are required!");
            return next(error);
        }
        if (!allowedRoles.includes(role)) {
            return next(createHttpError(400, "Choose a valid account role."));
        }

        const isUserPresent = await User.findOne({email});
        if(isUserPresent){
            const error = createHttpError(400, "User already exist!");
            return next(error);
        }

        const approvalToken = crypto.randomBytes(24).toString("hex");
        const user = { name, phone, email, password, role, status: "Pending", approvalToken };
        const newUser = User(user);
        await newUser.save();

        try {
            await sendSignupApprovalRequest(newUser);
        } catch (mailError) {
            // Don't fail the signup just because the notification email
            // couldn't be sent — the admin can still approve manually.
            console.error("Failed to send signup approval email:", mailError.message);
        }

        res.status(201).json({
            success: true,
            message: `Account created! An admin will review and approve your ${role} access before you can log in.`,
            data: { name: newUser.name, email: newUser.email, role: newUser.role, status: newUser.status },
        });


    } catch (error) {
        next(error);
    }
}


const login = async (req, res, next) => {

    try {
        
        const { email, password } = req.body;

        if(!email || !password) {
            const error = createHttpError(400, "All fields are required!");
            return next(error);
        }

        const credential = String(email).trim();
        const escapedCredential = credential.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const isUserPresent = await User.findOne({
            $or: [
                { email: new RegExp(`^${escapedCredential}$`, "i") },
                { username: credential.toLowerCase() },
            ],
        });
        if(!isUserPresent){
            await UserAuditLog.create({ action: "login.failed", outcome: "failure", reason: "Invalid credentials" });
            const error = createHttpError(401, "Invalid Credentials");
            return next(error);
        }

        const isMatch = await bcrypt.compare(password, isUserPresent.password);
        if(!isMatch){
            await UserAuditLog.create({
                targetUserId: isUserPresent._id,
                action: "login.failed",
                outcome: "failure",
                reason: "Invalid credentials",
            });
            const error = createHttpError(401, "Invalid Credentials");
            return next(error);
        }

        if (!isUserPresent.active) {
            await UserAuditLog.create({
                targetUserId: isUserPresent._id,
                action: "login.failed",
                outcome: "failure",
                reason: "Inactive account",
            });
            return next(createHttpError(403, "This account is inactive. Contact your administrator."));
        }
        if (isUserPresent.status === "Pending") {
            await UserAuditLog.create({ targetUserId: isUserPresent._id, action: "login.failed", outcome: "failure", reason: "Account pending approval" });
            const error = createHttpError(403, "Your account is awaiting admin approval. You'll be able to log in once it's approved.");
            return next(error);
        }

        if (isUserPresent.status === "Rejected") {
            await UserAuditLog.create({ targetUserId: isUserPresent._id, action: "login.failed", outcome: "failure", reason: "Account rejected" });
            const error = createHttpError(403, "Your account request was not approved. Contact your admin for details.");
            return next(error);
        }

        isUserPresent.lastLoginAt = new Date();
        await isUserPresent.save();
        await UserAuditLog.create({
            actorId: isUserPresent._id,
            targetUserId: isUserPresent._id,
            action: "login.succeeded",
        });

        setAccessCookie(res, isUserPresent);

        const role = await Role.findOne({ key: String(isUserPresent.role).trim().toLowerCase() }).lean();
        const userData = normalizeUser(isUserPresent);
        userData.permissions = getEffectivePermissions(isUserPresent, role);
        res.status(200).json({success: true, message: "User login successfully!", data: userData});


    } catch (error) {
        next(error);
    }

}

// Clicked from the approval email — no login required, protected by the
// random token instead. Sets the account to Approved so they can log in.
const approveUser = async (req, res, next) => {
    try {
        const { id, token } = req.params;
        const user = await User.findById(id);

        if (!user || !user.approvalToken || user.approvalToken !== token) {
            return res.status(400).send("This approval link is invalid or has already been used.");
        }

        user.status = "Approved";
        user.approvalToken = null;
        await user.save();

        res.send(`<h2>${user.name} (${user.role}) has been approved. They can now log in.</h2>`);
    } catch (error) {
        next(error);
    }
}

const rejectUser = async (req, res, next) => {
    try {
        const { id, token } = req.params;
        const user = await User.findById(id);

        if (!user || !user.approvalToken || user.approvalToken !== token) {
            return res.status(400).send("This link is invalid or has already been used.");
        }

        user.status = "Rejected";
        user.approvalToken = null;
        await user.save();

        res.send(`<h2>${user.name}'s (${user.role}) signup request has been rejected.</h2>`);
    } catch (error) {
        next(error);
    }
}

const getUserData = async (req, res, next) => {
    try {
        const role = await Role.findOne({ key: String(req.user.role).trim().toLowerCase() }).lean();
        const user = normalizeUser(req.user);
        user.permissions = getEffectivePermissions(req.user, role);
        res.status(200).json({success: true, data: user});

    } catch (error) {
        next(error);
    }
};

    const listUsers = async (req, res, next) => {
        try {
            const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
            const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 25));
            const query = {};
            const search = String(req.query.search || "").trim();
            if (search) {
                const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                query.$or = [
                    { name: new RegExp(escaped, "i") },
                    { username: new RegExp(escaped, "i") },
                    { email: new RegExp(escaped, "i") },
                ];
            }
            if (req.query.role) query.role = req.query.role;
            if (req.query.status === "active") query.active = true;
            if (req.query.status === "inactive") query.active = false;
            const [users, total] = await Promise.all([
                User.find(query).select("-password -approvalToken -authVersion")
                    .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
                User.countDocuments(query),
            ]);
            const roles = await Role.find().lean();
            const roleMap = new Map(roles.map((role) => [role.key, role]));
            const data = users.map((user) => ({
                ...user,
                permissions: getEffectivePermissions(user, roleMap.get(String(user.role).toLowerCase())),
            }));
            res.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
        } catch (error) {
            next(error);
        }
    };

    const getManagedUser = async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id).select("-password -approvalToken -authVersion").lean();
            if (!user) return next(createHttpError(404, "User not found."));
            const role = await Role.findOne({ key: String(user.role).toLowerCase() }).lean();
            res.json({ success: true, data: { ...user, permissions: getEffectivePermissions(user, role) } });
        } catch (error) {
            next(error);
        }
    };

    const createManagedUser = async (req, res, next) => {
        try {
            const { name, username, email, phone, employeeId, password, confirmPassword, role, active = true, notes = "", permissions = [], denied = [] } = req.body;
            if (![name, username, email, phone, password, confirmPassword, role].every((value) => String(value || "").trim())) {
                return next(createHttpError(400, "Name, username, email, phone, password, password confirmation, and role are required."));
            }
            if (password !== confirmPassword) return next(createHttpError(400, "Passwords do not match."));
            if (!/^\S+@\S+\.\S+$/.test(String(email).trim())) return next(createHttpError(400, "Enter a valid email address."));
            const phoneDigits = String(phone).replace(/\D/g, "");
            if (!/^\+?[0-9 ()-]{7,20}$/.test(String(phone).trim()) || phoneDigits.length < 7 || phoneDigits.length > 15) {
                return next(createHttpError(400, "Enter a valid phone number."));
            }
            if (!/^[a-zA-Z0-9._-]{3,32}$/.test(String(username).trim())) return next(createHttpError(400, "Username must be 3–32 characters using letters, numbers, dots, underscores, or hyphens."));
            if (!passwordIsStrong(password)) return next(createHttpError(400, "Password must be at least 12 characters and include uppercase, lowercase, number, and symbol characters."));
            if (typeof active !== "boolean") return next(createHttpError(400, "Account status must be active or inactive."));
            const roleKey = String(role).trim().toLowerCase();
            const existingRole = await Role.findOne({ key: roleKey }).lean();
            if (!roleDefaults[roleKey] && !existingRole) {
                return next(createHttpError(400, "Select a valid predefined or custom role."));
            }
            if (["super admin", "admin"].includes(roleKey) && !isSuperAdmin(req.user)) {
                return next(createHttpError(403, "Only the Super Admin can create an administrator account."));
            }
            const assignedRolePermissions = existingRole?.permissions || roleDefaults[roleKey] || [];
            if (String(req.user.role).toLowerCase() !== "super admin" &&
                assignedRolePermissions.some((permission) => !req.permissions.includes(permission))) {
                return next(createHttpError(403, "You cannot assign a role with permissions you do not have."));
            }
            const delegationError = validatePermissionDelegation(req, permissions);
            if (delegationError) return next(createHttpError(403, delegationError));
            const deniedError = validatePermissionDelegation(req, denied);
            if (deniedError) return next(createHttpError(403, deniedError));
            const normalizedEmail = String(email).trim().toLowerCase();
            const normalizedUsername = String(username).trim().toLowerCase();
            const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const duplicate = await User.findOne({
                $or: [{ email: new RegExp(`^${escapedEmail}$`, "i") }, { username: normalizedUsername }],
            });
            if (duplicate) return next(createHttpError(409, "That email address or username is already in use."));
            const user = new User({
                name: String(name).trim(),
                username: normalizedUsername,
                email: normalizedEmail,
                phone: String(phone).trim(),
                employeeId: String(employeeId || "").trim(),
                notes: String(notes || "").trim(),
                password,
                role: String(role).trim(),
                status: "Approved",
                active,
                permissionOverrides: { granted: permissions, denied },
            });
            await user.save();
            await audit(req, "user.created", user._id, { role: user.role, active: user.active });
            res.status(201).json({ success: true, message: "Employee account created.", data: normalizeUser(user) });
        } catch (error) {
            next(error);
        }
    };

    const updateManagedUser = async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) return next(createHttpError(404, "User not found."));
            if (["admin", "super admin"].includes(String(user.role).toLowerCase()) && !isSuperAdmin(req.user)) {
                return next(createHttpError(403, "Only the Super Admin may manage administrator accounts."));
            }
            if (String(user._id) === String(req.user._id) && ("role" in req.body || "permissions" in req.body)) {
                return next(createHttpError(403, "You cannot change your own role or permissions."));
            }
            const allowed = ["name", "email", "phone", "username", "employeeId", "notes"];
            for (const field of allowed) {
                if (field in req.body) user[field] = field === "email" || field === "username"
                    ? String(req.body[field] || "").trim().toLowerCase()
                    : req.body[field];
            }
            if (user.email && !/^\S+@\S+\.\S+$/.test(user.email)) return next(createHttpError(400, "Enter a valid email address."));
            if ("phone" in req.body && !/^\+?[0-9 ()-]{7,20}$/.test(String(user.phone || ""))) return next(createHttpError(400, "Enter a valid phone number."));
            if (user.username && !/^[a-zA-Z0-9._-]{3,32}$/.test(user.username)) return next(createHttpError(400, "Username must be 3–32 valid characters."));
            const duplicate = await User.findOne({
                _id: { $ne: user._id },
                $or: [
                    { email: new RegExp(`^${user.email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
                    ...(user.username ? [{ username: user.username }] : []),
                ],
            });
            if (duplicate) return next(createHttpError(409, "That email address or username is already in use."));
            await user.save();
            await audit(req, "user.edited", user._id, { fields: Object.keys(req.body).filter((field) => allowed.includes(field)) });
            res.json({ success: true, message: "Employee updated.", data: normalizeUser(user) });
        } catch (error) {
            next(error);
        }
    };

    const changeUserRole = async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) return next(createHttpError(404, "User not found."));
            if (["admin", "super admin"].includes(String(user.role).toLowerCase()) && !isSuperAdmin(req.user)) {
                return next(createHttpError(403, "Only the Super Admin may manage administrator accounts."));
            }
            if (String(user._id) === String(req.user._id)) return next(createHttpError(403, "You cannot change your own role."));
            const roleName = String(req.body.role || "").trim();
            const roleKey = roleName.toLowerCase();
            const customRole = await Role.findOne({ key: roleKey }).lean();
            if (!roleDefaults[roleKey] && !customRole) return next(createHttpError(400, "Select a valid role."));
            if (roleKey === "super admin" && String(req.user.role).toLowerCase() !== "super admin") {
                return next(createHttpError(403, "Only the Super Admin can assign the Super Admin role."));
            }
            if (roleKey === "admin" && !isSuperAdmin(req.user)) {
                return next(createHttpError(403, "Only the Super Admin can assign the Admin role."));
            }
            const assignedRolePermissions = customRole?.permissions || roleDefaults[roleKey] || [];
            if (String(req.user.role).toLowerCase() !== "super admin" &&
                assignedRolePermissions.some((permission) => !req.permissions.includes(permission))) {
                return next(createHttpError(403, "You cannot assign a role with permissions you do not have."));
            }
            if (["super admin", "admin"].includes(String(user.role).toLowerCase()) &&
                String(req.user.role).toLowerCase() !== "super admin") {
                return next(createHttpError(403, "Only the Super Admin may change an administrator account's role."));
            }
            if (String(user.role).toLowerCase() === "super admin" && roleKey !== "super admin") {
                const remaining = await User.countDocuments({
                    role: user.role,
                    active: true,
                    status: "Approved",
                    _id: { $ne: user._id },
                });
                if (!remaining) return next(createHttpError(409, "The last active Super Admin cannot be demoted."));
            }
            user.role = roleName;
            user.permissionOverrides = { granted: [], denied: [] };
            user.authVersion += 1;
            await user.save();
            await audit(req, "user.role.changed", user._id, { role: roleName, permissionOverridesReset: true });
            res.json({ success: true, data: normalizeUser(user) });
        } catch (error) {
            next(error);
        }
    };

    const updateUserPermissions = async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) return next(createHttpError(404, "User not found."));
            if (["admin", "super admin"].includes(String(user.role).toLowerCase()) && !isSuperAdmin(req.user)) {
                return next(createHttpError(403, "Only the Super Admin may manage administrator accounts."));
            }
            if (String(user._id) === String(req.user._id)) return next(createHttpError(403, "You cannot change your own permissions."));
            const { granted = [], denied = [] } = req.body;
            for (const value of [granted, denied]) {
                const error = validatePermissionDelegation(req, value);
                if (error) return next(createHttpError(403, error));
            }
            user.permissionOverrides = { granted: [...new Set(granted)], denied: [...new Set(denied)] };
            user.authVersion += 1;
            await user.save();
            await audit(req, "user.permissions.changed", user._id, {
                granted: user.permissionOverrides.granted,
                denied: user.permissionOverrides.denied,
            });
            res.json({ success: true, data: { ...normalizeUser(user), permissions: getEffectivePermissions(user) } });
        } catch (error) {
            next(error);
        }
    };

    const updateUserStatus = async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) return next(createHttpError(404, "User not found."));
            if (["admin", "super admin"].includes(String(user.role).toLowerCase()) && !isSuperAdmin(req.user)) {
                return next(createHttpError(403, "Only the Super Admin may manage administrator accounts."));
            }
            if (String(user._id) === String(req.user._id) && req.body.active === false) return next(createHttpError(403, "You cannot deactivate your own account."));
            if (typeof req.body.active !== "boolean") return next(createHttpError(400, "Account status must be active or inactive."));
            if (String(user.role).toLowerCase() === "super admin" && !req.body.active) {
                const remaining = await User.countDocuments({ role: user.role, active: true, status: "Approved", _id: { $ne: user._id } });
                if (!remaining) return next(createHttpError(409, "The last active Super Admin cannot be deactivated."));
            }
            if (["admin", "super admin"].includes(String(user.role).toLowerCase()) &&
                String(req.user.role).toLowerCase() !== "super admin") {
                return next(createHttpError(403, "Only the Super Admin may change an administrator account's status."));
            }
            user.active = req.body.active;
            user.authVersion += 1;
            await user.save();
            await audit(req, req.body.active ? "user.activated" : "user.deactivated", user._id);
            res.json({ success: true, data: normalizeUser(user) });
        } catch (error) {
            next(error);
        }
    };

    const resetManagedPassword = async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) return next(createHttpError(404, "User not found."));
            if (["admin", "super admin"].includes(String(user.role).toLowerCase()) && !isSuperAdmin(req.user)) {
                return next(createHttpError(403, "Only the Super Admin may manage administrator accounts."));
            }
            if (String(user._id) === String(req.user._id)) return next(createHttpError(403, "Use the account password-change flow for your own account."));
            if (["admin", "super admin"].includes(String(user.role).toLowerCase()) &&
                String(req.user.role).toLowerCase() !== "super admin") {
                return next(createHttpError(403, "Only the Super Admin may reset an administrator password."));
            }
            if (req.body.password !== req.body.confirmPassword) return next(createHttpError(400, "Passwords do not match."));
            if (!passwordIsStrong(req.body.password)) return next(createHttpError(400, "Temporary password must be at least 12 characters and include uppercase, lowercase, number, and symbol characters."));
            user.password = req.body.password;
            user.forcePasswordChange = true;
            user.authVersion += 1;
            await user.save();
            await audit(req, "user.password.reset", user._id, { forcePasswordChange: true });
            res.json({ success: true, message: "Password reset. The employee must change it after signing in." });
        } catch (error) {
            next(error);
        }
    };

    const changeOwnPassword = async (req, res, next) => {
        try {
            const { currentPassword, newPassword } = req.body;
            if (!await bcrypt.compare(String(currentPassword || ""), req.user.password)) return next(createHttpError(400, "Current password is incorrect."));
            if (newPassword !== req.body.confirmPassword) return next(createHttpError(400, "Passwords do not match."));
            if (!passwordIsStrong(newPassword)) return next(createHttpError(400, "Password must be at least 12 characters and include uppercase, lowercase, number, and symbol characters."));
            req.user.password = newPassword;
            req.user.forcePasswordChange = false;
            req.user.authVersion += 1;
            await req.user.save();
            setAccessCookie(res, req.user);
            await audit(req, "user.password.changed", req.user._id);
            res.json({ success: true, message: "Password changed successfully." });
        } catch (error) {
            next(error);
        }
    };

    const listRoles = async (_req, res, next) => {
        try {
            const customRoles = await Role.find().sort({ name: 1 }).lean();
            const builtins = Object.entries(roleDefaults).map(([key, rolePermissions]) => ({
                name: key.replace(/\b\w/g, (letter) => letter.toUpperCase()),
                key,
                permissions: rolePermissions,
                isSystem: true,
            }));
            res.json({ success: true, data: builtins.concat(customRoles.filter((role) => !role.isSystem)) });
        } catch (error) {
            next(error);
        }
    };

    const getPermissionCatalog = (_req, res) => {
        res.json({
            success: true,
            data: permissionCatalog.map(([key, label]) => ({ key, label })),
        });
    };

    const saveRole = async (req, res, next) => {
        try {
            const name = String(req.body.name || "").trim();
            const rolePermissions = req.body.permissions;
            if (!/^[A-Za-z][A-Za-z0-9 &_-]{1,39}$/.test(name)) return next(createHttpError(400, "Role name must be 2–40 characters."));
            if (!Array.isArray(rolePermissions) || rolePermissions.some((permission) => !allPermissions.includes(permission))) {
                return next(createHttpError(400, "Role permissions are invalid."));
            }
            const delegationError = validatePermissionDelegation(req, rolePermissions);
            if (delegationError) return next(createHttpError(403, delegationError));
            const key = name.toLowerCase();
            if (roleDefaults[key]) return next(createHttpError(409, "Predefined roles cannot be overwritten."));
            const role = await Role.findOneAndUpdate(
                { key },
                { $set: { name, key, permissions: [...new Set(rolePermissions)], isSystem: false } },
                { new: true, upsert: true, runValidators: true }
            );
            await User.updateMany({ role: role.name }, { $inc: { authVersion: 1 } });
            await audit(req, "role.saved", null, { role: name, permissions: role.permissions });
            res.status(201).json({ success: true, data: role });
        } catch (error) {
            next(error);
        }
    };

    const listAuditLogs = async (req, res, next) => {
        try {
            const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
            const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 50));
            const [data, total] = await Promise.all([
                UserAuditLog.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
                    .populate("actorId", "name email").populate("targetUserId", "name email").lean(),
                UserAuditLog.countDocuments(),
            ]);
            res.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
        } catch (error) {
            next(error);
        }
    };

const logout = async (req, res, next) => {
    try {
        const clearCookieOptions = config.cookieDomain ? { domain: config.cookieDomain } : {};
        res.clearCookie('accessToken', clearCookieOptions);
        res.status(200).json({success: true, message: "User logout successfully!"});

    } catch (error) {
        next(error);
    }
}




module.exports = {
    register, login, getUserData, logout, approveUser, rejectUser,
    listUsers, getManagedUser, createManagedUser, updateManagedUser,
    changeUserRole, updateUserPermissions, updateUserStatus,
    resetManagedPassword, changeOwnPassword, listRoles, saveRole, listAuditLogs,
    getPermissionCatalog,
};