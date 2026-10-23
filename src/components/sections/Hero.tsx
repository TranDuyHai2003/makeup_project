"use client";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Settings } from "@/lib/types";

export function Hero({ settings }: { settings: Settings }) {
  return (
    <section className="relative flex min-h-svh items-end overflow-hidden">
      {settings.hero_url ? (
        <SmartImage src={settings.hero_url} alt={settings.artist_name ?? "Hero"} priority fill sizes="100vw" maxWidth={1920} imgClassName="scale-105" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#23201b] via-bg to-bg" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/20" />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-24 pt-40 md:px-8 md:pb-32">
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="eyebrow">
          Bridal · Event · Editorial
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="font-display mt-5 text-6xl font-light leading-[0.95] md:text-8xl"
        >
          {settings.artist_name}
        </motion.h1>
        {settings.tagline && (
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.55 }} className="mt-6 max-w-xl text-base font-light leading-relaxed text-ink/80 md:text-lg">
            {settings.tagline}
          </motion.p>
        )}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.75 }} className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/#contact">Đặt lịch</ButtonLink>
          <ButtonLink href="/#portfolio" variant="outline">Xem portfolio</ButtonLink>
        </motion.div>
      </div>
      <motion.a
        href="#about"
        aria-label="Cuộn xuống"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gold/70"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown />
      </motion.a>
    </section>
  );
}
