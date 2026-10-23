import Link from "next/link";
import { Camera, MapPin, MessageCircle, Phone } from "lucide-react";
import { Year } from "@/components/ui/Year";
import type { Settings } from "@/lib/types";
import { messengerLink, telLink, zaloLink } from "@/lib/utils";

const nav = [
  { href: "/#about", label: "Giới thiệu" },
  { href: "/#services", label: "Dịch vụ" },
  { href: "/#portfolio", label: "Portfolio" },
  { href: "/#contact", label: "Liên hệ" },
];

export function Footer({ settings }: { settings: Settings }) {
  type Social = { href: string | null; label: string; icon: React.ReactNode };
  const socials = ([
    { href: messengerLink(settings.facebook), label: "Messenger", icon: <MessageCircle size={16} strokeWidth={1.5} /> },
    { href: zaloLink(settings.zalo), label: "Zalo", icon: <span className="text-[0.55rem] font-semibold">Zalo</span> },
    { href: settings.instagram, label: "Instagram", icon: <Camera size={16} strokeWidth={1.5} /> },
    { href: settings.tiktok, label: "TikTok", icon: <span className="text-[0.55rem] font-semibold">TT</span> },
  ] as Social[]).filter((s): s is Social & { href: string } => !!s.href);
  const tel = telLink(settings.phone);

  return (
    <footer className="relative border-t border-line bg-bg">
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-10 md:px-8 md:pt-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-display text-3xl font-light md:text-4xl">{settings.artist_name}</Link>
            {settings.tagline && <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{settings.tagline}</p>}
            {socials.length > 0 && (
              <div className="mt-6 flex gap-2.5">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-gold hover:text-gold"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>
          <div>
            <p className="eyebrow">Khám phá</p>
            <ul className="mt-5 space-y-3 text-sm text-muted">
              {nav.map((l) => (
                <li key={l.href}><Link href={l.href} className="transition-colors hover:text-gold">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Liên hệ</p>
            <ul className="mt-5 space-y-3 text-sm text-muted">
              {settings.phone && (
                <li><a href={tel ?? "#"} className="flex items-center gap-3 transition-colors hover:text-gold"><Phone size={14} className="shrink-0 text-gold" />{settings.phone}</a></li>
              )}
              {settings.address && (
                <li className="flex items-start gap-3"><MapPin size={14} className="mt-0.5 shrink-0 text-gold" />{settings.address}</li>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col-reverse items-center justify-between gap-4 border-t border-line pt-6 text-[0.65rem] uppercase tracking-[0.2em] text-muted/70 sm:flex-row">
          <span>© <Year /> {settings.artist_name}</span>
          <Link href="/admin" className="transition-colors hover:text-gold">Quản trị</Link>
        </div>
      </div>
    </footer>
  );
}
