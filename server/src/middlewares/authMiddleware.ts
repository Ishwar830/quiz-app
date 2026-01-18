import { RequestHandler } from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { ApiResponse } from "../lib/utils.ts";

const authMiddleware: RequestHandler = async (req, res, next) => {
  const data = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!data) {
    return res.status(401).json(ApiResponse.error("Unauthorized user"));
  }

  req.user = data.user;

  next();
};

export default authMiddleware;
