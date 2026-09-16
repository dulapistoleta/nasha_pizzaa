import { DISHES } from "@/lib/menu-data";
import type { DishCategory } from "@/types/menu";

/**
 * Прогрев картинок блюд категории.
 *
 * Вызывается при наведении или фокусе на плашке/плитке категории: пока гость
 * целится, браузер уже тянет фотографии — после клика список появляется без
 * «мигания» пустых плиток. Повторные вызовы бесплатны: адреса запоминаем.
 */
const prefetched = new Set<string>();

function prefetchImage(src: string): void {
  if (typeof window === "undefined" || prefetched.has(src)) return;
  prefetched.add(src);
  const image = new window.Image();
  image.decoding = "async";
  image.src = src;
}

export function prefetchCategoryImages(category: DishCategory): void {
  for (const dish of DISHES) {
    if (dish.category !== category) continue;
    /* Ширина 384 — тот же вариант, что выбирает next/image в сетке карточек. */
    prefetchImage(`/_next/image?url=${encodeURIComponent(`/images/dishes/${dish.id}.webp`)}&w=384&q=75`);
  }
}
