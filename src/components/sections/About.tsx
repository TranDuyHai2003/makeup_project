import { Reveal } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Settings } from "@/lib/types";

export function About({ settings }: { settings: Settings }) {
  const stats = [
    settings.years_exp ? { value: `${settings.years_exp}+`, label: "Năm kinh nghiệm" } : null,
    settings.clients_count ? { value: `${settings.clients_count}+`, label: "Khách hàng" } : null,
  ].filter(Boolean) as { value: string; label: string }[];

  return (
    <section id="about" className="mx-auto grid max-w-6xl gap-12 px-5 py-24 md:grid-cols-2 md:items-center md:gap-20 md:px-8 md:py-32">
      <Reveal>
        <div className="relative">
          <div className="absolute -inset-3 border border-gold/30" aria-hidden />
          {settings.avatar_url ? (
            <SmartImage src={settings.avatar_url} alt={settings.artist_name ?? ""} width={4} height={5} sizes="(min-width: 768px) 45vw, 100vw" maxWidth={1000} />
          ) : (
            <div className="aspect-[4/5] bg-bg-2" />
          )}
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="eyebrow">Giới thiệu</p>
        <h2 className="font-display mt-4 text-4xl font-light leading-tight md:text-5xl">
          Xin chào, mình là <em className="text-gold">{settings.artist_name}</em>
        </h2>
        <div className="gold-line mt-6 w-24" />
        <p className="mt-6 whitespace-pre-line leading-relaxed text-muted">{settings.bio}</p>
        {stats.length > 0 && (
          <div className="mt-10 flex gap-12">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-5xl font-light text-gold">{s.value}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </Reveal>
    </section>
  );
}
