import { Router } from 'express';
import { authController } from '../../controllers/auth/auth_controller';
const router = Router();

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/verify-pass', authController.verifyPass); // ? Added

export default router;
