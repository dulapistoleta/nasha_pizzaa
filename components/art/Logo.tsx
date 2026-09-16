"use client";

import { wobblyEllipse, starPath } from "@/lib/art-geometry";

/** Рисованный знак заведения: пицца-колесо на солнечном круге. */
export function LogoMark({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      <circle cx="32" cy="32" r="31" fill="var(--color-sun)" />
      <path
        d={wobblyEllipse({ cx: 32, cy: 32, rx: 29.5, ry: 29, steps: 48, wobble: 1.1, seed: 9 })}
        stroke="var(--color-graphite)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* сама пицца */}
      <path
        d={wobblyEllipse({ cx: 32, cy: 35, rx: 19, ry: 18, seed: 4 })}
        fill="var(--color-cream)"
        stroke="var(--color-graphite)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* куски */}
      <g stroke="var(--color-graphite)" strokeWidth="1.6" strokeLinecap="round" opacity="0.55">
        <path d="M32 17.5 32 35M32 35 15.5 42M32 35 48.5 42M32 35 23 18.5M32 35 41 18.5" />
      </g>
      {/* пепперони */}
      <g fill="var(--color-tomato)">
        <path d={wobblyEllipse({ cx: 25, cy: 30, rx: 4, ry: 3.6, seed: 21 })} />
        <path d={wobblyEllipse({ cx: 40, cy: 31, rx: 3.6, ry: 3.3, seed: 27 })} />
        <path d={wobblyEllipse({ cx: 33, cy: 43, rx: 3.4, ry: 3.1, seed: 33 })} />
      </g>
      {/* базилик */}
      <path
        d="M46 22c3-4 8-5 11-3-2 4-7 6-11 3Z"
        fill="var(--color-basil)"
        stroke="var(--color-graphite)"
        strokeWidth="1.4"
      />
      {/* звезда-искра */}
      <path
        d={starPath(12, 14, 6, 2.4, 5, 5)}
        stroke="var(--color-graphite)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Логотип с текстовой частью. */
export function Logo({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className={compact ? "h-9 w-9 shrink-0" : "h-11 w-11 shrink-0"} />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display font-black tracking-tight text-graphite ${
            compact ? "text-lg" : "text-xl sm:text-[1.4rem]"
          }`}
        >
          Наша пицца
        </span>
        <span className="font-marker text-[0.95rem] leading-tight text-tomato sm:text-base">
          настоящая итальянская
        </span>
      </span>
    </span>
  );
}
