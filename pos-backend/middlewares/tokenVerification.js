const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../models/userModel");
const Role = require("../models/roleModel");
const { getEffectivePermissions, routePermission } = require("../utils/rbac");
const UserAuditLog = require("../models/userAuditLogModel");


const isVerifiedUser = async (req, res, next) => {
    let decodeToken;
    try {
        const { accessToken } = req.cookies || {};
        if(!accessToken){
            const error = createHttpError(401, "Please provide token!");
            return next(error);
        }
        decodeToken = jwt.verify(accessToken, config.accessTokenSecret);
    } catch (error) {
        return next(createHttpError(401, "Invalid Token!"));
    }

    try {
        const user = await User.findById(decodeToken._id);
        if(!user){
            const error = createHttpError(401, "User not exist!");
            return next(error);
        }
        if ((decodeToken.authVersion ?? 0) !== user.authVersion) {
            return next(createHttpError(401, "Your session has expired. Please sign in again."));
        }
        if (!user.active || user.status !== "Approved") {
            return next(createHttpError(401, "This account is inactive or not approved."));
        }
        if (user.forcePasswordChange &&
            !(req.baseUrl === "/api/user" && ["/me/password", "/logout", "/"].includes(req.path))) {
            return next(createHttpError(403, "Change your temporary password before continuing."));
        }

        req.user = user;
        const role = await Role.findOne({ key: String(user.role).trim().toLowerCase() }).lean();
        req.permissions = getEffectivePermissions(user, role);
        const requiredPermission = routePermission(req.baseUrl, req.path, req.method, req.body, user, req.permissions);
        req.authorization = { permission: requiredPermission };
        const hasPermission = Array.isArray(requiredPermission)
            ? requiredPermission.some((permission) => req.permissions.includes(permission))
            : req.permissions.includes(requiredPermission);
        if (requiredPermission && !hasPermission) {
            return next(createHttpError(403, "You do not have permission to perform this action."));
        }
        if (!["GET", "HEAD", "OPTIONS"].includes(req.method) &&
            !(req.baseUrl === "/api/user" && req.path === "/me/password")) {
            res.once("finish", () => {
                if (req.auditLogged) return;
                const action = req.auditActionOverride || auditAction(req);
                UserAuditLog.create({
                    actorId: req.user._id,
                    targetUserId: req.params?.id || null,
                    recordId: req.params?.id || null,
                    action,
                    outcome: res.statusCode < 400 ? "success" : "failure",
                    reason: res.statusCode >= 400 ? `HTTP ${res.statusCode}` : "",
                }).catch((error) => console.error("Failed to persist activity audit event:", error.message));
            });
        }
        next();

    } catch (error) {
        next(error);
    }
}

const auditAction = (req) => {
    if (req.baseUrl === "/api/order" && req.body?.orderStatus === "Cancelled") return "order.cancelled";
    if (req.baseUrl === "/api/order" && req.method === "DELETE") return "order.deleted";
    if (req.baseUrl === "/api/payment") return "payment.processed";
    if (req.baseUrl === "/api/inventory" && req.path.endsWith("/adjust")) return "stock.adjusted";
    if (req.baseUrl === "/api/dish" && req.method === "PUT") return "dish.updated";
    if (req.baseUrl === "/api/settings") return "financial.settings.changed";
    return `${req.baseUrl.replace(/^\/api\//, "")}.${req.method.toLowerCase()}`;
};

// Role gate — use AFTER isVerifiedUser. e.g. router.post("/", isVerifiedUser, requireRole("Admin"), handler)
// Roles are matched case-insensitively ("Admin", "Cashier", "Waiter").
const requireRole = (...allowedRoles) => {
    const allowed = allowedRoles.map((r) => String(r).toLowerCase());
    return (req, res, next) => {
        if (req.authorization?.permission) return next();
        const role = String(req.user?.role || "").toLowerCase();
        if (!allowed.includes(role)) {
            return next(createHttpError(403, `Only ${allowedRoles.join(" / ")} can do this.`));
        }
        next();
    };
};

module.exports = { isVerifiedUser, requireRole };