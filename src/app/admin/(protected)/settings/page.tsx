import { SettingsForm } from "@/components/admin/SettingsForm";
import { PageTitle } from "@/components/admin/ui";
import { adminData } from "@/lib/admin-data";

export default async function SettingsPage() {
  const { settings } = await adminData();
  return (
    <>
      <PageTitle title="Cài đặt" description="Bio, ảnh hero, liên hệ và mạng xã hội." />
      <SettingsForm settings={settings} />
    </>
  );
}
