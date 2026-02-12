import { Router } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import authController from "../../controllers/auth/auth_controller";

const router = Router();

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3,

  keyGenerator: (req) => {
    const email = req.body?.email?.toLowerCase()?.trim() || "unknown";
    const ip = ipKeyGenerator(req.ip); // ✅ FIXED
    return `${email}-${ip}`;
  },

  message: {
    success: false,
    message: "Too many OTP requests. Please try again in 10 minutes.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/send-otp", otpLimiter, authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.post("/verify-pass", authController.verifyPass);

export default router;
