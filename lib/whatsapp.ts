import { RESTAURANT } from "@/lib/restaurant";
import { formatTenge } from "@/lib/format";
import type { CartLine } from "@/types/menu";
import { sanitizeAddress, sanitizeComment, sanitizeName } from "@/lib/sanitize";

export interface OrderDraft {
  lines: CartLine[];
  /** Адрес доставки, введённый гостем. */
  address?: string;
  /** Комментарий к заказу. */
  comment?: string;
  /** Имя гостя (необязательно). */
  name?: string;
}

/**
 * Собирает текст заказа для WhatsApp строго в формате заведения:
 *
 * Здравствуйте! Хочу заказать в "Наша пицца":
 * 1) Пепперони x1,
 * 2) Морс 1л x1.
 * Сумма: 5 380 ₸.
 * Адрес доставки: ...
 */
export function buildOrderMessage({ lines, address, comment, name }: OrderDraft): string {
  const items = lines
    .filter((line) => line.qty > 0)
    .map((line, index) => `${index + 1}) ${line.dish.shortName} x${line.qty}`)
    .join(",\n");

  const total = lines.reduce((sum, line) => sum + line.dish.price * line.qty, 0);

  const parts = [`Здравствуйте! Хочу заказать в "${RESTAURANT.name}":`, `${items}.`];

  parts.push(`Сумма: ${formatTenge(total)}.`);

  /* Повторная очистка перед отправкой — защита в глубину: сообщение могло
     быть собрано не только из формы корзины. */
  const safeAddress = sanitizeAddress(address);
  const safeComment = sanitizeComment(comment);
  const safeName = sanitizeName(name);

  parts.push(`Адрес доставки: ${safeAddress || "..."}`);

  if (safeName) parts.push(`Имя: ${safeName}`);
  if (safeComment) parts.push(`Комментарий: ${safeComment}`);

  return parts.join("\n");
}

/** Готовая ссылка на чат WhatsApp с заполненным заказом. */
export function buildOrderLink(draft: OrderDraft): string {
  return RESTAURANT.whatsapp.link(buildOrderMessage(draft));
}

/** Быстрый вопрос по конкретному блюду. */
export function buildDishQuestionLink(dishName: string, price: number): string {
  const text = `Здравствуйте! Подскажите по позиции "${dishName}" (${formatTenge(price)}) — хочу оформить заказ в "${RESTAURANT.name}".`;
  return RESTAURANT.whatsapp.link(text);
}
