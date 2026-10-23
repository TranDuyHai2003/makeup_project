"use client";

export type Uploaded = { url: string; public_id: string; width: number; height: number };

/**
 * Upload thẳng từ trình duyệt lên Cloudinary (có chữ ký từ server).
 * File không đi qua Vercel nên không bị giới hạn dung lượng request.
 */
export async function uploadToCloudinary(file: File, onProgress?: (pct: number) => void): Promise<Uploaded> {
  const signRes = await fetch("/api/cloudinary-sign", { method: "POST" });
  if (!signRes.ok) throw new Error((await signRes.json().catch(() => ({})))?.error ?? "Không lấy được chữ ký upload");
  const sign = await signRes.json();

  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", sign.apiKey);
  fd.append("timestamp", String(sign.timestamp));
  fd.append("signature", sign.signature);
  fd.append("folder", sign.folder);

  return new Promise<Uploaded>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const r = JSON.parse(xhr.responseText);
        resolve({ url: r.secure_url, public_id: r.public_id, width: r.width, height: r.height });
      } else {
        let msg = "Upload thất bại";
        try { msg = JSON.parse(xhr.responseText)?.error?.message ?? msg; } catch {}
        reject(new Error(msg));
      }
    };
    xhr.onerror = () => reject(new Error("Lỗi mạng khi upload"));
    xhr.send(fd);
  });
}
