"use client";

import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { CategoryBar } from "@/components/sections/CategoryBar";
import { MenuCatalog } from "@/components/sections/MenuCatalog";
import { TopPicks } from "@/components/sections/TopPicks";
import { useSectionSpy } from "@/hooks/useSectionSpy";
import { CATEGORIES } from "@/lib/menu-data";
import type { CategoryId } from "@/types/menu";

const SCROLL_OFFSET = 96;

/**
 * Оркестратор меню: хранит выбранную категорию, связывает sticky-ленту,
 * блок «Топ выбор» и каталог.
 *
 *  • «Топ выбор» — сбрасывает фильтр и ведёт к блоку хитов;
 *  • конкретная категория — фильтрует каталог;
 *  • когда фильтра нет, активная плашка подсвечивается по позиции скролла.
 */
export function MenuExperience() {
  const [filter, setFilter] = useState<CategoryId>("top");

  /**
   * Лента категорий подсвечивается мгновенно (неотложное обновление), а тяжёлый
   * каталог перерисовывается отложенно: React может прервать эту работу, поэтому
   * клик по плашке остаётся отзывчивым даже когда на странице 25 карточек,
   * каждая на ~140 узлов DOM. Раньше всё это перестраивалось в одном кадре.
   */
  const deferredFilter = useDeferredValue(filter);

  const spyIds = useMemo(
    () => CATEGORIES.filter((category) => category.id !== "top").map((c) => `cat-${c.id}`),
    [],
  );

  const spy = useSectionSpy(spyIds, { enabled: filter === "top", offset: 260 });

  /* Подсвечиваемая категория — производная от фильтра и позиции скролла. */
  const spyCategory = spy ? (spy.replace("cat-", "") as CategoryId) : null;

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

  const handleReset = useCallback(() => setFilter("top"), []);

  const activeCategory: CategoryId =
    filter !== "top" ? filter : (spyCategory ?? "top");

  return (
    <>
      <CategoryBar active={activeCategory} onSelect={handleSelect} />
      <TopPicks />
      <MenuCatalog filter={deferredFilter} onReset={handleReset} />
    </>
  );
}
