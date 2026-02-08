import { supabase } from "../config/supabase";

// 1. Define the type for the payment data
export type PaymentMemory = {
  status: "COMPLETED";
  email: string;
  timestamp: number;
  amount?: number;
};

// 2. Initialize the local memory store
const memoryStore = new Map<string, PaymentMemory>();

/**
 * Saves payment to both local memory (for speed) and Supabase (for persistence).
 */
export async function savePayment(data: PaymentMemory) {
  // Save to Memory (for immediate frontend redirect/read)
  memoryStore.set(data.email, data);
  console.log(`💾 Memory: Cached payment for ${data.email}`);

  // Save to Supabase (for permanent registration in the DB)
  const { error } = await supabase.from("payments").insert([
    {
      email: data.email,
      amount: data.amount,
      status: data.status,
      created_at: new Date(data.timestamp),
    },
  ]);

  if (error) {
    console.error(`❌ DB Error: ${error.message}`);
  } else {
    console.log(`✅ DB: Registered payment for ${data.email}`);
  }
}

/**
 * Reads payment from memory. Required by payment_service.ts
 */
export function readPayment(email: string) {
  const record = memoryStore.get(email);
  if (!record) return null;

  // Cleanup: If older than 2 mins, delete to keep memory light
  if (Date.now() - record.timestamp > 120000) {
    memoryStore.delete(email);
    return null;
  }
  return record;
}
