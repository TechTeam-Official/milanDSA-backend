// controllers/webhook/webhook_controller.ts
import { Request, Response } from "express";
import { webhookService } from "../../services/webhook/webhook_service";

export const webhookController = {
  async handlePost(req: Request, res: Response) {
    try {
      const result = await webhookService.processPost(req.body);

      // IMPORTANT:
      // Webhook providers expect 200 even if internal logic fails
      return res.status(200).json(result);
    } catch (err: any) {
      console.error("Webhook processing failed:", err);

      return res.status(200).json({
        status: "error",
        message: "Internal processing failure",
      });
    }
  },

  async handleGet(_req: Request, _res: Response) {
    const result = await webhookService.processGet();
    return _res.status(200).json(result);
  },
};
