import { NextResponse } from "next/server";
import { CLOUDINARY_FOLDER, signUpload } from "@/lib/cloudinary-server";
import { isCloudinaryConfigured } from "@/lib/env";
import { getUser } from "@/lib/supabase/server";

/** Trả về chữ ký để trình duyệt upload thẳng lên Cloudinary. Chỉ admin đã đăng nhập mới gọi được. */
export async function POST() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isCloudinaryConfigured()) return NextResponse.json({ error: "Chưa cấu hình Cloudinary" }, { status: 500 });

  const timestamp = Math.round(Date.now() / 1000);
  const params = { timestamp, folder: CLOUDINARY_FOLDER };
  const signature = signUpload(params);

  return NextResponse.json({
    timestamp,
    folder: CLOUDINARY_FOLDER,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  });
}
