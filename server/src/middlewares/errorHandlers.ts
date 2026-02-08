import { Request, Response, NextFunction, RequestHandler } from "express";
import { ApiResponse } from "../lib/utils.js";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.log(err);
  res.status(500).json(ApiResponse.error("Internal Server Error"));
};

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json(ApiResponse.error(`Cannot ${req.method} ${req.path}`));
};
