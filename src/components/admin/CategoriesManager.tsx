"use client";
import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import { createCategory, deleteCategory, saveCategory, updateCategory } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import type { Category } from "@/lib/types";
import { Card, Field, ResultMessage, SubmitButton, TranslationFields } from "./ui";

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Category | null>(null);
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

  function remove(c: Category) {
    if (!confirm(`Xoá danh mục "${c.name}"? Ảnh trong danh mục sẽ chuyển thành "Không phân loại".`)) return;
    run(deleteCategory(c.id));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
      <div className="space-y-6">
        {editing ? (
          <EditCategory key={editing.id} category={editing} onDone={() => { setEditing(null); router.refresh(); }} onCancel={() => setEditing(null)} />
        ) : (
          <Card>
            <form action={action} className="space-y-4">
              <h2 className="font-display text-xl">Thêm danh mục</h2>
              <Field label="Tên" name="name" placeholder="Cô dâu" />
              <Field label="Slug (đường dẫn, tuỳ chọn)" name="slug" placeholder="co-dau" />
              <TranslationFields values={null} fields={[{ name: "name", label: "Tên", placeholder: "Bridal / 新娘" }]} />
              <div className="flex items-center gap-3"><SubmitButton>Thêm</SubmitButton><ResultMessage result={result} /></div>
            </form>
          </Card>
        )}
      </div>
      <ul className="divide-y divide-line self-start rounded-2xl border border-line bg-surface shadow-[0_12px_30px_-24px_rgba(90,40,40,.3)]">
        {categories.map((c, i) => (
          <li key={c.id} className="flex items-center gap-3 p-4">
            <button onClick={() => setEditing(c)} className="min-w-0 flex-1 text-left">
              <div className="font-medium">{c.name}</div>
              <div className="truncate text-xs text-muted">
                /portfolio/{c.slug}
                {(c.i18n?.en?.name || c.i18n?.["zh-TW"]?.name) && (
                  <span className="ml-2">· {[c.i18n?.en?.name, c.i18n?.["zh-TW"]?.name].filter(Boolean).join(" · ")}</span>
                )}
              </div>
            </button>
            <button onClick={() => setEditing(c)} className="text-muted hover:text-ink" title="Sửa"><Pencil size={16} /></button>
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

function EditCategory({ category, onDone, onCancel }: { category: Category; onDone: () => void; onCancel: () => void }) {
  const [result, action] = useActionState(async (prev: Awaited<ReturnType<typeof saveCategory>> | null, fd: FormData) => {
    const r = await saveCategory(prev, fd);
    if (r.ok) onDone();
    return r;
  }, null);
  return (
    <Card>
      <form action={action} className="space-y-4">
        <input type="hidden" name="id" value={category.id} />
        <h2 className="font-display text-xl">Sửa danh mục</h2>
        <Field label="Tên" name="name" defaultValue={category.name} />
        <Field label="Slug (đường dẫn)" name="slug" defaultValue={category.slug} />
        <TranslationFields values={category.i18n} defaultOpen fields={[{ name: "name", label: "Tên", placeholder: "Bridal / 新娘" }]} />
        <div className="flex items-center gap-3">
          <SubmitButton />
          <Button type="button" variant="ghost" onClick={onCancel} className="px-4 py-2">Huỷ</Button>
          <ResultMessage result={result} />
        </div>
      </form>
    </Card>
  );
}
