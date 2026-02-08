type PaymentMemory = {
  status: 'COMPLETED';
  email: string;
  timestamp: number;
  amount?: number;
};

// Map<Email, PaymentData>
const memoryStore = new Map<string, PaymentMemory>();

export function savePayment(data: PaymentMemory) {
  memoryStore.set(data.email, data);
  console.log(\?? Memory: Stored payment for \\);
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
