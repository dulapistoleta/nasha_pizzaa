"use client";

import { LayoutGrid, X } from "lucide-react";
import { memo, type CSSProperties } from "react";
import { DishCard } from "@/components/menu/DishCard";
import { Reveal, SectionHeading } from "@/components/ui/SectionHeading";
import { CATEGORIES, DISH_COUNT, DISHES } from "@/lib/menu-data";
import { positionsLabel } from "@/lib/format";
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
 * Каталог меню с фильтрацией по категориям.
 *
 * Без фильтра («Топ выбор») позиции сгруппированы по категориям — по ним
 * работает scroll-spy в sticky-ленте. С фильтром остаётся одна категория.
 */
export const MenuCatalog = memo(function MenuCatalog({
  filter,
  onReset,
}: {
  filter: CategoryId;
  onReset: () => void;
}) {
  const isFiltered = filter !== "top";
  const activeCategory = isFiltered
    ? MENU_CATEGORIES.find((category) => category.id === filter)
    : null;
  const filteredDishes = isFiltered ? (BY_CATEGORY.get(filter as DishCategory) ?? []) : [];

  return (
    <section id="menu-catalog" className="relative scroll-mt-40 pb-16 pt-4 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Всё меню заведения"
          title="Каталог"
          accent="меню"
          description={`${DISH_COUNT} позиций: неаполитанская пицца, паста, завтраки, супы и салаты, закуски, комбо-сеты и домашние напитки.`}
        />

        {/* Панель управления фильтром. Смена состояния — CSS-анимация
            по key: React пересоздаёт узел, и она проигрывается заново. */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {isFiltered ? (
              <div key={`filtered-${filter}`} className="animate-fade-down flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-2xl bg-sun px-4 py-2.5 text-sm font-extrabold text-graphite">
                  <span>{activeCategory?.emoji}</span>
                  {activeCategory?.label}
                  <span className="rounded-full bg-graphite/10 px-2 py-0.5 text-[0.7rem] font-bold">
                    {filteredDishes.length}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={onReset}
                  className="inline-flex items-center gap-2 rounded-2xl border border-graphite/15 bg-cream px-4 py-2.5 text-sm font-bold text-graphite transition hover:border-graphite/30 hover:bg-sun-soft"
                >
                  <X className="h-4 w-4" strokeWidth={3} />
                  Показать всё меню
                </button>
              </div>
            ) : (
              <p
                key="all"
                className="animate-fade-down inline-flex items-center gap-2 rounded-2xl border border-graphite/10 bg-cream/80 px-4 py-2.5 text-sm font-semibold text-ink-50"
              >
                <LayoutGrid className="h-4 w-4 text-sun-deep" strokeWidth={2.6} />
                Показано всё меню · {positionsLabel(DISH_COUNT)}
              </p>
            )}
        </div>

        {isFiltered ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        ) : (
          <div className="mt-10 flex flex-col gap-14">
            {MENU_CATEGORIES.map((category) => {
              const dishes = BY_CATEGORY.get(category.id as DishCategory) ?? [];
              if (dishes.length === 0) return null;

              return (
                <div key={category.id} id={`cat-${category.id}`} className="scroll-mt-44">
                  <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-graphite/10 pb-4">
                    <h3 className="flex items-center gap-3 text-2xl font-black text-graphite sm:text-3xl">
                      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-cream text-xl shadow-inset-line ring-1 ring-graphite/10">
                        {category.emoji}
                      </span>
                      {category.label}
                    </h3>
                    <span className="font-marker text-xl text-tomato">
                      {positionsLabel(dishes.length)}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {dishes.map((dish, index) => (
                      <Reveal
                        key={dish.id}
                        delay={Math.min(index * 0.05, 0.3)}
                        className="h-full"
                      >
                        <DishCard dish={dish} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {isFiltered && filteredDishes.length === 0 ? (
          <p className="mt-10 rounded-3xl border border-dashed border-graphite/15 bg-cream/70 p-8 text-center text-sm text-ink-50">
            В этой категории пока нет позиций — загляните в «Топ выбор».
          </p>
        ) : null}
      </div>
    </section>
  );
});
