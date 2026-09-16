"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  BasilDoodle,
  CheeseDoodle,
  FlameDoodle,
  MoonDoodle,
  OliveBranchDoodle,
  PizzaSliceDoodle,
  PizzaWheelDoodle,
  RollingPinDoodle,
  SparkDoodle,
  StarDoodle,
  StarrySwirl,
  SwirlWave,
  TomatoDoodle,
  WheatDoodle,
} from "@/components/art/doodles";

/**
 * Фоновая «настенная роспись»: рисованные дудлы в духе «Звёздной ночи»,
 * летящие кусочки пиццы, базилик, помидоры, огонь печи и маркерные надписи.
 *
 * Слой зафиксирован на вьюпорте и мягко параллаксит при скролле,
 * поэтому фон читается как стена заведения, а не как картинка в начале страницы.
 */
export function DoodleBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  /* Параллакс включаем только на десктопе: на смартфоне сдвиг крупных
     SVG-слоёв заставляет перерисовывать их каждый кадр. */
  const enableParallax = useMediaQuery("(min-width: 1024px)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const parallax = enableParallax && !reduceMotion;

  /**
   * Прогресс скролла пишем в CSS-переменную, а сдвиг считает сам CSS.
   *
   * Раньше это делал Framer Motion (`useScroll` + `useTransform`), но он весит
   * ~83 КБ gzip и попадал в стартовый бандл ради одной этой анимации.
   */
  useEffect(() => {
    if (!parallax) return;
    const element = containerRef.current;
    if (!element) return;

    let frame: number | null = null;
    let last = -1;

    const update = () => {
      frame = null;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      /* Пишем только при заметном изменении — лишние записи в style вызывают
         пересчёт стилей на каждом кадре. */
      const rounded = Math.round(progress * 200) / 200;
      if (rounded === last) return;
      last = rounded;
      element.style.setProperty("--parallax", String(rounded));
    };

    const onScroll = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [parallax]);

  /* Множители слоёв: чем «дальше» слой, тем меньше сдвиг. */
  const layer = (depth: number) =>
    parallax
      ? { transform: `translate3d(0, calc(var(--parallax, 0) * ${-depth}px), 0)` }
      : undefined;

  return (
    /* translateZ(0) выносит фон в отдельный слой компоновщика: при скролле
       контента он не перерисовывается заново. */
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden [transform:translateZ(0)] [contain:strict]"
    >
      {/* Тёплое солнечное свечение. Раньше это были круги с blur-2xl — фильтр
          размытия на элемент 600×600 px пересчитывался при каждой перерисовке.
          Градиент, который сам сходит на нет, даёт тот же вид бесплатно. */}
      <div className="absolute -top-40 -right-24 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(255,200,0,0.28),rgba(255,200,0,0.12)_38%,transparent_68%)]" />
      <div className="absolute top-1/3 -left-40 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(225,29,72,0.10),rgba(225,29,72,0.04)_40%,transparent_70%)]" />
      <div className="absolute -bottom-40 right-1/4 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(224,176,113,0.22),rgba(224,176,113,0.09)_40%,transparent_70%)]" />

      {/* ---------- Слой 1: небо Ван Гога ---------- */}
      <div style={layer(70)} className="absolute inset-0">
        <StarrySwirl className="absolute -top-24 -right-24 h-[26rem] w-[26rem] text-graphite/[0.10] lg:h-[34rem] lg:w-[34rem]" />
        <StarrySwirl className="absolute top-[42%] -left-32 hidden h-[22rem] w-[22rem] text-tomato/[0.10] md:block lg:h-[28rem] lg:w-[28rem]" />
        <StarrySwirl className="absolute bottom-[6%] right-[8%] hidden h-[16rem] w-[16rem] text-sun/30 lg:block" />
        <SwirlWave className="absolute top-[18%] left-[6%] hidden w-[30rem] text-graphite/[0.08] lg:block" />
        <SwirlWave className="absolute bottom-[18%] right-[4%] hidden w-[26rem] text-graphite/[0.07] xl:block" />
        <MoonDoodle className="absolute top-[26%] right-[16%] hidden h-24 w-24 text-sun-deep/35 lg:block" />
        <StarDoodle className="absolute top-[12%] left-[28%] h-8 w-8 text-sun/60" strokeWidth={2.6} />
        <StarDoodle className="absolute top-[58%] right-[6%] h-10 w-10 text-sun/50" strokeWidth={2.4} />
        <StarDoodle className="absolute bottom-[24%] left-[12%] h-7 w-7 text-tomato/30" strokeWidth={2.6} />
      </div>

      {/* ---------- Слой 2: еда и печь ---------- */}
      <div style={layer(170)} className="absolute inset-0">
        <PizzaSliceDoodle className="animate-float-slow absolute top-[30%] right-[12%] h-24 w-24 -rotate-12 text-graphite/[0.12] md:h-28 md:w-28" />
        <PizzaSliceDoodle className="animate-float-mid absolute bottom-[26%] left-[6%] h-16 w-16 rotate-[18deg] text-graphite/[0.10] md:h-20 md:w-20" />
        <PizzaSliceDoodle className="animate-float-fast absolute top-[68%] right-[28%] hidden h-14 w-14 rotate-[8deg] text-graphite/[0.09] lg:block" />
        <PizzaWheelDoodle className="absolute top-[8%] left-[4%] hidden h-32 w-32 text-graphite/[0.09] lg:block" />
        <PizzaWheelDoodle className="absolute bottom-[10%] right-[16%] hidden h-24 w-24 text-graphite/[0.08] xl:block" />
        <FlameDoodle className="animate-float-mid absolute bottom-[38%] right-[3%] h-20 w-20 text-tomato/[0.22] md:h-24 md:w-24" />
        <TomatoDoodle className="animate-float-slow absolute top-[46%] left-[16%] hidden h-16 w-16 text-tomato/25 md:block" />
        <BasilDoodle className="animate-float-mid absolute top-[76%] left-[26%] hidden h-20 w-20 text-basil/25 lg:block" />
        <BasilDoodle className="absolute top-[22%] right-[32%] hidden h-14 w-14 -rotate-45 text-basil/20 xl:block" />
        <OliveBranchDoodle className="absolute top-[62%] left-[42%] hidden w-32 text-basil/20 xl:block" />
        <CheeseDoodle className="animate-float-slow absolute top-[38%] right-[46%] hidden h-14 w-14 text-sun-deep/40 xl:block" />
        <WheatDoodle className="absolute bottom-[6%] left-[3%] hidden h-20 w-20 text-crust/60 lg:block" />
        <RollingPinDoodle className="absolute top-[84%] right-[38%] hidden w-28 text-graphite/[0.10] xl:block" />
      </div>

      {/* ---------- Слой 3: маркерные надписи и искры ---------- */}
      <div style={layer(300)} className="absolute inset-0">
        <span className="absolute top-[16%] left-[2%] hidden origin-left -rotate-12 font-marker text-4xl text-graphite/[0.13] lg:block xl:text-5xl">
          We love pizza
        </span>
        <span className="absolute top-[52%] right-[2%] hidden rotate-12 font-marker text-5xl text-tomato/[0.16] lg:block xl:text-6xl">
          457&nbsp;°C
        </span>
        <span className="absolute bottom-[12%] left-[8%] hidden -rotate-6 font-marker text-3xl text-graphite/[0.12] lg:block">
          72 h di fermentazione
        </span>
        <span className="absolute top-[34%] left-[30%] hidden rotate-6 font-marker text-3xl text-basil/25 xl:block">
          basilico fresco
        </span>
        <span className="absolute bottom-[30%] right-[10%] hidden -rotate-12 font-marker text-3xl text-graphite/[0.12] xl:block">
          fatto a mano
        </span>
        <SparkDoodle className="animate-float-fast absolute top-[22%] left-[52%] h-6 w-6 text-sun/60" />
        <SparkDoodle className="animate-float-slow absolute bottom-[18%] right-[42%] h-7 w-7 text-sun/50" />
        <SparkDoodle className="animate-float-mid absolute top-[70%] left-[70%] hidden h-5 w-5 text-tomato/30 md:block" />
      </div>
    </div>
  );
}
