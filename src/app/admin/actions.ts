"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { destroyImage } from "@/lib/cloudinary-server";
import { SITE_TAG } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { TRANSLATED_LOCALES } from "@/lib/i18n/config";
import { TRANSLATABLE, type Translations } from "@/lib/i18n/content";
import { slugify } from "@/lib/utils";

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Mọi action ghi dữ liệu đều kiểm tra user lại, không chỉ dựa vào proxy.ts. */
async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Bạn chưa đăng nhập.");
  return supabase;
}

function fail(err: unknown): ActionResult {
  let message = err instanceof Error ? err.message : String(err);
  if (/column .*i18n.* does not exist|i18n.*schema cache/i.test(message)) {
    message = "Database chưa có cột bản dịch. Hãy chạy file supabase/migrations/002_i18n.sql trong Supabase → SQL Editor.";
  }
  console.error("[admin action]", message);
  return { ok: false, error: message };
}

/** Làm mới cache trang public ngay lập tức (đọc thấy ngay dữ liệu vừa ghi). */
function refresh() {
  updateTag(SITE_TAG);
}

/** Đọc các ô bản dịch "i18n.<lang>.<field>" từ form thành { en: {...}, "zh-TW": {...} } (bỏ ô trống). */
function readI18n(formData: FormData, fields: readonly string[]): Translations {
  const out: Translations = {};
  for (const lang of TRANSLATED_LOCALES) {
    const entry: Record<string, string> = {};
    for (const f of fields) {
      const v = String(formData.get(`i18n.${lang}.${f}`) ?? "").trim();
      if (v) entry[f] = v.slice(0, 5000);
    }
    if (Object.keys(entry).length) out[lang] = entry;
  }
  return out;
}

const emptyToNull = (v: unknown) => (v === "" || v === undefined ? null : v);
const optText = z.preprocess(emptyToNull, z.string().max(5000).nullable());
const optInt = z.preprocess((v) => (v === "" || v == null ? null : Number(v)), z.number().int().nullable());

// ---------- Auth ----------
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------- Settings ----------
const settingsSchema = z.object({
  artist_name: optText, tagline: optText, bio: optText, avatar_url: optText, hero_url: optText,
  phone: optText, zalo: optText, facebook: optText, instagram: optText, tiktok: optText,
  address: optText, years_exp: optInt, clients_count: optInt,
});

