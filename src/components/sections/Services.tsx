import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Service } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function Services({ services }: { services: Service[] }) {
  if (services.length === 0) return null;
  return (
    <section id="services" className="bg-bg-2 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading eyebrow="Dịch vụ & bảng giá" title="Mỗi dịp một phong cách" description="Giá tham khảo, có thể thay đổi theo yêu cầu và địa điểm. Liên hệ để được tư vấn gói phù hợp." />
        <div className="mt-16 divide-y divide-line border-y border-line">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.05}>
              <div className="group grid gap-3 py-7 md:grid-cols-[1fr_2fr_auto] md:items-baseline md:gap-10">
                <h3 className="font-display text-2xl font-light transition-colors group-hover:text-gold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{s.description}</p>
                <div className="text-right text-sm tracking-wide text-gold md:min-w-32">
                  <span className="text-xs text-muted">từ </span>
                  {formatPrice(s.price_from)}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
