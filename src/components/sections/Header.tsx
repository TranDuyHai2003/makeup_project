"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import type { Dictionary } from "@/lib/i18n/dictionaries/vi";
import { LOCALE_COOKIE, LOCALE_META, LOCALES, localePath, stripLocale, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

const SECTIONS = ["about", "services", "portfolio", "before-after", "testimonials", "contact"] as const;

export function Header({ name, lang, t }: { name: string; lang: Locale; t: Dictionary["nav"] }) {
  const label: Record<(typeof SECTIONS)[number], string> = {
    about: t.about,
    services: t.services,
    portfolio: t.portfolio,
    "before-after": t.beforeAfter,
    testimonials: t.testimonials,
    contact: t.contact,
  };
  const links = SECTIONS.map((id) => ({ id, label: label[id] }));
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const pathname = usePathname();
  const basePath = stripLocale(pathname);
  const isHome = basePath === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Làm nổi mục menu ứng với section đang ở giữa màn hình
  useEffect(() => {
    if (!isHome) return;
    const sections = SECTIONS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
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
        <Link href={localePath(lang, "/")} onClick={() => setOpen(false)} aria-label={`${name} - ${t.home}`} className="relative z-10 min-w-0 pr-4">
          <Logo name={name} />
        </Link>
        <nav className="hidden shrink-0 items-center gap-4 lg:flex xl:gap-6" aria-label={t.mainMenu}>
          {links.map((l) => (
            <Link
              key={l.id}
              href={localePath(lang, `/#${l.id}`)}
              className={cn(
                l.id === "before-after" && "hidden xl:inline",
                "relative whitespace-nowrap py-1 text-[0.65rem] uppercase tracking-[0.18em] transition-colors hover:text-gold xl:tracking-[0.22em]",
                active === l.id ? "text-gold" : "text-muted",
              )}
            >
              {l.label}
              <span className={cn("absolute inset-x-0 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-500", active === l.id ? "scale-x-100" : "scale-x-0")} />
            </Link>
          ))}
          <LanguageSwitcher lang={lang} basePath={basePath} label={t.language} />
          <Link href={localePath(lang, "/#contact")} className="whitespace-nowrap rounded-full border border-gold/60 px-5 py-2 text-[0.68rem] uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold hover:text-white">
            {t.book}
          </Link>
        </nav>
        <button
          className="relative z-10 -mr-2 flex h-11 w-11 items-center justify-center text-ink lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? t.closeMenu : t.openMenu}
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
            aria-label={t.mobileMenu}
          >
            <div className="pointer-events-none absolute -top-32 right-[-30%] h-96 w-96 rounded-full bg-gold-soft/70 blur-3xl" aria-hidden />
            <ul className="flex flex-1 flex-col justify-center gap-1">
              {links.map((l, i) => (
                <motion.li key={l.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.05, duration: 0.4 }}>
                  <Link
                    href={localePath(lang, `/#${l.id}`)}
                    onClick={() => setOpen(false)}
                    className={cn("font-display flex items-baseline gap-4 py-2 text-4xl font-light transition-colors", active === l.id ? "text-gold" : "text-ink hover:text-gold")}
                  >
                    <span className="w-6 text-[0.65rem] tracking-[0.2em] text-muted">0{i + 1}</span>
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mb-5 flex justify-center">
              <LanguageSwitcher lang={lang} basePath={basePath} label={t.language} large />
            </div>
            <Link
              href={localePath(lang, "/#contact")}
              onClick={() => setOpen(false)}
              className="mb-6 flex items-center justify-center rounded-full bg-gold py-4 text-xs uppercase tracking-[0.25em] text-white shadow-[0_10px_30px_-12px_rgba(169,107,94,.6)]"
            >
              {t.bookNow}
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

function rememberLocale(l: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
}

/** Nút chuyển ngôn ngữ: giữ nguyên trang đang xem, ghi nhớ lựa chọn bằng cookie (1 năm). */
function LanguageSwitcher({ lang, basePath, label, large }: { lang: Locale; basePath: string; label: string; large?: boolean }) {
  return (
    <div role="group" aria-label={label} className={cn("flex shrink-0 items-center whitespace-nowrap", large ? "gap-1 rounded-full border border-line bg-surface p-1" : "gap-0.5 border-l border-line pl-3")}>
      {LOCALES.map((l) => (
        <a
          key={l}
          href={localePath(l, basePath)}
          hrefLang={LOCALE_META[l].htmlLang}
          lang={LOCALE_META[l].htmlLang}
          onClick={() => rememberLocale(l)}
          aria-current={l === lang ? "true" : undefined}
          title={LOCALE_META[l].label}
          className={cn(
            "rounded-full transition-colors",
            large ? "px-4 py-2 text-xs tracking-[0.15em]" : "px-1.5 py-1 text-[0.65rem] tracking-[0.1em]",
            l === lang ? (large ? "bg-gold text-white" : "text-gold") : "text-muted hover:text-ink",
          )}
        >
          {LOCALE_META[l].short}
        </a>
      ))}
    </div>
  );
}
