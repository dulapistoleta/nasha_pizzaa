"use client";

import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { useState } from "react";
import { useConsent } from "@/lib/consent";

/**
 * Компактный тост согласия на работу с данными в браузере.
 *
 * Принципы, чтобы это не стало «тёмным паттерном»:
 *  • «Принять» и «Отклонить» — одинаковые по размеру и весу кнопки;
 *  • необязательные категории по умолчанию выключены;
 *  • выбор можно изменить в любой момент — «Настройки cookie» в подвале;
 *  • крестик равен отказу от необязательного.
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

  const rowClass =
    "flex-1 rounded-xl px-2.5 py-2 text-[0.7rem] font-extrabold transition whitespace-nowrap";

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-text"
      className="fixed inset-x-3 bottom-3 z-[80] sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-sm"
    >
      <div className="rounded-2xl border border-graphite/10 bg-cream p-3 shadow-float">
        <div className="flex items-start gap-2.5">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-sun text-graphite">
            <Cookie className="h-3.5 w-3.5" strokeWidth={2.6} />
          </span>
          <div className="flex min-w-0 flex-col gap-0.5">
            <h2 id="cookie-banner-title" className="text-xs font-bold text-graphite">
              Данные в вашем браузере
            </h2>
            <p id="cookie-banner-text" className="text-[0.7rem] leading-snug text-ink-50">
              Храним только корзину и ваш выбор. Рекламных трекеров и аналитики нет —{" "}
              <Link
                href="/cookies"
                className="font-semibold text-graphite underline underline-offset-2"
              >
                подробнее
              </Link>
              .
            </p>
          </div>
          <button
            type="button"
            onClick={() => save({ analytics: false, marketing: false })}
            aria-label="Закрыть и оставить только необходимое"
            className="ml-auto grid h-6 w-6 shrink-0 place-items-center rounded-full text-ink-30 transition hover:bg-milk hover:text-graphite"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.6} />
          </button>
        </div>

        {isSettingsOpen ? (
          <div className="mt-2.5 flex flex-col gap-1.5 rounded-xl border border-line bg-white p-2.5">
            <label className="flex items-start justify-between gap-3 opacity-70">
              <span className="flex flex-col gap-0.5">
                <span className="text-[0.7rem] font-bold text-graphite">Необходимые</span>
                <span className="text-[0.65rem] leading-snug text-ink-50">
                  Корзина и запоминание выбора. Отключить нельзя.
                </span>
              </span>
              <input type="checkbox" checked disabled className="mt-0.5 h-3.5 w-3.5 accent-graphite" />
            </label>

            <label className="flex items-start justify-between gap-3">
              <span className="flex flex-col gap-0.5">
                <span className="text-[0.7rem] font-bold text-graphite">Аналитика</span>
                <span className="text-[0.65rem] leading-snug text-ink-50">
                  Пока не используется — включим только с вашего согласия.
                </span>
              </span>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(event) => setAnalytics(event.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 accent-graphite"
              />
            </label>

            <label className="flex items-start justify-between gap-3">
              <span className="flex flex-col gap-0.5">
                <span className="text-[0.7rem] font-bold text-graphite">Маркетинг</span>
                <span className="text-[0.65rem] leading-snug text-ink-50">
                  Рекламных пикселей на сайте нет.
                </span>
              </span>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(event) => setMarketing(event.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 accent-graphite"
              />
            </label>
          </div>
        ) : null}

        <div className="mt-2.5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => save({ analytics: true, marketing: true })}
            className={`${rowClass} bg-sun text-graphite hover:bg-sun-deep`}
          >
            Принять
          </button>
          <button
            type="button"
            onClick={() => save({ analytics: false, marketing: false })}
            className={`${rowClass} border border-graphite/15 bg-white text-graphite hover:border-graphite/30 hover:bg-milk`}
          >
            Отклонить
          </button>
          {isSettingsOpen ? (
            <button
              type="button"
              onClick={() => save({ analytics, marketing })}
              className={`${rowClass} bg-graphite text-cream hover:bg-graphite-soft`}
            >
              Сохранить
            </button>
          ) : (
            <button
              type="button"
              onClick={openSettings}
              className={`${rowClass} border border-graphite/15 bg-white text-graphite hover:border-graphite/30 hover:bg-milk`}
            >
              Настроить
            </button>
          )}
        </div>

        {isSettingsOpen ? (
          <button
            type="button"
            onClick={closeBanner}
            className="mt-2 text-[0.65rem] font-semibold text-ink-50 underline underline-offset-2 transition hover:text-graphite"
          >
            Вернуться назад
          </button>
        ) : null}
      </div>
    </div>
  );
}
