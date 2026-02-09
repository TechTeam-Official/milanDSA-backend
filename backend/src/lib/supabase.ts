// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use Service Role Key to bypass RLS for webhook updates
export const supabase = createClient(supabaseUrl, supabaseKey);
