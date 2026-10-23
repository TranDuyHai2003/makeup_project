"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#about", label: "Giới thiệu" },
  { href: "/#services", label: "Dịch vụ" },
  { href: "/#portfolio", label: "Portfolio" },
  { href: "/#before-after", label: "Before / After" },
  { href: "/#testimonials", label: "Cảm nhận" },
  { href: "/#contact", label: "Liên hệ" },
];

export function Header({ name }: { name: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-500",
        scrolled || open ? "bg-bg/85 backdrop-blur-md border-b border-line" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="font-display text-2xl tracking-wide whitespace-nowrap">
          {name}
        </Link>
        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="whitespace-nowrap text-[0.7rem] uppercase tracking-[0.25em] text-muted transition-colors hover:text-gold">
              {l.label}
            </Link>
          ))}
          <Link href="/#contact" className="whitespace-nowrap rounded-full border border-gold/60 px-5 py-2 text-[0.7rem] uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold hover:text-bg">
            Đặt lịch
          </Link>
        </nav>
        <button className="lg:hidden text-ink" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-5 px-6 pb-8 pt-2 lg:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-xs uppercase tracking-[0.25em] text-muted hover:text-gold">
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
