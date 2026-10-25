"use client";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Settings } from "@/lib/types";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({ settings }: { settings: Settings }) {
  const name = settings.artist_name ?? "";
  return (
    <section className="relative overflow-hidden">
      {/* Nền: quầng sáng vàng nhạt rất mềm */}
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-[36rem] w-[36rem] rounded-full bg-gold-soft/70 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-48 -left-40 h-[30rem] w-[30rem] rounded-full bg-gold-soft/50 blur-3xl" aria-hidden />

      <div className="relative mx-auto grid min-h-[100svh] max-w-6xl items-center gap-10 px-5 pt-24 pb-16 md:grid-cols-[1.1fr_1fr] md:gap-16 md:px-8 md:pt-28 md:pb-20">
        {/* Ảnh trong khung vòm */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease }}
          className="relative mx-auto w-[78%] max-w-[22rem] md:order-last md:w-full md:max-w-[26rem]"
        >
          <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-t-full border border-gold/50 md:translate-x-5 md:translate-y-5" aria-hidden />
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-bg-2 shadow-[0_40px_80px_-40px_rgba(90,40,40,.45)]">
            {settings.hero_url ? (
              <motion.div className="absolute inset-0" initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease }}>
                <SmartImage src={settings.hero_url} alt={name || "Hero"} priority fill sizes="(min-width: 768px) 420px, 78vw" maxWidth={1024} />
              </motion.div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#f2dcd6] to-bg-2" />
            )}
          </div>
          {settings.years_exp ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.9, ease }}
              className="absolute -bottom-4 -left-4 flex h-24 w-24 flex-col items-center justify-center rounded-full border border-gold/40 bg-surface text-center shadow-[0_20px_40px_-20px_rgba(90,40,40,.4)] md:-left-10 md:h-28 md:w-28"
            >
              <span className="font-display text-3xl font-light leading-none text-gold md:text-4xl">{settings.years_exp}+</span>
              <span className="mt-1 text-[0.5rem] uppercase leading-tight tracking-[0.2em] text-muted md:text-[0.55rem]">năm<br />kinh nghiệm</span>
            </motion.div>
          ) : null}
        </motion.div>

        {/* Chữ */}
        <div className="text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="eyebrow flex items-center justify-center gap-3 md:justify-start"
          >
            <span className="h-px w-8 bg-gold/60" aria-hidden />
            Bridal · Event · Editorial
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease }}
            className="font-display text-balance mt-5 text-[clamp(2.8rem,11vw,6.5rem)] font-light leading-[0.95] tracking-[-0.01em]"
          >
            {name}
          </motion.h1>
          {settings.tagline && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease }}
              className="text-balance mx-auto mt-6 max-w-md text-[0.95rem] leading-relaxed text-muted md:mx-0 md:text-lg"
            >
              {settings.tagline}
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease }}
            className="mx-auto mt-9 grid max-w-sm grid-cols-2 gap-3 sm:flex sm:max-w-none sm:justify-center sm:gap-4 md:justify-start"
          >
            <ButtonLink href="/#contact" className="min-h-12 whitespace-nowrap px-4 sm:px-7">Đặt lịch</ButtonLink>
            <ButtonLink href="/#portfolio" variant="outline" className="min-h-12 whitespace-nowrap px-4 sm:px-7">Xem portfolio</ButtonLink>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#about"
        aria-label="Cuộn xuống"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-gold md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.2 }, y: { repeat: Infinity, duration: 2.2, ease: "easeInOut" } }}
      >
        <span className="text-[0.6rem] uppercase tracking-[0.35em]">Cuộn</span>
        <ChevronDown size={18} />
      </motion.a>
    </section>
  );
}
