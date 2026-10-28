import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Service } from "@/lib/types";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/vi";
import { formatPriceIntl } from "@/lib/i18n/format";
import { localePath } from "@/lib/i18n/config";

export function Services({ services, lang, t }: { services: Service[]; lang: Locale; t: Dictionary }) {
  if (services.length === 0) return null;
  return (
    <section id="services" className="bg-bg-2 py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading eyebrow={t.services.eyebrow} title={t.services.title} description={t.services.description} />
        <div className="mt-14 border-t border-line md:mt-20">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={Math.min(i, 4) * 0.05}>
              <div className="group relative grid grid-cols-[auto_1fr_auto] gap-x-4 gap-y-2 border-b border-line py-6 md:grid-cols-[3rem_1fr_1.6fr_8.5rem] md:items-baseline md:gap-x-10 md:py-8">
                <span className="font-display pt-1 text-sm text-gold md:pt-0">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-[1.45rem] font-light leading-snug transition-colors duration-300 group-hover:text-gold md:text-[1.75rem]">{s.title}</h3>
                <div className="row-start-1 col-start-3 whitespace-nowrap pt-1.5 text-right md:col-start-4 md:pt-0">
                  {/* tiếng Trung: "起" đứng sau giá; các ngôn ngữ khác: "từ / from" đứng trước */}
                  {s.price_from != null && lang !== "zh-TW" && <span className="mr-1 text-[0.65rem] uppercase tracking-[0.15em] text-muted">{t.services.from}</span>}
                  <span className="text-sm tracking-wide text-gold md:text-base">{formatPriceIntl(s.price_from, lang, t.price)}</span>
                  {s.price_from != null && lang === "zh-TW" && <span className="ml-1 text-[0.7rem] text-muted">{t.services.from}</span>}
                </div>
                {s.description && (
                  <p className="col-span-2 col-start-2 text-sm leading-relaxed text-muted md:col-span-1 md:col-start-3 md:row-start-1">{s.description}</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12 flex justify-center">
          <ButtonLink href={localePath(lang, "/#contact")} variant="outline">
            {t.services.cta} <ArrowUpRight size={14} />
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
