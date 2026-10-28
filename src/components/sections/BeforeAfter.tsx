"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronsLeftRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cldSrcSet, cldUrl } from "@/lib/cloudinary";
import type { Dictionary } from "@/lib/i18n/dictionaries/vi";
import type { Photo } from "@/lib/types";

export function BeforeAfter({ photos, t }: { photos: Photo[]; t: Dictionary["beforeAfter"] }) {
  const pairs = photos.filter((p) => p.before_url);
  if (pairs.length === 0) return null;

  return (
    <section id="before-after" className="bg-bg-2 py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} description={t.description} />
        <div className={pairs.length === 1 ? "mx-auto mt-14 max-w-xl md:mt-20" : "mt-14 grid gap-10 md:mt-20 md:grid-cols-2 md:gap-8"}>
          {pairs.slice(0, 4).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <CompareSlider t={t} before={p.before_url!} after={p.url} alt={p.caption ?? ""} ratio={pairs.length === 1 && p.width && p.height ? p.width / p.height : 4 / 5} />
              {p.caption && <p className="font-display mt-4 text-center text-lg font-light text-ink/80">{p.caption}</p>}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CompareSlider({ t, before, after, alt, ratio = 0.8 }: { t: Dictionary["beforeAfter"]; before: string; after: string; alt: string; ratio?: number }) {
  const [pos, setPos] = useState(50);
  const [touched, setTouched] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Gợi ý "kéo được": trượt nhẹ qua lại một lần khi khung vào màn hình
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timers: ReturnType<typeof setTimeout>[] = [];
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        timers = [setTimeout(() => setPos(35), 400), setTimeout(() => setPos(65), 1000), setTimeout(() => setPos(50), 1600)];
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  const animate = !touched;

  return (
    <div ref={ref} className="relative select-none overflow-hidden bg-bg-2 shadow-[0_30px_60px_-30px_rgba(90,40,40,.35)]" style={{ aspectRatio: `${Math.max(ratio, 0.66)}` }}>
      <img src={cldUrl(after, 1200)} srcSet={cldSrcSet(after, 1200)} sizes="(min-width: 768px) 560px, 100vw" alt={`${alt} - ${t.after}`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      <div
        className={animate ? "absolute inset-0 transition-[clip-path] duration-500 ease-in-out" : "absolute inset-0"}
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img src={cldUrl(before, 1200)} srcSet={cldSrcSet(before, 1200)} sizes="(min-width: 768px) 560px, 100vw" alt={`${alt} - ${t.before}`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      </div>
      <div
        className={animate ? "pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_14px_rgba(0,0,0,.35)] transition-[left] duration-500 ease-in-out" : "pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_14px_rgba(0,0,0,.35)]"}
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/85 text-gold shadow-lg backdrop-blur">
          <ChevronsLeftRight size={20} strokeWidth={1.5} />
        </div>
      </div>
      <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-white/80 px-3 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-ink backdrop-blur">{t.before}</span>
      <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-gold px-3 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-white">{t.after}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => {
          setTouched(true);
          setPos(Number(e.target.value));
        }}
        aria-label={t.compare}
        className="ba-range absolute inset-0 m-0 opacity-0"
      />
    </div>
  );
}
