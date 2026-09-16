"use client";

import { ArrowRight, Clock, MapPin, MessageCircle, Sparkle } from "lucide-react";
import type { CSSProperties } from "react";
import { DishImage } from "@/components/menu/DishImage";
import {
  CheeseDoodle,
  FlameDoodle,
  HalalDoodle,
  StarrySwirl,
  TomatoDoodle,
  WheatDoodle,
} from "@/components/art/doodles";
import { getDishById } from "@/lib/menu-data";
import { RESTAURANT } from "@/lib/restaurant";
import { buildOrderLink } from "@/lib/whatsapp";

const HERO_DISH = getDishById("pepperoni");

const USPS = [
  {
    icon: <FlameDoodle className="h-7 w-7 text-tomato" strokeWidth={3.4} />,
    title: "Печь 457 °C",
    text: "90 секунд и готово",
  },
  {
    icon: <WheatDoodle className="h-7 w-7 text-crust" strokeWidth={3.4} />,
    title: "72 ч ферментации",
    text: "«Леопардовые» бортики",
  },
  {
    icon: <CheeseDoodle className="h-7 w-7 text-sun-deep" strokeWidth={3.4} />,
    title: "Моцарелла",
    text: "Из Италии",
  },
  {
    icon: <HalalDoodle className="h-7 w-7 text-basil" strokeWidth={3.4} />,
    title: "Halal",
    text: "Говяжья пепперони и ветчина",
  },
];

