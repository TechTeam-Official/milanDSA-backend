import { supabase } from "../../config/supabase";

export type PaymentMemory = {
  status: "COMPLETED";
  email: string;
  timestamp: number;
  amount?: number;
};

const memoryStore = new Map<string, PaymentMemory>();

export async function savePayment(data: PaymentMemory) {
  // 1. Update Memory (Instant Frontend Redirect)
  memoryStore.set(data.email, data);
  console.log(`💾 Memory: Cached payment for ${data.email}`);

  // 2. Update Database (Persistent Record)
  const { error } = await supabase.from("payments").upsert({
    email: data.email,
    amount: data.amount,
    status: data.status,
    created_at: new Date(data.timestamp),
  });

  if (error) console.error("❌ DB Error:", error.message);
  else console.log(`✅ DB: Registered payment for ${data.email}`);
}

export function readPayment(email: string) {
  const record = memoryStore.get(email);
  if (!record) return null;

  // Cleanup: If older than 2 mins, delete
  if (Date.now() - record.timestamp > 120000) {
    memoryStore.delete(email);
    return null;
  }
  return record;
}
