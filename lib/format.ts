/**
 * Утилиты форматирования. Детерминированы на сервере и клиенте,
 * чтобы не ловить hydration mismatch.
 */

/** 3690 -> "3 690 ₸" (неразрывные пробелы, чтобы цена не рвалась). */
export function formatTenge(value: number): string {
  const grouped = String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, "\u202F");
  return `${grouped}\u00A0₸`;
}

/** 3690 -> "3 690" без символа валюты. */
export function formatNumber(value: number): string {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, "\u202F");
}

/** Склонение: plural(2, "пицца", "пиццы", "пицц") -> "пиццы". */
export function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

/** "3 позиции" / "1 позиция" / "5 позиций". */
export function positionsLabel(n: number): string {
  return `${n} ${plural(n, "позиция", "позиции", "позиций")}`;
}

/**
 * Текущее время в часовом поясе заведения.
 * Возвращает минуты от начала суток.
 */
export function minutesInTimeZone(timeZone: string, now: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat("ru-RU", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return (hour % 24) * 60 + minute;
}

export interface OpenState {
  isOpen: boolean;
  /** Готовая подпись статуса. */
  label: string;
}

/**
 * Открыто ли заведение прямо сейчас (по времени Астаны).
 * Если время определить не удалось — возвращаем оптимистичное «открыто».
 */
export function resolveOpenState(
  timeZone: string,
  open: string,
  close: string,
  now: Date = new Date(),
): OpenState {
  const toMinutes = (value: string) => {
    const [h, m] = value.split(":").map(Number);
    return h * 60 + m;
  };

  try {
    const current = minutesInTimeZone(timeZone, now);
    const openAt = toMinutes(open);
    const closeAt = toMinutes(close);
    const isOpen = current >= openAt && current < closeAt;
    return {
      isOpen,
      label: isOpen
        ? `Открыто до ${close}`
        : current < openAt
          ? `Откроемся в ${open}`
          : `Закрыто · ждём в ${open}`,
    };
  } catch {
    return { isOpen: true, label: `Ежедневно ${open}–${close}` };
  }
}

/** Аккуратный tel-хреф. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
