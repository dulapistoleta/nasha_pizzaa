"use client";

import {
  ArrowUpRight,
  Bike,
  Clock,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShoppingBag,
} from "lucide-react";
import { Reveal, SectionHeading } from "@/components/ui/SectionHeading";
import { StarrySwirl, TomatoDoodle, BasilDoodle } from "@/components/art/doodles";
import { RESTAURANT } from "@/lib/restaurant";
import { telHref } from "@/lib/format";
import { buildOrderLink } from "@/lib/whatsapp";

const CHANNELS = [
  {
    id: "2gis",
    label: "Открыть в 2GIS",
    hint: "Схема проезда и отзывы гостей",
    href: RESTAURANT.links.twoGis,
    icon: <Navigation className="h-5 w-5" strokeWidth={2.4} />,
    tone: "bg-basil text-cream",
  },
  {
    id: "wolt",
    label: "Заказать в Wolt",
    hint: "Доставка курьером Wolt по Астане",
    href: RESTAURANT.links.wolt,
    icon: <Bike className="h-5 w-5" strokeWidth={2.4} />,
    tone: "bg-[#00C2E8] text-graphite",
  },
  {
    id: "yandex",
    label: "Заказать в Яндекс Еда",
    hint: "Доставка курьером Яндекс Еды",
    href: RESTAURANT.links.yandexEda,
    icon: <ShoppingBag className="h-5 w-5" strokeWidth={2.4} />,
    tone: "bg-sun text-graphite",
  },
  {
    id: "whatsapp",
    label: "Написать в WhatsApp",
    hint: "Соберём заказ и подтвердим вручную",
    href: buildOrderLink({ lines: [] }),
    icon: <MessageCircle className="h-5 w-5" strokeWidth={2.4} />,
    tone: "bg-[#25D366] text-graphite",
  },
];

/** Блок контактов и заказа: способы связи, адрес, часы работы. */
export function Contacts() {

  return (
    <section id="contacts" className="skip-offscreen relative scroll-mt-40 pb-16 pt-6 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Как нас найти и заказать"
          title="Ждём вас на"
          accent="Мәңгілік Ел"
          description="Позвоните, напишите в WhatsApp или закажите через любимый сервис доставки — заберём и привезём."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Каналы заказа */}
          <div className="grid gap-3 sm:grid-cols-2">
            {CHANNELS.map((channel) => (
              <a
                key={channel.id}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
               
               
               
               
                data-reveal="" className="reveal group flex flex-col gap-3 rounded-4xl border border-line bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-2xl ${channel.tone}`}
                  >
                    {channel.icon}
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 text-ink-30 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-graphite"
                    strokeWidth={2.6}
                  />
                </div>
                <span className="font-display text-lg font-black leading-tight text-graphite">
                  {channel.label}
                </span>
                <span className="text-xs leading-relaxed text-ink-50">{channel.hint}</span>
              </a>
            ))}
          </div>

          {/* Карточка с адресом */}
          <Reveal delay={0.1} className="relative">
            <div className="relative flex h-full flex-col gap-5 overflow-hidden rounded-4xl border border-graphite/10 bg-graphite p-6 text-cream shadow-float">
              <StarrySwirl className="absolute -right-12 -top-12 h-44 w-44 text-sun/20" />
              <TomatoDoodle className="absolute -bottom-4 right-6 h-16 w-16 text-tomato/40" />
              <BasilDoodle className="absolute bottom-24 right-24 h-14 w-14 text-basil/30" />

              <div className="relative flex flex-col gap-1.5">
                <span className="font-marker text-2xl text-sun">наш адрес</span>
                <p className="text-lg font-bold leading-snug">{RESTAURANT.addressFull}</p>
              </div>

              <div className="relative flex flex-col gap-3 text-sm">
                <span className="inline-flex items-start gap-2.5 text-cream/85">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-sun" strokeWidth={2.6} />
                  {RESTAURANT.hours.label}
                </span>
                <span className="inline-flex items-start gap-2.5 text-cream/85">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sun" strokeWidth={2.6} />
                  {RESTAURANT.district}, ЖК «Promenade Expo», 1 этаж
                </span>
              </div>

              <div className="relative mt-auto flex flex-col gap-2.5">
                {RESTAURANT.phones.map((phone) => (
                  <a
                    key={phone.tel}
                    href={telHref(phone.tel)}
                    className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-extrabold transition active:scale-[0.98] ${
                      phone.primary
                        ? "bg-sun text-graphite shadow-sun hover:bg-sun-deep"
                        : "border border-cream/20 bg-cream/5 text-cream hover:bg-cream/10"
                    }`}
                  >
                    <Phone className="h-4 w-4" strokeWidth={2.8} />
                    {phone.label}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Стилизованная «карта» */}
        <Reveal delay={0.15}>
          <a
            href={RESTAURANT.links.twoGis}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mt-5 flex min-h-[220px] items-end overflow-hidden rounded-4xl border border-line bg-cream shadow-card"
          >
            <MapPattern />
            <div className="relative z-10 m-4 flex w-full flex-wrap items-center justify-between gap-3 rounded-3xl border border-graphite/10 bg-cream/95 px-5 py-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-tomato text-cream">
                  <MapPin className="h-5 w-5" strokeWidth={2.6} />
                  <span className="absolute inset-0 animate-pulse-ring rounded-2xl bg-tomato/50" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="font-bold text-graphite">{RESTAURANT.name}</span>
                  <span className="text-xs text-ink-50">{RESTAURANT.addressShort}</span>
                </span>
              </div>
              <span className="inline-flex items-center gap-2 rounded-2xl bg-graphite px-4 py-2.5 text-xs font-extrabold text-cream transition group-hover:bg-graphite-soft">
                Построить маршрут
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.8} />
              </span>
            </div>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/** Декоративная «схема кварталов» вместо карты. */
function MapPattern() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 800 300"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      <rect width="800" height="300" fill="#F3EDE2" />
      <g stroke="#DCD2C1" strokeWidth="14" strokeLinecap="round">
        <path d="M-20 90H820M-20 220H820M140 -20V320M420 -20V320M660 -20V320" />
      </g>
      <g stroke="#E6DCCB" strokeWidth="6" strokeLinecap="round">
        <path d="M-20 150H820M280 -20V320M540 -20V320M80 -20V320M740 -20V320" />
      </g>
      <g fill="#E9E1D2">
        <rect x="170" y="110" width="90" height="90" rx="14" />
        <rect x="450" y="120" width="70" height="70" rx="12" />
        <rect x="300" y="240" width="90" height="46" rx="12" />
        <rect x="690" y="180" width="70" height="60" rx="12" />
      </g>
      <g fill="#DCEBD3">
        <circle cx="230" cy="250" r="34" />
        <circle cx="600" cy="60" r="28" />
      </g>
      <path d="M-20 30C120 10 260 70 400 40C540 10 680 60 820 30" stroke="#C9BCA6" strokeWidth="8" fill="none" strokeLinecap="round" />
    </svg>
  );
}
