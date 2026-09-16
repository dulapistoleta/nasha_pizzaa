"use client";

import Image from "next/image";
import { useState } from "react";
import { PizzaWheelDoodle } from "@/components/art/doodles";
import { dishImageSrc } from "@/components/menu/dish-utils";
import type { Dish } from "@/types/menu";

type LoadState = "loading" | "ready" | "error";

/**
 * Изображение блюда с элегантным skeleton-лоадером
 * и красивым рисованным фолбэком, если файла ещё нет.
 *
 * Путь всегда `/images/dishes/[dish-slug].webp` — чтобы заменить
 * плейсхолдер на реальное 4K-фото, достаточно положить файл рядом.
 */
export function DishImage({
  dish,
  sizes,
  priority = false,
  className = "",
}: {
  dish: Dish;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const [state, setState] = useState<LoadState>("loading");

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {/* Skeleton: тёплая основа + бегущий блик.
          Раньше здесь рисовался ещё и SVG-вихрь — 33 карточки давали
          33 копии одних и тех же путей и лишние ~150 КБ разметки. */}
      {state === "loading" ? (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#FFFDF8,#F5EEE2)]">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        </div>
      ) : null}

      {state === "error" ? (
        <FallbackArt dish={dish} />
      ) : (
        <Image
          src={dishImageSrc(dish)}
          alt={dish.name}
          fill
          sizes={sizes}
          priority={priority}
          onLoad={() => setState("ready")}
          onError={() => setState("error")}
          className={`object-cover transition-all duration-700 ease-out ${
            state === "ready" ? "scale-100 opacity-100 blur-0" : "scale-105 opacity-0 blur-md"
          }`}
        />
      )}
    </div>
  );
}

/** Дефолтный рендер: рисованная пицца-колесо на крафтовом фоне. */
function FallbackArt({ dish }: { dish: Dish }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_35%,#FFFDF8,#F3EADA)]">
      <PizzaWheelDoodle className="h-[74%] w-[74%] text-crust" strokeWidth={3} />
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-marker text-lg text-graphite/45">
        {dish.shortName}
      </span>
    </div>
  );
}
