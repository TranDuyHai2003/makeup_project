"use client";
import { useState, type FormEvent } from "react";
import { Camera, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Service, Settings } from "@/lib/types";
import { telLink, zaloLink } from "@/lib/utils";

type Status = { state: "idle" } | { state: "sending" } | { state: "ok"; message: string } | { state: "error"; message: string };

export function Contact({ settings, services }: { settings: Settings; services: Service[] }) {
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Gửi thất bại");
      setStatus({ state: "ok", message: json.message ?? "Đã gửi! Mình sẽ liên hệ lại sớm." });
      form.reset();
    } catch (err) {
      setStatus({ state: "error", message: err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng nhắn Zalo." });
    }
  }

  const zalo = zaloLink(settings.zalo);
  const tel = telLink(settings.phone);

  return (
    <section id="contact" className="bg-bg-2 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-16 px-5 md:grid-cols-2 md:px-8">
        <Reveal>
          <SectionHeading align="left" eyebrow="Liên hệ" title="Đặt lịch cho ngày đặc biệt của bạn" description="Điền form hoặc nhắn trực tiếp qua Zalo. Mình thường phản hồi trong vòng vài giờ." />
          <ul className="mt-10 space-y-4 text-sm text-muted">
            {settings.phone && (
              <li className="flex items-center gap-3"><Phone size={16} className="text-gold" /><a href={tel ?? "#"} className="hover:text-ink">{settings.phone}</a></li>
            )}
            {settings.address && (
              <li className="flex items-center gap-3"><MapPin size={16} className="text-gold" /><span>{settings.address}</span></li>
            )}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            {zalo && <SocialPill href={zalo} label="Zalo" />}
            {settings.facebook && <SocialPill href={settings.facebook} label="Messenger" icon={<MessageCircle size={14} />} />}
            {settings.instagram && <SocialPill href={settings.instagram} label="Instagram" icon={<Camera size={14} />} />}
            {settings.tiktok && <SocialPill href={settings.tiktok} label="TikTok" />}
            {tel && <SocialPill href={tel} label="Gọi điện" icon={<Phone size={14} />} />}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="space-y-5">
            <Field label="Tên của bạn" name="name" required placeholder="Nguyễn Thị A" />
            <Field label="Số điện thoại / Zalo" name="phone" required placeholder="09xx xxx xxx" inputMode="tel" />
            <div>
              <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.25em] text-muted">Dịch vụ</label>
              <select name="service" className="input">
                <option value="">Chọn dịch vụ</option>
                {services.map((s) => <option key={s.id} value={s.title ?? ""}>{s.title}</option>)}
                <option value="Khác">Khác</option>
              </select>
            </div>
            <Field label="Ngày dự kiến" name="date" type="date" />
            <div>
              <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.25em] text-muted">Lời nhắn</label>
              <textarea name="message" rows={4} className="input" placeholder="Địa điểm, số người, phong cách mong muốn..." />
            </div>
            {/* Honeypot chống spam */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <Button type="submit" disabled={status.state === "sending"} className="w-full">
              {status.state === "sending" ? "Đang gửi..." : "Gửi yêu cầu"}
            </Button>
            {status.state === "ok" && <p className="text-sm text-gold">{status.message}</p>}
            {status.state === "error" && <p className="text-sm text-red-300">{status.message}</p>}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.25em] text-muted">{label}</label>
      <input className="input" {...props} />
    </div>
  );
}

function SocialPill({ href, label, icon }: { href: string; label: string; icon?: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[0.65rem] uppercase tracking-[0.2em] text-muted transition-colors hover:border-gold hover:text-gold">
      {icon}{label}
    </a>
  );
}
