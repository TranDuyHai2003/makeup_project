import "server-only";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER ?? "makeup-portfolio";

/** Ký tham số upload. Secret chỉ nằm ở server. */
export function signUpload(params: Record<string, string | number>) {
  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!);
  return signature;
}

/** Xoá ảnh trên Cloudinary để không tốn dung lượng. Không ném lỗi nếu thất bại. */
export async function destroyImage(publicId: string): Promise<void> {
  if (!publicId || !process.env.CLOUDINARY_API_SECRET) return;
  try {
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
  } catch (err) {
    console.error("[cloudinary] destroy failed", publicId, err);
  }
}
