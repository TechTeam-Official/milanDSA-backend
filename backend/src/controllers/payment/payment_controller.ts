// controllers/payment/payment_controller.ts
import { Request, Response } from "express";
import { supabase } from "../../lib/supabase";

export const checkPaymentStatus = async (req: Request, res: Response) => {
  const { bookingId } = req.query;

  if (!bookingId) return res.status(400).json({ error: "Missing bookingId" });

  const { data, error } = await supabase
    .from("payments")
    .select("status")
    .eq("booking_id", bookingId)
    .single();

  if (error || !data) {
    return res.json({ paid: false });
  }

  return res.json({ paid: data.status === "success" });
};
