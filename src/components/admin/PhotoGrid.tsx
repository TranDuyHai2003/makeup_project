"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DndContext, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Star, Trash2, X } from "lucide-react";
import { deletePhoto, reorderPhotos, updatePhoto } from "@/app/admin/actions";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/Button";
import { cldUrl } from "@/lib/cloudinary";
import type { Category, Photo } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PhotoGrid({ photos, categories }: { photos: Photo[]; categories: Category[] }) {
  const router = useRouter();
  const [items, setItems] = useState(photos);
  const [editing, setEditing] = useState<Photo | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [pending, start] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }));

  // Đồng bộ khi server trả dữ liệu mới (router.refresh) - pattern "adjust state during render"
  const [prevPhotos, setPrevPhotos] = useState(photos);
  if (photos !== prevPhotos) {
    setPrevPhotos(photos);
    setItems(photos);
  }

  const visible = filter === "all" ? items : items.filter((p) => p.category_id === filter);

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = items.findIndex((p) => p.id === active.id);
    const to = items.findIndex((p) => p.id === over.id);
    const next = arrayMove(items, from, to);
    setItems(next);
    start(async () => {
      const res = await reorderPhotos(next.map((p) => p.id));
      if (!res.ok) alert(res.error);
    });
  }

  function toggleFeatured(p: Photo) {
    setItems((s) => s.map((x) => (x.id === p.id ? { ...x, is_featured: !x.is_featured } : x)));
    start(async () => {
      const res = await updatePhoto(p.id, { is_featured: !p.is_featured });
      if (!res.ok) alert(res.error);
    });
  }

  function remove(p: Photo) {
    if (!confirm("Xoá ảnh này? Ảnh cũng sẽ bị xoá trên Cloudinary.")) return;
    setItems((s) => s.filter((x) => x.id !== p.id));
    start(async () => {
      const res = await deletePhoto(p.id);
      if (!res.ok) alert(res.error);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button onClick={() => setFilter("all")} className={cn("rounded-full border px-3 py-1", filter === "all" ? "border-gold text-gold" : "border-line text-muted")}>Tất cả ({items.length})</button>
        {categories.map((c) => (
          <button key={c.id} onClick={() => setFilter(c.id)} className={cn("rounded-full border px-3 py-1", filter === c.id ? "border-gold text-gold" : "border-line text-muted")}>
            {c.name} ({items.filter((p) => p.category_id === c.id).length})
          </button>
        ))}
        {pending && <span className="ml-auto text-muted">Đang lưu...</span>}
      </div>
      <p className="text-xs text-muted">Kéo thả để sắp xếp thứ tự (chỉ khi xem &quot;Tất cả&quot;). Bấm vào ảnh để sửa chú thích, danh mục, ảnh before.</p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={visible.map((p) => p.id)} strategy={rectSortingStrategy} disabled={filter !== "all"}>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map((p) => (
              <SortableCard key={p.id} photo={p} category={categories.find((c) => c.id === p.category_id)?.name} onEdit={() => setEditing(p)} onFeatured={() => toggleFeatured(p)} onDelete={() => remove(p)} sortable={filter === "all"} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      {items.length === 0 && <p className="py-10 text-center text-sm text-muted">Chưa có ảnh nào. Hãy upload ở phía trên.</p>}

      {editing && (
        <EditDialog
          photo={editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={(patch) => {
            setItems((s) => s.map((x) => (x.id === editing.id ? { ...x, ...patch } : x)));
            setEditing(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function SortableCard({ photo, category, onEdit, onFeatured, onDelete, sortable }: { photo: Photo; category?: string; onEdit: () => void; onFeatured: () => void; onDelete: () => void; sortable: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: photo.id, disabled: !sortable });
  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={cn("group relative overflow-hidden rounded-xl border border-line bg-bg", isDragging && "z-10 opacity-80 ring-1 ring-gold")}>
      <button onClick={onEdit} className="block w-full">
        <img src={cldUrl(photo.url, 500)} alt={photo.caption ?? ""} className="aspect-[4/5] w-full object-cover" loading="lazy" />
      </button>
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2">
        {sortable ? (
          <span {...attributes} {...listeners} className="cursor-grab rounded-md bg-bg/70 p-1 text-muted backdrop-blur touch-none active:cursor-grabbing"><GripVertical size={16} /></span>
        ) : <span />}
        <button onClick={onFeatured} title="Nổi bật" className={cn("rounded-md bg-bg/70 p-1 backdrop-blur", photo.is_featured ? "text-gold" : "text-muted")}>
          <Star size={16} fill={photo.is_featured ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-bg to-transparent p-2 text-[11px]">
        <span className="truncate text-muted">{category ?? "—"}{photo.before_url ? " · B/A" : ""}</span>
        <button onClick={onDelete} className="rounded-md bg-bg/70 p-1 text-muted hover:text-red-600"><Trash2 size={14} /></button>
      </div>
    </li>
  );
}

function EditDialog({ photo, categories, onClose, onSaved }: { photo: Photo; categories: Category[]; onClose: () => void; onSaved: (patch: Partial<Photo>) => void }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const patch = {
      caption: String(fd.get("caption") ?? ""),
      category_id: String(fd.get("category_id") ?? ""),
      before_url: String(fd.get("before_url") ?? ""),
    };
    start(async () => {
      const res = await updatePhoto(photo.id, patch);
      if (!res.ok) return setError(res.error);
      onSaved({ caption: patch.caption || null, category_id: patch.category_id || null, before_url: patch.before_url || null });
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 md:items-center md:p-6" onClick={onClose}>
      <form onSubmit={onSubmit} onClick={(e) => e.stopPropagation()} className="max-h-[90svh] w-full max-w-lg space-y-4 overflow-y-auto rounded-t-2xl border border-line bg-surface shadow-[0_12px_30px_-24px_rgba(90,40,40,.3)] p-5 md:rounded-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl">Sửa ảnh</h3>
          <button type="button" onClick={onClose} className="text-muted hover:text-ink"><X /></button>
        </div>
        <img src={cldUrl(photo.url, 800)} alt="" className="max-h-64 w-full rounded-lg object-contain bg-bg" />
        <div>
          <label className="mb-1.5 block text-[0.65rem] uppercase tracking-[0.25em] text-muted">Chú thích</label>
          <input name="caption" defaultValue={photo.caption ?? ""} className="input" placeholder="VD: Cô dâu Thanh Hà" />
        </div>
        <div>
          <label className="mb-1.5 block text-[0.65rem] uppercase tracking-[0.25em] text-muted">Danh mục</label>
          <select name="category_id" defaultValue={photo.category_id ?? ""} className="input">
            <option value="">Không phân loại</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <ImageField label="Ảnh BEFORE (tuỳ chọn)" name="before_url" defaultValue={photo.before_url} hint="Thêm ảnh mặt mộc để ảnh này xuất hiện trong mục Before / After." />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} className="px-4 py-2">Huỷ</Button>
          <Button type="submit" disabled={pending} className="px-5 py-2">{pending ? "Đang lưu..." : "Lưu"}</Button>
        </div>
      </form>
    </div>
  );
}
