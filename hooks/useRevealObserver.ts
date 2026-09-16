"use client";

import { useEffect } from "react";

/**
 * Один IntersectionObserver на всю страницу вместо motion-компонента на каждую карточку.
 *
 * Раньше 33 карточки давали 66 экземпляров Framer Motion: это лишний клиентский JS,
 * память и длинные задачи при гидратации. Теперь появление — это CSS-переход
 * (`transform` + `opacity`) и одна общая подписка.
 */
export function useRevealObserver(): void {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pending = new Set<Element>();
    let frame: number | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.visible = "true";
          observer.unobserve(entry.target);
          pending.delete(entry.target);
        }
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.01 },
    );

    const scan = () => {
      frame = null;

      for (const element of document.querySelectorAll("[data-reveal]:not([data-visible])")) {
        if (pending.has(element)) continue;

        if (reduceMotion) {
          (element as HTMLElement).dataset.visible = "true";
          continue;
        }

        pending.add(element);
        observer.observe(element);
      }
    };

    const scheduleScan = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(scan);
    };

    scan();

    /* Фильтрация каталога подменяет карточки — подхватываем новые узлы.
       Наблюдаем только за структурой, скролл сюда не попадает. */
    const mutations = new MutationObserver(scheduleScan);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
      pending.clear();
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);
}
