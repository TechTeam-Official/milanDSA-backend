import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";

export function jwtGuard(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  const token = authHeader.split(" ")[1];

  // 1. Verify the token
  const decoded = verifyJwt(token);

  // 2. Check if valid (not null) and is an object (not just a string)
  if (!decoded || typeof decoded === "string") {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }

  // 3. Type Assertion: Tell TypeScript "I promise this object has these fields"
  req.user = decoded as { id: string; email: string; name: string };

  next();
}
