import { Request, Response, NextFunction, RequestHandler } from "express";
import { ApiResponse } from "../lib/utils.js";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error("ERROR:", err);

  return res.status(500).json(
    ApiResponse.error({
      code: "SERVER ERROR",
      message: "Internal Server Error",
    }),
  );
};

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json(
    ApiResponse.error({
      code: "NOT FOUND",
      message: `Cannot ${req.method} ${req.path}`,
    }),
  );
};
