import type { NextConfig } from "next";
import { securityHeaders } from "./lib/security-headers";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  /* Не раскрываем стек технологий в заголовке X-Powered-By. */
  poweredByHeader: false,

  reactStrictMode: true,

  /* Меньше клиентского JS: импорты из этих пакетов режутся пофайлово. */
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    /* SVG из внешних источников не оптимизируем — это вектор XSS */
    dangerouslyAllowSVG: false,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders(isDev),
      },
      {
        /* У плейсхолдеров блюд стабильные имена — кэшируем надолго.
           При замене на реальное фото имя то же, поэтому сутки, а не год. */
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
