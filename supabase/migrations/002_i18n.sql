-- ĐA NGÔN NGỮ (Tiếng Việt · English · 繁體中文)
-- Chạy MỘT LẦN trong Supabase → SQL Editor → New query → Run. Chạy lại cũng an toàn.
--
-- 1) Thêm cột "i18n" (jsonb) lưu bản dịch cho từng bảng, dạng:
--      { "en": { "tagline": "..." }, "zh-TW": { "tagline": "..." } }
--    Ô thiếu bản dịch → trang tiếng Anh / tiếng Trung tự hiện bản tiếng Việt.
-- 2) Điền sẵn bản dịch cho dữ liệu mẫu hiện có (ghép theo nội dung tiếng Việt, chỉ điền dòng CHƯA có bản dịch,
--    nên không ghi đè bản dịch đã sửa trong admin).
-- 3) SAU KHI CHẠY: vào trang admin → Cài đặt → bấm Lưu một lần để trang web xoá cache và hiện bản dịch.

alter table settings     add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table categories   add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table photos       add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table services     add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table testimonials add column if not exists i18n jsonb not null default '{}'::jsonb;

-- Báo cho Data API (PostgREST) biết có cột mới ngay lập tức
notify pgrst, 'reload schema';

-- ===== Cài đặt chung =====
update settings set i18n = jsonb_build_object(
  'en', jsonb_build_object(
    'tagline', 'Celebrating your own unique beauty',
    'bio', 'Over the years I have had the joy of working with brides, photo shoots and events, and I believe the most beautiful makeup is the kind that keeps you completely yourself, just more radiant. Every face tells a story, and I am here to tell yours through light, colour and a refined touch.',
    'address', 'Hanoi, Vietnam'
  ),
  'zh-TW', jsonb_build_object(
    'tagline', '襯托屬於你的獨特之美',
    'bio', '多年來陪伴許多新娘、拍攝與活動，我相信最美的妝容，是讓你依然是自己，只是更加光彩動人。每一張臉都是一個故事，而我在這裡，用光影、色彩與細膩的手法，為你訴說屬於你的故事。',
    'address', '越南河內'
  )
)
where id = 1 and (i18n is null or i18n = '{}'::jsonb);

-- ===== Danh mục (album) =====
update categories c set i18n = t.tr from (values
  ('co-dau',    '{"en":{"name":"Bridal"},    "zh-TW":{"name":"新娘"}}'::jsonb),
  ('su-kien',   '{"en":{"name":"Events"},    "zh-TW":{"name":"活動"}}'::jsonb),
  ('editorial', '{"en":{"name":"Editorial"}, "zh-TW":{"name":"時尚造型"}}'::jsonb),
  ('ky-yeu',    '{"en":{"name":"Graduation"},"zh-TW":{"name":"畢業照"}}'::jsonb)
) as t(slug, tr)
where c.slug = t.slug and (c.i18n is null or c.i18n = '{}'::jsonb);