export async function saveSettings(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const data = settingsSchema.parse(Object.fromEntries(formData.entries()));
    const i18n = readI18n(formData, TRANSLATABLE.settings);
    const { error } = await supabase.from("settings").upsert({ id: 1, ...data, i18n });
    if (error) throw new Error(error.message);
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

// ---------- Categories ----------
export async function createCategory(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const name = z.string().trim().min(1, "Thiếu tên danh mục").parse(formData.get("name"));
    const slugInput = String(formData.get("slug") ?? "").trim();
    const slug = slugify(slugInput || name);
    const { count } = await supabase.from("categories").select("id", { count: "exact", head: true });
    const i18n = readI18n(formData, TRANSLATABLE.categories);
    const { error } = await supabase.from("categories").insert({ name, slug, sort_order: (count ?? 0) + 1, i18n });
    if (error) throw new Error(error.message);
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/** Sửa tên (kèm bản dịch) và slug của danh mục từ form. */
export async function saveCategory(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const id = z.string().uuid().parse(formData.get("id"));
    const name = z.string().trim().min(1, "Thiếu tên danh mục").parse(formData.get("name"));
    const slug = slugify(String(formData.get("slug") ?? "").trim() || name);
    const i18n = readI18n(formData, TRANSLATABLE.categories);
    const { error } = await supabase.from("categories").update({ name, slug, i18n }).eq("id", id);
    if (error) throw new Error(error.message);
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function updateCategory(id: string, patch: { name?: string; slug?: string; sort_order?: number }): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const clean = { ...patch, ...(patch.slug ? { slug: slugify(patch.slug) } : {}) };
    const { error } = await supabase.from("categories").update(clean).eq("id", id);
    if (error) throw new Error(error.message);
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw new Error(error.message);
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

// ---------- Photos ----------
const photoInsertSchema = z.object({
  url: z.string().url(),
  public_id: z.string().min(1),
  width: z.number().int().nullable(),
  height: z.number().int().nullable(),
  category_id: z.string().uuid().nullable(),
});

/** Lưu nhiều ảnh vừa upload lên Cloudinary vào bảng photos. */
export async function savePhotos(items: z.infer<typeof photoInsertSchema>[]): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const rows = z.array(photoInsertSchema).min(1).parse(items);
    const { data: last } = await supabase.from("photos").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
    let order = (last?.sort_order ?? 0) + 1;
    const { error } = await supabase.from("photos").insert(rows.map((r) => ({ ...r, sort_order: order++ })));
    if (error) throw new Error(error.message);
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

const photoPatchSchema = z.object({
  caption: optText.optional(),
  category_id: z.preprocess(emptyToNull, z.string().uuid().nullable()).optional(),
  is_featured: z.boolean().optional(),
  before_url: z.preprocess(emptyToNull, z.string().url().nullable()).optional(),
  i18n: z.record(z.string(), z.record(z.string(), z.string())).optional(),
});

export async function updatePhoto(id: string, patch: z.infer<typeof photoPatchSchema>): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const clean = photoPatchSchema.parse(patch);
    const { error } = await supabase.from("photos").update(clean).eq("id", id);
    if (error) throw new Error(error.message);
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/** Xoá ảnh trong DB và trên Cloudinary (kể cả ảnh before nếu là ảnh Cloudinary). */
export async function deletePhoto(id: string): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const { data: photo, error: readErr } = await supabase.from("photos").select("public_id, before_url").eq("id", id).maybeSingle();
    if (readErr) throw new Error(readErr.message);
    const { error } = await supabase.from("photos").delete().eq("id", id);
    if (error) throw new Error(error.message);
    if (photo?.public_id) await destroyImage(photo.public_id);
    const beforeId = photo?.before_url ? extractPublicId(photo.before_url) : null;
    if (beforeId) await destroyImage(beforeId);
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function reorderPhotos(orderedIds: string[]): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const ids = z.array(z.string().uuid()).parse(orderedIds);
    const results = await Promise.all(ids.map((id, i) => supabase.from("photos").update({ sort_order: i + 1 }).eq("id", id)));
    const err = results.find((r) => r.error)?.error;
    if (err) throw new Error(err.message);
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/** Xoá một ảnh lẻ trên Cloudinary (vd: ảnh hero/avatar cũ). Không bắt buộc thành công. */
export async function destroyCloudinaryImage(publicId: string): Promise<ActionResult> {
  try {
    await requireUser();
    await destroyImage(publicId);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

function extractPublicId(url: string): string | null {
  const m = url.match(/\/upload\/(?:[^/]+\/)*?(?:v\d+\/)?(.+?)\.[a-zA-Z0-9]+$/);
  return m?.[1] ?? null;
}

// ---------- Services ----------
const serviceSchema = z.object({ title: optText, description: optText, price_from: optInt, sort_order: optInt });

export async function saveService(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const id = String(formData.get("id") ?? "");
    const data = serviceSchema.parse(Object.fromEntries(formData.entries()));
    const payload = { ...data, sort_order: data.sort_order ?? 0, i18n: readI18n(formData, TRANSLATABLE.services) };
    const { error } = id
      ? await supabase.from("services").update(payload).eq("id", id)
      : await supabase.from("services").insert(payload);
    if (error) throw new Error(error.message);
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteService(id: string): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) throw new Error(error.message);
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

// ---------- Testimonials ----------
const testimonialSchema = z.object({
  client_name: optText, content: optText, photo_url: optText,
  rating: z.preprocess((v) => (v === "" || v == null ? 5 : Number(v)), z.number().int().min(1).max(5)),
});

export async function saveTestimonial(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const id = String(formData.get("id") ?? "");
    const data = { ...testimonialSchema.parse(Object.fromEntries(formData.entries())), i18n: readI18n(formData, TRANSLATABLE.testimonials) };
    const { error } = id
      ? await supabase.from("testimonials").update(data).eq("id", id)
      : await supabase.from("testimonials").insert(data);
    if (error) throw new Error(error.message);
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) throw new Error(error.message);
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}
