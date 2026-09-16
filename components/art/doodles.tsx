"use client";

import type { SVGProps } from "react";
import { round, spiralPath, starPath, wobblyEllipse } from "@/lib/art-geometry";

/**
 * Библиотека рисованных «дудлов» в стиле настенной росписи заведения.
 *
 * Все элементы:
 *  • рисуются только обводкой (`currentColor`), поэтому цвет задаётся
 *    классами Tailwind (`text-sun`, `text-tomato`, …);
 *  • строятся по детерминированным формулам, поэтому серверный и клиентский
 *    рендер совпадают (нет hydration mismatch);
 *  • намеренно «дрожат» — лёгкий seeded-разброс имитирует линию от руки.
 */

export interface DoodleProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  /** Толщина основной линии. */
  strokeWidth?: number;
}

/* -------------------------------------------------------------------------- */
/*  Дудлы                                                                      */
/* -------------------------------------------------------------------------- */

/** Вихрь «Звёздной ночи» — три спирали с эхом. */
export function StarrySwirl({ strokeWidth = 2, className, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden {...rest}>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path
          d={spiralPath({ cx: 100, cy: 100, rStart: 4, rEnd: 88, turns: 2.45, wobble: 2.2, seed: 3 })}
          strokeWidth={strokeWidth * 1.35}
          opacity="0.95"
        />
        <path
          d={spiralPath({
            cx: 100,
            cy: 100,
            rStart: 5,
            rEnd: 74,
            turns: 2.3,
            phase: 0.5,
            wobble: 2.6,
            seed: 17,
          })}
          strokeWidth={strokeWidth * 0.85}
          opacity="0.7"
        />
        <path
          d={spiralPath({
            cx: 100,
            cy: 100,
            rStart: 3,
            rEnd: 56,
            turns: 2.1,
            phase: 1.4,
            wobble: 2.2,
            seed: 29,
          })}
          strokeWidth={strokeWidth * 0.6}
          opacity="0.5"
        />
      </g>
    </svg>
  );
}

/** Вихревая волна — горизонтальная «небесная» линия. */
export function SwirlWave({ strokeWidth = 2, className, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 240 90" fill="none" className={className} aria-hidden {...rest}>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M8 58C26 24 60 10 92 22c26 10 30 44 56 52 22 7 44-6 54-28"
          strokeWidth={strokeWidth * 1.2}
        />
        <path d="M8 70C30 40 62 28 90 40c25 11 31 40 55 46 20 5 38-6 47-24" strokeWidth={strokeWidth * 0.7} opacity="0.6" />
        <path d="M16 46c16-24 44-33 70-23 22 9 27 33 50 40" strokeWidth={strokeWidth * 0.55} opacity="0.45" />
      </g>
    </svg>
  );
}

/** Летящий кусочек пиццы. */
export function PizzaSliceDoodle({ strokeWidth = 2, className, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden {...rest}>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>
        {/* борт */}
        <path d="M11 31C24 12 74 12 88 31" strokeWidth={strokeWidth * 1.5} />
        <path d="M17 30c11-13 53-13 65 0" opacity="0.6" />
        {/* боковины */}
        <path d="M11 31 48 91" strokeWidth={strokeWidth * 1.25} />
        <path d="M88 31 51 91" strokeWidth={strokeWidth * 1.25} />
        {/* пепперони */}
        <path d={wobblyEllipse({ cx: 34, cy: 43, rx: 6, ry: 5.4, seed: 5 })} />
        <path d={wobblyEllipse({ cx: 60, cy: 48, rx: 5.4, ry: 5, seed: 11 })} />
        <path d={wobblyEllipse({ cx: 46, cy: 68, rx: 4.6, ry: 4.4, seed: 19 })} />
        {/* линия сыра */}
        <path d="M26 52c6 3 12 1 15-3" opacity="0.55" />
        <path d="M55 74c4 2 8 1 10-2" opacity="0.55" />
      </g>
    </svg>
  );
}

/** Целый круг пиццы с разметкой на куски. */
export function PizzaWheelDoodle({ strokeWidth = 2, className, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden {...rest}>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>
        <path d={wobblyEllipse({ cx: 100, cy: 100, rx: 86, ry: 84, seed: 7 })} strokeWidth={strokeWidth * 1.5} />
        <path d={wobblyEllipse({ cx: 100, cy: 100, rx: 70, ry: 69, seed: 13, overshoot: 1.05 })} opacity="0.65" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 100 + Math.cos(rad) * 68;
          const y1 = 100 + Math.sin(rad) * 68;
          const x2 = 100 + Math.cos(rad) * 84;
          const y2 = 100 + Math.sin(rad) * 84;
          return (
            <path
              key={angle}
              d={`M${round(x1)} ${round(y1)} L${round(x2)} ${round(y2)}`}
              opacity={0.35 + (index % 3) * 0.15}
            />
          );
        })}
      </g>
    </svg>
  );
}

