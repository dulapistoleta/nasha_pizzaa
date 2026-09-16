"use client";

import { useCallback, useDeferredValue, useEffect, useState } from "react";
import { CategoryBar } from "@/components/sections/CategoryBar";
import { MenuCatalog } from "@/components/sections/MenuCatalog";
import { CATEGORIES } from "@/lib/menu-data";
import type { CategoryId } from "@/types/menu";

const SCROLL_OFFSET = 96;

/**
 * Оркестратор меню: хранит выбранную категорию и связывает sticky-ленту
 * с содержимым секции меню.
 *
 *  • «Рекомендуем» — такая же категория, но открыта по умолчанию;
 *  • выбор другой категории заменяет содержимое секции её блюдами;
 *  • тяжёлого списка из 25 карточек в разметке нет — одновременно живёт
 *    максимум 8–10, поэтому переключение и скролл дешёвые.
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
        scrollTo("menu-catalog");
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
    scrollTo("menu-catalog");
  }, [scrollTo]);

  /**
   * Ссылки из шапки, подвала и hero — обычные анкоры. Чтобы они не просто
   * прокручивали страницу, а ещё и переключали категорию, слушаем hash:
   *  • #cat-<id> — открыть категорию;
   *  • #menu-catalog / #top-picks — вернуться к рекомендованным.
   */
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash;
      if (!hash) return;

      if (hash === "#menu-catalog" || hash === "#top-picks") {
        setFilter("top");
        return;
      }

      const match = /^#cat-(.+)$/.exec(hash);
      if (!match) return;

      const id = match[1] as CategoryId;
      if (!CATEGORIES.some((category) => category.id === id)) return;
      setFilter(id);
      window.requestAnimationFrame(() => scrollTo("menu-catalog"));
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [scrollTo]);

  return (
    <>
      <CategoryBar active={filter} onSelect={handleSelect} />
      <MenuCatalog filter={deferredFilter} onReset={handleReset} />
    </>
  );
}
