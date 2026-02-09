// services/webhook/webhook_service.ts
import { supabase } from "../../lib/supabase";

export const webhookService = {
  async processPost(payload: any) {
    // 1. Extract data based on Konfhub's payload structure
    // Typically: booking_id, status, and payment_id
    const { booking_id, status, payment_id } = payload;

    if (!booking_id) {
      throw new Error("No booking_id found in webhook payload");
    }

    // 2. Update the 'payments' table
    // We filter by booking_id and update the status to 'success'
    const { data, error } = await supabase
      .from("payments")
      .update({
        status:
          status === "completed" || status === "success" ? "success" : "failed",
        // Optional: you can store the gateway's transaction ID if you add a column for it
        // transaction_id: payment_id
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

  async processGet(query: any) {
    return { status: "active", message: "Webhook endpoint reachable" };
  },
};
