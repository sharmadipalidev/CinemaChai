import multer from "multer";
import ApiError from "../utils/api-error.js";

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large (max 5 MB in this demo)",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors ?? [],
    });
  }

  if (err?.code === "23505") {
    return res.status(409).json({
      success: false,
      message: "A record with the same unique value already exists",
    });
  }

  if (err?.code === "23503") {
    return res.status(400).json({
      success: false,
      message: "The requested operation references a missing related record",
    });
  }

  if (err?.code === "22P02") {
    return res.status(400).json({
      success: false,
      message: "Invalid input format",
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export default errorHandler;
