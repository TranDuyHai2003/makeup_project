import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "gold" | "outline" | "ghost" | "danger";

const styles: Record<Variant, string> = {
  gold: "bg-gold text-white hover:bg-gold-hover shadow-[0_10px_30px_-12px_rgba(169,107,94,.55)]",
  outline: "border border-gold/50 text-gold hover:bg-gold hover:text-white",
  ghost: "text-muted hover:text-ink",
  danger: "border border-red-500/40 text-red-600 hover:bg-red-500/10",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs tracking-[0.2em] uppercase transition-[color,background-color,border-color,transform] duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

export function Button({ variant = "gold", className, ...props }: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={cn(base, styles[variant], className)} {...props} />;
}

export function ButtonLink({
  variant = "gold",
  className,
  href,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; children: ReactNode }) {
  return (
    <Link href={href} className={cn(base, styles[variant], className)} {...props}>
      {children}
    </Link>
  );
}
