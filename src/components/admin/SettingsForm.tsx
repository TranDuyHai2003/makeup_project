"use client";
import { useActionState } from "react";
import { saveSettings } from "@/app/admin/actions";
import type { Settings } from "@/lib/types";
import { ImageField } from "./ImageField";
import { Card, Field, ResultMessage, SubmitButton } from "./ui";

export function SettingsForm({ settings }: { settings: Settings }) {
  const [result, action] = useActionState(saveSettings, null);
  return (
    <form action={action} className="grid gap-6 lg:grid-cols-2">
      <Card className="space-y-4">
        <h2 className="font-display text-xl">Thông tin chung</h2>
        <Field label="Nghệ danh" name="artist_name" defaultValue={settings.artist_name} />
        <Field label="Slogan" name="tagline" defaultValue={settings.tagline} />
        <Field label="Giới thiệu (bio)" name="bio" defaultValue={settings.bio} textarea rows={7} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Số năm kinh nghiệm" name="years_exp" type="number" defaultValue={settings.years_exp} />
          <Field label="Số khách đã làm" name="clients_count" type="number" defaultValue={settings.clients_count} />
        </div>
      </Card>
      <div className="space-y-6">
        <Card className="space-y-5">
          <h2 className="font-display text-xl">Ảnh</h2>
          <ImageField label="Ảnh hero (toàn màn hình đầu trang)" name="hero_url" defaultValue={settings.hero_url} hint="Nên dùng ảnh ngang, tối thiểu 1920px." />
          <ImageField label="Ảnh chân dung (mục giới thiệu)" name="avatar_url" defaultValue={settings.avatar_url} hint="Ảnh dọc tỉ lệ 4:5 sẽ đẹp nhất." />
        </Card>
        <Card className="space-y-4">
          <h2 className="font-display text-xl">Liên hệ & mạng xã hội</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Số điện thoại" name="phone" defaultValue={settings.phone} placeholder="0912 345 678" />
            <Field label="Zalo (số ĐT hoặc link)" name="zalo" defaultValue={settings.zalo} placeholder="0912345678" />
          </div>
          <Field label="Địa chỉ" name="address" defaultValue={settings.address} placeholder="Quận 1, TP.HCM" />
          <Field label="Facebook / Messenger" name="facebook" defaultValue={settings.facebook} placeholder="https://facebook.com/..." />
          <Field label="Instagram" name="instagram" defaultValue={settings.instagram} placeholder="https://instagram.com/..." />
          <Field label="TikTok" name="tiktok" defaultValue={settings.tiktok} placeholder="https://tiktok.com/@..." />
        </Card>
      </div>
      <div className="flex items-center gap-4 lg:col-span-2">
        <SubmitButton />
        <ResultMessage result={result} />
      </div>
    </form>
  );
}
