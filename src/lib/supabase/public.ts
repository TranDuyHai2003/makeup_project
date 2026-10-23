import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/env";

/**
 * Client ẩn danh, KHÔNG đọc cookie. Dùng trong các hàm 'use cache' cho trang public
 * (hàm cache không được phép đụng vào cookies()/headers()).
 */
export function createPublicClient() {
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
