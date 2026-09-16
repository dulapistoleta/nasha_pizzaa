"use client";

import {
  Check,
  Flame,
  Info,
  Minus,
  Plus,
  ShoppingBag,
  Timer,
  Wheat,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { DishImage } from "@/components/menu/DishImage";
import { useDishModal } from "@/components/menu/dish-modal-context";
import { StarrySwirl } from "@/components/art/doodles";
import { useCart } from "@/lib/cart-store";
import { formatTenge } from "@/lib/format";
import { RESTAURANT } from "@/lib/restaurant";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { buildDishQuestionLink } from "@/lib/whatsapp";
import { CATEGORIES } from "@/lib/menu-data";

/**
 * Pop-up окно блюда: увеличенное фото, состав, БЖУ/граммовка
 * и описание технологии выпечки при 457 °C.
 */
export function DishModal() {
  const { activeDish, displayDish, isOpen, closeDish } = useDishModal();
  const { add, open } = useCart();
  const [qty, setQty] = useState(1);
  const [qtyDishId, setQtyDishId] = useState<string | null>(null);

  useLockBodyScroll(Boolean(activeDish));

  /* Сброс количества при открытии другого блюда — прямо во время рендера,
     как рекомендует React, вместо эффекта с setState. */
  if (activeDish && activeDish.id !== qtyDishId) {
    setQtyDishId(activeDish.id);
    setQty(1);
  }

  useEffect(() => {
    if (!activeDish) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeDish, closeDish]);

  const dish = displayDish;
  const category = dish ? CATEGORIES.find((c) => c.id === dish.category) : null;

  /* Оболочка живёт в DOM постоянно, а открытие/закрытие — это CSS-переходы.
     Так анимация закрытия работает без AnimatePresence и без Framer Motion,
     который весил ~83 КБ gzip и попадал в стартовый бандл. */
  return (
    <div
      className={`fixed inset-0 z-[80] flex items-end justify-center transition-[opacity,visibility] duration-300 sm:items-center sm:p-6 ${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        onClick={closeDish}
        className="absolute inset-0 bg-graphite/55 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={dish?.name ?? "Описание блюда"}
        className={`relative z-10 flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-4xl bg-cream shadow-float transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:rounded-4xl ${
          isOpen ? "translate-y-0 scale-100" : "translate-y-6 scale-[0.98]"
        }`}
      >
        {dish ? (
          <>
            <button
              type="button"
              onClick={closeDish}
              aria-label="Закрыть"
              className="absolute right-4 top-4 z-30 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-graphite shadow-card backdrop-blur transition hover:bg-white"
            >
              <X className="h-5 w-5" strokeWidth={2.6} />
            </button>

            <div className="grid flex-1 overflow-y-auto md:grid-cols-2 md:overflow-hidden">
              {/* Фото */}
              <div className="relative flex items-center justify-center bg-[radial-gradient(circle_at_50%_35%,#FFFDF8,#F2E9DA)] p-6 md:p-8">
                <StarrySwirl className="absolute -left-10 -top-10 h-40 w-40 text-graphite/10" />
                <StarrySwirl className="absolute -bottom-12 -right-8 h-44 w-44 text-sun/30" />
                <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-full shadow-[0_26px_60px_-24px_rgba(24,24,27,0.5)] ring-8 ring-white">
                  <DishImage dish={dish} priority sizes="(max-width: 768px) 90vw, 420px" />
                </div>
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {dish.badges.slice(0, 2).map((badge) => (
                    <Badge key={badge.label} badge={badge} size="sm" />
                  ))}
                </div>
              </div>

              {/* Описание */}
              <div className="flex flex-col gap-5 p-6 md:overflow-y-auto md:p-8">
                <div className="flex flex-col gap-2">
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-milk px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-ink-50">
                    {category?.emoji} {category?.label}
                  </span>
                  <h2 className="text-2xl font-black leading-tight text-graphite sm:text-3xl">
                    {dish.name}
                  </h2>
                  <p className="text-sm leading-relaxed text-ink-50 sm:text-base">
                    {dish.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {dish.badges.map((badge) => (
                    <Badge key={badge.label} badge={badge} size="sm" />
                  ))}
                </div>

                {/* Состав */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-sans text-xs font-black uppercase tracking-widest text-ink-30">
                    Состав
                  </h3>
                  <ul className="grid gap-1.5 sm:grid-cols-2">
                    {dish.composition.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-ink-70">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-basil" strokeWidth={3} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* БЖУ и граммовка */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-sans text-xs font-black uppercase tracking-widest text-ink-30">
                    Пищевая ценность
                  </h3>
                  <div className="grid grid-cols-5 gap-2">
                    <NutritionCell label="Вес" value={`${dish.nutrition.weight}`} unit="г" />
                    <NutritionCell label="Ккал" value={`${dish.nutrition.kcal}`} />
                    <NutritionCell label="Б" value={`${dish.nutrition.protein}`} unit="г" />
                    <NutritionCell label="Ж" value={`${dish.nutrition.fat}`} unit="г" />
                    <NutritionCell label="У" value={`${dish.nutrition.carbs}`} unit="г" />
                  </div>
                  <p className="text-[0.7rem] text-ink-30">
                    Вес, калорийность и БЖУ — справочные значения на порцию, уточняются у
                    технолога заведения.
                  </p>
                </div>

                {/* Технология */}
                <div className="relative overflow-hidden rounded-3xl bg-graphite p-5 text-cream">
                  <StarrySwirl className="absolute -right-8 -top-10 h-32 w-32 text-sun/25" />
                  <div className="relative flex flex-col gap-3">
                    <span className="font-marker text-2xl text-sun">как мы это готовим</span>
                    <div className="flex flex-wrap gap-2">
                      <TechChip icon={<Flame className="h-4 w-4" strokeWidth={2.6} />}>
                        Печь {RESTAURANT.oven.temperature} °C
                      </TechChip>
                      <TechChip icon={<Timer className="h-4 w-4" strokeWidth={2.6} />}>
                        {RESTAURANT.oven.seconds} секунд
                      </TechChip>
                      <TechChip icon={<Wheat className="h-4 w-4" strokeWidth={2.6} />}>
                        Тесто {RESTAURANT.oven.fermentationHours} ч
                      </TechChip>
                    </div>
                    <p className="text-sm leading-relaxed text-cream/80">{dish.technology}</p>
                  </div>
                </div>

                {dish.allergens?.length ? (
                  <p className="flex items-start gap-2 text-xs text-ink-50">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-sun-deep" strokeWidth={2.4} />
                    Аллергены: {dish.allergens.join(", ")}. Уточните у официанта, если есть
                    ограничения.
                  </p>
                ) : null}
              </div>
            </div>

            {/* Панель заказа */}
            <div className="flex flex-col gap-3 border-t border-line bg-white/95 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-5">
              <div className="flex items-center justify-between gap-4 sm:justify-start">
                <span className="font-display text-2xl font-black text-graphite">
                  {formatTenge(dish.price * qty)}
                </span>
                <div className="flex items-center gap-1 rounded-2xl bg-milk p-1">
                  <button
                    type="button"
                    onClick={() => setQty((value) => Math.max(1, value - 1))}
                    aria-label="Уменьшить количество"
                    className="grid h-9 w-9 place-items-center rounded-xl bg-white text-graphite shadow-sm transition hover:bg-cream disabled:opacity-40"
                    disabled={qty <= 1}
                  >
                    <Minus className="h-4 w-4" strokeWidth={3} />
                  </button>
                  <span className="w-8 text-center font-bold tabular-nums">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((value) => Math.min(20, value + 1))}
                    aria-label="Увеличить количество"
                    className="grid h-9 w-9 place-items-center rounded-xl bg-white text-graphite shadow-sm transition hover:bg-cream"
                  >
                    <Plus className="h-4 w-4" strokeWidth={3} />
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={buildDishQuestionLink(dish.name, dish.price)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-graphite/15 bg-white px-4 py-3.5 text-sm font-bold text-graphite transition hover:border-graphite/30 sm:flex-none"
                >
                  Спросить в WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => {
                    add(dish.id, qty);
                    closeDish();
                    open();
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-sun px-5 py-3.5 text-sm font-extrabold text-graphite shadow-sun transition hover:bg-sun-deep active:scale-[0.98] sm:flex-none"
                >
                  <ShoppingBag className="h-4 w-4" strokeWidth={2.8} />
                  Добавить · {formatTenge(dish.price * qty)}
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function NutritionCell({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-2xl bg-milk px-1 py-2.5">
      <span className="text-[0.65rem] font-bold uppercase tracking-wider text-ink-30">{label}</span>
      <span className="font-display text-base font-black leading-none text-graphite">
        {value}
        {unit ? <span className="text-[0.7rem] font-bold text-ink-50">{unit}</span> : null}
      </span>
    </div>
  );
}

function TechChip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-cream/10 px-3 py-1.5 text-xs font-bold text-cream ring-1 ring-cream/15">
      <span className="text-sun">{icon}</span>
      {children}
    </span>
  );
}
