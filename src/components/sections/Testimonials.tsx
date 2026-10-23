"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [i, setI] = useState(0);
  const n = testimonials.length;

  useEffect(() => {
    if (n < 2) return;
    const id = setInterval(() => setI((v) => (v + 1) % n), 6000);
    return () => clearInterval(id);
  }, [n]);

  if (n === 0) return null;
  const t = testimonials[i];

  return (
    <section id="testimonials" className="mx-auto max-w-4xl px-5 py-24 text-center md:px-8 md:py-32">
      <SectionHeading eyebrow="Cảm nhận khách hàng" title="Lời nhắn gửi lại" />
      <div className="relative mt-16 min-h-56">
        <AnimatePresence mode="wait">
          <motion.figure key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.5 }}>
            <div className="flex justify-center gap-1 text-gold">
              {Array.from({ length: t.rating ?? 5 }).map((_, k) => <Star key={k} size={14} fill="currentColor" />)}
            </div>
            <blockquote className="font-display mt-6 text-2xl font-light italic leading-relaxed md:text-3xl">“{t.content}”</blockquote>
            <figcaption className="mt-6 flex items-center justify-center gap-3">
              {t.photo_url && <img src={t.photo_url} alt="" className="h-10 w-10 rounded-full object-cover" />}
              <span className="text-xs uppercase tracking-[0.25em] text-muted">{t.client_name}</span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      {n > 1 && (
        <div className="mt-8 flex justify-center gap-3">
          {testimonials.map((x, k) => (
            <button key={x.id} aria-label={`Cảm nhận ${k + 1}`} onClick={() => setI(k)} className={cn("h-1.5 rounded-full transition-all", k === i ? "w-8 bg-gold" : "w-1.5 bg-line hover:bg-muted")} />
          ))}
        </div>
      )}
    </section>
  );
}
