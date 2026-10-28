import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, matchLocale } from "@/lib/i18n/config";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Trang public đa ngôn ngữ:
 * - "/en/..." và "/zh-TW/..." đi thẳng vào route [lang].
 * - "/vi/..." chuyển hướng (308) về đường dẫn không tiền tố để mỗi trang chỉ có một URL chuẩn.
 * - Đường dẫn không tiền tố: lần đầu ghé (chưa có cookie chọn ngôn ngữ) mà trình duyệt ưu tiên tiếng Anh / tiếng Trung
 *   thì chuyển sang ngôn ngữ đó; còn lại phục vụ tiếng Việt bằng rewrite nội bộ sang "/vi/..." (URL trên thanh địa chỉ giữ nguyên).
 */
const BOT_UA = /bot|crawl|spider|slurp|facebookexternalhit|facebot|meta-externalagent|zalo|whatsapp|telegram|discord|linkedin|twitter|preview|lighthouse/i;

function handleLocale(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";

  if (isLocale(first) && first !== DEFAULT_LOCALE) return NextResponse.next();

  // Ảnh chia sẻ của trang tiếng Việt nằm ở /vi/.../opengraph-image: phục vụ thẳng, không chuyển hướng
  if (first === DEFAULT_LOCALE && pathname.includes("/opengraph-image")) return NextResponse.next();

  if (first === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(DEFAULT_LOCALE.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const preferred = isLocale(saved) ? saved : matchLocale(request.headers.get("accept-language"));
  // Robot (Google, Facebook, Zalo...) luôn nhận đúng trang theo link, không bị tự chuyển ngôn ngữ
  const isBot = BOT_UA.test(request.headers.get("user-agent") ?? "");
  if (preferred !== DEFAULT_LOCALE && !saved && !isBot) {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferred}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url, 307);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.rewrite(url);
}

export async function proxy(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) return handleLocale(request);
  return adminGuard(request);
}

/**
 * Chạy trước mọi request vào /admin:
 * 1. Làm mới session Supabase (ghi lại cookie nếu token được refresh).
 * 2. Chưa đăng nhập → chuyển về /admin/login. Đã đăng nhập mà vào /admin/login → về /admin.
 * Lưu ý: đây chỉ là lớp bảo vệ đầu tiên; mỗi server action vẫn kiểm tra user lại (xem admin/actions.ts).
 */
async function adminGuard(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname.startsWith("/admin/login");

  // Chưa cấu hình Supabase: cho qua để trang admin hiển thị hướng dẫn cấu hình.
  if (!SUPABASE_URL.startsWith("http") || SUPABASE_ANON_KEY.length < 20) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (user && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  // Bỏ qua file tĩnh, API, ảnh/icon sinh tự động, sitemap, robots, manifest
  matcher: [
    "/((?!_next/|api/|icon|apple-icon|manifest\\.webmanifest|robots\\.txt|sitemap\\.xml|favicon|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|txt|xml|webmanifest|woff2?|ttf)$).*)",
  ],
};

