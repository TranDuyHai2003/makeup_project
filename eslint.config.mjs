import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Ảnh lấy từ Cloudinary đã được tối ưu qua URL (f_auto,q_auto,w_xxx),
      // nên dùng <img srcSet> trực tiếp thay vì next/image để không tốn quota tối ưu ảnh của Vercel.
      "@next/next/no-img-element": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
