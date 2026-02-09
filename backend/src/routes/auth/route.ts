// src/routes/auth/auth_routes.ts
import { Router } from "express";
import rateLimit from "express-rate-limit";
import authController from "../../controllers/auth/auth_controller";

const router = Router();

// 🛡️ Rate Limiter: 3 OTP requests per 10 minutes per IP
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: "Too many attempts. Please try again in 10 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/send-otp", otpLimiter, authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.post("/verify-pass", authController.verifyPass);

export default router;
