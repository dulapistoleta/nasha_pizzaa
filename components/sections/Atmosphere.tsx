"use client";

import { Armchair, Camera, Flame, TreePine, Users } from "lucide-react";
import { MuralWall, SimmerSmoke } from "@/components/art/MuralWall";
import { Reveal, SectionHeading } from "@/components/ui/SectionHeading";
import { RESTAURANT } from "@/lib/restaurant";
import { formatNumber } from "@/lib/format";

const FEATURES = [
  {
    icon: <Camera className="h-5 w-5" strokeWidth={2.4} />,
    title: "Стена Ван Гога",
    text: "Роспись в духе «Звёздной ночи» — гости фотографируются у неё чаще, чем едят.",
  },
  {
    icon: <TreePine className="h-5 w-5" strokeWidth={2.4} />,
    title: "Терраса на Мәңгілік Ел",
    text: "Открытая веранда: летом — прохлада, зимой — вид на проспект через панорамное стекло.",
  },
  {
    icon: <Flame className="h-5 w-5" strokeWidth={2.4} />,
    title: "Дровяная печь",
    text: `Печь на ${RESTAURANT.oven.temperature} °C стоит в зале — видно, как пицца становится пиццей.`,
  },
  {
    icon: <Armchair className="h-5 w-5" strokeWidth={2.4} />,
    title: "Семейный зал",
    text: "Мягкий свет, дерево и крафт: удобно и на свидании, и с детьми, и с ноутбуком днём.",
  },
];

const STATS = [
  { value: `${RESTAURANT.oven.temperature}`, unit: "°C", label: "температура печи" },
  { value: `${RESTAURANT.oven.seconds}`, unit: "сек", label: "выпечка одной пиццы" },
  { value: `${RESTAURANT.oven.fermentationHours}`, unit: "ч", label: "ферментация теста" },
  { value: "100", unit: "%", label: "итальянская моцарелла" },
];

/** Блок атмосферы: история заведения, рисованное панно и цифры. */
export function Atmosphere() {

  return (
    <section id="atmosphere" className="skip-offscreen relative scroll-mt-40 py-8 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-6 sm:gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          {/* Панно */}
          <Reveal className="relative order-2 lg:order-1">
            <SimmerSmoke className="-top-6 left-10" />
            <MuralWall className="aspect-[4/3] w-full sm:aspect-[16/11]" />
            <span className="absolute -bottom-4 right-6 rotate-[-3deg] rounded-2xl border border-graphite/10 bg-cream px-4 py-2 font-marker text-xl text-graphite shadow-card">
              наша стена
            </span>
          </Reveal>

          {/* История */}
          <div className="order-1 flex flex-col gap-7 lg:order-2">
            <SectionHeading
              eyebrow="Атмосфера пиццерии"
              title="Стена Ван Гога и терраса на"
              accent="Мангилик Ел"
              description={RESTAURANT.story}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                 
                 
                 
                 
                  data-reveal="" className="reveal flex flex-col gap-2.5 rounded-3xl border border-graphite/[0.08] bg-cream/85 p-4 shadow-inset-line backdrop-blur transition hover:-translate-y-1 hover:border-sun hover:shadow-card"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sun-soft text-tomato">
                    {feature.icon}
                  </span>
                  <span className="font-bold leading-tight text-graphite">{feature.title}</span>
                  <span className="text-xs leading-relaxed text-ink-50">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 rounded-3xl bg-graphite p-4 text-cream">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sun text-graphite">
                <Users className="h-5 w-5" strokeWidth={2.6} />
              </span>
              <p className="text-sm leading-snug text-cream/85">
                Приходите компанией — у нас есть сеты на 4–6 человек и большой общий стол у печи.
              </p>
            </div>
          </div>
        </div>

        {/* Цифры */}
        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.07}>
              <div className="flex h-full flex-col items-center gap-1 rounded-3xl border border-graphite/10 bg-white/80 px-4 py-6 text-center shadow-card backdrop-blur">
                <span className="font-display text-4xl font-black leading-none text-graphite sm:text-5xl">
                  {formatNumber(Number(stat.value))}
                  <span className="text-xl text-tomato sm:text-2xl">{stat.unit}</span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-50">
                  {stat.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
