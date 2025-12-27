import { Request, Response, NextFunction } from "express";
import { jwtVerifier } from "../../config/auth";

export const requireAuth = jwtVerifier;

export const attachUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.auth || !req.auth.payload) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  const payload = req.auth.payload;

  const userId = payload.sub;
  if (!userId) {
    return res.status(401).json({ message: "Invalid token" });
  }

  req.user = {
    id: userId,
    email: typeof payload.email === "string" ? payload.email : undefined,
    roles: Array.isArray(payload["https://milan.app/roles"])
      ? (payload["https://milan.app/roles"] as string[])
      : [],
  };

  next();
};
