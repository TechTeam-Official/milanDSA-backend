import { supabase } from "../../lib/supabase";

export const webhookService = {
  async processPost(payload: any) {
    try {
      const attendee = payload?.Data?.["Attendee Details"];
      const eventType = payload?.["Event Type"];

      if (!attendee || eventType !== "registration") {
        console.log("🔕 Ignored webhook event");
        return { status: "ignored" };
      }

      const bookingId = attendee["Booking Id"];
      const paymentId = attendee["payment_id"];
      const buyerEmail = attendee["Buyer Email"];

      if (!bookingId) {
        console.error("❌ Missing Booking Id");
        return { status: "ignored" };
      }

      const { data, error } = await supabase
        .from("payments")
        .upsert(
          {
            booking_id: bookingId,
            email: buyerEmail,
            status: "success",
            payment_id: paymentId,
            raw_payload: payload,
          },
          { onConflict: "booking_id" },
        )
        .select()
        .single();

      if (error) {
        console.error("❌ Supabase error:", error);
        return { status: "db_error" };
      }

      console.log("✅ Payment recorded:", bookingId);
      return { status: "success", bookingId, record: data };
    } catch (err) {
      console.error("❌ Webhook crash:", err);
      return { status: "error" };
    }
  },
};
