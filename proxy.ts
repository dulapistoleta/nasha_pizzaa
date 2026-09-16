import { NextResponse, type NextRequest } from "next/server";
import { clientIp, enforceRateLimit, memoryStore, type RateLimitRule } from "@/lib/rate-limit";
import { securityHeaders } from "@/lib/security-headers";

/**
 * Прослойка запроса (в Next 16 заменила `middleware`).
 *
 * Что делает:
 *  1. Отсекает сканеры уязвимостей по типовым путям — не доводит их до рендера.
 *  2. Ограничивает частоту запросов по IP (защита от парсинга и флуда).
 *  3. Проставляет заголовки безопасности, включая на отказных ответах.
 *
 * Ограничения и оговорки — в README, раздел «Безопасность».
 */

/* Лимиты подобраны так, чтобы живой пользователь не мог в них упереться:
   одна загрузка страницы = 1 документ + ~34 оптимизированных картинки. */
const RULES: Record<string, RateLimitRule> = {
  page: { name: "page", limit: 120, windowMs: 60_000 },
  image: { name: "image", limit: 1_500, windowMs: 60_000 },
  api: { name: "api", limit: 30, windowMs: 60_000 },
};

/** Типовые пути, которые сканеры дёргают в поисках утечек и админок. */
const SCANNER_PATHS =
  /^\/(\.env|\.git|\.svn|\.aws|\.ssh|wp-admin|wp-login|wp-content|xmlrpc\.php|phpmyadmin|admin\.php|administrator|vendor\/|\.well-known\/\.\.|actuator|actuator\/|cgi-bin|shell|config\.(php|json|ya?ml)|backup|\.DS_Store|drupal|joomla|typo3)/i;

function pickRule(pathname: string): RateLimitRule {
  if (pathname.startsWith("/api/")) return RULES.api;
  if (pathname.startsWith("/_next/image")) return RULES.image;
  return RULES.page;
}

function deny(status: number, message: string, extraHeaders?: Record<string, string>) {
  const response = new NextResponse(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8", ...extraHeaders },
  });

  for (const { key, value } of securityHeaders(process.env.NODE_ENV === "development")) {
    response.headers.set(key, value);
  }

  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isDev = process.env.NODE_ENV === "development";

  /* 1. Сканеры: отвечаем сразу, не тратя ресурсы на рендер. */
  if (SCANNER_PATHS.test(pathname)) {
    return deny(404, "Not found");
  }

  /* 2. Только безопасные методы: страница ничего не принимает POST-ом. */
  if (request.method !== "GET" && request.method !== "HEAD") {
    return deny(405, "Method not allowed", { Allow: "GET, HEAD" });
  }

  /* 3. Ограничение частоты. */
  const rule = pickRule(pathname);
  const result = await enforceRateLimit(memoryStore, clientIp(request.headers), rule);

  const limitHeaders: Record<string, string> = {
    "X-RateLimit-Limit": String(rule.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };

  if (!result.ok) {
    return deny(429, "Too many requests. Please slow down.", {
      ...limitHeaders,
      "Retry-After": String(result.retryAfterSeconds),
    });
  }

  /* 4. Пропускаем дальше, добавив заголовки безопасности и на успешный ответ. */
  const response = NextResponse.next();

  for (const { key, value } of securityHeaders(isDev)) {
    response.headers.set(key, value);
  }
  for (const [key, value] of Object.entries(limitHeaders)) {
    response.headers.set(key, value);
  }

  return response;
}

export const config = {
  /* Статику с хэшем в имени не трогаем — она отдаётся CDN и не нагружает сервер.
     `_next/image` наоборот под защитой: это самая дорогая операция. */
  matcher: ["/((?!_next/static).*)"],
};
