"use client";

import {
  BasilDoodle,
  CheeseDoodle,
  MoonDoodle,
  OliveBranchDoodle,
  PizzaSliceDoodle,
  PizzaWheelDoodle,
  SparkDoodle,
  StarDoodle,
  StarrySwirl,
  SwirlWave,
  TomatoDoodle,
  WheatDoodle,
} from "@/components/art/doodles";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * Большое рисованное «панно» — стена заведения в духе Ван Гога:
 * вихревое небо, дровяная печь с огнём, летящая пицца и маркерные надписи.
 * Используется в блоке атмосферы.
 */
export function MuralWall({ className = "" }: { className?: string }) {
  /* Пламя «дышит» только если гость не просил уменьшить движение. */
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <div
      className={`relative isolate overflow-hidden rounded-4xl border border-graphite/10 bg-gradient-to-b from-sun-soft/70 via-cream to-milk-deep shadow-card ${className}`}
    >
      {/* небо */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_15%_0%,rgba(255,200,0,0.28),transparent_60%),radial-gradient(90%_70%_at_90%_10%,rgba(225,29,72,0.10),transparent_60%)]" />

      {/* вихри */}
      <StarrySwirl className="absolute -top-16 -left-20 h-72 w-72 text-graphite/20 sm:h-80 sm:w-80" />
      <StarrySwirl className="absolute -top-10 right-4 h-44 w-44 text-tomato/20 sm:h-56 sm:w-56" />
      <StarrySwirl className="absolute bottom-24 -right-16 h-52 w-52 text-sun-deep/40" />
      <SwirlWave className="absolute top-1/3 left-0 w-[42rem] text-graphite/15" />
      <SwirlWave className="absolute top-[46%] right-0 w-[34rem] text-graphite/10" />

      {/* ночные светила */}
      <MoonDoodle className="absolute top-8 right-1/4 h-16 w-16 text-sun-deep/60 sm:h-20 sm:w-20" />
      <StarDoodle className="absolute top-12 left-1/3 h-7 w-7 text-sun/70" strokeWidth={2.6} />
      <StarDoodle className="absolute top-24 right-12 h-9 w-9 text-sun/60" strokeWidth={2.4} />
      <StarDoodle className="absolute bottom-32 left-16 h-6 w-6 text-tomato/40" strokeWidth={2.6} />
      <SparkDoodle className="animate-float-mid absolute top-1/3 right-1/3 h-7 w-7 text-sun/70" />

      {/* летящая пицца */}
      <PizzaSliceDoodle className="animate-float-slow absolute top-[26%] left-[16%] h-20 w-20 -rotate-12 text-graphite/35 sm:h-24 sm:w-24" />
      <PizzaSliceDoodle className="animate-float-mid absolute top-[52%] right-[18%] h-16 w-16 rotate-12 text-graphite/30 sm:h-20 sm:w-20" />
      <PizzaWheelDoodle className="absolute top-[36%] left-1/2 h-28 w-28 -translate-x-1/2 text-graphite/25 sm:h-36 sm:w-36" />

      {/* дровяная печь */}
      <OvenDoodle
        className="absolute bottom-0 left-1/2 z-20 h-32 w-44 -translate-x-1/2 drop-shadow-[0_12px_20px_rgba(24,24,27,0.22)] sm:h-44 sm:w-56"
        animated={!reduceMotion}
      />

      {/* «стойка» с ингредиентами */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-16 bg-gradient-to-t from-milk-deep via-milk-deep/70 to-transparent" />
      <TomatoDoodle className="absolute bottom-3 left-5 z-20 h-12 w-12 text-tomato/70 sm:h-16 sm:w-16" />
      <BasilDoodle className="absolute bottom-3 left-20 z-20 h-14 w-14 text-basil/60 sm:h-20 sm:w-20" />
      <OliveBranchDoodle className="absolute bottom-4 right-20 z-20 hidden w-28 text-basil/55 sm:block" />
      <WheatDoodle className="absolute bottom-3 right-6 z-20 h-14 w-14 text-crust sm:h-16 sm:w-16" />
      <CheeseDoodle className="absolute bottom-4 left-1/2 z-20 h-10 w-10 -translate-x-[8.5rem] text-sun-deep/80 sm:h-12 sm:w-12" />

      {/* маркерные надписи */}
      <span className="absolute top-6 left-6 -rotate-6 font-marker text-3xl text-graphite/45 sm:text-5xl">
        We love pizza
      </span>
      <span className="absolute top-20 right-6 rotate-6 font-marker text-3xl text-tomato/55 sm:text-4xl">
        457&nbsp;°C
      </span>
      <span className="absolute bottom-24 left-8 -rotate-3 font-marker text-2xl text-basil/60 sm:text-3xl">
        basilico fresco
      </span>
      <span className="absolute bottom-20 right-8 rotate-3 font-marker text-2xl text-graphite/40 sm:text-3xl">
        Napoli → Astana
      </span>

      {/* мягкая виньетка, чтобы текст поверх читался */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_50%,transparent_45%,rgba(250,247,242,0.55)_100%)]" />
      <div aria-hidden className="paper-noise pointer-events-none absolute inset-0 opacity-30" />
    </div>
  );
}

