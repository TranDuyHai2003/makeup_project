"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const links = [
  { id: "about", label: "Giới thiệu" },
  { id: "services", label: "Dịch vụ" },
  { id: "portfolio", label: "Portfolio" },
  { id: "before-after", label: "Before / After" },
  { id: "testimonials", label: "Cảm nhận" },
  { id: "contact", label: "Liên hệ" },
];

export function Header({ name }: { name: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const isHome = usePathname() === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Làm nổi mục menu ứng với section đang ở giữa màn hình
  useEffect(() => {
    if (!isHome) return;
    const sections = links.map((l) => document.getElementById(l.id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [isHome]);

  // Khoá cuộn trang khi mở menu mobile, đóng bằng phím Esc
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solid = scrolled || open || !isHome;

  return (
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        solid ? "border-b border-line/80 bg-bg/85 shadow-[0_8px_30px_-24px_rgba(90,40,40,.35)] backdrop-blur-xl" : "border-b border-transparent bg-transparent",
      )}
    >
      <div className={cn("mx-auto flex max-w-6xl items-center justify-between px-5 transition-[padding] duration-500 md:px-8", scrolled ? "py-3" : "py-4 md:py-5")}>
        <Link href="/" onClick={() => setOpen(false)} aria-label={`${name} - Trang chủ`} className="relative z-10 min-w-0 pr-4">
          <Logo name={name} />
        </Link>
        <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Menu chính">
          {links.map((l) => (
            <Link
              key={l.id}
              href={`/#${l.id}`}
              className={cn(
                "relative whitespace-nowrap py-1 text-[0.68rem] uppercase tracking-[0.25em] transition-colors hover:text-gold",
                active === l.id ? "text-gold" : "text-muted",
              )}
            >
              {l.label}
              <span className={cn("absolute inset-x-0 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-500", active === l.id ? "scale-x-100" : "scale-x-0")} />
            </Link>
          ))}
          <Link href="/#contact" className="whitespace-nowrap rounded-full border border-gold/60 px-5 py-2 text-[0.68rem] uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold hover:text-white">
            Đặt lịch
          </Link>
        </nav>
        <button
          className="relative z-10 -mr-2 flex h-11 w-11 items-center justify-center text-ink lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
        >
          {open ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
        </button>
      </div>
    </header>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex h-[100dvh] flex-col bg-bg/[0.98] px-6 pb-safe pt-24 backdrop-blur-xl lg:hidden"
            aria-label="Menu mobile"
          >
            <div className="pointer-events-none absolute -top-32 right-[-30%] h-96 w-96 rounded-full bg-gold-soft/70 blur-3xl" aria-hidden />
            <ul className="flex flex-1 flex-col justify-center gap-1">
              {links.map((l, i) => (
                <motion.li key={l.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.05, duration: 0.4 }}>
                  <Link
                    href={`/#${l.id}`}
                    onClick={() => setOpen(false)}
                    className={cn("font-display flex items-baseline gap-4 py-2 text-4xl font-light transition-colors", active === l.id ? "text-gold" : "text-ink hover:text-gold")}
                  >
                    <span className="w-6 text-[0.65rem] tracking-[0.2em] text-muted">0{i + 1}</span>
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <Link
              href="/#contact"
              onClick={() => setOpen(false)}
              className="mb-6 flex items-center justify-center rounded-full bg-gold py-4 text-xs uppercase tracking-[0.25em] text-white shadow-[0_10px_30px_-12px_rgba(169,107,94,.6)]"
            >
              Đặt lịch ngay
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