-- ===== Dịch vụ =====
update services s set i18n = t.tr from (values
  ('Makeup cô dâu', '{
    "en":{"title":"Bridal makeup","description":"Full wedding-day package: makeup trial, hairstyling and touch-ups during the reception. Fresh and natural or full glam, your choice."},
    "zh-TW":{"title":"新娘妝","description":"婚禮當天全套服務：試妝、髮型與宴客期間補妝。清透自然或華麗風格，任你挑選。"}}'::jsonb),
  ('Makeup sự kiện', '{
    "en":{"title":"Event makeup","description":"Parties, galas and product launches. A base that lasts 10 hours and looks flawless on camera in any light."},
    "zh-TW":{"title":"活動妝","description":"派對、晚宴、產品發表會。底妝持妝 10 小時，在任何光線下都上鏡好看。"}}'::jsonb),
  ('Makeup chụp ảnh / editorial', '{
    "en":{"title":"Photo shoot / editorial makeup","description":"Concepts tailored to your crew''s brief. Experienced with studios and magazines."},
    "zh-TW":{"title":"拍攝 / 時尚造型妝","description":"依團隊需求打造妝感概念，具備與攝影棚及雜誌合作的經驗。"}}'::jsonb),
  ('Makeup kỷ yếu', '{
    "en":{"title":"Graduation photo makeup","description":"Group discounts available. Quick, natural makeup that suits students."},
    "zh-TW":{"title":"畢業照妝容","description":"團體享優惠價。快速、自然，適合學生的妝感。"}}'::jsonb),
  ('Dạy makeup cá nhân', '{
    "en":{"title":"Private makeup lessons","description":"One-on-one sessions teaching makeup that flatters your face, plus product advice to fit your budget."},
    "zh-TW":{"title":"一對一彩妝教學","description":"一對一課程，教你畫出適合自己臉型的妝容，並依預算推薦合適的彩妝品。"}}'::jsonb)
) as t(title, tr)
where s.title = t.title and (s.i18n is null or s.i18n = '{}'::jsonb);

-- ===== Cảm nhận khách hàng =====
update testimonials x set i18n = t.tr from (values
  ('Thanh Hà', '{
    "en":{"content":"My base lasted all 12 hours of the wedding and still felt light. In my wedding photos I still look like me, just so much prettier."},
    "zh-TW":{"content":"底妝撐過整整 12 小時的婚宴，依然輕薄服貼。看婚紗照時我還是我，只是美了好多。"}}'::jsonb),
  ('Minh Anh', '{
    "en":{"content":"I have oily skin and my foundation usually slides off, but it was handled so skilfully. My friends kept asking where I had my makeup done."},
    "zh-TW":{"content":"我是油性肌膚，底妝很容易脫妝，但處理得非常好。朋友一直問我是在哪裡化的妝。"}}'::jsonb),
  ('Quỳnh Chi', '{
    "en":{"content":"Punctual, gentle, and even suggested a hairstyle to match my dress. Absolutely worth it."},
    "zh-TW":{"content":"準時、溫柔，還幫我建議搭配禮服的髮型。非常值得。"}}'::jsonb)
) as t(client_name, tr)
where x.client_name = t.client_name and (x.i18n is null or x.i18n = '{}'::jsonb);

-- ===== Chú thích ảnh =====
update photos p set i18n = t.tr from (values
  ('Cô dâu Thanh Hà',       '{"en":{"caption":"Bride Thanh Ha"},           "zh-TW":{"caption":"新娘 Thanh Hà"}}'::jsonb),
  ('Bridal soft glam',      '{"en":{"caption":"Bridal soft glam"},         "zh-TW":{"caption":"柔和新娘妝"}}'::jsonb),
  ('Editorial glow',        '{"en":{"caption":"Editorial glow"},           "zh-TW":{"caption":"光澤時尚妝"}}'::jsonb),
  ('Dạ tiệc',               '{"en":{"caption":"Evening party"},            "zh-TW":{"caption":"晚宴"}}'::jsonb),
  ('Nhẹ nhàng, trong trẻo',  '{"en":{"caption":"Soft and fresh"},           "zh-TW":{"caption":"輕柔清透"}}'::jsonb),
  ('Kỷ yếu lớp 12A1',       '{"en":{"caption":"Class 12A1 graduation"},    "zh-TW":{"caption":"12A1 班畢業照"}}'::jsonb),
  ('Studio',                '{"en":{"caption":"Studio"},                   "zh-TW":{"caption":"攝影棚"}}'::jsonb),
  ('Tiệc cưới',             '{"en":{"caption":"Wedding reception"},        "zh-TW":{"caption":"婚宴"}}'::jsonb),
  ('Chi tiết',              '{"en":{"caption":"Details"},                  "zh-TW":{"caption":"細節"}}'::jsonb)
) as t(caption, tr)
where p.caption = t.caption and (p.i18n is null or p.i18n = '{}'::jsonb);
