"use client";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Expand } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Category, Photo } from "@/lib/types";
import { cn } from "@/lib/utils";

const PortfolioLightbox = dynamic(() => import("./PortfolioLightbox"), { ssr: false });

const PAGE = 12;

type Props = { photos: Photo[]; categories: Category[]; showHeading?: boolean; showFilter?: boolean; title?: string; eyebrow?: string; description?: string };

export function Portfolio({ photos, categories, showHeading = true, showFilter = true, title = "Những khoảnh khắc đã qua tay mình", eyebrow = "Portfolio", description }: Props) {
  const [active, setActive] = useState<string | "all">("all");
  const [index, setIndex] = useState(-1);
  const [opened, setOpened] = useState(false); // chỉ tải lightbox sau lần bấm đầu tiên
  const [limit, setLimit] = useState(PAGE);

  const filtered = useMemo(() => (active === "all" ? photos : photos.filter((p) => p.category_id === active)), [photos, active]);
  const visible = filtered.slice(0, limit);
  const usedCategories = categories.filter((c) => photos.some((p) => p.category_id === c.id));
  const catName = (id: string | null) => categories.find((c) => c.id === id)?.name;

  if (photos.length === 0) return null;

  const open = (i: number) => {
    setOpened(true);
    setIndex(i);
  };
  const choose = (id: string | "all") => {
    setActive(id);
    setLimit(PAGE);
  };

  return (
    <section id="portfolio" className="mx-auto max-w-6xl py-24 md:px-8 md:py-36">
      {showHeading && (
        <div className="px-5 md:px-0">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        </div>
      )}

      {showFilter && usedCategories.length > 1 && (
        <div className="no-scrollbar mt-10 overflow-x-auto md:mt-14">
          <div className="mx-auto flex w-max gap-2 px-5 md:px-0">
            <FilterChip active={active === "all"} onClick={() => choose("all")}>Tất cả</FilterChip>
            {usedCategories.map((c) => (
              <FilterChip key={c.id} active={active === c.id} onClick={() => choose(c.id)}>{c.name}</FilterChip>
            ))}
          </div>
        </div>
      )}

      <motion.div layout className="masonry mt-8 px-2.5 md:mt-12 md:px-0">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((p, i) => (
            <motion.button
              layout
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => open(i)}
              aria-label={`Xem ảnh ${p.caption ?? i + 1}`}
              className="group relative block w-full cursor-zoom-in overflow-hidden text-left"
            >
              <SmartImage
                src={p.url}
                alt={p.caption ?? "Makeup"}
                width={p.width}
                height={p.height}
                sizes="(min-width: 1152px) 370px, (min-width: 768px) 31vw, 48vw"
                maxWidth={1024}
                imgClassName="duration-[1.2s] group-hover:scale-[1.04]"
              />
              {/* Chú thích: luôn hiện nhẹ trên mobile, hiện khi rê chuột trên PC */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/65 via-black/15 to-transparent p-3 pt-10 transition-opacity duration-500 md:p-5 md:pt-16 md:opacity-0 md:group-hover:opacity-100">
                <div className="min-w-0">
                  {active === "all" && catName(p.category_id) && (
                    <p className="hidden text-[0.6rem] uppercase tracking-[0.25em] text-gold-soft md:block">{catName(p.category_id)}</p>
                  )}
                  {p.caption && <p className="font-display truncate text-[0.95rem] leading-tight text-white md:mt-1 md:text-xl">{p.caption}</p>}
                </div>
                <Expand size={16} className="hidden shrink-0 text-white/85 md:block" />
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length > limit && (
        <div className="mt-10 flex justify-center px-5">
          <button
            onClick={() => setLimit((l) => l + PAGE)}
            className="rounded-full border border-line px-7 py-3 text-[0.68rem] uppercase tracking-[0.25em] text-muted transition-colors hover:border-gold hover:text-gold"
          >
            Xem thêm {Math.min(PAGE, filtered.length - limit)} ảnh
          </button>
        </div>
      )}

      {showFilter && usedCategories.length > 0 && (
        <div className="mt-20 px-5 md:mt-28 md:px-0">
          <Reveal className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Album</p>
              <h3 className="font-display mt-3 text-3xl font-light md:text-4xl">Xem theo chủ đề</h3>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-5">
            {usedCategories.map((c, i) => {
              const inCat = photos.filter((p) => p.category_id === c.id);
              const cover = inCat.find((p) => p.is_featured) ?? inCat[0];
              return (
                <Reveal key={c.id} delay={i * 0.06}>
                  <Link href={`/portfolio/${c.slug}`} className="group relative block aspect-[3/4] overflow-hidden">
                    <SmartImage src={cover.url} alt={c.name} fill sizes="(min-width: 768px) 25vw, 50vw" maxWidth={640} imgClassName="duration-[1.2s] group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent transition-colors duration-500 group-hover:from-black/55" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 md:p-5">
                      <div>
                        <p className="font-display text-xl font-light leading-tight text-white md:text-2xl">{c.name}</p>
                        <p className="mt-1 text-[0.6rem] uppercase tracking-[0.25em] text-white/75">{inCat.length} ảnh</p>
                      </div>
                      <ArrowUpRight size={18} className="text-gold-soft transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      )}

      {opened && <PortfolioLightbox photos={visible} index={index} onClose={() => setIndex(-1)} />}
    </section>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "whitespace-nowrap rounded-full border px-5 py-2.5 text-[0.65rem] uppercase tracking-[0.22em] transition-colors duration-300",
        active ? "border-gold bg-gold text-white shadow-[0_6px_20px_-10px_rgba(169,107,94,.7)]" : "border-line bg-surface/60 text-muted hover:border-gold/60 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
