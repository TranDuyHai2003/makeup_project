import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Font Cormorant Garamond (giấy phép OFL, xem src/assets/fonts/OFL.txt) đã cắt gọn còn Latin + tiếng Việt,
 * dùng cho favicon và ảnh chia sẻ tạo bằng ImageResponse. Đọc một lần ở cấp module.
 */
const dir = join(process.cwd(), "src/assets/fonts");

const [light, lightItalic, medium] = await Promise.all([
  readFile(join(dir, "CormorantGaramond-Light.ttf")),
  readFile(join(dir, "CormorantGaramond-LightItalic.ttf")),
  readFile(join(dir, "CormorantGaramond-Medium.ttf")),
]);

export const ogFonts = [
  { name: "Cormorant", data: light, weight: 300 as const, style: "normal" as const },
  { name: "Cormorant", data: lightItalic, weight: 300 as const, style: "italic" as const },
  { name: "Cormorant", data: medium, weight: 500 as const, style: "normal" as const },
];
