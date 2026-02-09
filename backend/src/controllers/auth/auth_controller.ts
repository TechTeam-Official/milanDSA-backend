// src/controllers/auth/auth_controller.ts
import { Request, Response } from "express";
import { authService } from "../../services/auth/auth_service";

const authController = {
  /**
   * Triggers the OTP generation, hashing, and hybrid email delivery.
   */
  sendOtp: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const result = await authService.sendOtp(email);
      return res.json(result);
    } catch (e: any) {
      return res.status(400).json({ success: false, message: e.message });
    }
  },

  /**
   * Verifies the SHA-256 hashed OTP from the database.
   */
  verifyOtp: async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;
      const result = await authService.verifyOtp(email, otp);
      return res.json(result);
    } catch (e: any) {
      return res.status(400).json({ success: false, message: e.message });
    }
  },

  /**
   * Validates eligibility for pass types based on domain.
   */
  verifyPass: (req: Request, res: Response) => {
    try {
      const { email, passType } = req.body;
      const result = authService.verifyPass(email, passType);
      return res.json(result);
    } catch (e: any) {
      return res.status(403).json({ success: false, message: e.message });
    }
  },
};

export default authController;
