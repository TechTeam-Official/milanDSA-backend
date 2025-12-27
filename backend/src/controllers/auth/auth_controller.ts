import { Request, Response } from "express";
import { AuthService } from "../../services/auth/auth_service";

export const getMe = (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  const profile = AuthService.getProfile(req.user);
  res.status(200).json(profile);
};

export const checkAccess = (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  res.status(200).json({
    authenticated: true,
    userId: req.user.id,
    roles: req.user.roles,
  });
};
