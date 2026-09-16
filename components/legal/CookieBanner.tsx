"use client";

import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { useState } from "react";
import { useConsent } from "@/lib/consent";

/**
 * Баннер согласия на работу с данными в браузере.
 *
 * Принципы, чтобы это не стало «тёмным паттерном»:
 *  • три кнопки одного размера и веса — отказ не спрятан и не серый;
 *  • необязательные категории по умолчанию выключены;
 *  • выбор можно изменить в любой момент — ссылка «Настройки cookie» в подвале;
 *  • закрытие крестиком = согласие только на необходимое.
 */
export function CookieBanner() {
  const { isBannerOpen, consent, save, closeBanner } = useConsent();
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  if (!isBannerOpen) return null;

  const openSettings = () => {
    setAnalytics(consent?.analytics ?? false);
    setMarketing(consent?.marketing ?? false);
    setSettingsOpen(true);
  };

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-text"
      className="fixed inset-x-3 bottom-[5.5rem] z-[80] lg:inset-x-auto lg:right-6 lg:bottom-6 lg:max-w-md"
    >
      <div className="rounded-3xl border border-graphite/10 bg-cream p-5 shadow-float">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-sun text-graphite">
            <Cookie className="h-4.5 w-4.5" strokeWidth={2.6} />
          </span>
          <div className="flex flex-col gap-1">
            <h2 id="cookie-banner-title" className="font-display text-base font-black text-graphite">
              Данные в вашем браузере
            </h2>
            <p id="cookie-banner-text" className="text-xs leading-relaxed text-ink-50">
              Для работы корзины сайт хранит данные в браузере — это необходимо. Рекламных
              трекеров и аналитики у нас нет. Подробнее — в{" "}
              <Link href="/cookies" className="font-semibold text-graphite underline underline-offset-2">
                политике Cookie
              </Link>
              .
            </p>
          </div>
          <button
            type="button"
            onClick={() => save({ analytics: false, marketing: false })}
            aria-label="Закрыть и оставить только необходимое"
            className="ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-30 transition hover:bg-milk hover:text-graphite"
          >
            <X className="h-4 w-4" strokeWidth={2.6} />
          </button>
        </div>

        {isSettingsOpen ? (
          <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-line bg-white p-3">
            <label className="flex items-start justify-between gap-3 opacity-70">
              <span className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-graphite">Необходимые</span>
                <span className="text-[0.7rem] leading-snug text-ink-50">
                  Корзина и запоминание вашего выбора. Отключить нельзя.
                </span>
              </span>
              <input type="checkbox" checked disabled className="mt-1 h-4 w-4 accent-graphite" />
            </label>

            <label className="flex items-start justify-between gap-3">
              <span className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-graphite">Аналитика</span>
                <span className="text-[0.7rem] leading-snug text-ink-50">
                  Пока не используется. Если включим — только с вашего согласия.
                </span>
              </span>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(event) => setAnalytics(event.target.checked)}
                className="mt-1 h-4 w-4 accent-graphite"
              />
            </label>

            <label className="flex items-start justify-between gap-3">
              <span className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-graphite">Маркетинг</span>
                <span className="text-[0.7rem] leading-snug text-ink-50">
                  Пока не используется. Рекламных пикселей на сайте нет.
                </span>
              </span>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(event) => setMarketing(event.target.checked)}
                className="mt-1 h-4 w-4 accent-graphite"
              />
            </label>
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => save({ analytics: true, marketing: true })}
            className="flex-1 rounded-2xl bg-sun px-4 py-2.5 text-xs font-extrabold text-graphite transition hover:bg-sun-deep"
          >
            Принять все
          </button>
          <button
            type="button"
            onClick={() => save({ analytics: false, marketing: false })}
            className="flex-1 rounded-2xl border border-graphite/15 bg-white px-4 py-2.5 text-xs font-extrabold text-graphite transition hover:border-graphite/30 hover:bg-milk"
          >
            Только необходимые
          </button>
          {isSettingsOpen ? (
            <button
              type="button"
              onClick={() => save({ analytics, marketing })}
              className="flex-1 rounded-2xl bg-graphite px-4 py-2.5 text-xs font-extrabold text-cream transition hover:bg-graphite-soft"
            >
              Сохранить выбор
            </button>
          ) : (
            <button
              type="button"
              onClick={openSettings}
              className="flex-1 rounded-2xl border border-graphite/15 bg-white px-4 py-2.5 text-xs font-extrabold text-graphite transition hover:border-graphite/30 hover:bg-milk"
            >
              Настроить
            </button>
          )}
        </div>

        {isSettingsOpen ? (
          <button
            type="button"
            onClick={closeBanner}
            className="mt-3 text-[0.7rem] font-semibold text-ink-50 underline underline-offset-2 transition hover:text-graphite"
          >
            Вернуться назад
          </button>
        ) : null}
      </div>
    </div>
  );
}
