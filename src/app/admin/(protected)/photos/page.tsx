import { PhotoGrid } from "@/components/admin/PhotoGrid";
import { PhotoUploader } from "@/components/admin/PhotoUploader";
import { Card, PageTitle } from "@/components/admin/ui";
import { adminData } from "@/lib/admin-data";
import { isCloudinaryConfigured } from "@/lib/env";

export default async function PhotosPage() {
  const { photos, categories } = await adminData();
  return (
    <>
      <PageTitle title="Ảnh" description="Upload, sắp xếp, phân loại và xoá ảnh portfolio." />
      {!isCloudinaryConfigured() && (
        <p className="mb-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-200">Chưa cấu hình Cloudinary nên chưa upload được. Điền các biến CLOUDINARY_* trong .env.local.</p>
      )}
      <Card className="mb-8"><PhotoUploader categories={categories} /></Card>
      <PhotoGrid photos={photos} categories={categories} />
    </>
  );
}
