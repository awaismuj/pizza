const createHttpError = require("http-errors");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const config = require("../config/config");
const { sendSignupApprovalRequest } = require("../utils/mailer");

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

        const isUserPresent = await User.findOne({email});
        if(!isUserPresent){
            const error = createHttpError(401, "Invalid Credentials");
            return next(error);
        }

        const isMatch = await bcrypt.compare(password, isUserPresent.password);
        if(!isMatch){
            const error = createHttpError(401, "Invalid Credentials");
            return next(error);
        }

        if (isUserPresent.status === "Pending") {
            const error = createHttpError(403, "Your account is awaiting admin approval. You'll be able to log in once it's approved.");
            return next(error);
        }

        if (isUserPresent.status === "Rejected") {
            const error = createHttpError(403, "Your account request was not approved. Contact your admin for details.");
            return next(error);
        }

        const accessToken = jwt.sign({_id: isUserPresent._id}, config.accessTokenSecret, {
            expiresIn : '1d'
        });

        // Set cookie options depending on environment. In production, browsers require
        // secure + sameSite='none' for cross-subdomain cookie sharing.
        const isProd = config.nodeEnv === 'production';
        const cookieOptions = {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: isProd ? 'none' : 'lax',
            secure: isProd,
        };

        if (config.cookieDomain) {
            cookieOptions.domain = config.cookieDomain;
        }

        res.cookie('accessToken', accessToken, cookieOptions);

        res.status(200).json({success: true, message: "User login successfully!", 
            data: isUserPresent
        });


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
        
        const user = await User.findById(req.user._id);
        res.status(200).json({success: true, data: user});

    } catch (error) {
        next(error);
    }
}

const logout = async (req, res, next) => {
    try {
        const clearCookieOptions = config.cookieDomain ? { domain: config.cookieDomain } : {};
        res.clearCookie('accessToken', clearCookieOptions);
        res.status(200).json({success: true, message: "User logout successfully!"});

    } catch (error) {
        next(error);
    }
}




const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, "-password").sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

const createUserByAdmin = async (req, res, next) => {
    try {
        const requesterRole = String(req.user?.role || "").toLowerCase();
        if (requesterRole !== "admin") {
            return next(createHttpError(403, "Only administrators can directly create system user accounts."));
        }

        const { name, phone, email, password, role, status = "Approved", permissions, canAccessERP } = req.body;
        if (!name || !phone || !email || !password || !role) {
            return next(createHttpError(400, "Name, phone, email, password, and role are all required."));
        }

        const existing = await User.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            return next(createHttpError(400, "A user account with this email address already exists."));
        }

        const isFullAdmin = String(role).toLowerCase() === "admin";
        const defaultPermissions = {
            canAccessERP: isFullAdmin || Boolean(canAccessERP || permissions?.canAccessERP),
            canManageOrders: true,
            canManageMenu: isFullAdmin,
            canManageInventory: isFullAdmin,
            canManageStaff: isFullAdmin,
            canViewFinancials: isFullAdmin,
            canManageAssets: isFullAdmin,
            canManageSettings: isFullAdmin,
            canDeleteRecords: isFullAdmin,
            ...(permissions || {}),
        };

        const newUser = new User({
            name: name.trim(),
            phone,
            email: email.toLowerCase().trim(),
            password,
            role,
            status,
            canAccessERP: defaultPermissions.canAccessERP,
            permissions: defaultPermissions,
        });

        await newUser.save();
        const userObj = newUser.toObject();
        delete userObj.password;

        res.status(201).json({
            success: true,
            message: "System user account created successfully!",
            data: userObj,
        });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const requesterRole = String(req.user?.role || "").toLowerCase();
        if (requesterRole !== "admin") {
            return next(createHttpError(403, "Only administrators can update user accounts."));
        }

        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return next(createHttpError(404, "User not found"));

        const { name, phone, email, password, role, status, permissions, canAccessERP } = req.body;

        if (name) user.name = name.trim();
        if (phone) user.phone = phone;
        if (email) {
            const trimmedEmail = email.toLowerCase().trim();
            if (trimmedEmail !== user.email) {
                const clash = await User.findOne({ email: trimmedEmail, _id: { $ne: id } });
                if (clash) return next(createHttpError(400, "Email is already taken by another account."));
                user.email = trimmedEmail;
            }
        }
        if (role) user.role = role;
        if (status) user.status = status;
        if (password && password.trim().length >= 4) {
            user.password = password.trim();
        }

        if (permissions) {
            user.permissions = {
                ...(user.permissions ? (user.permissions.toObject ? user.permissions.toObject() : user.permissions) : {}),
                ...permissions,
            };
            if (typeof permissions.canAccessERP === "boolean") {
                user.canAccessERP = permissions.canAccessERP;
            }
        }
        if (typeof canAccessERP === "boolean") {
            user.canAccessERP = canAccessERP;
            if (!user.permissions) user.permissions = {};
            user.permissions.canAccessERP = canAccessERP;
        }

        await user.save();
        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json({
            success: true,
            message: "User account updated successfully!",
            data: userObj,
        });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const requesterRole = String(req.user?.role || "").toLowerCase();
        if (requesterRole !== "admin") {
            return next(createHttpError(403, "Only administrators can delete user accounts."));
        }

        const { id } = req.params;
        if (req.user?._id?.toString() === id) {
            return next(createHttpError(400, "You cannot delete your own logged-in admin account."));
        }

        const deleted = await User.findByIdAndDelete(id);
        if (!deleted) return next(createHttpError(404, "User not found"));

        res.status(200).json({
            success: true,
            message: "User account deleted successfully!",
            data: { _id: id },
        });
    } catch (error) {
        next(error);
    }
};

const updateUserPermissions = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { canAccessERP, role, permissions } = req.body;

        const user = await User.findById(id);
        if (!user) return next(createHttpError(404, "User not found"));

        if (typeof canAccessERP === "boolean") {
            user.canAccessERP = canAccessERP;
            if (!user.permissions) user.permissions = {};
            user.permissions.canAccessERP = canAccessERP;
        }
        if (role) user.role = role;
        if (permissions) {
            user.permissions = {
                ...(user.permissions ? (user.permissions.toObject ? user.permissions.toObject() : user.permissions) : {}),
                ...permissions,
            };
            if (typeof permissions.canAccessERP === "boolean") {
                user.canAccessERP = permissions.canAccessERP;
            }
        }

        await user.save();
        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json({
            success: true,
            message: "User permissions updated successfully!",
            data: userObj,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getUserData,
    logout,
    approveUser,
    rejectUser,
    getAllUsers,
    createUserByAdmin,
    updateUser,
    deleteUser,
    updateUserPermissions,
};