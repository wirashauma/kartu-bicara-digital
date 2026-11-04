import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  console.error("[ServerError]", err.stack || err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Terjadi kesalahan internal pada server.",
  });
}

