import Link from "next/link";
import { Year } from "@/components/ui/Year";
import type { Settings } from "@/lib/types";

export function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 text-xs tracking-[0.2em] text-muted md:flex-row md:px-8">
        <span className="font-display text-xl tracking-normal text-ink">{settings.artist_name}</span>
        <span className="uppercase">© <Year /> · {settings.address ?? ""}</span>
        <Link href="/admin" className="uppercase hover:text-gold">Admin</Link>
      </div>
    </footer>
  );
}
