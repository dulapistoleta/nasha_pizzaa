"use client";

import Link from "next/link";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/art/Logo";
import { StarrySwirl } from "@/components/art/doodles";
import { CATEGORIES } from "@/lib/menu-data";
import { RESTAURANT } from "@/lib/restaurant";
import { telHref } from "@/lib/format";
import { LEGAL } from "@/lib/legal";
import { useConsent } from "@/lib/consent";
import { buildOrderLink } from "@/lib/whatsapp";

/** Подвал: навигация по меню, контакты и правовая информация. */
export function Footer() {
  const year = new Date().getFullYear();
  const { openSettings } = useConsent();

  return (
    <footer className="skip-offscreen relative overflow-hidden border-t border-graphite/10 bg-milk-deep pb-28 pt-14 lg:pb-14">
      <StarrySwirl className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 text-graphite/[0.07]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-ink-50">
              Крафтовая неаполитанская пицца в Астане: тесто 72 часов ферментации и печь на{" "}
              {RESTAURANT.oven.temperature} °C. Halal-начинки, итальянская моцарелла, стена в духе
              Ван Гога.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-1.5 text-[0.7rem] font-bold text-graphite ring-1 ring-graphite/10">
                Halal
              </span>
              <span className="rounded-full bg-white px-3 py-1.5 text-[0.7rem] font-bold text-graphite ring-1 ring-graphite/10">
                Печь {RESTAURANT.oven.temperature} °C
              </span>
              <span className="rounded-full bg-white px-3 py-1.5 text-[0.7rem] font-bold text-graphite ring-1 ring-graphite/10">
                Летняя терраса
              </span>
            </div>
          </div>

          <nav className="flex flex-col gap-3">
            <span className="font-marker text-2xl text-tomato">меню</span>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm lg:grid-cols-1">
              {CATEGORIES.map((category) => (
                <li key={category.id}>
                  <a
                    href={category.id === "top" ? "#top-picks" : "#menu-catalog"}
                    className="inline-flex items-center gap-1.5 text-ink-50 transition hover:text-graphite"
                  >
                    <span>{category.emoji}</span>
                    {category.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-3">
            <span className="font-marker text-2xl text-tomato">контакты</span>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <span className="inline-flex items-start gap-2 text-ink-50">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-tomato" strokeWidth={2.6} />
                  {RESTAURANT.addressFull}
                </span>
              </li>
              <li>
                <span className="inline-flex items-center gap-2 text-ink-50">
                  <Clock className="h-4 w-4 shrink-0 text-sun-deep" strokeWidth={2.6} />
                  {RESTAURANT.hours.label}
                </span>
              </li>
              {RESTAURANT.phones.map((phone) => (
                <li key={phone.tel}>
                  <a
                    href={telHref(phone.tel)}
                    className="inline-flex items-center gap-2 font-semibold text-graphite transition hover:text-tomato"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-tomato" strokeWidth={2.6} />
                    {phone.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={buildOrderLink({ lines: [] })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-graphite transition hover:text-basil"
                >
                  <MessageCircle className="h-4 w-4 shrink-0 text-basil" strokeWidth={2.6} />
                  WhatsApp
                </a>
              </li>
            </ul>

            <div className="mt-1 flex flex-wrap gap-2">
              <a
                href={RESTAURANT.links.twoGis}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-graphite ring-1 ring-graphite/10 transition hover:ring-graphite/30"
              >
                2GIS
              </a>
              <a
                href={RESTAURANT.links.wolt}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-graphite ring-1 ring-graphite/10 transition hover:ring-graphite/30"
              >
                Wolt
              </a>
              <a
                href={RESTAURANT.links.yandexEda}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-graphite ring-1 ring-graphite/10 transition hover:ring-graphite/30"
              >
                Яндекс Еда
              </a>
            </div>
          </div>
        </div>

        {/* Реквизиты продавца: без них дистанционная торговля — нарушение. */}
        <div className="mt-12 rounded-3xl border border-graphite/10 bg-white/70 p-5 text-xs leading-relaxed text-ink-50">
          <p className="font-bold text-graphite">Продавец</p>
          <p className="mt-1">
            {LEGAL.seller.name} · {LEGAL.seller.bin}
          </p>
          <p>{LEGAL.seller.address}</p>
          <p className="mt-1">Почта для обращений: {LEGAL.contact.email}</p>
          <p className="mt-1">
            Ответственный за обработку персональных данных: {LEGAL.seller.responsible}
          </p>
          {!LEGAL.requisitesReady ? (
            <p className="mt-2 text-ink-30">
              Поля с прочерками заполняются данными заведения: наименование, БИН/ИИН, юридический
              адрес, почта и ответственное лицо.
            </p>
          ) : null}
        </div>

        {/* Юридические документы и настройки согласия */}
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-graphite/10 pt-6 text-xs">
          {LEGAL.docs.map((doc) => (
            <Link
              key={doc.href}
              href={doc.href}
              className="font-semibold text-ink-50 underline-offset-4 transition hover:text-graphite hover:underline"
            >
              {doc.title}
            </Link>
          ))}
          <button
            type="button"
            onClick={openSettings}
            className="font-semibold text-ink-50 underline-offset-4 transition hover:text-graphite hover:underline"
          >
            Настройки cookie
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-xs text-ink-30 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {RESTAURANT.name}. {RESTAURANT.tagline}.
          </span>
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>Цены указаны в тенге и могут меняться.</span>
            <span className="hidden sm:inline">·</span>
            <span>Изображения блюд — демонстрационные.</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
