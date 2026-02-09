// controllers/payment/payment_controller.ts
import { Request, Response } from "express";
import { webhookService } from "../../services/webhook/webhook_service";
import { supabase } from "../../lib/supabase";

export const paymentController = {
  async webhook(req: Request, res: Response) {
    try {
      const result = await webhookService.processPost(req.body);
      return res.status(200).json(result);
    } catch (err: any) {
      console.error("Webhook error:", err);
      return res.status(500).json({ error: "Webhook failed" });
    }
  },

  async checkStatus(req: Request, res: Response) {
    const { bookingId } = req.query;

    if (!bookingId) {
      return res.status(400).json({ error: "Missing bookingId" });
    }

    const { data, error } = await supabase
      .from("payments")
      .select("status")
      .eq("booking_id", bookingId)
      .single();

    if (error || !data) {
      return res.json({ paid: false });
    }

    return res.json({ paid: data.status === "success" });
  },
};
