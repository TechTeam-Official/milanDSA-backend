// src/controllers/auth/auth_controller.ts
import { Request, Response } from "express";

export const getMeController = (req: Request, res: Response) => {
  res.status(200).json({
    message: "Authenticated",
    auth: req.auth, // injected by Auth0 middleware
  });
};
