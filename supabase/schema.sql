-- Chạy file này trong Supabase Dashboard → SQL Editor → New query → Run
-- (Chạy một lần duy nhất khi tạo project.)

create table if not exists settings (
  id int primary key default 1,
  artist_name text, tagline text, bio text,
  avatar_url text, hero_url text,
  phone text, zalo text, facebook text, instagram text, tiktok text,
  address text, years_exp int, clients_count int,
  constraint single_row check (id = 1)
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null, slug text unique not null, sort_order int default 0
);

create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  url text not null, public_id text not null,
  before_url text,                      -- dùng cho slider Before/After
  category_id uuid references categories(id) on delete set null,
  caption text, is_featured boolean default false,
  width int, height int, sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  title text, description text, price_from int, sort_order int default 0
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text, content text, photo_url text, rating int default 5,
  created_at timestamptz default now()
);

-- Dòng settings mặc định
insert into settings (id, artist_name, tagline) values (1, 'Makeup Artist', 'Tôn vinh vẻ đẹp riêng của bạn')
on conflict (id) do nothing;

-- Danh mục mặc định
insert into categories (name, slug, sort_order) values
  ('Cô dâu', 'co-dau', 1),
  ('Sự kiện', 'su-kien', 2),
  ('Editorial', 'editorial', 3),
  ('Kỷ yếu', 'ky-yeu', 4)
on conflict (slug) do nothing;

-- Bảo mật (RLS): ai cũng được ĐỌC, chỉ admin đã đăng nhập mới được GHI
do $$
declare t text;
begin
  foreach t in array array['settings','categories','photos','services','testimonials'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "public read" on %I', t);
    execute format('drop policy if exists "admin write" on %I', t);
    execute format('create policy "public read" on %I for select using (true)', t);
    execute format('create policy "admin write" on %I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- QUAN TRỌNG: Sau khi tạo tài khoản admin trong Authentication → Users,
-- vào Authentication → Providers → Email và TẮT "Allow new users to sign up".
