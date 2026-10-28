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

type TrField = { name: string; label: string; textarea?: boolean; rows?: number; placeholder?: string };
type TrValues = Partial<Record<"en" | "zh-TW", Record<string, string | null | undefined>>> | null | undefined;

const TR_LANGS = [
  { code: "en", label: "English" },
  { code: "zh-TW", label: "繁體中文 (Đài Loan)" },
] as const;

/**
 * Ô nhập bản dịch tiếng Anh / tiếng Trung cho các trường nội dung. Tên ô dạng "i18n.en.tagline".
 * Để trống → trang tiếng Anh / tiếng Trung tự dùng bản tiếng Việt.
 */
export function TranslationFields({ fields, values, defaultOpen }: { fields: TrField[]; values: TrValues; defaultOpen?: boolean }) {
  const filled = TR_LANGS.map((l) => fields.filter((f) => values?.[l.code]?.[f.name]?.trim()).length);
  return (
    <details open={defaultOpen} className="group rounded-xl border border-dashed border-line bg-bg/60 p-4 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm">
        <span className="font-medium">🌐 Bản dịch (English · 繁體中文)</span>
        <span className="text-xs text-muted">
          EN {filled[0]}/{fields.length} · 中文 {filled[1]}/{fields.length}
          <span className="ml-2 inline-block transition-transform group-open:rotate-180">▾</span>
        </span>
      </summary>
      <p className="mt-2 text-xs text-muted">Ô nào để trống, trang ngôn ngữ đó sẽ hiện bản tiếng Việt.</p>
      <div className="mt-4 grid gap-5 md:grid-cols-2">
        {TR_LANGS.map((l) => (
          <div key={l.code} className="space-y-3" lang={l.code === "zh-TW" ? "zh-Hant-TW" : "en"}>
            <p className="text-[0.65rem] uppercase tracking-[0.25em] text-gold">{l.label}</p>
            {fields.map((f) => (
              <Field
                key={f.name}
                label={f.label}
                name={`i18n.${l.code}.${f.name}`}
                defaultValue={values?.[l.code]?.[f.name] ?? ""}
                textarea={f.textarea}
                rows={f.rows ?? 3}
                placeholder={f.placeholder}
              />
            ))}
          </div>
        ))}
      </div>
    </details>
  );
}
