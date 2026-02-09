import { Request, Response } from "express";
import { authService } from "../../services/auth/auth_service";

export const authController = {
  /**
   * Triggers the OTP generation, hashing, and hybrid email delivery.
   */
  sendOtp: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const result = await authService.sendOtp(email);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  },

  /**
   * Verifies the SHA-256 hashed OTP from the database.
   */
  verifyOtp: async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;
      const result = await authService.verifyOtp(email, otp);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  },

  /**
   * Validates eligibility for 'event' or 'pro' pass types based on domain.
   */
  verifyPass: (req: Request, res: Response) => {
    try {
      const { email, passType } = req.body;
      // This now correctly points to the 'event' | 'pro' logic in your service
      const result = authService.verifyPass(email, passType);
      res.json(result);
    } catch (e: any) {
      // Returns 403 Forbidden for non-SRM emails attempting restricted passes
      res.status(403).json({ success: false, message: e.message });
    }
  },
};
