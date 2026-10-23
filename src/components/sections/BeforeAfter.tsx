"use client";
import { useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cldSrcSet, cldUrl } from "@/lib/cloudinary";
import type { Photo } from "@/lib/types";

export function BeforeAfter({ photos }: { photos: Photo[] }) {
  const pairs = photos.filter((p) => p.before_url);
  if (pairs.length === 0) return null;

  return (
    <section id="before-after" className="bg-bg-2 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading eyebrow="Before / After" title="Sự khác biệt nằm ở chi tiết" description="Kéo thanh trượt để so sánh trước và sau khi trang điểm." />
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {pairs.slice(0, 4).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <CompareSlider before={p.before_url!} after={p.url} alt={p.caption ?? ""} ratio={p.width && p.height ? p.width / p.height : 4 / 5} />
              {p.caption && <p className="mt-3 text-center text-xs tracking-wide text-muted">{p.caption}</p>}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CompareSlider({ before, after, alt, ratio = 0.8 }: { before: string; after: string; alt: string; ratio?: number }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative select-none overflow-hidden bg-bg" style={{ aspectRatio: `${ratio}` }}>
      <img src={cldUrl(after, 1200)} srcSet={cldSrcSet(after, 1200)} sizes="(min-width: 768px) 50vw, 100vw" alt={`${alt} - sau`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={cldUrl(before, 1200)} srcSet={cldSrcSet(before, 1200)} sizes="(min-width: 768px) 50vw, 100vw" alt={`${alt} - trước`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      </div>
      <div className="pointer-events-none absolute inset-y-0 w-px bg-gold" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold bg-bg/80 text-gold backdrop-blur">
          <span className="text-xs">◀ ▶</span>
        </div>
      </div>
      <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-bg/70 px-3 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-ink/80 backdrop-blur">Trước</span>
      <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-gold/90 px-3 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-bg">Sau</span>
      <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label="So sánh trước và sau" className="ba-range absolute inset-0 m-0 opacity-0" />
    </div>
  );
}
