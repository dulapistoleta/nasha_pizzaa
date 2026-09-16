"use client";

import { ArrowRight, Check, Flame, Plus, Star, Timer } from "lucide-react";
import { memo } from "react";
import { Badge } from "@/components/ui/Badge";
import { DishImage } from "@/components/menu/DishImage";
import { AccentText } from "@/components/menu/dish-utils";
import { useDishModal } from "@/components/menu/dish-modal-context";
import { useCart } from "@/lib/cart-store";
import { formatTenge } from "@/lib/format";
import { CARD_BADGE_LIMIT } from "@/lib/menu-data";
import type { Dish } from "@/types/menu";

/**
 * Карточка блюда: премиальная белая плитка с «парящей» круглой фотографией,
 * бейджами, составом с акцентом на тесто и моцареллу и быстрым добавлением в корзину.
 *
 * `memo` здесь не микрооптимизация: карточка весит ~140 узлов DOM, а её родитель
 * (`MenuExperience`) перерисовывается на каждом кадре скролла из-за scroll-spy —
 * без `memo` все 33 карточки согласовывались заново десятки раз в секунду.
 * Блюдо — стабильный объект из `menu-data`, поэтому сравнения по ссылке достаточно.
 * Изменения корзины карточка по-прежнему получает через контекст.
 */
export const DishCard = memo(function DishCard({
  dish,
  priority = false,
}: {
  dish: Dish;
  priority?: boolean;
}) {
  const { add, qtyOf } = useCart();
  const { openDish } = useDishModal();
  const inCart = qtyOf(dish.id);
  const cardBadges = dish.badges.slice(0, CARD_BADGE_LIMIT);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-4xl border border-line bg-white shadow-card transition-[box-shadow,transform] duration-300 will-change-auto hover:-translate-y-1.5 hover:shadow-card-hover">

      {/* Фото-зона с «парящей» круглой фотографией */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[radial-gradient(circle_at_50%_30%,#FFFDF8,#F5EEE2)]">
        {/* Зерно без mix-blend-mode: блендинг заставлял браузер перекомпоновывать
            слой карточки при каждом изменении — на 33 карточках это дорого. */}
        <div className="paper-noise pointer-events-none absolute inset-0 opacity-45" />

        <button
          type="button"
          onClick={() => openDish(dish)}
          aria-label={`Открыть описание: ${dish.name}`}
          className="absolute left-1/2 top-1/2 aspect-square h-[86%] -translate-x-1/2 -translate-y-1/2 cursor-pointer overflow-hidden rounded-full shadow-[0_18px_38px_-18px_rgba(24,24,27,0.45)] ring-[6px] ring-white transition-transform duration-500 group-hover:scale-[1.04]"
        >
          <DishImage
            dish={dish}
            priority={priority}
            sizes="(max-width: 640px) 88vw, (max-width: 1024px) 44vw, 300px"
          />
          {/* Подсказка, что фото кликабельно */}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="rounded-full bg-graphite/90 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-cream">
              Подробнее
            </span>
          </span>
        </button>

        {/* Бейджи */}
        <div className="pointer-events-none absolute left-3 top-3 flex max-w-[70%] flex-wrap gap-1.5">
          {cardBadges.map((badge) => (
            <Badge key={badge.label} badge={badge} size="sm" />
          ))}
        </div>

        {/* Порядковый номер в топе */}
        {dish.topRank ? (
          <span className="pointer-events-none absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-graphite font-display text-sm font-black text-sun shadow-float">
            {dish.topRank}
          </span>
        ) : null}

        {/* Ценник «парящий» на стыке фото и описания */}
        <div className="pointer-events-none absolute bottom-3 right-3 rounded-2xl bg-white px-3.5 py-2 shadow-float ring-1 ring-graphite/5">
          <span className="font-display text-lg font-black leading-none text-graphite">
            {formatTenge(dish.price)}
          </span>
        </div>
      </div>

      {/* Текстовый блок */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-bold leading-snug text-graphite sm:text-xl">{dish.name}</h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-ink-50">
          <AccentText text={dish.description} />
        </p>

        {/* Явная ссылка на подробности: текст в карточке остаётся выделяемым,
            а открыть окно можно с фото или отсюда. */}
        <button
          type="button"
          onClick={() => openDish(dish)}
          className="group/link -mt-1 inline-flex w-fit cursor-pointer items-center gap-1 text-xs font-bold text-tomato underline-offset-4 transition hover:underline"
        >
          Состав и БЖУ
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5"
            strokeWidth={3}
          />
        </button>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.7rem] font-semibold text-ink-50">
          <span className="inline-flex items-center gap-1 rounded-full bg-milk px-2.5 py-1">
            <Timer className="h-3.5 w-3.5 text-sun-deep" strokeWidth={2.6} />
            72 ч тесто
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-milk px-2.5 py-1">
            <Flame className="h-3.5 w-3.5 text-tomato" strokeWidth={2.6} />
            90 сек
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-milk px-2.5 py-1">
            {dish.nutrition.weight} г · {dish.nutrition.kcal} ккал
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => add(dish.id)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-sun px-4 py-3 text-sm font-extrabold text-graphite shadow-sun transition hover:bg-sun-deep active:scale-[0.97]"
          >
            {inCart > 0 ? (
              <>
                <Check className="h-4 w-4" strokeWidth={3} />
                В корзине · {inCart}
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" strokeWidth={3} />
                В корзину
              </>
            )}
          </button>

          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-graphite text-sun">
            <Star className="h-4.5 w-4.5" strokeWidth={2.4} />
          </span>
        </div>
      </div>

    </article>
  );
});
