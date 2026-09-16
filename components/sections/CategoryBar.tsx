"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CATEGORIES } from "@/lib/menu-data";
import { prefetchCategoryImages } from "@/lib/prefetch-images";
import type { CategoryId, DishCategory } from "@/types/menu";

/**
 * Sticky-лента категорий с горизонтальной прокруткой (скроллбар + свайп),
 * плавным индикатором активной категории и авто-прокруткой к выбранной плашке.
 */
export function CategoryBar({
  active,
  onSelect,
}: {
  active: CategoryId;
  onSelect: (id: CategoryId) => void;
}) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const chipRefs = useRef<Partial<Record<CategoryId, HTMLButtonElement | null>>>({});

  /* Геометрия «бегунка» активной категории. Один элемент вместо motion-разметки
     в каждой плашке: позицию анимирует CSS-переход по transform/width. */
  const [pill, setPill] = useState({ x: 0, y: 0, width: 0, height: 0, ready: false });

  const measurePill = useCallback(() => {
    const chip = chipRefs.current[active];
    if (!chip) return;
    setPill({
      x: chip.offsetLeft,
      y: chip.offsetTop,
      width: chip.offsetWidth,
      height: chip.offsetHeight,
      ready: true,
    });
  }, [active]);

  useEffect(() => {
    const rail = railRef.current;
    const chip = chipRefs.current[active];
    if (!rail || !chip) return;

    /* Читаем геометрию в rAF — после возможных записей в стили, чтобы
       не провоцировать синхронный пересчёт вёрстки. */
    const frame = window.requestAnimationFrame(() => {
      measurePill();
      const target = chip.offsetLeft - (rail.clientWidth - chip.clientWidth) / 2;
      rail.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [active, measurePill]);

  /* Ширина ленты меняется при повороте экрана и загрузке шрифтов. */
  useEffect(() => {
    const onResize = () => measurePill();
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(onResize).catch(() => {});
    return () => window.removeEventListener("resize", onResize);
  }, [measurePill]);

  const scrollRail = useCallback((direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * Math.min(420, rail.clientWidth * 0.7), behavior: "smooth" });
  }, []);

  return (
    <div
      className="sticky z-40 border-y border-graphite/10 bg-milk/95 lg:bg-milk/90 lg:backdrop-blur-xl"
      style={{ top: "var(--header-h, 4.5rem)" }}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-2 sm:px-4">
        <button
          type="button"
          onClick={() => scrollRail(-1)}
          aria-label="Прокрутить категории влево"
          className="hidden h-9 w-9 shrink-0 place-items-center rounded-full border border-graphite/10 bg-cream text-graphite transition hover:bg-sun-soft lg:grid"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={3} />
        </button>

        <div
          ref={railRef}
          role="tablist"
          aria-label="Категории меню"
          className="rail-scroll fade-x relative flex flex-1 flex-nowrap gap-1.5 overflow-x-auto scroll-smooth px-1 py-2 sm:gap-2 sm:py-3"
        >
          {/* «Бегунок» активной категории */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 rounded-full bg-sun shadow-[0_10px_24px_-12px_rgba(255,200,0,0.95)] transition-[transform,width,height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: pill.width,
              height: pill.height,
              transform: `translate3d(${pill.x}px, ${pill.y}px, 0)`,
              opacity: pill.ready ? 1 : 0,
            }}
          />
          {CATEGORIES.map((category) => {
            const isActive = category.id === active;

            return (
              <button
                key={category.id}
                ref={(node) => {
                  chipRefs.current[category.id] = node;
                }}
                type="button"
                role="tab"
                aria-selected={isActive}
                title={category.hint}
                onClick={() => onSelect(category.id)}
                /* Прогреваем фото, пока палец/курсор ещё только наводится. */
                onPointerEnter={() =>
                  category.id !== "top" && prefetchCategoryImages(category.id as DishCategory)
                }
                onFocus={() =>
                  category.id !== "top" && prefetchCategoryImages(category.id as DishCategory)
                }
                className={`relative shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-colors duration-200 sm:px-4 sm:py-2.5 sm:text-sm ${
                  isActive ? "text-graphite" : "text-ink-50 hover:text-graphite"
                }`}
              >
                {!isActive ? (
                  <span className="absolute inset-0 rounded-full border border-graphite/[0.08] bg-cream/70" />
                ) : null}
                <span className="relative z-10 flex items-center gap-1.5 whitespace-nowrap sm:gap-2">
                  <span className="text-sm leading-none sm:text-base">{category.emoji}</span>
                  {category.label}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scrollRail(1)}
          aria-label="Прокрутить категории вправо"
          className="hidden h-9 w-9 shrink-0 place-items-center rounded-full border border-graphite/10 bg-cream text-graphite transition hover:bg-sun-soft lg:grid"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
