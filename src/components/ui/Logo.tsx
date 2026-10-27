import { MARK_PATH, MARK_VIEWBOX } from "@/lib/logo-mark";
import { cn } from "@/lib/utils";

/** Biểu tượng mắt khép + hàng mi (vector, đổi màu theo chữ). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox={MARK_VIEWBOX} aria-hidden className={className} fill="currentColor">
      <path d={MARK_PATH} />
    </svg>
  );
}

/** Logo đầy đủ: biểu tượng vàng hồng + tên. */
export function Logo({ name, size = "md", showName = true, className }: { name: string; size?: "sm" | "md" | "lg"; showName?: boolean; className?: string }) {
  const mark = { sm: "h-8 w-8", md: "h-10 w-10 md:h-11 md:w-11", lg: "h-14 w-14" }[size];
  const text = { sm: "text-xl", md: "text-[1.35rem] md:text-2xl", lg: "text-3xl md:text-4xl" }[size];
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2.5", className)}>
      <LogoMark className={cn("shrink-0 text-gold", mark)} />
      {showName && <span className={cn("font-display truncate font-light tracking-wide text-ink", text)}>{name}</span>}
    </span>
  );
}
