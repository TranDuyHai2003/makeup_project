"use client";
import { useRouter } from "next/navigation";
import { useRef, useState, type DragEvent } from "react";
import { Upload } from "lucide-react";
import { savePhotos } from "@/app/admin/actions";
import type { Category } from "@/lib/types";
import { uploadToCloudinary } from "@/lib/upload-client";
import { cn } from "@/lib/utils";

type Item = { file: File; progress: number; status: "waiting" | "uploading" | "done" | "error"; error?: string };

export function PhotoUploader({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [category, setCategory] = useState<string>(categories[0]?.id ?? "");
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) return;
    setBusy(true);
    setMessage(null);
    const next: Item[] = list.map((file) => ({ file, progress: 0, status: "waiting" }));
    setItems(next);

    const uploaded: Parameters<typeof savePhotos>[0] = [];
    // Upload tuần tự 3 ảnh một lúc để không nghẽn mạng trên điện thoại
    const queue = [...next.keys()];
    const worker = async () => {
      while (queue.length) {
        const i = queue.shift()!;
        setItems((s) => s.map((it, k) => (k === i ? { ...it, status: "uploading" } : it)));
        try {
          const r = await uploadToCloudinary(next[i].file, (p) => setItems((s) => s.map((it, k) => (k === i ? { ...it, progress: p } : it))));
          uploaded.push({ url: r.url, public_id: r.public_id, width: r.width, height: r.height, category_id: category || null });
          setItems((s) => s.map((it, k) => (k === i ? { ...it, status: "done", progress: 100 } : it)));
        } catch (e) {
          setItems((s) => s.map((it, k) => (k === i ? { ...it, status: "error", error: e instanceof Error ? e.message : "Lỗi" } : it)));
        }
      }
    };
    await Promise.all([worker(), worker(), worker()]);

    if (uploaded.length) {
      const res = await savePhotos(uploaded);
      setMessage(res.ok ? `Đã thêm ${uploaded.length} ảnh.` : res.error);
      if (res.ok) {
        setItems([]);
        router.refresh();
      }
    }
    setBusy(false);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-[0.65rem] uppercase tracking-[0.25em] text-muted">Danh mục cho ảnh mới</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input w-auto">
          <option value="">Không phân loại</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !busy && inputRef.current?.click()}
        className={cn("flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-10 text-center transition-colors", dragging ? "border-gold bg-gold/5" : "border-line hover:border-gold/60", busy && "pointer-events-none opacity-60")}
      >
        <Upload className="text-gold" />
        <p className="text-sm">Kéo thả ảnh vào đây hoặc bấm để chọn</p>
        <p className="text-xs text-muted">Chọn được nhiều ảnh cùng lúc. Ảnh được nén và tối ưu tự động.</p>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
      </div>
      {items.length > 0 && (
        <ul className="grid grid-cols-3 gap-2 md:grid-cols-6">
          {items.map((it, i) => (
            <li key={i} className="relative overflow-hidden rounded-lg border border-line bg-bg">
              <img src={URL.createObjectURL(it.file)} alt="" className="aspect-square w-full object-cover opacity-70" />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-line"><div className={cn("h-full", it.status === "error" ? "bg-red-400" : "bg-gold")} style={{ width: `${it.progress}%` }} /></div>
              {it.status === "error" && <span className="absolute inset-0 flex items-center justify-center bg-bg/70 p-1 text-center text-[10px] text-red-600">{it.error}</span>}
            </li>
          ))}
        </ul>
      )}
      {message && <p className="text-sm text-gold">{message}</p>}
    </div>
  );
}
