// services/webhook/webhook_service.ts
import { supabase } from "../../lib/supabase";

export const webhookService = {
  async processPost(payload: any) {
    const { booking_id, status } = payload;

    if (!booking_id) {
      throw new Error("No booking_id found in webhook payload");
    }

    const { data, error } = await supabase
      .from("payments")
      .update({
        status:
          status === "completed" || status === "success" ? "success" : "failed",
      })
      .eq("booking_id", booking_id)
      .select();

    if (error) {
      console.error("Supabase Update Error:", error);
      throw error;
    }

    return {
      status: "success",
      updated_booking: booking_id,
      record: data,
    };
  },

  async processGet() {
    return {
      status: "active",
      message: "Webhook endpoint reachable",
    };
  },
};
