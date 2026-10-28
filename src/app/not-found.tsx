import type { Metadata } from "next";

export const metadata: Metadata = { title: "404", robots: { index: false } };

/** Trang 404 chung: không biết khách đang xem ngôn ngữ nào nên hiện cả 3. */
export default function NotFound() {
  const items = [
    { lang: "vi", title: "Trang không tồn tại", back: "← Về trang chủ", href: "/" },
    { lang: "en", title: "Page not found", back: "← Back to home", href: "/en" },
    { lang: "zh-Hant-TW", title: "找不到此頁面", back: "← 回首頁", href: "/zh-TW" },
  ];
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 px-5 text-center">
      <p className="eyebrow">404</p>
      {items.map((i) => (
        <div key={i.lang} lang={i.lang} className="space-y-2">
          <h1 className="font-display text-3xl font-light md:text-4xl">{i.title}</h1>
          {/* thẻ <a> để tải lại trang đầy đủ theo ngôn ngữ */}
          <a href={i.href} className="text-xs uppercase tracking-[0.25em] text-gold">{i.back}</a>
        </div>
      ))}
    </main>
  );
}
