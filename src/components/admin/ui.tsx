"use client";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import type { ActionResult } from "@/app/admin/actions";

export function PageTitle({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-light md:text-4xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-surface shadow-[0_12px_30px_-24px_rgba(90,40,40,.3)] p-5 md:p-6 ${className}`}>{children}</div>;
}

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-[0.65rem] uppercase tracking-[0.25em] text-muted">{children}</label>;
}

export function Field({ label, name, defaultValue, type = "text", placeholder, textarea, rows = 4 }: { label: string; name: string; defaultValue?: string | number | null; type?: string; placeholder?: string; textarea?: boolean; rows?: number }) {
  return (
    <div>
      <Label>{label}</Label>
      {textarea ? (
        <textarea name={name} defaultValue={defaultValue ?? ""} rows={rows} placeholder={placeholder} className="input" />
      ) : (
        <input name={name} type={type} defaultValue={defaultValue ?? ""} placeholder={placeholder} className="input" />
      )}
    </div>
  );
}

export function SubmitButton({ children = "Lưu", variant = "gold" as const }: { children?: React.ReactNode; variant?: "gold" | "outline" }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant={variant} disabled={pending} className="px-5 py-2.5">
      {pending ? "Đang lưu..." : children}
    </Button>
  );
}

export function ResultMessage({ result }: { result: ActionResult | null }) {
  if (!result) return null;
  return result.ok ? <p className="text-sm text-gold">Đã lưu.</p> : <p className="text-sm text-red-600">{result.error}</p>;
}
