"use client";

import { X } from "lucide-react";
import { memo, type CSSProperties } from "react";
import { DishCard } from "@/components/menu/DishCard";
import { TopPicks } from "@/components/sections/TopPicks";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CATEGORIES, DISHES } from "@/lib/menu-data";
import { positionsLabel } from "@/lib/format";
import type { CategoryId, Dish, DishCategory } from "@/types/menu";

const MENU_CATEGORIES = CATEGORIES.filter((category) => category.id !== "top");

/* Разбивка по категориям считается один раз на модуле: раньше `DISHES.filter(...)`
   прогонялся для каждой категории на каждой перерисовке каталога. */
const BY_CATEGORY = new Map<DishCategory, Dish[]>(
  MENU_CATEGORIES.map((category) => [
    category.id as DishCategory,
    DISHES.filter((dish) => dish.category === category.id),
  ]),
);

/**
 * Секция меню. Содержимое зависит от выбранной категории:
 *
 *  • «Рекомендуем» (по умолчанию) — восемь рекомендованных позиций;
 *  • любая другая категория — блюда только этой категории.
 *
 * Раньше здесь всегда висел список из 25 карточек, сгруппированный по всем
 * категориям: первый экран был тяжёлым, а scroll-spy пересчитывал позиции на
 * каждом кадре прокрутки. Теперь в разметке одновременно живёт максимум
 * 8–10 карточек, поэтому переключение категорий и скролл дешёвые.
 */
export const MenuCatalog = memo(function MenuCatalog({
  filter,
  onReset,
}: {
  filter: CategoryId;
  onReset: () => void;
}) {
  const isRecommended = filter === "top";
  const activeCategory = isRecommended
    ? null
    : MENU_CATEGORIES.find((category) => category.id === filter);
  const dishes = isRecommended ? [] : (BY_CATEGORY.get(filter as DishCategory) ?? []);

  return (
    <section id="menu-catalog" className="relative scroll-mt-40 py-8 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {isRecommended ? (
          <TopPicks />
        ) : (
          <>
            <SectionHeading
              eyebrow="Всё меню заведения"
              title={activeCategory?.label ?? "Меню"}
              description={`${positionsLabel(dishes.length)} в категории. Вернуться к рекомендованным — кнопкой ниже.`}
            />

            {/* Панель фильтра: смена состояния — CSS-анимация по key,
                React пересоздаёт узел, и она проигрывается заново. */}
            <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">
              <div
                key={`filtered-${filter}`}
                className="animate-fade-down flex flex-wrap items-center gap-2 sm:gap-3"
              >
                <span className="inline-flex items-center gap-2 rounded-2xl bg-sun px-3 py-2 text-xs font-extrabold text-graphite sm:px-4 sm:py-2.5 sm:text-sm">
                  <span>{activeCategory?.emoji}</span>
                  {activeCategory?.label}
                  <span className="rounded-full bg-graphite/10 px-2 py-0.5 text-[0.7rem] font-bold">
                    {dishes.length}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={onReset}
                  className="inline-flex items-center gap-2 rounded-2xl border border-graphite/15 bg-cream px-3 py-2 text-xs font-bold text-graphite transition hover:border-graphite/30 hover:bg-sun-soft sm:px-4 sm:py-2.5 sm:text-sm"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={3} />
                  Показать рекомендованные
                </button>
              </div>
            </div>

            {dishes.length > 0 ? (
              <div
                id={`cat-${filter}`}
                className="mt-4 grid scroll-mt-40 grid-cols-2 gap-2.5 sm:mt-8 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"
              >
                {dishes.map((dish, index) => (
                  <div
                    /* Ключ — только id блюда: при переключении категорий React
                       переиспользует узлы и <img> вместо пересоздания. */
                    key={dish.id}
                    data-reveal=""
                    style={{ "--reveal-delay": `${Math.min(index * 45, 300)}ms` } as CSSProperties}
                    className="reveal h-full"
                  >
                    <DishCard dish={dish} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-8 rounded-3xl border border-dashed border-graphite/15 bg-cream/70 p-8 text-center text-sm text-ink-50">
                В этой категории пока нет позиций — загляните в рекомендованные.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
});
