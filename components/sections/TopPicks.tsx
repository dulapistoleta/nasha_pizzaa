"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { DishCard } from "@/components/menu/DishCard";
import { Reveal, SectionHeading } from "@/components/ui/SectionHeading";
import { TOP_PICKS } from "@/lib/menu-data";
import { useCart } from "@/lib/cart-store";
import { buildOrderLink } from "@/lib/whatsapp";

/**
 * Блок «Топ выбор»: восемь позиций, которые заведение советует попробовать.
 * Превосходные степени вроде «самые продаваемые» не используем: их нужно
 * подтверждать выгрузкой продаж, иначе это недостоверная реклама.
 */
export function TopPicks() {
  const { lines } = useCart();
  const hasCart = lines.length > 0;

  return (
    <section id="top-picks" className="relative scroll-mt-40 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Восемь позиций, которые мы советуем"
            title="Топ выбор"
            description="Восемь позиций, ради которых к нам возвращаются: от «Пепперони» до сета на большую компанию."
          />

          <Reveal delay={0.15}>
            <div className="flex items-center gap-3 rounded-3xl border border-graphite/10 bg-cream/85 p-4 shadow-inset-line backdrop-blur">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sun text-graphite">
                <Sparkles className="h-5 w-5" strokeWidth={2.6} />
              </span>
              <p className="max-w-[15rem] text-xs leading-snug text-ink-50">
                Не знаете, с чего начать? Возьмите «Пепперони» — её у нас заказывают чаще всего.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {TOP_PICKS.map((dish, index) => (
            <Reveal key={dish.id} delay={Math.min(index * 0.06, 0.42)} className="h-full">
              <DishCard dish={dish} priority={index < 2} />
            </Reveal>
          ))}
        </div>

        {hasCart ? (
          <div
           
           
            data-reveal="" className="reveal mt-8 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-graphite/15 bg-cream/70 p-5 text-center sm:flex-row sm:justify-between sm:text-left"
          >
            <p className="text-sm text-ink-70">
              Уже выбрали? Отправим заказ в WhatsApp прямо сейчас — мы подтвердим за пару минут.
            </p>
            <a
              href={buildOrderLink({ lines })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-graphite px-5 py-3 text-sm font-extrabold text-cream transition hover:bg-graphite-soft"
            >
              Оформить заказ
              <ArrowRight className="h-4 w-4" strokeWidth={3} />
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
