import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { isResendConfigured } from "@/lib/env";

const schema = z.object({
  name: z.string().trim().min(1, "Thiếu tên").max(100),
  phone: z.string().trim().min(8, "Số điện thoại không hợp lệ").max(20),
  service: z.string().trim().max(100).optional().default(""),
  date: z.string().trim().max(20).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
  website: z.string().max(0).optional(), // honeypot: bot điền vào đây sẽ bị loại
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" }, { status: 400 });
  }
  const d = parsed.data;

  if (!isResendConfigured()) {
    console.log("[contact] (chưa cấu hình Resend) yêu cầu mới:", d);
    return NextResponse.json({ ok: true, message: "Đã nhận yêu cầu (chế độ demo: chưa cấu hình gửi email)." });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const esc = (s: string) => s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c] ?? c);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
    to: process.env.CONTACT_TO_EMAIL!,
    subject: `[Đặt lịch] ${d.name} · ${d.service || "Chưa chọn dịch vụ"}`,
    html: `
      <h2>Yêu cầu đặt lịch mới</h2>
      <p><b>Tên:</b> ${esc(d.name)}</p>
      <p><b>Điện thoại / Zalo:</b> ${esc(d.phone)}</p>
      <p><b>Dịch vụ:</b> ${esc(d.service) || "-"}</p>
      <p><b>Ngày dự kiến:</b> ${esc(d.date) || "-"}</p>
      <p><b>Lời nhắn:</b><br/>${esc(d.message).replace(/\n/g, "<br/>") || "-"}</p>
    `,
  });

  if (error) {
    console.error("[contact] resend error", error);
    return NextResponse.json({ ok: false, error: "Không gửi được email, vui lòng nhắn Zalo." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, message: "Đã gửi! Mình sẽ liên hệ lại sớm." });
}
