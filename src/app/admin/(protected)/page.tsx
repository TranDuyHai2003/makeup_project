import Link from "next/link";
import { PageTitle } from "@/components/admin/ui";
import { adminData } from "@/lib/admin-data";

export default async function AdminDashboard() {
  const d = await adminData();
  const cards = [
    { href: "/admin/photos", label: "Ảnh", value: d.photos.length, hint: `${d.photos.filter((p) => p.before_url).length} cặp before/after` },
    { href: "/admin/categories", label: "Danh mục", value: d.categories.length },
    { href: "/admin/services", label: "Dịch vụ", value: d.services.length },
    { href: "/admin/testimonials", label: "Cảm nhận", value: d.testimonials.length },
  ];
  return (
    <>
      <PageTitle title={`Xin chào, ${d.settings.artist_name ?? "bạn"}`} description="Chọn mục bên trái để cập nhật nội dung. Mọi thay đổi hiển thị ngay trên trang public." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="rounded-2xl border border-line bg-bg-2 p-5 transition-colors hover:border-gold/60">
            <div className="text-[0.65rem] uppercase tracking-[0.25em] text-muted">{c.label}</div>
            <div className="font-display mt-2 text-5xl font-light text-gold">{c.value}</div>
            {c.hint && <div className="mt-1 text-xs text-muted">{c.hint}</div>}
          </Link>
        ))}
      </div>
      <div className="mt-8 rounded-2xl border border-line bg-bg-2 p-5 text-sm leading-relaxed text-muted">
        <p className="font-medium text-ink">Mẹo nhanh</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Upload ảnh ngay sau buổi làm: vào <Link href="/admin/photos" className="text-gold">Ảnh</Link>, chọn danh mục rồi kéo thả nhiều ảnh cùng lúc.</li>
          <li>Muốn ảnh xuất hiện trong mục Before / After: bấm vào ảnh, thêm &quot;Ảnh BEFORE&quot;.</li>
          <li>Đổi ảnh hero, số điện thoại, Zalo trong <Link href="/admin/settings" className="text-gold">Cài đặt</Link>.</li>
        </ul>
      </div>
    </>
  );
}
