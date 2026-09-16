"use client";

import type { CSSProperties, ReactNode } from "react";
import { MarkerSwoosh } from "@/components/art/doodles";

/**
 * Крупный заголовок секции с рисованным маркерным акцентом.
 *
 * Появление — на CSS (`reveal`), видимость выставляет общий
 * IntersectionObserver: на всю страницу один наблюдатель вместо
 * motion-компонента на каждый элемент.
 */
export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = "left",
  children,
}: {
  eyebrow?: string;
  title: string;
  /** Слово, которое подчёркиваем «маркером». */
  accent?: string;
  description?: string;
  align?: "left" | "center";
  children?: ReactNode;
}) {
  const isCenter = align === "center";

  return (
    <div className={`flex flex-col gap-3 ${isCenter ? "items-center text-center" : "items-start"}`}>
      {eyebrow ? (
        <span
          data-reveal=""
          className="reveal inline-flex items-center gap-2 rounded-full border border-graphite/10 bg-cream/80 px-3.5 py-1.5 font-marker text-lg text-tomato shadow-inset-line"
        >
          {eyebrow}
        </span>
      ) : null}

      <h2
        data-reveal=""
        style={{ "--reveal-delay": "60ms" } as CSSProperties}
        className={`reveal max-w-3xl text-3xl font-black leading-[1.08] text-graphite sm:text-4xl lg:text-5xl ${
          isCenter ? "mx-auto" : ""
        }`}
      >
        {title}
        {accent ? (
          <span className="relative ml-2 inline-block whitespace-nowrap">
            <span className="relative z-10">{accent}</span>
            <MarkerSwoosh className="absolute -bottom-1 left-0 z-0 h-3 w-full text-sun" />
          </span>
        ) : null}
      </h2>

      {description ? (
        <p
          data-reveal=""
          style={{ "--reveal-delay": "120ms" } as CSSProperties}
          className={`reveal max-w-2xl text-base leading-relaxed text-ink-50 sm:text-lg ${
            isCenter ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      ) : null}

      {children}
    </div>
  );
}

/**
 * Обёртка появления для карточек в сетке.
 *
 * Это обычный `div` с CSS-переходом: класс `reveal` анимирует только
 * `transform` и `opacity`, а видимость выставляет общий IntersectionObserver
 * из `useRevealObserver`. Никакого Framer Motion на каждой карточке.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      data-reveal=""
      className={`reveal ${className}`}
      style={
        delay ? ({ "--reveal-delay": `${Math.round(delay * 1000)}ms` } as CSSProperties) : undefined
      }
    >
      {children}
    </div>
  );
}
