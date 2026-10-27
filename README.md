# Makeup Artist Portfolio

Website portfolio tông tối, điểm nhấn gold, kèm trang admin để chủ sở hữu tự cập nhật ảnh, dịch vụ, bảng giá, cảm nhận khách hàng và thông tin liên hệ. Toàn bộ dịch vụ đi kèm đều có gói miễn phí.

| Thành phần | Công nghệ |
|---|---|
| Framework | Next.js 16 (App Router, Cache Components) + TypeScript |
| Giao diện | Tailwind CSS v4, Framer Motion, yet-another-react-lightbox, dnd-kit |
| Database + đăng nhập admin | Supabase (Postgres + Auth, RLS) |
| Ảnh | Cloudinary (upload thẳng từ trình duyệt, tối ưu `f_auto,q_auto,w_xxx`) |
| Liên hệ | Nút Messenger / Zalo / Instagram / gọi điện (không cần email server) |
| Hosting | Vercel |

## Chạy thử ngay (chưa cần tài khoản gì)

```bash
npm install
npm run dev
```

Mở http://localhost:3000. Khi chưa có `.env.local`, trang chạy bằng **dữ liệu mẫu** (`src/lib/mock-data.ts`) để xem giao diện. Trang admin sẽ hiện thông báo "Chưa cấu hình Supabase".

## Tài khoản cần tạo (tất cả miễn phí)

Bạn tự tạo các tài khoản dưới đây bằng email của mình, sau đó sao chép các khoá vào file `.env.local` (copy từ `.env.example`). **Không gửi mật khẩu hay API key cho ai khác.**

### 1. Supabase (bắt buộc cho admin)

1. Vào https://supabase.com → New project. Chọn region **Singapore** cho nhanh ở Việt Nam. Đặt mật khẩu database (lưu lại).
2. Vào **SQL Editor → New query**, dán toàn bộ nội dung file `supabase/schema.sql` → **Run**.
3. Vào **Authentication → Users → Add user → Create new user**: nhập email + mật khẩu cho chủ sở hữu trang. Tick "Auto Confirm User".
4. Vào **Authentication → Sign In / Providers → Email** và **TẮT "Allow new users to sign up"**. Nếu không tắt, người lạ có thể tự đăng ký và sửa trang.
5. Vào **Project Settings → API**, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Cloudinary (bắt buộc để upload ảnh)

1. Vào https://cloudinary.com → đăng ký free.
2. Ở **Dashboard** (hoặc Settings → API Keys), copy:
   - `Cloud name` → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `API Key` → `CLOUDINARY_API_KEY`
   - `API Secret` → `CLOUDINARY_API_SECRET`

### 3. GitHub + Vercel (để đưa trang lên mạng)

1. Tạo repo trên https://github.com và push code lên.
2. Vào https://vercel.com → **Add New → Project** → chọn repo → ở bước **Environment Variables** dán toàn bộ biến trong `.env.local` (đổi `NEXT_PUBLIC_SITE_URL` thành `https://tenban.vercel.app`) → Deploy.
3. Từ đó mỗi lần push code, Vercel tự deploy lại.

### 4. Giữ Supabase không bị tạm dừng

Supabase free tạm dừng project sau 7 ngày không hoạt động. Workflow `.github/workflows/keep-alive.yml` gọi `/api/keep-alive` 3 ngày một lần. Trong GitHub repo → **Settings → Secrets and variables → Actions**, thêm:

- `SITE_URL` = `https://tenban.vercel.app`
- `KEEP_ALIVE_SECRET` = chuỗi ngẫu nhiên bất kỳ, **giống** giá trị `KEEP_ALIVE_SECRET` đã đặt trên Vercel.

## Logo, favicon, tiêu đề

