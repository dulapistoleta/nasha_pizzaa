"use client";

import { Phone, UtensilsCrossed } from "lucide-react";
import { CartButton } from "@/components/cart/CartButton";
import { useCart } from "@/lib/cart-store";
import { useConsent } from "@/lib/consent";
import { useScrolledPast } from "@/hooks/useMediaQuery";
import { telHref } from "@/lib/format";
import { RESTAURANT } from "@/lib/restaurant";

/**
 * Плавающая нижняя панель для смартфонов: звонок и корзина
 * (или быстрый переход к меню, если корзина пуста).
 */
export function MobileActionBar() {
  const visible = useScrolledPast(420);
  const { totals, isOpen, close } = useCart();
  const { isBannerOpen } = useConsent();
  const hasItems = totals.count > 0;

  /* Пока открыт тост согласия, панель уступает ему место внизу экрана. */
  const shown = visible && !isOpen && !isBannerOpen;

  return (
    /* Панель всегда в DOM, показ — CSS-переход. Так нет ни монтирования
       по скроллу, ни зависимости от Framer Motion в стартовом бандле. */
    <div
      aria-hidden={!shown}
      className={`fixed inset-x-0 bottom-0 z-[60] border-t border-graphite/10 bg-milk/95 px-3 pt-3 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center gap-2" tabIndex={shown ? undefined : -1}>
            <a
              href={telHref(RESTAURANT.phones[0].tel)}
              className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-graphite/12 bg-cream px-4 py-3.5 text-sm font-bold text-graphite transition active:scale-[0.97]"
            >
              <Phone className="h-4.5 w-4.5 text-tomato" strokeWidth={2.8} />
              Позвонить
            </a>

            {hasItems ? (
              <CartButton variant="bar" />
            ) : (
              <a
                href="#top-picks"
                onClick={close}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-sun px-4 py-3.5 text-sm font-extrabold text-graphite shadow-sun transition active:scale-[0.98]"
              >
                <UtensilsCrossed className="h-4.5 w-4.5" strokeWidth={2.8} />
                Выбрать пиццу
              </a>
            )}
      </div>
    </div>
  );
}
