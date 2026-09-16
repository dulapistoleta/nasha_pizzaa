"use client";

import { useCallback, useDeferredValue, useState } from "react";
import { CategoryBar } from "@/components/sections/CategoryBar";
import { MenuCatalog } from "@/components/sections/MenuCatalog";
import { TopPicks } from "@/components/sections/TopPicks";
import type { CategoryId } from "@/types/menu";

const SCROLL_OFFSET = 96;

/**
 * Оркестратор меню: хранит выбранную категорию и связывает sticky-ленту,
 * блок «Топ выбор» и каталог.
 *
 *  • «Топ выбор» — стартовый экран: показываем только рекомендованные позиции;
 *  • конкретная категория — подгружаем блюда этой категории в каталог;
 *  • пока ничего не выбрано, каталог держит только плитки категорий — тяжёлого
 *    списка из 25 карточек в разметке нет, поэтому первый экран лёгкий.
 */
export function MenuExperience() {
  const [filter, setFilter] = useState<CategoryId>("top");

  /**
   * Плашка в ленте подсвечивается мгновенно (неотложное обновление), а список
   * блюд React перерисовывает отложенно и может прервать эту работу — клик
   * остаётся отзывчивым даже на слабом телефоне.
   */
  const deferredFilter = useDeferredValue(filter);

  const scrollTo = useCallback((elementId: string, behavior: ScrollBehavior = "smooth") => {
    const element = document.getElementById(elementId);
    if (!element) return;
    const top = element.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top, behavior });
  }, []);

  const handleSelect = useCallback(
    (id: CategoryId) => {
      if (id === "top") {
        setFilter("top");
        scrollTo("top-picks");
        return;
      }

      /* Верх каталога не зависит от фильтра, а вот высота страницы — очень:
         переход с «всего меню» на «Пасту» укорачивает документ почти на
         5000 px. Если стоять внутри каталога, браузер сам пересчитывает
         позицию скролла в момент схлопывания — получается рывок, который
         читается как зависание.

         Поэтому сначала переносим окно на верх каталога (мгновенно, пока
         разметка ещё прежняя), и только потом меняем список: схлопывание
         происходит уже ниже окна и визуально ничего не двигает. */
      const catalog = document.getElementById("menu-catalog");

      if (catalog) {
        const target = catalog.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;

        if (window.scrollY > target) {
          window.scrollTo({ top: target, behavior: "instant" });
          setFilter(id);
          return;
        }
      }

      /* Гость выше каталога — просто фильтруем и плавно ведём вниз. */
      setFilter(id);
      window.requestAnimationFrame(() => scrollTo("menu-catalog"));
    },
    [scrollTo],
  );

  const handleReset = useCallback(() => {
    setFilter("top");
    scrollTo("top-picks");
  }, [scrollTo]);

  return (
    <>
      <CategoryBar active={filter} onSelect={handleSelect} />
      <TopPicks />
      <MenuCatalog filter={deferredFilter} onSelect={handleSelect} onReset={handleReset} />
    </>
  );
}
