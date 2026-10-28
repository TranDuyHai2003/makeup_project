"use client";
import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { deleteService, saveService } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import type { Service } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Card, Field, ResultMessage, SubmitButton, TranslationFields } from "./ui";

export function ServicesManager({ services }: { services: Service[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Service | "new" | null>(null);
  const [, start] = useTransition();

  function remove(s: Service) {
    if (!confirm(`Xoá dịch vụ "${s.title}"?`)) return;
    start(async () => {
      const res = await deleteService(s.id);
      if (!res.ok) alert(res.error);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {editing && (
        <ServiceForm
          key={editing === "new" ? "new" : editing.id}
          service={editing === "new" ? null : editing}
          onDone={() => { setEditing(null); router.refresh(); }}
          onCancel={() => setEditing(null)}
        />
      )}
      {!editing && (
        <Button variant="outline" onClick={() => setEditing("new")} className="px-5 py-2.5"><Plus size={14} />Thêm dịch vụ</Button>
      )}
      <ul className="divide-y divide-line rounded-2xl border border-line bg-surface shadow-[0_12px_30px_-24px_rgba(90,40,40,.3)]">
        {services.map((s) => (
          <li key={s.id} className="flex items-start gap-4 p-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3"><span className="font-medium">{s.title}</span><span className="text-sm text-gold">từ {formatPrice(s.price_from)}</span><span className="text-xs text-muted">#{s.sort_order}</span></div>
              <p className="mt-1 text-sm text-muted">{s.description}</p>
            </div>
            <button onClick={() => setEditing(s)} className="text-muted hover:text-ink"><Pencil size={16} /></button>
            <button onClick={() => remove(s)} className="text-muted hover:text-red-600"><Trash2 size={16} /></button>
          </li>
        ))}
        {services.length === 0 && <li className="p-6 text-center text-sm text-muted">Chưa có dịch vụ nào.</li>}
      </ul>
    </div>
  );
}

function ServiceForm({ service, onDone, onCancel }: { service: Service | null; onDone: () => void; onCancel: () => void }) {
  const [result, action] = useActionState(async (prev: Awaited<ReturnType<typeof saveService>> | null, fd: FormData) => {
    const r = await saveService(prev, fd);
    if (r.ok) onDone();
    return r;
  }, null);
  return (
    <Card>
      <form action={action} className="space-y-4">
        <input type="hidden" name="id" value={service?.id ?? ""} />
        <h2 className="font-display text-xl">{service ? "Sửa dịch vụ" : "Thêm dịch vụ"}</h2>
        <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
          <Field label="Tên dịch vụ" name="title" defaultValue={service?.title} placeholder="Makeup cô dâu" />
          <Field label="Giá từ (VNĐ)" name="price_from" type="number" defaultValue={service?.price_from} placeholder="2500000" />
          <Field label="Thứ tự" name="sort_order" type="number" defaultValue={service?.sort_order ?? 0} />
        </div>
        <Field label="Mô tả" name="description" defaultValue={service?.description} textarea rows={3} />
        <TranslationFields
          values={service?.i18n}
          fields={[
            { name: "title", label: "Tên dịch vụ" },
            { name: "description", label: "Mô tả", textarea: true },
          ]}
        />
        <div className="flex items-center gap-3">
          <SubmitButton />
          <Button type="button" variant="ghost" onClick={onCancel} className="px-4 py-2">Huỷ</Button>
          <ResultMessage result={result} />
        </div>
      </form>
    </Card>
  );
}
