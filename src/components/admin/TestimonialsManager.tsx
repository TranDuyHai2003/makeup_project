"use client";
import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { deleteTestimonial, saveTestimonial } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import type { Testimonial } from "@/lib/types";
import { ImageField } from "./ImageField";
import { Card, Field, Label, ResultMessage, SubmitButton } from "./ui";

export function TestimonialsManager({ testimonials }: { testimonials: Testimonial[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Testimonial | "new" | null>(null);
  const [, start] = useTransition();

  function remove(t: Testimonial) {
    if (!confirm(`Xoá cảm nhận của "${t.client_name}"?`)) return;
    start(async () => {
      const res = await deleteTestimonial(t.id);
      if (!res.ok) alert(res.error);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {editing && (
        <TestimonialForm key={editing === "new" ? "new" : editing.id} item={editing === "new" ? null : editing} onDone={() => { setEditing(null); router.refresh(); }} onCancel={() => setEditing(null)} />
      )}
      {!editing && <Button variant="outline" onClick={() => setEditing("new")} className="px-5 py-2.5"><Plus size={14} />Thêm cảm nhận</Button>}
      <ul className="grid gap-3 md:grid-cols-2">
        {testimonials.map((t) => (
          <li key={t.id} className="flex gap-3 rounded-2xl border border-line bg-bg-2 p-4">
            {t.photo_url && <img src={t.photo_url} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2"><span className="font-medium">{t.client_name}</span><span className="flex text-gold">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={10} fill="currentColor" />)}</span></div>
              <p className="mt-1 text-sm text-muted">{t.content}</p>
            </div>
            <button onClick={() => setEditing(t)} className="self-start text-muted hover:text-ink"><Pencil size={16} /></button>
            <button onClick={() => remove(t)} className="self-start text-muted hover:text-red-300"><Trash2 size={16} /></button>
          </li>
        ))}
        {testimonials.length === 0 && <li className="p-6 text-center text-sm text-muted md:col-span-2">Chưa có cảm nhận nào.</li>}
      </ul>
    </div>
  );
}

function TestimonialForm({ item, onDone, onCancel }: { item: Testimonial | null; onDone: () => void; onCancel: () => void }) {
  const [result, action] = useActionState(async (prev: Awaited<ReturnType<typeof saveTestimonial>> | null, fd: FormData) => {
    const r = await saveTestimonial(prev, fd);
    if (r.ok) onDone();
    return r;
  }, null);
  return (
    <Card>
      <form action={action} className="space-y-4">
        <input type="hidden" name="id" value={item?.id ?? ""} />
        <h2 className="font-display text-xl">{item ? "Sửa cảm nhận" : "Thêm cảm nhận"}</h2>
        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <Field label="Tên khách" name="client_name" defaultValue={item?.client_name} />
          <div>
            <Label>Số sao</Label>
            <select name="rating" defaultValue={item?.rating ?? 5} className="input">{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} sao</option>)}</select>
          </div>
        </div>
        <Field label="Nội dung" name="content" defaultValue={item?.content} textarea rows={3} />
        <ImageField label="Ảnh khách (tuỳ chọn)" name="photo_url" defaultValue={item?.photo_url} />
        <div className="flex items-center gap-3">
          <SubmitButton />
          <Button type="button" variant="ghost" onClick={onCancel} className="px-4 py-2">Huỷ</Button>
          <ResultMessage result={result} />
        </div>
      </form>
    </Card>
  );
}
