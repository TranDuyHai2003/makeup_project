import { monogram } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** Logo: chữ lồng trong vòng tròn vàng hồng + tên. Sinh từ tên nghệ sĩ, không cần file ảnh. */
export function Logo({ name, size = "md", showName = true, className }: { name: string; size?: "sm" | "md" | "lg"; showName?: boolean; className?: string }) {
  const initials = monogram(name);
  const ring = { sm: "h-8 w-8 text-[0.8rem]", md: "h-10 w-10 text-[0.95rem]", lg: "h-14 w-14 text-[1.3rem]" }[size];
  const text = { sm: "text-xl", md: "text-[1.35rem] md:text-2xl", lg: "text-3xl md:text-4xl" }[size];
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-3", className)}>
      <span
        aria-hidden
        className={cn(
          "font-display relative flex shrink-0 items-center justify-center rounded-full border border-gold/70 font-light italic tracking-tight text-gold",
          "before:absolute before:inset-[3px] before:rounded-full before:border before:border-gold/20",
          ring,
        )}
      >
        <span className="-mt-px pr-px">{initials}</span>
      </span>
      {showName && <span className={cn("font-display truncate font-light tracking-wide text-ink", text)}>{name}</span>}
    </span>
  );
}
