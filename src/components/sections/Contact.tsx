import type { ReactNode } from "react";
import { ArrowUpRight, Camera, MapPin, MessageCircle, Phone } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/vi";
import { fmt, joinOr } from "@/lib/i18n/format";
import type { Settings } from "@/lib/types";
import { messengerLink, telLink, zaloLink } from "@/lib/utils";

type Channel = { href: string; label: string; hint: string; icon: ReactNode; accent: string };

export function Contact({ settings, lang, t }: { settings: Settings; lang: Locale; t: Dictionary["contact"] }) {
  const zalo = zaloLink(settings.zalo);
  const messenger = messengerLink(settings.facebook);
  const tel = telLink(settings.phone);

  const channels: Channel[] = [];
  if (messenger) channels.push({ href: messenger, label: "Messenger", hint: t.messengerHint, icon: <MessageCircle size={20} />, accent: "#0084ff" });
  if (zalo) channels.push({ href: zalo, label: "Zalo", hint: settings.zalo?.startsWith("http") ? t.zaloHint : `Zalo ${settings.zalo}`, icon: <span className="text-xs font-bold">Zalo</span>, accent: "#0068ff" });
  if (settings.instagram) channels.push({ href: settings.instagram, label: "Instagram", hint: t.instagramHint, icon: <Camera size={20} />, accent: "#e1306c" });
  if (settings.tiktok) channels.push({ href: settings.tiktok, label: "TikTok", hint: t.tiktokHint, icon: <span className="text-xs font-bold">TT</span>, accent: "#111111" });

  const names = channels.filter((c) => c.label !== "TikTok").map((c) => c.label);
  const intro = names.length ? fmt(t.introVia, { channels: joinOr(names, t.or, lang) }) : t.introCall;

  return (
    <section id="contact" className="bg-bg-2 py-24 md:py-36">
      <div className="mx-auto grid max-w-6xl gap-16 px-5 md:grid-cols-2 md:px-8">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow={t.eyebrow}
            title={t.title}
            description={intro}
          />
          <ul className="mt-10 space-y-4 text-sm text-muted">
            {settings.phone && (
              <li className="flex items-center gap-3"><Phone size={16} className="text-gold" /><a href={tel ?? "#"} className="hover:text-ink">{settings.phone}</a></li>
            )}
            {settings.address && (
              <li className="flex items-center gap-3"><MapPin size={16} className="text-gold" /><span>{settings.address}</span></li>
            )}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-4">
            {channels.map((c) => <ChannelCard key={c.label} {...c} />)}
            {tel && (
              <ChannelCard href={tel} label={t.call} hint={settings.phone ?? ""} icon={<Phone size={20} />} accent="#a96b5e" external={false} />
            )}
            {channels.length === 0 && !tel && (
              <p className="text-sm text-muted">{t.empty}</p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ChannelCard({ href, label, hint, icon, accent, external = true }: Channel & { external?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="group flex items-center gap-4 rounded-2xl border border-line/80 bg-surface px-4 py-4 shadow-[0_12px_30px_-22px_rgba(90,40,40,.35)] transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-gold active:scale-[0.99] md:gap-5 md:px-5"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white" style={{ backgroundColor: accent }}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm uppercase tracking-[0.2em] text-ink">{label}</span>
        <span className="block truncate text-sm text-muted">{hint}</span>
      </span>
      <ArrowUpRight size={18} className="text-muted transition-colors group-hover:text-gold" />
    </a>
  );
}
