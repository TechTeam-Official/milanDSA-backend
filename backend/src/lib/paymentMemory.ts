import { supabase } from "../config/supabase";

// 1. Defined types to include specific ticket types
export type PaymentMemory = {
  status: "COMPLETED";
  email: string;
  timestamp: number;
  amount: number;
  ticket_type?: "EVENT" | "PROSHOW";
};

// 2. Initialize the local memory store
const memoryStore = new Map<string, PaymentMemory>();

/**
 * Saves payment to both local memory and Supabase.
 * Determines ticket type based on price and generates a unique booking_id.
 */
export async function savePayment(data: PaymentMemory) {
  // Fixes TS2345: Explicitly type the variable to match the PaymentMemory union type
  const ticketType: "EVENT" | "PROSHOW" =
    data.amount >= 999 ? "PROSHOW" : "EVENT";

  const paymentRecord: PaymentMemory = {
    ...data,
    ticket_type: ticketType,
  };

  // Save to Memory (for immediate frontend redirect speed)
  memoryStore.set(data.email, paymentRecord);
  console.log(`💾 Memory: Cached ${ticketType} payment for ${data.email}`);

  // Save to Supabase (Persistence)
  const { error } = await supabase.from("payments").insert([
    {
      email: data.email,
      amount: data.amount,
      status: data.status,
      ticket_type: ticketType,
      // Fixes Not-Null Constraint: Provide a unique string ID
      booking_id: `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      created_at: new Date(data.timestamp),
    },
  ]);

  if (error) {
    console.error(`❌ DB Error: ${error.message}`);
  } else {
    console.log(`✅ DB: Registered ${ticketType} payment for ${data.email}`);
  }
}

/**
 * Reads payment from memory with a 2-minute expiry check.
 */
export function readPayment(email: string) {
  const record = memoryStore.get(email);
  if (!record) return null;

  // Cleanup: Delete if older than 120 seconds
  if (Date.now() - record.timestamp > 120000) {
    memoryStore.delete(email);
    return null;
  }
  return record;
}