- **Biểu tượng thương hiệu**: mắt khép với hàng mi cong, nét kẻ mắt đuôi mèo, chân mày và ánh lấp lánh, vẽ bằng nét thư pháp vàng hồng. Là vector trong `src/lib/logo-mark.ts`, dùng chung cho logo (header, footer), favicon, icon iPhone, icon ứng dụng và ảnh chia sẻ.
- **Logo trên trang** = biểu tượng + tên nghệ sĩ (sửa tên trong Admin → Cài đặt).
- **Favicon / icon**: `src/app/icon.tsx`, `src/app/apple-icon.tsx`, `src/app/manifest.ts`.
- **Ảnh chia sẻ** Facebook / Zalo / Messenger (1200×630): biểu tượng + tên + câu giới thiệu + ảnh hero trong khung vòm; mỗi album có ảnh riêng. Xem `src/app/(public)/opengraph-image.tsx`.
- **Tiêu đề trang**: trang chủ "Tên · Makeup cô dâu & sự kiện tại <địa chỉ>", album "Album makeup Cô dâu · Tên".
- Font vẽ ảnh chia sẻ: Cormorant Garamond (giấy phép OFL) trong `src/assets/fonts/`, đã cắt gọn còn chữ Latin + tiếng Việt.

Facebook lưu cache ảnh chia sẻ. Sau khi đổi tên/ảnh hero, dán link vào https://developers.facebook.com/tools/debug/ và bấm **Scrape Again** để cập nhật.

## Cấu trúc dự án

```
src/
├─ app/
│  ├─ (public)/                 # Trang chủ one-page + /portfolio/[category]
│  ├─ admin/
│  │  ├─ login/                 # Đăng nhập (Supabase Auth)
│  │  ├─ (protected)/           # Dashboard, photos, categories, services, testimonials, settings
│  │  └─ actions.ts             # Server actions: kiểm tra user + ghi DB + updateTag('site')
│  ├─ api/
│  │  ├─ cloudinary-sign/       # Ký upload (chỉ admin đã đăng nhập)
│  │  └─ keep-alive/            # Giữ Supabase thức
│  ├─ sitemap.ts, robots.ts
├─ components/  (ui/, sections/, admin/)
├─ lib/
│  ├─ data.ts                   # getSiteData(): 'use cache' + cacheTag, dùng mock khi chưa có Supabase
│  ├─ supabase/ (client, server, public)
│  ├─ cloudinary.ts / cloudinary-server.ts
│  └─ mock-data.ts
└─ proxy.ts                     # Bảo vệ /admin (tên mới của middleware.ts trong Next.js 16)
supabase/schema.sql             # Tạo bảng + RLS
.github/workflows/keep-alive.yml
```

## Cách hoạt động

- **Trang public** gần như tĩnh: toàn bộ dữ liệu lấy một lần trong `getSiteData()` (được cache với tag `site`). Khi admin lưu bất kỳ thứ gì, server action gọi `updateTag('site')` nên trang public cập nhật ngay.
- **Upload ảnh**: trình duyệt xin chữ ký từ `/api/cloudinary-sign` rồi upload thẳng lên Cloudinary (không qua Vercel). Sau đó lưu `url`, `public_id`, `width`, `height` vào bảng `photos`. Xoá ảnh sẽ xoá luôn trên Cloudinary.
- **Before / After**: ảnh nào có `before_url` sẽ xuất hiện trong mục so sánh. Trong admin, bấm vào ảnh → thêm "Ảnh BEFORE".
- **Bảo mật**: `proxy.ts` chặn `/admin` khi chưa đăng nhập; mỗi server action kiểm tra user lại; RLS trong Postgres chỉ cho `authenticated` ghi dữ liệu; Cloudinary API secret chỉ ở server.

## Lệnh

```bash
npm run dev     # phát triển
npm run build   # build production
npm run start   # chạy bản build
npm run lint    # kiểm tra lint
```

## Tên miền riêng (sau này)

Mua `.com` ở Cloudflare Registrar hoặc Namecheap (~250–300k/năm), hoặc `.vn` ở nhà đăng ký trong nước. Trong Vercel → Project → **Domains** → thêm domain và trỏ DNS theo hướng dẫn. Nhớ đổi `NEXT_PUBLIC_SITE_URL` và `SITE_URL` (GitHub secret).
