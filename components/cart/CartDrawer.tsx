"use client";

import {
  ArrowRight,
  MapPin,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DishImage } from "@/components/menu/DishImage";
import { StarrySwirl, PizzaSliceDoodle } from "@/components/art/doodles";
import { useCart } from "@/lib/cart-store";
import { formatTenge, positionsLabel } from "@/lib/format";
import { RESTAURANT } from "@/lib/restaurant";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { buildOrderLink, buildOrderMessage } from "@/lib/whatsapp";
import { telHref } from "@/lib/format";

/** Выдвижная корзина с подсчётом суммы в ₸ и оформлением заказа в WhatsApp. */
export function CartDrawer() {
  const {
    lines,
    totals,
    isOpen,
    hasOpened,
    close,
    setQty,
    remove,
    clear,
    address,
    setAddress,
    comment,
    setComment,
  } = useCart();
  useLockBodyScroll(isOpen);

  /* Согласие на обработку данных нужно именно для отправки заказа: адрес и
     комментарий уходят в WhatsApp. Галочка не отмечена заранее — иначе это
     было бы согласие по умолчанию. Факт и время согласия сохраняем. */
  const [agreed, setAgreed] = useState(false);

  const ORDER_CONSENT_KEY = "nasha-pizza:order-consent:v1";

  const toggleAgreed = (next: boolean) => {
    setAgreed(next);
    try {
      if (next) {
        window.localStorage.setItem(
          ORDER_CONSENT_KEY,
          JSON.stringify({ grantedAt: new Date().toISOString(), version: "1.0" }),
        );
      } else {
        window.localStorage.removeItem(ORDER_CONSENT_KEY);
      }
    } catch {
      /* приватный режим — просто не сохраняем отметку */
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const orderLink = buildOrderLink({ lines, address, comment });
  const preview = buildOrderMessage({ lines, address, comment });
  const isEmpty = lines.length === 0;

  return (
    /* Шторка всегда в DOM: открытие и закрытие — обычные CSS-переходы,
       поэтому Framer Motion в стартовом бандле не нужен. */
    <div
      className={`fixed inset-0 z-[90] transition-[opacity,visibility] duration-300 ${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div onClick={close} className="absolute inset-0 bg-graphite/55 backdrop-blur-sm" />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Корзина"
        className={`absolute right-0 top-0 flex h-full w-full flex-col bg-cream shadow-float transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:max-w-md ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
            {/* Шапка */}
            <div className="flex items-center justify-between gap-3 border-b border-line bg-white/80 px-5 py-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-sun text-graphite">
                  <ShoppingBag className="h-5 w-5" strokeWidth={2.6} />
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="font-display text-lg font-black text-graphite">Ваш заказ</span>
                  <span className="text-xs text-ink-50">
                    {isEmpty ? "Пока пусто" : positionsLabel(totals.count)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Закрыть корзину"
                className="grid h-10 w-10 place-items-center rounded-full bg-milk text-graphite transition hover:bg-sun-soft"
              >
                <X className="h-5 w-5" strokeWidth={2.6} />
              </button>
            </div>

            {/* Содержимое. До первого открытия не рендерим ничего, кроме
                каркаса: иначе миниатюры блюд грузятся впустую. */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {!hasOpened ? null : isEmpty ? (
                <EmptyCart onClose={close} />
              ) : (
                <ul className="flex flex-col gap-3">
                  {lines.map((line) => (
                      <li key={line.dish.id}>
                        <div className="flex gap-3 rounded-3xl border border-line bg-white p-3 shadow-card">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
                            <DishImage dish={line.dish} sizes="80px" />
                          </div>

                          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <span className="line-clamp-2 text-sm font-bold leading-snug text-graphite">
                                {line.dish.shortName}
                              </span>
                              <button
                                type="button"
                                onClick={() => remove(line.dish.id)}
                                aria-label={`Удалить ${line.dish.shortName}`}
                                className="shrink-0 rounded-lg p-1 text-ink-30 transition hover:bg-tomato-soft hover:text-tomato"
                              >
                                <Trash2 className="h-4 w-4" strokeWidth={2.4} />
                              </button>
                            </div>

                            <span className="text-xs text-ink-50">
                              {formatTenge(line.dish.price)} / шт
                            </span>

                            <div className="mt-auto flex items-center justify-between gap-2">
                              <div className="flex items-center gap-0.5 rounded-xl bg-milk p-0.5">
                                <button
                                  type="button"
                                  onClick={() => setQty(line.dish.id, line.qty - 1)}
                                  aria-label="Уменьшить"
                                  className="grid h-7 w-7 place-items-center rounded-lg bg-white text-graphite transition hover:bg-cream"
                                >
                                  <Minus className="h-3.5 w-3.5" strokeWidth={3} />
                                </button>
                                <span className="w-7 text-center text-sm font-bold tabular-nums">
                                  {line.qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setQty(line.dish.id, line.qty + 1)}
                                  aria-label="Увеличить"
                                  className="grid h-7 w-7 place-items-center rounded-lg bg-white text-graphite transition hover:bg-cream"
                                >
                                  <Plus className="h-3.5 w-3.5" strokeWidth={3} />
                                </button>
                              </div>
                              <span className="font-display text-base font-black text-graphite">
                                {formatTenge(line.dish.price * line.qty)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                  ))}
                </ul>
              )}

              {!isEmpty ? (
                <div className="mt-5 flex flex-col gap-3">
                  <label className="flex flex-col gap-1.5">
                    <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-ink-30">
                      <MapPin className="h-3.5 w-3.5" strokeWidth={2.8} />
                      Адрес доставки
                    </span>
                    <textarea
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      rows={2}
                      placeholder="Например: Мәңгілік Ел 52, кв. 12, подъезд 2"
                      className="resize-none rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition placeholder:text-ink-30 focus:border-sun focus:ring-4 focus:ring-sun/25"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-black uppercase tracking-widest text-ink-30">
                      Комментарий
                    </span>
                    <input
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                      placeholder="Без лука, порезать на 8 частей…"
                      className="rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition placeholder:text-ink-30 focus:border-sun focus:ring-4 focus:ring-sun/25"
                    />
                  </label>

                  <details className="rounded-2xl border border-dashed border-line bg-milk/60 px-4 py-3">
                    <summary className="cursor-pointer text-xs font-bold text-ink-50">
                      Посмотреть текст сообщения
                    </summary>
                    <pre className="mt-2 whitespace-pre-wrap font-sans text-xs leading-relaxed text-ink-70">
                      {preview}
                    </pre>
                  </details>

                  <button
                    type="button"
                    onClick={clear}
                    className="self-start text-xs font-semibold text-ink-30 underline-offset-4 transition hover:text-tomato hover:underline"
                  >
                    Очистить корзину
                  </button>
                </div>
              ) : null}
            </div>

            {/* Итог */}
            <div className="border-t border-line bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="flex items-center justify-between pb-3">
                <span className="text-sm font-semibold text-ink-50">Итого</span>
                <span className="font-display text-2xl font-black text-graphite">
                  {formatTenge(totals.subtotal)}
                </span>
              </div>

              {!isEmpty ? (
                <label className="mb-3 flex items-start gap-2.5 rounded-2xl border border-line bg-milk/50 p-3">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(event) => toggleAgreed(event.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-graphite"
                  />
                  <span className="text-[0.7rem] leading-relaxed text-ink-70">
                    Согласен на обработку персональных данных: адрес и комментарий уйдут в WhatsApp
                    заведения, чтобы выполнить заказ.{" "}
                    <Link
                      href="/privacy"
                      className="font-semibold text-graphite underline underline-offset-2"
                    >
                      Политика конфиденциальности
                    </Link>
                    .
                  </span>
                </label>
              ) : null}

              <a
                href={isEmpty || !agreed ? undefined : orderLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={isEmpty || !agreed}
                onClick={(event) => {
                  if (isEmpty || !agreed) event.preventDefault();
                }}
                className={`flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-extrabold transition ${
                  isEmpty || !agreed
                    ? "cursor-not-allowed bg-milk text-ink-30"
                    : "bg-graphite text-cream shadow-float hover:bg-graphite-soft active:scale-[0.99]"
                }`}
              >
                <MessageCircle className="h-4.5 w-4.5" strokeWidth={2.6} />
                Оформить заказ в WhatsApp
                <ArrowRight className="h-4 w-4" strokeWidth={3} />
              </a>

              {!isEmpty && !agreed ? (
                <p className="mt-2 text-center text-[0.7rem] text-ink-50">
                  Отметьте согласие — без него мы не сможем передать заказ оператору.
                </p>
              ) : null}

              <div className="mt-2 flex items-center justify-center gap-4 text-xs text-ink-50">
                <a
                  href={telHref(RESTAURANT.phones[0].tel)}
                  className="inline-flex items-center gap-1.5 font-semibold transition hover:text-graphite"
                >
                  <Phone className="h-3.5 w-3.5" strokeWidth={2.6} />
                  {RESTAURANT.phones[0].label}
                </a>
                <span className="text-ink-30">·</span>
                <span>{RESTAURANT.hours.short}</span>
              </div>
            </div>
      </aside>
    </div>
  );
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-4 py-10 text-center">
      <StarrySwirl className="absolute -top-6 right-0 h-32 w-32 text-graphite/10" />
      <PizzaSliceDoodle className="animate-float-mid h-20 w-20 -rotate-12 text-crust" />
      <div className="flex flex-col gap-1">
        <span className="font-display text-xl font-black text-graphite">Корзина пока пустая</span>
        <span className="max-w-[16rem] text-sm text-ink-50">
          Добавьте пиццу из рекомендованных — и мы соберём заказ в WhatsApp за пару секунд.
        </span>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="rounded-2xl bg-sun px-5 py-3 text-sm font-extrabold text-graphite shadow-sun transition hover:bg-sun-deep"
      >
        Перейти к меню
      </button>
    </div>
  );
}
