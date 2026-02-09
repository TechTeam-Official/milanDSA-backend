// controllers/webhook/webhook_controller.ts
import { Request, Response } from "express";
import { webhookService } from "../../services/webhook/webhook_service";

export const webhookController = {
  async handlePost(req: Request, res: Response) {
    try {
      const result = await webhookService.processPost(req.body);
      // Always return 200 to acknowledge receipt to the provider
      return res.status(200).json(result);
    } catch (err: any) {
      console.error("Webhook processing failed:", err.message);
      return res
        .status(200)
        .json({ status: "error", message: "Internal processing failure" });
    }
  },

  async handleGet(req: Request, res: Response) {
    const result = await webhookService.processGet(req.query);
    res.status(200).json(result);
  },
};
