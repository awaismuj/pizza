const config = require("../config/config");

const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        status: statusCode,
        message: err.message,
        // Optional structured details (e.g. which items are short on stock)
        // so the storefront can show a precise message and fix the cart.
        ...(err.data ? { data: err.data } : {}),
        errorStack: config.nodeEnv === "development" ? err.stack : ""
    })
}

module.exports = globalErrorHandler;