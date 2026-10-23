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
    <section className="relative flex min-h-[100svh] items-end overflow-hidden">
      {settings.hero_url ? (
        <motion.div className="absolute inset-0" initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease }}>
          <SmartImage src={settings.hero_url} alt={name || "Hero"} priority fill sizes="100vw" maxWidth={1920} />
        </motion.div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#23201b] via-bg to-bg" />
      )}
      {/* Lớp phủ: tối dần xuống dưới + tối bên trái trên màn hình lớn để chữ luôn dễ đọc */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/25" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-bg/70 via-bg/20 to-transparent md:block" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-gold/10 blur-3xl" aria-hidden />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-36 md:px-8 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="eyebrow flex items-center gap-3"
        >
          <span className="h-px w-8 bg-gold/70" aria-hidden />
          Bridal · Event · Editorial
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease }}
          className="font-display text-balance mt-5 max-w-4xl text-[clamp(2.9rem,12vw,7.5rem)] font-light leading-[0.95] tracking-[-0.01em]"
        >
          {name}
        </motion.h1>
        {settings.tagline && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease }}
            className="text-balance mt-6 max-w-xl text-[0.95rem] font-light leading-relaxed text-ink/80 md:text-lg"
          >
            {settings.tagline}
          </motion.p>
        )}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75, ease }}
          className="mt-9 grid max-w-sm grid-cols-2 gap-3 sm:flex sm:max-w-none sm:gap-4"
        >
          <ButtonLink href="/#contact" className="min-h-12 whitespace-nowrap px-4 sm:px-7">Đặt lịch</ButtonLink>
          <ButtonLink href="/#portfolio" variant="outline" className="min-h-12 whitespace-nowrap bg-bg/20 px-4 backdrop-blur-sm sm:px-7">Xem portfolio</ButtonLink>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        aria-label="Cuộn xuống"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-gold/70 md:flex"
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
