/**
 * Заголовки безопасности — единый источник правды.
 *
 * Используются и в `next.config.ts` (для обычных ответов), и в `proxy.ts`
 * (чтобы ответы 429/403 тоже уходили с защитными заголовками).
 */

/**
 * Политика безопасности контента.
 *
 * Next вставляет инлайновые bootstrap-скрипты и flight-данные, а Framer Motion
 * пишет инлайновые `style`. Пер-запросный nonce потребовал бы динамического
 * рендеринга и лишил бы лендинг статической генерации и кэша на CDN — поэтому
 * CSP статическая: сторонние источники скриптов запрещены полностью.
 */
export function buildCsp(isDev: boolean): string {
  return [
    "default-src 'self'",
    isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
      : "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self' data:",
    // Никаких сторонних API: всё, что нужно, отдаёт свой же origin
    "connect-src 'self'",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export function securityHeaders(isDev: boolean): { key: string; value: string }[] {
  return [
    { key: "Content-Security-Policy", value: buildCsp(isDev) },
    {
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: [
        "camera=()",
        "microphone=()",
        "geolocation=()",
        "payment=()",
        "usb=()",
        "magnetometer=()",
        "gyroscope=()",
        "accelerometer=()",
        "interest-cohort=()",
        "browsing-topics=()",
      ].join(", "),
    },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
    { key: "X-DNS-Prefetch-Control", value: "off" },
    { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  ];
}
