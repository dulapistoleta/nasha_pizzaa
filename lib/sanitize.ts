/**
 * Санитайзинг пользовательского ввода.
 *
 * Сейчас единственные данные от гостя — адрес доставки и комментарий к заказу.
 * Они попадают в текст сообщения WhatsApp, поэтому:
 *  • ограничиваем длину (защита от переполнения URL и «простыней» в чате);
 *  • вырезаем управляющие символы и невидимые символы (RTL-override, zero-width);
 *  • в однострочных полях убираем переводы строк, чтобы нельзя было подделать
 *    дополнительные пункты заказа в сообщении.
 */

/** Управляющие и невидимые символы, включая bidi-override и zero-width. */
const DANGEROUS_CHARS =
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u2028\u2029\u202A-\u202E\u2066-\u2069\uFEFF]/g;

const MAX_ADDRESS = 240;
const MAX_COMMENT = 200;
const MAX_NAME = 60;

/** Общая очистка: убираем невидимое, нормализуем пробелы, режем длину. */
function clean(value: string, maxLength: number): string {
  return value
    .replace(DANGEROUS_CHARS, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim()
    .slice(0, maxLength);
}

/** Адрес доставки — одна строка. */
export function sanitizeAddress(value: unknown): string {
  if (typeof value !== "string") return "";
  return clean(value.replace(/[\r\n]+/g, ", "), MAX_ADDRESS);
}

/** Комментарий к заказу — тоже одна строка: так его видно целиком в сообщении. */
export function sanitizeComment(value: unknown): string {
  if (typeof value !== "string") return "";
  return clean(value.replace(/[\r\n]+/g, " "), MAX_COMMENT);
}

export function sanitizeName(value: unknown): string {
  if (typeof value !== "string") return "";
  return clean(value.replace(/[\r\n]+/g, " "), MAX_NAME);
}

/**
 * Экранирование JSON для вставки в `<script type="application/ld+json">`.
 * `</script>` внутри данных иначе разорвал бы тег и открыл XSS.
 */
export function escapeJsonForHtml(json: string): string {
  return json
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