/** Дровяная печь: каменный купол, тёмное устье и живое пламя внутри. */
function OvenDoodle({ className = "", animated = true }: { className?: string; animated?: boolean }) {
  const flames = [
    { x: 60, scale: 0.9, delay: "0s" },
    { x: 82, scale: 1.15, delay: "0.35s" },
    { x: 106, scale: 1, delay: "0.7s" },
    { x: 128, scale: 0.8, delay: "1.05s" },
  ];

  return (
    <svg viewBox="0 0 200 170" className={className} aria-hidden preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="mural-oven-dome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7E2BE" />
          <stop offset="52%" stopColor="#E0B071" />
          <stop offset="100%" stopColor="#B27B3E" />
        </linearGradient>
        <linearGradient id="mural-oven-mouth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E11D48" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#E11D48" />
        </linearGradient>
      </defs>

      {/* труба */}
      <rect x="86" y="2" width="28" height="30" rx="6" fill="#3F3F46" />
      <rect x="80" y="0" width="40" height="10" rx="5" fill="#52525B" />

      {/* каменный купол */}
      <path
        d="M8 166C8 92 48 32 100 32C152 32 192 92 192 166Z"
        fill="url(#mural-oven-dome)"
        stroke="#18181B"
        strokeOpacity="0.28"
        strokeWidth="3"
      />
      {/* кладка */}
      <g stroke="#8A5A22" strokeOpacity="0.3" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <path d="M28 104C54 76 146 76 172 104" />
        <path d="M18 134C50 102 150 102 182 134" />
        <path d="M100 33V166" />
        <path d="M60 62C74 50 90 44 100 43" />
        <path d="M140 62C126 50 110 44 100 43" />
      </g>

      {/* устье */}
      <path d="M42 166C42 122 68 96 100 96C132 96 158 122 158 166Z" fill="#18181B" />
      <path d="M52 166C52 128 75 106 100 106C125 106 148 128 148 166Z" fill="url(#mural-oven-mouth)" />

      {/* пламя */}
      {flames.map((flame, index) => (
        /* Внешняя группа позиционирует пламя, внутренняя — анимируется:
           CSS-transform анимации перебил бы SVG-атрибут transform. */
        <g key={flame.x} transform={`translate(${flame.x} 166) scale(${flame.scale})`}>
          <g
            className={animated ? (index % 2 === 0 ? "animate-simmer" : "animate-float-fast") : ""}
            style={{
              animationDelay: flame.delay,
              transformBox: "fill-box",
              transformOrigin: "bottom center",
            }}
          >
            <path
              d="M0 0c-11 0-19-7-19-17 0-9 7-15 9-22 2-5 2-9 1-13 7 4 12 9 14 15 1-3 1-6 0-8 7 6 12 14 12 22C17-9 10 0 0 0Z"
              fill="#FFC800"
            />
            <path
              d="M0-6c-5 0-9-4-9-9 0-5 3-8 5-12 1-3 1-5 1-7 4 3 6 6 7 9 1-2 1-3 0-5 3 4 5 8 5 12 0 7-4 12-9 12Z"
              fill="#FFF3C9"
              opacity="0.85"
            />
          </g>
        </g>
      ))}

      {/* подовая лопатка у печи */}
      <g stroke="#18181B" strokeOpacity="0.3" strokeWidth="2.5" strokeLinecap="round">
        <path d="M170 160L192 142" />
        <ellipse cx="166" cy="163" rx="9" ry="5" fill="#E0B071" />
      </g>
    </svg>
  );
}

/** Анимированный «дым» над печью — декоративный акцент для блока атмосферы. */
export function SimmerSmoke({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`animate-float-mid pointer-events-none absolute opacity-30 ${className}`}
    >
      <SwirlWave className="w-40 text-graphite/15" />
    </div>
  );
}
