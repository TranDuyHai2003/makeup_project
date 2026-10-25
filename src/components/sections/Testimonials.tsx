import { Quote, Star } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const n = testimonials.length;
  if (n === 0) return null;
  // ≤ 3 cảm nhận: lưới cố định trên PC. Nhiều hơn: hàng vuốt ngang ở mọi kích thước.
  const gridOnDesktop = n <= 3;

  return (
    <section id="testimonials" className="relative overflow-hidden py-24 md:py-36">
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-soft/50 blur-3xl" aria-hidden />
      <div className="relative mx-auto max-w-6xl md:px-8">
        <div className="px-5 md:px-0">
          <SectionHeading eyebrow="Cảm nhận khách hàng" title="Lời nhắn gửi lại" />
        </div>
        <Reveal
          className={cn(
            "no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 md:mt-20 md:scroll-px-0 md:px-0",
            gridOnDesktop && (n === 1 ? "md:mx-auto md:grid md:max-w-xl" : n === 2 ? "md:mx-auto md:grid md:max-w-4xl md:grid-cols-2 md:gap-6" : "md:grid md:grid-cols-3 md:gap-6"),
          )}
        >
          {testimonials.map((t) => (
            <div key={t.id} className={cn("w-[85%] shrink-0 snap-start sm:w-[60%]", gridOnDesktop ? "md:w-auto" : "md:w-[31%]")}>
              <figure className="flex h-full flex-col border border-line/70 bg-surface p-7 shadow-[0_20px_50px_-30px_rgba(90,40,40,.25)] md:p-9">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-gold" aria-label={`${t.rating ?? 5} sao`}>
                    {Array.from({ length: t.rating ?? 5 }).map((_, k) => <Star key={k} size={13} fill="currentColor" strokeWidth={0} />)}
                  </div>
                  <Quote size={28} className="text-gold/30" strokeWidth={1} />
                </div>
                <blockquote className="font-display mt-6 flex-1 text-[1.35rem] font-light italic leading-relaxed text-ink/90 md:text-2xl">
                  “{t.content}”
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3 border-t border-line pt-5">
                  {t.photo_url ? (
                    <img src={t.photo_url} alt="" loading="lazy" className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <span className="font-display flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-lg text-gold">
                      {(t.client_name ?? "?").trim().charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="text-[0.7rem] uppercase tracking-[0.25em] text-muted">{t.client_name}</span>
                </figcaption>
              </figure>
            </div>
          ))}
        </Reveal>
        {(!gridOnDesktop || n > 1) && (
          <p className={cn("mt-6 text-center text-[0.6rem] uppercase tracking-[0.3em] text-muted/70", gridOnDesktop && "md:hidden")}>Vuốt để xem thêm →</p>
        )}
      </div>
    </section>
  );
}
