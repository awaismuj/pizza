const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../models/userModel");


const isVerifiedUser = async (req, res, next) => {
    try{

        const { accessToken } = req.cookies;
        
        if(!accessToken){
            const error = createHttpError(401, "Please provide token!");
            return next(error);
        }

        const decodeToken = jwt.verify(accessToken, config.accessTokenSecret);

        const user = await User.findById(decodeToken._id);
        if(!user){
            const error = createHttpError(401, "User not exist!");
            return next(error);
        }

        req.user = user;
        next();

    }catch (error) {
        const err = createHttpError(401, "Invalid Token!");
        next(err);
    }
}

// Role gate — use AFTER isVerifiedUser. e.g. router.post("/", isVerifiedUser, requireRole("Admin"), handler)
// Roles are matched case-insensitively ("Admin", "Cashier", "Waiter").
const requireRole = (...allowedRoles) => {
    const allowed = allowedRoles.map((r) => String(r).toLowerCase());
    return (req, res, next) => {
        const role = String(req.user?.role || "").toLowerCase();
        if (!allowed.includes(role)) {
            return next(createHttpError(403, `Only ${allowedRoles.join(" / ")} can do this.`));
        }
        next();
    };
};

module.exports = { isVerifiedUser, requireRole };