"use client";
import { useState } from "react";
import { Upload, X } from "lucide-react";
import { uploadToCloudinary } from "@/lib/upload-client";
import { cldUrl } from "@/lib/cloudinary";
import { Label } from "./ui";

/** Ô chọn một ảnh (hero, avatar, ảnh before...). Upload lên Cloudinary rồi điền URL vào input ẩn. */
export function ImageField({ label, name, defaultValue, hint }: { label: string; name: string; defaultValue?: string | null; hint?: string }) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setProgress(0);
    try {
      const r = await uploadToCloudinary(file, setProgress);
      setUrl(r.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload thất bại");
    } finally {
      setProgress(null);
    }
  }

  return (
    <div>
      <Label>{label}</Label>
      <input type="hidden" name={name} value={url} />
      <div className="flex items-start gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-line bg-bg">
          {url ? <img src={cldUrl(url, 300)} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-muted"><Upload size={18} /></div>}
          {progress !== null && <div className="absolute inset-x-0 bottom-0 h-1 bg-line"><div className="h-full bg-gold" style={{ width: `${progress}%` }} /></div>}
        </div>
        <div className="flex-1 space-y-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 text-xs text-muted hover:border-gold hover:text-gold">
            <Upload size={14} />{progress !== null ? `Đang tải ${progress}%` : "Chọn ảnh"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} disabled={progress !== null} />
          </label>
          {url && (
            <button type="button" onClick={() => setUrl("")} className="ml-2 inline-flex items-center gap-1 text-xs text-muted hover:text-red-600"><X size={12} />Bỏ ảnh</button>
          )}
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="hoặc dán URL ảnh" className="input text-xs" />
          {hint && <p className="text-xs text-muted">{hint}</p>}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