/** HERO: главный оффер, УТП и «парящая» пицца с вращающейся печатью. */
export function Hero() {

  return (
    <section id="top" className="relative overflow-hidden pb-14 pt-8 sm:pb-20 sm:pt-12 lg:pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          {/* Текстовая часть */}
          <div className="flex flex-col items-start gap-6">
            <span
             
             
             
              data-reveal="" className="reveal inline-flex items-center gap-2 rounded-full border border-graphite/10 bg-cream/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink-70 shadow-inset-line backdrop-blur"
            >
              <MapPin className="h-3.5 w-3.5 text-tomato" strokeWidth={2.8} />
              {RESTAURANT.city} · {RESTAURANT.addressShort}
              <span className="hidden text-ink-30 sm:inline">·</span>
              <span className="hidden items-center gap-1 text-ink-50 sm:inline-flex">
                <Clock className="h-3.5 w-3.5 text-sun-deep" strokeWidth={2.8} />
                {RESTAURANT.hours.short}
              </span>
            </span>

            <h1
             
             
             
              data-reveal="" className="reveal text-4xl font-black leading-[1.04] tracking-tight text-graphite sm:text-5xl lg:text-6xl xl:text-[4.15rem]"
             style={{ "--reveal-delay": "60ms" } as CSSProperties}>
              Искусство{" "}
              <span className="relative inline-block">
                <span className="relative z-10">неаполитанской</span>
                <span className="absolute inset-x-0 bottom-[0.12em] z-0 h-[0.34em] -rotate-[0.6deg] rounded-full bg-sun/85" />
              </span>{" "}
              пиццы в Астане
            </h1>

            <p
             
             
             
              data-reveal="" className="reveal max-w-xl text-base leading-relaxed text-ink-50 sm:text-lg"
             style={{ "--reveal-delay": "140ms" } as CSSProperties}>
              То самое ферментированное тесто, печь 457 °C и атмосфера, вдохновлённая Ван Гогом.
            </p>

            {/* Плашки преимуществ */}
            <div className="grid w-full grid-cols-2 gap-2.5 sm:max-w-2xl lg:grid-cols-4">
              {USPS.map((usp) => (
                <div
                  key={usp.title}
                 
                 
                 
                  data-reveal="" className="reveal group flex flex-col gap-2 rounded-3xl border border-graphite/[0.08] bg-cream/85 p-3.5 shadow-inset-line backdrop-blur transition hover:-translate-y-1 hover:border-sun hover:shadow-card"
                 style={{ "--reveal-delay": "200ms" } as CSSProperties}>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-milk transition group-hover:bg-sun-soft">
                    {usp.icon}
                  </span>
                  <span className="text-sm font-extrabold leading-tight text-graphite">
                    {usp.title}
                  </span>
                  <span className="text-[0.7rem] leading-tight text-ink-50">{usp.text}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div
             
             
             
              data-reveal="" className="reveal flex w-full flex-col gap-2.5 sm:flex-row sm:items-center"
             style={{ "--reveal-delay": "480ms" } as CSSProperties}>
              <a
                href="#top-picks"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-sun px-6 py-4 text-sm font-extrabold text-graphite shadow-sun transition hover:bg-sun-deep active:scale-[0.98]"
              >
                Смотреть топ-8
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={3}
                />
              </a>
              <a
                href={buildOrderLink({ lines: [] })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-graphite px-6 py-4 text-sm font-extrabold text-cream transition hover:bg-graphite-soft active:scale-[0.98]"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={2.8} />
                Заказать в WhatsApp
              </a>
            </div>

            <div
             
             
             
              data-reveal="" className="reveal flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-ink-50"
             style={{ "--reveal-delay": "600ms" } as CSSProperties}>
              {/* Пять закрашенных звёзд читались как заявленный рейтинг 5/5.
                  Рейтинг без подтверждения — недостоверная реклама, поэтому
                  оставили честную формулировку без оценки в звёздах. */}
              <span className="inline-flex items-center gap-1.5">
                <Sparkle className="h-3.5 w-3.5 text-sun" strokeWidth={2.4} />
                Гости отмечают бортики и атмосферу
              </span>
              <span className="inline-flex items-center gap-1.5">
                <TomatoDoodle className="h-4 w-4 text-tomato" strokeWidth={6} />
                Томаты San Marzano
              </span>
            </div>
          </div>

          {/* Визуальная часть */}
          <div
           
           
           
            data-reveal="" className="reveal relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <StarrySwirl className="absolute -left-8 -top-10 h-40 w-40 text-graphite/15 lg:h-56 lg:w-56" />
            <StarrySwirl className="absolute -bottom-10 -right-6 h-36 w-36 text-sun/40 lg:h-48 lg:w-48" />

            <div className="relative aspect-square w-full">
              {/* Пунктирное кольцо */}
              <div className="absolute inset-[3%] animate-spin-slow rounded-full border-2 border-dashed border-graphite/15" />

              {/* Пицца */}
              <div className="absolute inset-[9%] overflow-hidden rounded-full shadow-[0_40px_80px_-40px_rgba(24,24,27,0.6)] ring-[10px] ring-white">
                {HERO_DISH ? (
                  <DishImage
                    dish={HERO_DISH}
                    priority
                    sizes="(max-width: 1024px) 90vw, 520px"
                  />
                ) : null}
              </div>

              {/* Вращающаяся печать */}
              <RotatingSeal className="absolute -bottom-2 -left-2 h-32 w-32 drop-shadow-lg lg:h-40 lg:w-40" />

              {/* Маркерные акценты */}
              <span className="absolute -top-4 right-2 rotate-6 font-marker text-4xl text-tomato lg:text-5xl">
                457 °C
              </span>
              <span className="absolute bottom-10 right-0 -rotate-3 font-marker text-2xl text-graphite/70 lg:text-3xl">
                We love pizza
              </span>

              {/* Плашка «90 секунд» */}
              <div className="absolute -right-2 top-1/3 flex items-center gap-2 rounded-2xl border border-graphite/10 bg-cream/95 px-3.5 py-2.5 shadow-card backdrop-blur">
                <FlameDoodle className="h-6 w-6 text-tomato" strokeWidth={4} />
                <span className="flex flex-col leading-none">
                  <span className="font-display text-lg font-black text-graphite">90 сек</span>
                  <span className="text-[0.65rem] font-semibold text-ink-50">в печи</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UspMarquee />
    </section>
  );
}

/** Вращающаяся круговая печать. */
function RotatingSeal({ className = "" }: { className?: string }) {
  return (
    <div className={`relative grid place-items-center ${className}`}>
      <svg viewBox="0 0 200 200" className="h-full w-full animate-spin-slower" aria-hidden>
        <defs>
          <path
            id="hero-seal-path"
            d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0"
          />
        </defs>
        <circle cx="100" cy="100" r="94" fill="var(--color-sun)" />
        <circle cx="100" cy="100" r="94" fill="none" stroke="var(--color-graphite)" strokeWidth="3" />
        <circle cx="100" cy="100" r="62" fill="none" stroke="var(--color-graphite)" strokeWidth="2" opacity="0.35" />
        <text
          fill="var(--color-graphite)"
          fontSize="15.5"
          fontWeight="800"
          letterSpacing="3.4"
          fontFamily="var(--font-sans)"
        >
          <textPath href="#hero-seal-path" startOffset="0">
            · NAPOLI · ASTANA · 72 ORE DI FERMENTAZIONE
          </textPath>
        </text>
      </svg>
      <span className="absolute grid place-items-center text-center">
        <span className="font-marker text-2xl leading-none text-graphite">72 ч</span>
        <span className="text-[0.6rem] font-black uppercase tracking-widest text-graphite/70">
          тесто
        </span>
      </span>
    </div>
  );
}

const MARQUEE_ITEMS = [
  "Печь 457 °C",
  "90 секунд выпечки",
  "72 часа ферментации теста",
  "Итальянская моцарелла",
  "Halal мясные начинки",
  "Летняя терраса",
  "Стена в стиле Ван Гога",
  "Открыто ежедневно 10:00–22:00",
];

/** Бегущая строка с ключевыми сообщениями бренда. */
function UspMarquee() {
  return (
    <div className="relative mt-14 overflow-hidden border-y border-graphite/10 bg-graphite py-4 sm:mt-20">
      <div className="flex w-max animate-marquee items-center gap-8 pr-8 [will-change:transform]">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-8" aria-hidden={copy === 1}>
            {MARQUEE_ITEMS.map((item) => (
              <span
                key={`${copy}-${item}`}
                className="flex shrink-0 items-center gap-8 text-sm font-bold uppercase tracking-wider text-cream/90"
              >
                {item}
                <span className="h-1.5 w-1.5 rounded-full bg-sun" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
