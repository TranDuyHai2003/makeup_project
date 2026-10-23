"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Image as ImageIcon, LayoutDashboard, LogOut, MessageSquareQuote, Settings, Sparkles, Tags } from "lucide-react";
import { signOut } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/photos", label: "Ảnh", icon: ImageIcon },
  { href: "/admin/categories", label: "Danh mục", icon: Tags },
  { href: "/admin/services", label: "Dịch vụ", icon: Sparkles },
  { href: "/admin/testimonials", label: "Cảm nhận", icon: MessageSquareQuote },
  { href: "/admin/settings", label: "Cài đặt", icon: Settings },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  return (
    <aside className="border-b border-line bg-bg-2 md:w-60 md:shrink-0 md:border-r md:border-b-0">
      <div className="flex items-center justify-between px-5 py-4 md:block md:py-6">
        <Link href="/admin" className="font-display text-2xl">Admin</Link>
        <span className="truncate text-xs text-muted md:mt-1 md:block" title={email}>{email}</span>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={cn("flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors", active ? "bg-gold/15 text-gold" : "text-muted hover:bg-bg hover:text-ink")}>
              <Icon size={16} />{label}
            </Link>
          );
        })}
      </nav>
      <div className="hidden flex-col gap-1 px-3 pt-6 md:flex">
        <a href="/" target="_blank" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:text-ink"><ExternalLink size={16} />Xem trang</a>
        <form action={signOut}>
          <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:text-ink"><LogOut size={16} />Đăng xuất</button>
        </form>
      </div>
    </aside>
  );
}
