import { supabase } from "../config/supabase";

// 1. Define the type to fix error 1
export type PaymentMemory = {
  status: "COMPLETED";
  email: string;
  timestamp: number;
  amount?: number;
};

// 2. Define the store to fix error 2
const memoryStore = new Map<string, PaymentMemory>();

export async function savePayment(data: PaymentMemory) {
  // Save to Memory (for immediate frontend read)
  memoryStore.set(data.email, data);
  console.log(`💾 Memory: Cached payment for ${data.email}`);

  // Save to Supabase (for permanent registration)
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
