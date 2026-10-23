"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const configured = isSupabaseConfigured();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
    });
    setLoading(false);
    if (error) {
      setError("Email hoặc mật khẩu không đúng.");
      return;
    }
    router.replace(params.get("next") || "/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-5">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5 rounded-2xl border border-line bg-bg-2 p-8">
        <div className="text-center">
          <p className="eyebrow">Admin</p>
          <h1 className="font-display mt-2 text-3xl font-light">Đăng nhập</h1>
        </div>
        {!configured && (
          <p className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs leading-relaxed text-yellow-200">
            Chưa cấu hình Supabase. Hãy tạo file <code>.env.local</code> theo mẫu <code>.env.example</code> rồi khởi động lại.
          </p>
        )}
        <div>
          <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.25em] text-muted">Email</label>
          <input name="email" type="email" required autoComplete="email" className="input" />
        </div>
        <div>
          <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.25em] text-muted">Mật khẩu</label>
          <input name="password" type="password" required autoComplete="current-password" className="input" />
        </div>
        {error && <p className="text-sm text-red-300">{error}</p>}
        <Button type="submit" disabled={loading || !configured} className="w-full">
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>
    </main>
  );
}
