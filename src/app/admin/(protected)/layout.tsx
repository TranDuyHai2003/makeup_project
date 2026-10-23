import { Suspense } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { isSupabaseConfigured } from "@/lib/env";
import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-svh" />}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}

async function Shell({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return (
      <main className="mx-auto max-w-xl px-5 py-24">
        <p className="eyebrow">Admin</p>
        <h1 className="font-display mt-3 text-4xl font-light">Chưa cấu hình Supabase</h1>
        <p className="mt-6 leading-relaxed text-muted">
          Trang admin cần Supabase để đăng nhập và lưu dữ liệu. Làm theo hướng dẫn trong <code>README.md</code>: tạo project Supabase, chạy <code>supabase/schema.sql</code>, tạo tài khoản admin, rồi điền <code>.env.local</code>.
        </p>
      </main>
    );
  }
  const user = await getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="flex min-h-svh flex-col md:flex-row">
      <AdminNav email={user.email ?? ""} />
      <main className="flex-1 px-5 py-6 md:px-10 md:py-10">{children}</main>
    </div>
  );
}
