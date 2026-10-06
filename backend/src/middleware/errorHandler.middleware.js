import { logger } from "../config/logger.js";

const errorHandler = (err, req, res, next) => {
    logger.error(err.stack || err.message);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success : false,
        message : err.message || "Something went wrong."
    });
};

export { errorHandler};