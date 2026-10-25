"use client";
import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { createCategory, deleteCategory, updateCategory } from "@/app/admin/actions";
import type { Category } from "@/lib/types";
import { Card, Field, ResultMessage, SubmitButton } from "./ui";

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [result, action] = useActionState(async (prev: Awaited<ReturnType<typeof createCategory>> | null, fd: FormData) => {
    const r = await createCategory(prev, fd);
    if (r.ok) router.refresh();
    return r;
  }, null);
  const [, start] = useTransition();

  function run(p: Promise<{ ok: boolean; error?: string }>) {
    start(async () => {
      const r = await p;
      if (!r.ok) alert(r.error);
      router.refresh();
    });
  }

  function move(i: number, dir: -1 | 1) {
    const a = categories[i], b = categories[i + dir];
    if (!a || !b) return;
    run(Promise.all([updateCategory(a.id, { sort_order: b.sort_order }), updateCategory(b.id, { sort_order: a.sort_order })]).then((rs) => rs.find((r) => !r.ok) ?? { ok: true }));
  }

  function rename(c: Category) {
    const name = prompt("Tên danh mục", c.name);
    if (!name || name === c.name) return;
    run(updateCategory(c.id, { name }));
  }

  function remove(c: Category) {
    if (!confirm(`Xoá danh mục "${c.name}"? Ảnh trong danh mục sẽ chuyển thành "Không phân loại".`)) return;
    run(deleteCategory(c.id));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
      <Card>
        <form action={action} className="space-y-4">
          <h2 className="font-display text-xl">Thêm danh mục</h2>
          <Field label="Tên" name="name" placeholder="Cô dâu" />
          <Field label="Slug (đường dẫn, tuỳ chọn)" name="slug" placeholder="co-dau" />
          <div className="flex items-center gap-3"><SubmitButton>Thêm</SubmitButton><ResultMessage result={result} /></div>
        </form>
      </Card>
      <ul className="divide-y divide-line self-start rounded-2xl border border-line bg-surface shadow-[0_12px_30px_-24px_rgba(90,40,40,.3)]">
        {categories.map((c, i) => (
          <li key={c.id} className="flex items-center gap-3 p-4">
            <button onClick={() => rename(c)} className="flex-1 text-left">
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-muted">/portfolio/{c.slug}</div>
            </button>
            <button onClick={() => move(i, -1)} disabled={i === 0} className="text-muted hover:text-ink disabled:opacity-30"><ArrowUp size={16} /></button>
            <button onClick={() => move(i, 1)} disabled={i === categories.length - 1} className="text-muted hover:text-ink disabled:opacity-30"><ArrowDown size={16} /></button>
            <button onClick={() => remove(c)} className="text-muted hover:text-red-600"><Trash2 size={16} /></button>
          </li>
        ))}
        {categories.length === 0 && <li className="p-6 text-center text-sm text-muted">Chưa có danh mục.</li>}
      </ul>
    </div>
  );
}
