import { connection, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * Supabase free tạm dừng project sau 7 ngày không hoạt động.
 * GitHub Action (.github/workflows/keep-alive.yml) gọi route này 3 ngày/lần để giữ project luôn thức.
 */
export async function GET(req: Request) {
  await connection(); // luôn chạy ở request time, không prerender
  const secret = process.env.KEEP_ALIVE_SECRET;
  if (secret && req.headers.get("x-keep-alive-secret") !== secret) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }
  if (!isSupabaseConfigured()) return NextResponse.json({ ok: true, skipped: "supabase not configured" });

  const supabase = createPublicClient();
  const { error, count } = await supabase.from("categories").select("id", { count: "exact", head: true });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, categories: count, at: new Date().toISOString() });
}
