import { savePayment, readPayment } from '../../lib/paymentMemory';
import { supabase } from '../../config/supabase';

export const paymentService = {
  
  async handleWebhook(payload: any, secret?: string) {
    // ?? Security Check
    if (secret !== process.env.KONFHUB_WEBHOOK_SECRET) {
      throw new Error('Unauthorized Webhook Secret');
    }

    const attendee = payload.Data?.['Attendee Details'];
    if (!attendee) return { status: 'ignored' };

    const email = attendee['Email Address'];
    const amount = attendee['Amount Details']?.['Amount Paid'];

    // 1. Update Memory (Instant Frontend Redirect)
    savePayment({
      status: 'COMPLETED',
      email: email,
      timestamp: Date.now(),
      amount: amount
    });

    // 2. Update Database (Persistent Record)
    await supabase.from('payments').upsert({
      email: email,
      amount: amount,
      status: 'COMPLETED',
      booking_id: attendee['Booking Id']
    });

    return { received: true };
  },

  checkStatus(email: string) {
    if (!email) return { paid: false, error: 'Email required' };

    // Check Memory
    const memory = readPayment(email);
    if (memory) return { paid: true, data: memory };

    // Fallback: Check DB (if memory expired but user refreshed page)
    return { paid: false }; 
  }
};
