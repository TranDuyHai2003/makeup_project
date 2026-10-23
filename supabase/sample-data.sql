-- DỮ LIỆU MẪU: ảnh Unsplash, dịch vụ, cảm nhận khách hàng để trang trông đầy đủ trong lúc chờ dữ liệu thật.
-- Chạy trong Supabase → SQL Editor. Chạy lại nhiều lần cũng không bị nhân đôi.
-- KHÔNG ghi đè tên, số điện thoại, Zalo, Facebook, địa chỉ đã có; chỉ điền vào ô còn trống.
-- Ảnh mẫu có public_id = '' nên xoá trong admin sẽ không đụng tới Cloudinary.
-- SAU KHI CHẠY: vào trang admin → Cài đặt → bấm Lưu một lần để trang public xoá cache và hiện dữ liệu mới.

-- Settings: chỉ điền ô đang trống
update settings set
  bio = coalesce(bio, 'Với nhiều năm đồng hành cùng các cô dâu, những buổi chụp hình và sự kiện, mình tin rằng lớp trang điểm đẹp nhất là lớp trang điểm khiến bạn vẫn là chính mình, chỉ rạng rỡ hơn. Mỗi gương mặt là một câu chuyện, và mình ở đây để kể câu chuyện ấy bằng ánh sáng, màu sắc và sự tinh tế.'),
  avatar_url = coalesce(avatar_url, 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80'),
  hero_url = coalesce(hero_url, 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1920&q=80'),
  years_exp = coalesce(years_exp, 6),
  clients_count = coalesce(clients_count, 850)
where id = 1;

-- Ảnh portfolio mẫu (chỉ thêm khi bảng photos còn trống)
insert into photos (url, public_id, before_url, category_id, caption, is_featured, width, height, sort_order)
select v.url, '', v.before_url, c.id, v.caption, v.featured, v.w, v.h, v.ord
from (values
  ('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', null, 'co-dau', 'Cô dâu Thanh Hà', true, 1200, 1600, 1),
  ('https://images.unsplash.com/photo-1457972729786-0411a3b2b626?auto=format&fit=crop&w=1200&q=80', null, 'co-dau', 'Bridal soft glam', true, 1200, 1500, 2),
  ('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80', 'editorial', 'Editorial glow', true, 1200, 1500, 3),
  ('https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80', null, 'su-kien', 'Dạ tiệc', false, 1200, 1500, 4),
  ('https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=80', 'co-dau', 'Nhẹ nhàng, trong trẻo', true, 1200, 1800, 5),
  ('https://images.unsplash.com/photo-1503104834685-7205e8607eb9?auto=format&fit=crop&w=1200&q=80', null, 'ky-yeu', 'Kỷ yếu lớp 12A1', false, 1200, 1500, 6),
  ('https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80', null, 'editorial', 'Studio', false, 1200, 1600, 7),
  ('https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=80', null, 'su-kien', 'Tiệc cưới', false, 1200, 1500, 8),
  ('https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80', null, 'editorial', 'Chi tiết', false, 1200, 800, 9)
) as v(url, before_url, slug, caption, featured, w, h, ord)
left join categories c on c.slug = v.slug
where not exists (select 1 from photos);

-- Dịch vụ mẫu (chỉ thêm khi bảng còn trống)
insert into services (title, description, price_from, sort_order)
select * from (values
  ('Makeup cô dâu', 'Trọn gói ngày cưới: thử makeup, làm tóc, dặm lại trong tiệc. Phong cách trong trẻo hoặc glam tuỳ ý.', 2500000, 1),
  ('Makeup sự kiện', 'Dự tiệc, gala, ra mắt sản phẩm. Lớp nền bền 10 tiếng, lên hình đẹp dưới mọi ánh sáng.', 600000, 2),
  ('Makeup chụp ảnh / editorial', 'Concept theo yêu cầu của ekip. Có kinh nghiệm làm việc với studio và tạp chí.', 800000, 3),
  ('Makeup kỷ yếu', 'Giá ưu đãi theo nhóm. Trang điểm nhanh, tự nhiên, phù hợp lứa tuổi học sinh.', 150000, 4),
  ('Dạy makeup cá nhân', 'Buổi học 1 kèm 1, hướng dẫn trang điểm hợp gương mặt bạn, tư vấn mỹ phẩm theo ngân sách.', 1200000, 5)
) as v(title, description, price_from, sort_order)
where not exists (select 1 from services);

-- Cảm nhận khách hàng mẫu (chỉ thêm khi bảng còn trống)
insert into testimonials (client_name, content, rating)
select * from (values
  ('Thanh Hà', 'Lớp nền bền suốt 12 tiếng tiệc cưới mà vẫn mỏng nhẹ. Nhìn ảnh cưới mình vẫn là mình, chỉ xinh hơn rất nhiều.', 5),
  ('Minh Anh', 'Mình da dầu, hay trôi nền nhưng được xử lý rất khéo. Bạn bè hỏi suốt là makeup ở đâu.', 5),
  ('Quỳnh Chi', 'Đúng giờ, nhẹ nhàng, tư vấn kiểu tóc hợp váy luôn. Rất đáng tiền.', 5)
) as v(client_name, content, rating)
where not exists (select 1 from testimonials);

-- ===== XOÁ DỮ LIỆU MẪU (khi đã có dữ liệu thật) =====
-- Bỏ dấu -- ở các dòng dưới rồi chạy riêng đoạn này. Chỉ xoá ảnh mẫu (public_id rỗng) và ảnh mẫu Unsplash ở avatar/hero.
-- delete from photos where public_id = '';
-- update settings set avatar_url = null where avatar_url like 'https://images.unsplash.com/%';
-- update settings set hero_url = null where hero_url like 'https://images.unsplash.com/%';
-- Dịch vụ và cảm nhận mẫu: sửa hoặc xoá trực tiếp trong trang admin.
