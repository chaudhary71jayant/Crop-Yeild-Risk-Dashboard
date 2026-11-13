import { logger } from "../config/logger.js";

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack || err.message);
  const statusCode = err.statusCode && Number.isInteger(err.statusCode) && err.statusCode >= 400 && err.statusCode < 600
    ? err.statusCode
    : 500;

  const message = statusCode >= 500
    ? "Internal Server Error"
    : (err.message || "Something went wrong.");

  res.status(statusCode).json({
    success: false,
    message
  });
};

export { errorHandler };