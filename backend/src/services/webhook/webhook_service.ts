// services/webhook/webhook_service.ts
import { supabase } from "../../lib/supabase";

export const webhookService = {
  async processPost(payload: any) {
    const attendee = payload?.Data?.["Attendee Details"];

    if (!attendee) {
      console.error("❌ Missing Attendee Details", payload);
      return { status: "ignored" };
    }

    const bookingId = attendee["Booking Id"];
    const paymentStatus = payload?.["Event Type"];

    if (paymentStatus !== "registration") {
      console.log("Ignored KonfHub event:", paymentStatus);
      return { status: "ignored" };
    }

    const paymentId = attendee["payment_id"];

    if (!bookingId) {
      console.error("❌ Missing Booking Id", attendee);
      return { status: "ignored" };
    }

    const { data, error } = await supabase
      .from("payments")
      .update({
        status: "success",
        payment_id: paymentId,
        raw_payload: payload,
      })
      .eq("booking_id", bookingId)
      .select();

    if (error) {
      console.error("❌ Supabase Update Error:", error);
      return { status: "db_error" };
    }

    return {
      status: "success",
      bookingId,
      record: data,
    };
  },

  async processGet() {
    return {
      status: "active",
      message: "KonfHub webhook reachable",
    };
  },
};
