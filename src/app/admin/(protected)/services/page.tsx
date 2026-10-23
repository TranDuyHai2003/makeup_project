import { ServicesManager } from "@/components/admin/ServicesManager";
import { PageTitle } from "@/components/admin/ui";
import { adminData } from "@/lib/admin-data";

export default async function ServicesPage() {
  const { services } = await adminData();
  return (
    <>
      <PageTitle title="Dịch vụ & bảng giá" description="Thứ tự nhỏ hiển thị trước." />
      <ServicesManager services={services} />
    </>
  );
}
