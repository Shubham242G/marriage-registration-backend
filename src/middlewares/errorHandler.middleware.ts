import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Only log error in non-production for debugging
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  // Get a safe error message - don't expose internal details in production
  const isProduction = process.env.NODE_ENV === "production";
  const message = err.message || "An unexpected error occurred";
  
  // Sanitize error message to prevent information leakage
  const safeMessage = isProduction && !err.isOperational 
    ? "An unexpected error occurred" 
    : message;

  if (err.status && typeof err.status == "number") {
    return res.status(err.status).json({ 
      status: err.status, 
      message: safeMessage 
      // Removed: err object to prevent stack trace leakage
    });
  }

  return res.status(500).json({ 
    message: safeMessage 
    // Removed: err object to prevent stack trace leakage
  });
};
