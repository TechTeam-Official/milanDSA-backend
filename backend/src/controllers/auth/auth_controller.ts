import { Request, Response } from 'express';
import { authService } from '../../services/auth/auth_service';

export const authController = {
  sendOtp: async (req: Request, res: Response) => {
    try {
      const result = await authService.sendOtp(req.body.email);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  },

  verifyOtp: async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;
      const result = await authService.verifyOtp(email, otp);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  },

  verifyPass: (req: Request, res: Response) => {
    try {
      const { email, passType } = req.body;
      const result = authService.verifyPass(email, passType);
      res.json(result);
    } catch (e: any) {
      res.status(403).json({ success: false, message: e.message });
    }
  }
};