/** Веточка базилика. */
export function BasilDoodle({ strokeWidth = 2, className, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden {...rest}>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>
        <path d="M50 94C50 70 50 42 50 12" strokeWidth={strokeWidth * 1.2} />
        {[
          { y: 26, dir: -1 },
          { y: 42, dir: 1 },
          { y: 56, dir: -1 },
          { y: 70, dir: 1 },
        ].map(({ y, dir }) => (
          <g key={y}>
            <path
              d={`M50 ${y}C${50 + dir * 16} ${y - 12} ${50 + dir * 30} ${y - 7} ${50 + dir * 31} ${y + 5}C${50 + dir * 24} ${y + 12} ${50 + dir * 8} ${y + 11} 50 ${y}`}
            />
            <path d={`M50 ${y}L${50 + dir * 24} ${y + 4}`} opacity="0.5" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Помидор с плодоножкой. */
export function TomatoDoodle({ strokeWidth = 2, className, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden {...rest}>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>
        <path d={wobblyEllipse({ cx: 50, cy: 58, rx: 33, ry: 30, seed: 23 })} strokeWidth={strokeWidth * 1.3} />
        <path d="M50 28c-8-6-18-8-26-6 6 6 14 9 22 9" />
        <path d="M50 28c8-6 18-8 26-6-6 6-14 9-22 9" />
        <path d="M50 26V12" strokeWidth={strokeWidth * 1.2} />
        <path d="M50 28c-4 6-10 9-16 10M50 28c4 6 10 9 16 10" opacity="0.5" />
        <path d="M34 48c4-5 10-7 15-6" opacity="0.45" />
      </g>
    </svg>
  );
}

/** Огонь дровяной печи. */
export function FlameDoodle({ strokeWidth = 2, className, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden {...rest}>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>
        <path
          d="M50 92C32 92 20 80 20 64c0-15 11-24 15-35 3-8 4-15 3-22 11 5 19 15 22 25 2-5 3-11 2-16 10 9 18 22 18 35 0 20-12 41-30 41Z"
          strokeWidth={strokeWidth * 1.25}
        />
        <path
          d="M50 84c-9 0-15-7-15-15 0-8 6-13 9-19 2-4 3-8 3-12 6 3 10 8 12 14 1-3 2-6 1-9 5 5 8 12 8 19 0 11-8 22-18 22Z"
          opacity="0.6"
        />
        <path d="M50 74c-3 0-5-2-5-5 0-4 3-6 5-10 2 4 5 6 5 10 0 3-2 5-5 5Z" opacity="0.4" />
        {/* искры */}
        <path d="M22 30c2-4 6-6 9-5" opacity="0.55" />
        <path d="M80 26c-2-5-7-8-11-7" opacity="0.55" />
      </g>
    </svg>
  );
}

/** Колос пшеницы — про муку и тесто. */
export function WheatDoodle({ strokeWidth = 2, className, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden {...rest}>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>
        <path d="M50 94V22" strokeWidth={strokeWidth * 1.15} />
        {[30, 44, 58, 72].map((y, index) => (
          <g key={y}>
            <path d={`M50 ${y}c-14-4-20-14-18-24 12 2 20 12 18 24Z`} opacity={1 - index * 0.12} />
            <path d={`M50 ${y}c14-4 20-14 18-24-12 2-20 12-18 24Z`} opacity={1 - index * 0.12} />
          </g>
        ))}
        <path d="M50 22c-2-6 0-12 4-16" />
      </g>
    </svg>
  );
}

/** Ломтик сыра с дырочками. */
export function CheeseDoodle({ strokeWidth = 2, className, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden {...rest}>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>
        <path d="M10 70 80 36l6 30c-22 14-50 16-76 6Z" strokeWidth={strokeWidth * 1.25} />
        <path d="M10 70c26 10 54 8 76-6" opacity="0.5" />
        <path d={wobblyEllipse({ cx: 38, cy: 62, rx: 5, ry: 4, seed: 31 })} />
        <path d={wobblyEllipse({ cx: 60, cy: 58, rx: 4, ry: 3.4, seed: 37 })} />
        <path d="M52 78c1 5 4 8 8 9" opacity="0.6" />
      </g>
    </svg>
  );
}

/** Печать Halal: полумесяц со звездой в круге. */
export function HalalDoodle({ strokeWidth = 2, className, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden {...rest}>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>
        <path d={wobblyEllipse({ cx: 50, cy: 50, rx: 40, ry: 39, seed: 41 })} />
        <path d="M58 28a22 22 0 1 0 0 44 17.5 17.5 0 1 1 0-44Z" strokeWidth={strokeWidth * 1.15} />
        <path d={starPath(70, 40, 8, 3.4, 5, 53)} strokeWidth={strokeWidth * 0.85} />
      </g>
    </svg>
  );
}

/** Веточка оливы / рукколы. */
export function OliveBranchDoodle({ strokeWidth = 2, className, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 100" fill="none" className={className} aria-hidden {...rest}>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>
        <path d="M8 78C34 66 68 48 112 22" strokeWidth={strokeWidth * 1.1} />
        {[
          { x: 30, y: 62, r: 7 },
          { x: 58, y: 48, r: 6 },
          { x: 86, y: 33, r: 5.4 },
        ].map(({ x, y, r }) => (
          <path key={x} d={wobblyEllipse({ cx: x, cy: y + 6, rx: r, ry: r * 0.92, seed: x })} />
        ))}
        {[
          { x: 40, y: 48 },
          { x: 70, y: 34 },
        ].map(({ x, y }) => (
          <path key={x} d={`M${x} ${y + 20}c-8-10-6-22 4-28 6 10 4 22-4 28Z`} opacity="0.6" />
        ))}
      </g>
    </svg>
  );
}

/** Скалка — про 72 часа работы с тестом. */
export function RollingPinDoodle({ strokeWidth = 2, className, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 140 80" fill="none" className={className} aria-hidden {...rest}>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>
        <path d="M30 26h80a14 14 0 0 1 0 28H30a14 14 0 0 1 0-28Z" strokeWidth={strokeWidth * 1.2} />
        <path d="M30 34 12 32M30 46 12 48M110 34l18-2M110 46l18 2" />
        <path d="M12 32c-4 0-6 2-6 8s2 8 6 8M128 32c4 0 6 2 6 8s-2 8-6 8" />
        <path d="M48 30v20M74 30v20M98 30v20" opacity="0.35" />
      </g>
    </svg>
  );
}

/** Маркерный росчерк-подчёркивание. */
export function MarkerSwoosh({ className, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 200 24" fill="none" className={className} aria-hidden preserveAspectRatio="none" {...rest}>
      <path
        d="M3 17C40 6 120 3 197 11c-70-3-140 2-186 10 4-6 6-9 6-9Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

/** Рисованная стрелка-указатель. */
export function CurlyArrowDoodle({ strokeWidth = 2, className, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 90" fill="none" className={className} aria-hidden {...rest}>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>
        <path d="M6 16c26-10 56-6 74 12 10 10 12 26 2 33-8 6-19 0-17-10 2-9 14-11 20-4" />
        <path d="M22 30c-6-4-12-9-16-14M6 16c6-1 12-1 18 0" opacity="0" />
        <path d="M6 16c7-3 14-5 21-6M6 16c2 7 5 13 9 19" />
      </g>
    </svg>
  );
}

/** Круг-обводка от руки (для акцентов и «печатей»). */
export function ScribbleCircleDoodle({ strokeWidth = 2, className, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 200 120" fill="none" className={className} aria-hidden preserveAspectRatio="none" {...rest}>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path
          d={wobblyEllipse({ cx: 100, cy: 60, rx: 92, ry: 50, steps: 60, wobble: 3.4, seed: 61, overshoot: 1.06 })}
          strokeWidth={strokeWidth * 1.1}
        />
        <path
          d={wobblyEllipse({ cx: 100, cy: 60, rx: 92, ry: 50, steps: 60, wobble: 4, seed: 71, overshoot: 1.03 })}
          strokeWidth={strokeWidth * 0.7}
          opacity="0.5"
        />
      </g>
    </svg>
  );
}

/** Звёздочка-искра. */
export function SparkDoodle({ strokeWidth = 2, className, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 60 60" fill="none" className={className} aria-hidden {...rest}>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>
        <path d="M30 6c3 12 12 21 24 24-12 3-21 12-24 24-3-12-12-21-24-24 12-3 21-12 24-24Z" />
      </g>
    </svg>
  );
}

/** Пятиконечная звезда от руки. */
export function StarDoodle({ strokeWidth = 2, className, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden {...rest}>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>
        <path d={starPath(50, 52, 42, 17, 5, 83)} />
      </g>
    </svg>
  );
}

/** Полумесяц — ночное небо Ван Гога. */
export function MoonDoodle({ strokeWidth = 2, className, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden {...rest}>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>
        <path d="M66 16a38 38 0 1 0 0 68 31 31 0 1 1 0-68Z" strokeWidth={strokeWidth * 1.2} />
        <path d="M62 30a24 24 0 0 0 0 40" opacity="0.4" />
      </g>
    </svg>
  );
}
