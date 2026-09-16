"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatTenge } from "@/lib/format";

/**
 * Кнопка корзины с бейджем количества и суммой.
 * Используется в шапке и в плавающей мобильной панели.
 */
export function CartButton({ variant = "header" }: { variant?: "header" | "bar" }) {
  const { totals, toggle, isOpen } = useCart();
  const hasItems = totals.count > 0;

  if (variant === "bar") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={`Корзина: ${totals.count}`}
        className="relative flex flex-1 items-center justify-center gap-2 rounded-2xl bg-sun px-4 py-3.5 text-sm font-extrabold text-graphite shadow-sun transition active:scale-[0.98]"
      >
        <ShoppingBag className="h-4.5 w-4.5" strokeWidth={2.8} />
        {hasItems ? formatTenge(totals.subtotal) : "Корзина"}
        {hasItems ? (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-graphite px-1 text-[0.7rem] font-black text-sun">
            {totals.count}
          </span>
        ) : null}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Корзина: ${totals.count} ${totals.count === 1 ? "позиция" : "позиций"}`}
      aria-expanded={isOpen}
      className="group relative inline-flex items-center gap-2 rounded-2xl bg-graphite px-3.5 py-2.5 text-sm font-bold text-cream transition hover:bg-graphite-soft"
    >
      <span className="relative">
        <ShoppingBag className="h-4.5 w-4.5" strokeWidth={2.6} />
        {hasItems ? (
          /* key заставляет React пересоздать узел, и CSS-анимация
             проигрывается заново при каждом изменении количества. */
          <span
            key={totals.count}
            className="absolute -right-2.5 -top-2.5 grid h-5 min-w-5 animate-pop place-items-center rounded-full bg-sun px-1 text-[0.68rem] font-black text-graphite ring-2 ring-graphite"
          >
            {totals.count}
          </span>
        ) : null}
      </span>

      <span className="hidden tabular-nums sm:inline">
        {hasItems ? formatTenge(totals.subtotal) : "Корзина"}
      </span>
    </button>
  );
}
