import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes("TU_PROYECTO") && 
  !supabaseAnonKey.includes("tu_clave")
);

// Fallback dummy client for build time / when env variables are not yet configured
export const supabase = createClient(
  supabaseUrl || "https://placeholder-rapidagil.supabase.co",
  supabaseAnonKey || "placeholder-anon-key-rapidagil-1234567890",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);
