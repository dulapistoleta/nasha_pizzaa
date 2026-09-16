"use client";

import { LayoutGrid, X } from "lucide-react";
import { memo, type CSSProperties } from "react";
import { DishCard } from "@/components/menu/DishCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CATEGORIES, DISH_COUNT, DISHES } from "@/lib/menu-data";
import { positionsLabel } from "@/lib/format";
import { prefetchCategoryImages } from "@/lib/prefetch-images";
import type { CategoryId, Dish, DishCategory } from "@/types/menu";

const MENU_CATEGORIES = CATEGORIES.filter((category) => category.id !== "top");

/* Группировка считается один раз на модуле: раньше `DISHES.filter(...)`
   прогонялся для каждой категории на каждой перерисовке каталога. */
const BY_CATEGORY = new Map<DishCategory, Dish[]>(
  MENU_CATEGORIES.map((category) => [
    category.id as DishCategory,
    DISHES.filter((dish) => dish.category === category.id),
  ]),
);

/**
 * Каталог меню по категориям.
 *
 * Пока категория не выбрана, здесь только плитки категорий: рекомендованные
 * позиции живут в блоке «Топ выбор» выше. Так в разметке первого экрана нет
 * 25 тяжёлых карточек — меньше работы верстке, растеризации и памяти.
 */
export const MenuCatalog = memo(function MenuCatalog({
  filter,
  onSelect,
  onReset,
}: {
  filter: CategoryId;
  onSelect: (id: CategoryId) => void;
  onReset: () => void;
}) {
  const isFiltered = filter !== "top";
  const activeCategory = isFiltered
    ? MENU_CATEGORIES.find((category) => category.id === filter)
    : null;
  const filteredDishes = isFiltered ? (BY_CATEGORY.get(filter as DishCategory) ?? []) : [];

  return (
    <section id="menu-catalog" className="relative scroll-mt-40 pb-12 pt-3 sm:pb-24 sm:pt-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Всё меню заведения"
          title="Каталог"
          accent="меню"
          description={`${DISH_COUNT} позиций: неаполитанская пицца, паста, завтраки, супы и салаты, закуски, комбо-сеты и домашние напитки.`}
        />

        {isFiltered ? (
          <>
            {/* Панель управления фильтром. Смена состояния — CSS-анимация
                по key: React пересоздаёт узел, и она проигрывается заново. */}
            <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">
              <div key={`filtered-${filter}`} className="animate-fade-down flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="inline-flex items-center gap-2 rounded-2xl bg-sun px-3 py-2 text-xs font-extrabold text-graphite sm:px-4 sm:py-2.5 sm:text-sm">
                  <span>{activeCategory?.emoji}</span>
                  {activeCategory?.label}
                  <span className="rounded-full bg-graphite/10 px-2 py-0.5 text-[0.7rem] font-bold">
                    {filteredDishes.length}
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

            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {filteredDishes.map((dish, index) => (
                <div
                  /* Ключ — только id блюда. Раньше в ключ входил фильтр, поэтому
                     при переключении категорий React сносил и создавал заново все
                     узлы и <img> вместо переиспользования совпавших позиций. */
                  key={dish.id}
                  data-reveal=""
                  style={{ "--reveal-delay": `${Math.min(index * 45, 300)}ms` } as CSSProperties}
                  className="reveal h-full"
                >
                  <DishCard dish={dish} />
                </div>
              ))}
            </div>

            {filteredDishes.length === 0 ? (
              <p className="mt-8 rounded-3xl border border-dashed border-graphite/15 bg-cream/70 p-8 text-center text-sm text-ink-50">
                В этой категории пока нет позиций — загляните в рекомендованные.
              </p>
            ) : null}
          </>
        ) : (
          <>
            <p className="animate-fade-down mt-4 inline-flex items-center gap-2 rounded-2xl border border-graphite/10 bg-cream/80 px-3 py-2 text-xs font-semibold text-ink-50 sm:mt-6 sm:px-4 sm:py-2.5 sm:text-sm">
              <LayoutGrid className="h-4 w-4 text-sun-deep" strokeWidth={2.6} />
              Выберите категорию — покажем блюда из неё
            </p>

            {/* Плитки категорий: тот же выбор, что и в ленте сверху, но
                крупными мишенями и с количеством позиций. */}
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-6 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {MENU_CATEGORIES.map((category) => {
                const count = BY_CATEGORY.get(category.id as DishCategory)?.length ?? 0;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => onSelect(category.id)}
                    onPointerEnter={() => prefetchCategoryImages(category.id as DishCategory)}
                    onFocus={() => prefetchCategoryImages(category.id as DishCategory)}
                    className="group flex items-center gap-3 rounded-2xl border border-line bg-white p-3 text-left shadow-card transition hover:-translate-y-0.5 hover:border-sun hover:shadow-card-hover sm:rounded-3xl sm:p-4"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-milk text-lg ring-1 ring-graphite/10 transition group-hover:bg-sun-soft sm:h-12 sm:w-12 sm:rounded-2xl sm:text-2xl">
                      {category.emoji}
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="line-clamp-2 text-sm font-extrabold leading-tight text-graphite sm:text-base">
                        {category.label}
                      </span>
                      <span className="text-[0.7rem] font-semibold text-ink-50">
                        {positionsLabel(count)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
});
