import type { SiteData } from "./types";

/**
 * Dữ liệu mẫu, dùng khi chưa cấu hình Supabase để bạn xem giao diện ngay.
 * Khi đã kết nối Supabase, dữ liệu thật trong database sẽ thay thế toàn bộ.
 */
const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const CAT = {
  bridal: "11111111-1111-4111-8111-111111111111",
  event: "22222222-2222-4222-8222-222222222222",
  editorial: "33333333-3333-4333-8333-333333333333",
  yearbook: "44444444-4444-4444-8444-444444444444",
};

export const mockData: SiteData = {
  settings: {
    id: 1,
    artist_name: "Linh Makeup",
    tagline: "Tôn vinh vẻ đẹp riêng của bạn, trong ngày quan trọng nhất.",
    bio: "Mình là Linh, makeup artist với hơn 6 năm đồng hành cùng các cô dâu và những buổi chụp hình, sự kiện. Mình tin rằng lớp trang điểm đẹp nhất là lớp trang điểm khiến bạn vẫn là chính mình, chỉ rạng rỡ hơn. Mỗi gương mặt là một câu chuyện, và mình ở đây để kể câu chuyện ấy bằng ánh sáng, màu sắc và sự tinh tế.",
    avatar_url: u("photo-1487412947147-5cebf100ffc2", 800),
    hero_url: u("photo-1516975080664-ed2fc6a32937", 1920),
    phone: "0912 345 678",
    zalo: "0912345678",
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
    address: "Quận 1, TP. Hồ Chí Minh",
    years_exp: 6,
    clients_count: 850,
  },
  categories: [
    { id: CAT.bridal, name: "Cô dâu", slug: "co-dau", sort_order: 1 },
    { id: CAT.event, name: "Sự kiện", slug: "su-kien", sort_order: 2 },
    { id: CAT.editorial, name: "Editorial", slug: "editorial", sort_order: 3 },
    { id: CAT.yearbook, name: "Kỷ yếu", slug: "ky-yeu", sort_order: 4 },
  ],
  photos: [
    { id: "p1", url: u("photo-1519741497674-611481863552"), public_id: "", before_url: null, category_id: CAT.bridal, caption: "Cô dâu Thanh Hà", is_featured: true, width: 1200, height: 1600, sort_order: 1, created_at: "2026-01-01" },
    { id: "p2", url: u("photo-1457972729786-0411a3b2b626"), public_id: "", before_url: null, category_id: CAT.bridal, caption: "Bridal soft glam", is_featured: true, width: 1200, height: 1500, sort_order: 2, created_at: "2026-01-02" },
    { id: "p3", url: u("photo-1522337360788-8b13dee7a37e"), public_id: "", before_url: u("photo-1494790108377-be9c29b29330"), category_id: CAT.editorial, caption: "Editorial glow", is_featured: true, width: 1200, height: 1500, sort_order: 3, created_at: "2026-01-03" },
    { id: "p4", url: u("photo-1596462502278-27bfdc403348"), public_id: "", before_url: null, category_id: CAT.event, caption: "Dạ tiệc", is_featured: false, width: 1200, height: 1500, sort_order: 4, created_at: "2026-01-04" },
    { id: "p5", url: u("photo-1515372039744-b8f02a3ae446"), public_id: "", before_url: u("photo-1529626455594-4ff0802cfb7e"), category_id: CAT.bridal, caption: "Nhẹ nhàng, trong trẻo", is_featured: true, width: 1200, height: 1800, sort_order: 5, created_at: "2026-01-05" },
    { id: "p6", url: u("photo-1503104834685-7205e8607eb9"), public_id: "", before_url: null, category_id: CAT.yearbook, caption: "Kỷ yếu lớp 12A1", is_featured: false, width: 1200, height: 1500, sort_order: 6, created_at: "2026-01-06" },
    { id: "p7", url: u("photo-1524504388940-b1c1722653e1"), public_id: "", before_url: null, category_id: CAT.editorial, caption: "Studio", is_featured: false, width: 1200, height: 1600, sort_order: 7, created_at: "2026-01-07" },
    { id: "p8", url: u("photo-1531746020798-e6953c6e8e04"), public_id: "", before_url: null, category_id: CAT.event, caption: "Tiệc cưới", is_featured: false, width: 1200, height: 1500, sort_order: 8, created_at: "2026-01-08" },
    { id: "p9", url: u("photo-1512496015851-a90fb38ba796"), public_id: "", before_url: null, category_id: CAT.editorial, caption: "Chi tiết", is_featured: false, width: 1200, height: 800, sort_order: 9, created_at: "2026-01-09" },
  ],
  services: [
    { id: "s1", title: "Makeup cô dâu", description: "Trọn gói ngày cưới: thử makeup, làm tóc, dặm lại trong tiệc. Phong cách trong trẻo hoặc glam tuỳ ý.", price_from: 2500000, sort_order: 1 },
    { id: "s2", title: "Makeup sự kiện", description: "Dự tiệc, gala, ra mắt sản phẩm. Lớp nền bền 10 tiếng, lên hình đẹp dưới mọi ánh sáng.", price_from: 600000, sort_order: 2 },
    { id: "s3", title: "Makeup chụp ảnh / editorial", description: "Concept theo yêu cầu của ekip. Có kinh nghiệm làm việc với studio và tạp chí.", price_from: 800000, sort_order: 3 },
    { id: "s4", title: "Makeup kỷ yếu", description: "Giá ưu đãi theo nhóm. Trang điểm nhanh, tự nhiên, phù hợp lứa tuổi học sinh.", price_from: 150000, sort_order: 4 },
    { id: "s5", title: "Dạy makeup cá nhân", description: "Buổi học 1 kèm 1, hướng dẫn trang điểm hợp gương mặt bạn, tư vấn mỹ phẩm theo ngân sách.", price_from: 1200000, sort_order: 5 },
  ],
  testimonials: [
    { id: "t1", client_name: "Thanh Hà", content: "Lớp nền bền suốt 12 tiếng tiệc cưới mà vẫn mỏng nhẹ. Nhìn ảnh cưới mình vẫn là mình, chỉ xinh hơn rất nhiều. Cảm ơn Linh!", photo_url: null, rating: 5 },
    { id: "t2", client_name: "Minh Anh", content: "Mình da dầu, hay trôi nền nhưng Linh xử lý rất khéo. Bạn bè hỏi suốt là makeup ở đâu.", photo_url: null, rating: 5 },
    { id: "t3", client_name: "Quỳnh Chi", content: "Đúng giờ, nhẹ nhàng, tư vấn kiểu tóc hợp váy luôn. Rất đáng tiền.", photo_url: null, rating: 5 },
  ],
};
