"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Отслеживает, какая секция каталога сейчас в зоне видимости.
 *
 * Ключевое: во время скролла мы НЕ читаем геометрию. `getBoundingClientRect()`
 * на каждом кадре — это принудительный синхронный layout (layout thrashing),
 * из-за которого браузер пересчитывал вёрстку сотни раз за один скролл.
 *
 * Вместо этого позиции секций кэшируются и пересчитываются только тогда,
 * когда они реально могли измениться: при resize, смене шрифтов, загрузке
 * изображений и изменении высоты документа. Сам скролл читает лишь `scrollY`.
 */
export function useSectionSpy(
  ids: string[],
  options: { offset?: number; enabled?: boolean } = {},
): string | null {
  const { offset = 200, enabled = true } = options;
  const [active, setActive] = useState<string | null>(null);

  /** Кэш: id секции → её верх относительно начала документа. */
  const offsets = useRef<{ id: string; top: number }[]>([]);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || ids.length === 0) return;

    const measure = () => {
      const scrollY = window.scrollY;
      offsets.current = ids
        .map((id) => {
          const element = document.getElementById(id);
          if (!element) return null;
          /* Единственное чтение геометрии — и только вне обработчика скролла. */
          const rect = element.getBoundingClientRect();
          return { id, top: rect.top + scrollY };
        })
        .filter((entry): entry is { id: string; top: number } => entry !== null);
    };

    const evaluate = () => {
      frame.current = null;

      const scrollY = window.scrollY;
      const line = scrollY + offset;
      let current: string | null = null;

      for (const entry of offsets.current) {
        if (entry.top <= line) current = entry.id;
      }

      if (!current) {
        const first = offsets.current[0];
        if (first && first.top < scrollY + window.innerHeight * 0.75) current = first.id;
      }

      setActive((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (frame.current !== null) return;
      frame.current = window.requestAnimationFrame(evaluate);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    evaluate();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    /* Шрифты и изображения меняют высоту секций уже после первой отрисовки. */
    document.fonts?.ready.then(onResize).catch(() => {});
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      resizeObserver.disconnect();
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, [ids, offset, enabled]);

  return active;
}
