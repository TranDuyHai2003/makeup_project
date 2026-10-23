"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { cldUrl } from "@/lib/cloudinary";
import type { Category, Photo } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = { photos: Photo[]; categories: Category[]; showHeading?: boolean; showFilter?: boolean; title?: string; eyebrow?: string };

export function Portfolio({ photos, categories, showHeading = true, showFilter = true, title = "Những khoảnh khắc đã qua tay mình", eyebrow = "Portfolio" }: Props) {
  const [active, setActive] = useState<string | "all">("all");
  const [index, setIndex] = useState(-1);

  const visible = useMemo(() => (active === "all" ? photos : photos.filter((p) => p.category_id === active)), [photos, active]);
  const usedCategories = categories.filter((c) => photos.some((p) => p.category_id === c.id));

  if (photos.length === 0) return null;

  return (
    <section id="portfolio" className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
      {showHeading && <SectionHeading eyebrow={eyebrow} title={title} />}

      {showFilter && usedCategories.length > 1 && (
        <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3">
          <FilterButton active={active === "all"} onClick={() => setActive("all")}>Tất cả</FilterButton>
          {usedCategories.map((c) => (
            <FilterButton key={c.id} active={active === c.id} onClick={() => setActive(c.id)}>{c.name}</FilterButton>
          ))}
        </div>
      )}

      <motion.div layout className="masonry mt-12">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <motion.button
              layout
              key={p.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              onClick={() => setIndex(i)}
              className="group block w-full cursor-zoom-in text-left"
            >
              <SmartImage src={p.url} alt={p.caption ?? "Makeup"} width={p.width} height={p.height} sizes="(min-width: 768px) 33vw, 50vw" maxWidth={1024} imgClassName="group-hover:scale-105" />
              {p.caption && <p className="mt-2 text-xs tracking-wide text-muted">{p.caption}</p>}
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {showFilter && usedCategories.length > 0 && (
        <div className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[0.7rem] uppercase tracking-[0.25em] text-muted">
          {usedCategories.map((c) => (
            <Link key={c.id} href={`/portfolio/${c.slug}`} className="hover:text-gold">Album {c.name} →</Link>
          ))}
        </div>
      )}

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={visible.map((p) => ({ src: cldUrl(p.url, 1920), alt: p.caption ?? "", width: p.width ?? undefined, height: p.height ?? undefined }))}
        styles={{ container: { backgroundColor: "rgba(11,11,12,0.96)" } }}
      />
    </section>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn("relative pb-1 text-[0.7rem] uppercase tracking-[0.3em] transition-colors", active ? "text-gold" : "text-muted hover:text-ink")}
    >
      {children}
      {active && <motion.span layoutId="filter-underline" className="absolute inset-x-0 -bottom-0.5 h-px bg-gold" />}
    </button>
  );
}
