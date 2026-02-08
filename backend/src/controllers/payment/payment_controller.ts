import { Request, Response } from 'express';
import { paymentService } from '../../services/payment/payment_service';

export const paymentController = {
  webhook: async (req: Request, res: Response) => {
    try {
      const secret = req.headers['x-konfhub-secret'] as string;
      const result = await paymentService.handleWebhook(req.body, secret);
      res.json(result);
    } catch (e: any) {
      res.status(401).json({ error: e.message });
    }
  },

  checkStatus: (req: Request, res: Response) => {
    const email = req.query.email as string;
    const result = paymentService.checkStatus(email);
    res.json(result);
  }
};
