import { Reveal } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Settings } from "@/lib/types";

export function About({ settings }: { settings: Settings }) {
  const stats = [
    settings.years_exp ? { value: `${settings.years_exp}+`, label: "Năm kinh nghiệm" } : null,
    settings.clients_count ? { value: `${settings.clients_count}+`, label: "Khách hàng" } : null,
  ].filter(Boolean) as { value: string; label: string }[];

  return (
    <section id="about" className="relative mx-auto grid max-w-6xl gap-14 px-5 py-24 md:grid-cols-[5fr_6fr] md:items-center md:gap-20 md:px-8 md:py-36">
      <Reveal className="mx-auto w-full max-w-[22rem] md:max-w-none">
        <div className="relative">
          {/* Khung gold lệch về góc, tạo chiều sâu */}
          <div className="absolute inset-0 translate-x-3 translate-y-3 border border-gold/45 md:translate-x-5 md:translate-y-5" aria-hidden />
          {settings.avatar_url ? (
            <SmartImage src={settings.avatar_url} alt={settings.artist_name ?? ""} width={4} height={5} sizes="(min-width: 768px) 40vw, 22rem" maxWidth={1000} />
          ) : (
            <div className="relative aspect-[4/5] bg-bg-2" />
          )}
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="eyebrow">Giới thiệu</p>
        <h2 className="font-display text-balance mt-4 text-[2.4rem] font-light leading-[1.1] md:text-5xl">
          Xin chào, mình là <em className="text-gold">{settings.artist_name}</em>
        </h2>
        <div className="gold-line mt-6 w-24" />
        {settings.bio && <p className="mt-6 whitespace-pre-line text-[0.95rem] leading-[1.8] text-muted md:text-base">{settings.bio}</p>}
        {stats.length > 0 && (
          <dl className="mt-10 grid grid-cols-2 border-y border-line">
            {stats.map((s, i) => (
              <div key={s.label} className={i > 0 ? "border-l border-line py-5 pl-6" : "py-5 pr-6"}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-5xl font-light leading-none text-gold md:text-6xl">{s.value}</dd>
                <dd className="mt-2 text-[0.65rem] uppercase tracking-[0.22em] text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        )}
      </Reveal>
    </section>
  );
}
