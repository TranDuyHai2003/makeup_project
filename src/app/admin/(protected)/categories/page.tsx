import { CategoriesManager } from "@/components/admin/CategoriesManager";
import { PageTitle } from "@/components/admin/ui";
import { adminData } from "@/lib/admin-data";

export default async function CategoriesPage() {
  const { categories } = await adminData();
  return (
    <>
      <PageTitle title="Danh mục" description="Mỗi danh mục có trang album riêng tại /portfolio/slug, tốt cho SEO. Bấm vào tên để đổi tên." />
      <CategoriesManager categories={categories} />
    </>
  );
}
