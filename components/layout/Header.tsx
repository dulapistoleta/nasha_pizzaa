"use client";

import { Clock, MapPin, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/art/Logo";
import { CartButton } from "@/components/cart/CartButton";
import { useOpenStatus } from "@/hooks/useOpenStatus";
import { telHref } from "@/lib/format";
import { RESTAURANT } from "@/lib/restaurant";

/**
 * Фиксированная шапка: логотип, живой статус «Открыто»,
 * адрес, кнопка прямого звонка и корзина с бейджем.
 */
export function Header() {
  const headerRef = useRef<HTMLElement | null>(null);
  const [elevated, setElevated] = useState(false);
  const status = useOpenStatus();
  const primaryPhone = RESTAURANT.phones[0];

  /* Высоту шапки отдаём в CSS-переменную — её использует sticky-лента категорий. */
  useEffect(() => {
    const node = headerRef.current;
    if (!node) return;

    const apply = () =>
      document.documentElement.style.setProperty("--header-h", `${node.offsetHeight}px`);

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(node);
    window.addEventListener("resize", apply);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      /* backdrop-filter пересчитывается при каждом кадре скролла и на мобильных
         ощутимо бьёт по FPS. Там его нет — фон просто почти непрозрачный.
         На десктопе оставляем ради «матового стекла». */
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        elevated
          ? "border-graphite/10 bg-milk/95 shadow-[0_10px_30px_-24px_rgba(24,24,27,0.5)] lg:bg-milk/80 lg:backdrop-blur-xl"
          : "border-transparent bg-milk/90 lg:bg-milk/70 lg:backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:gap-5">
        <a href="#top" className="shrink-0" aria-label="Наша пицца — на главную">
          <Logo />
        </a>

        {/* Статус и адрес — на десктопе */}
        <div className="ml-2 hidden items-center gap-2 xl:flex">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
              status.isOpen ? "bg-basil-soft text-basil" : "bg-tomato-soft text-tomato"
            }`}
          >
            <span className="relative grid h-2 w-2 place-items-center">
              <span
                className={`absolute h-2 w-2 rounded-full ${
                  status.isOpen ? "animate-pulse-ring bg-basil" : "bg-tomato"
                }`}
              />
              <span
                className={`h-2 w-2 rounded-full ${status.isOpen ? "bg-basil" : "bg-tomato"}`}
              />
            </span>
            {status.label}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-graphite/10 bg-cream/70 px-3 py-1.5 text-xs font-semibold text-ink-70">
            <MapPin className="h-3.5 w-3.5 text-tomato" strokeWidth={2.6} />
            {RESTAURANT.addressShort}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={telHref(primaryPhone.tel)}
            className="hidden items-center gap-2 rounded-2xl border border-graphite/10 bg-cream px-3.5 py-2.5 text-sm font-bold text-graphite transition hover:border-sun hover:bg-sun-soft sm:inline-flex"
          >
            <Phone className="h-4 w-4 text-tomato" strokeWidth={2.6} />
            <span className="tabular-nums">{primaryPhone.label}</span>
          </a>

          {/* На мобильных — иконка звонка */}
          <a
            href={telHref(primaryPhone.tel)}
            aria-label={`Позвонить ${primaryPhone.label}`}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-graphite/10 bg-cream text-tomato transition active:scale-95 sm:hidden"
          >
            <Phone className="h-5 w-5" strokeWidth={2.6} />
          </a>

          <CartButton />
        </div>
      </div>

      {/* Мобильная строка со статусом и адресом */}
      <div className="border-t border-graphite/[0.07] xl:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-4 py-2 text-xs rail-bare sm:px-6">
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 font-bold ${
              status.isOpen ? "text-basil" : "text-tomato"
            }`}
          >
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${status.isOpen ? "bg-basil" : "bg-tomato"}`}
            />
            {status.label}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-ink-50">
            <Clock className="h-3.5 w-3.5 text-sun-deep" strokeWidth={2.6} />
            Ежедневно {RESTAURANT.hours.open}–{RESTAURANT.hours.close}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-ink-50">
            <MapPin className="h-3.5 w-3.5 text-tomato" strokeWidth={2.6} />
            {RESTAURANT.addressShort}
          </span>
        </div>
      </div>
    </header>
  );
}
