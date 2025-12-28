import { Request, Response, NextFunction } from "express";
import { authMiddleware } from "../../config/auth";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return authMiddleware(req, res, next);
};
