import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-5 text-center">
      <p className="eyebrow">404</p>
      <h1 className="font-display text-5xl font-light">Trang không tồn tại</h1>
      <Link href="/" className="text-xs uppercase tracking-[0.25em] text-gold">← Về trang chủ</Link>
    </main>
  );
}
