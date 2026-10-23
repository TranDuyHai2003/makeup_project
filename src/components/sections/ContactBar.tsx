"use client";
import { useEffect, useState } from "react";
import { Camera, MessageCircle, Phone } from "lucide-react";
import type { Settings } from "@/lib/types";
import { cn, messengerLink, telLink, zaloLink } from "@/lib/utils";

/**
 * Mobile: thanh liên hệ cố định dưới đáy (Zalo · Messenger · Gọi), hiện sau khi cuộn qua hero.
 * PC: nút Zalo tròn nổi ở góc phải.
 */
export function ContactBar({ settings }: { settings: Settings }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY > document.body.scrollHeight - 40;
      setShow(window.scrollY > window.innerHeight * 0.6 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const zalo = zaloLink(settings.zalo);
  const messenger = messengerLink(settings.facebook);
  const tel = telLink(settings.phone);

  const items = [
    zalo && { href: zalo, label: "Zalo", icon: null, primary: true },
    messenger && { href: messenger, label: "Messenger", icon: <MessageCircle size={18} strokeWidth={1.6} /> },
    !messenger && settings.instagram && { href: settings.instagram, label: "Instagram", icon: <Camera size={18} strokeWidth={1.6} /> },
    tel && { href: tel, label: "Gọi", icon: <Phone size={17} strokeWidth={1.6} />, internal: true },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode; primary?: boolean; internal?: boolean }[];

  if (items.length === 0) return null;

  return (
    <>
      <nav
        aria-label="Liên hệ nhanh"
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 border-t border-line/80 bg-bg/90 px-3 pt-2.5 pb-safe backdrop-blur-xl transition-transform duration-500 md:hidden",
          show ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="mx-auto grid max-w-md gap-2" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
          {items.map((it) => (
            <a
              key={it.label}
              href={it.href}
              {...(it.internal ? {} : { target: "_blank", rel: "noreferrer" })}
              className={cn(
                "flex h-12 items-center justify-center gap-2 rounded-full text-[0.68rem] uppercase tracking-[0.15em] transition-colors",
                it.primary ? "bg-[#0068ff] text-white" : "border border-line text-ink active:border-gold active:text-gold",
              )}
            >
              {it.primary ? (
                <span className="text-[0.8rem] font-semibold normal-case tracking-wide">Nhắn Zalo</span>
              ) : (
                <>
                  {it.icon}
                  <span>{it.label}</span>
                </>
              )}
            </a>
          ))}
        </div>
      </nav>

      {zalo && (
        <a
          href={zalo}
          target="_blank"
          rel="noreferrer"
          aria-label="Nhắn Zalo"
          className="fixed right-6 bottom-6 z-30 hidden h-14 w-14 items-center justify-center rounded-full bg-[#0068ff] text-white shadow-lg shadow-black/40 transition-transform hover:scale-105 md:flex"
        >
          <span className="text-[0.7rem] font-semibold tracking-wide">Zalo</span>
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#0068ff]/30 [animation-duration:2.5s]" />
        </a>
      )}
    </>
  );
}
