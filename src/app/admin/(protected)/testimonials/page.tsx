import { TestimonialsManager } from "@/components/admin/TestimonialsManager";
import { PageTitle } from "@/components/admin/ui";
import { adminData } from "@/lib/admin-data";

export default async function TestimonialsPage() {
  const { testimonials } = await adminData();
  return (
    <>
      <PageTitle title="Cảm nhận khách hàng" />
      <TestimonialsManager testimonials={testimonials} />
    </>
  );
}
