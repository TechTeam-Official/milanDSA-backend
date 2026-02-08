import { Router } from 'express';
import { paymentController } from '../../controllers/payment/payment_controller';
const router = Router();

router.post('/webhook', paymentController.webhook);
router.get('/check-payment', paymentController.checkStatus);

export default router;
