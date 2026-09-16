/**
 * Геометрия рисованных элементов.
 *
 * Все функции детерминированы (никакого `Math.random()`), поэтому SVG
 * выглядит одинаково на сервере и на клиенте — без hydration mismatch.
 */

/** Псевдослучайное число в диапазоне -1..1 по числовому seed. */
export function jitter(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
}

/**
 * Округление координат до десятых.
 *
 * SVG-пути — самая тяжёлая часть разметки: при двух знаках после запятой
 * 692路径 давали ~300 КБ HTML. Десятых достаточно: при рендере в ~400 px
 * одна десятая единицы viewBox — это 0.2 px, разницы не видно.
 */
export function round(value: number): string {
  return value.toFixed(1);
}

export interface SpiralOptions {
  cx: number;
  cy: number;
  rStart: number;
  rEnd: number;
  turns: number;
  phase?: number;
  steps?: number;
  wobble?: number;
  seed?: number;
}

/** Спираль — базовый элемент «Звёздной ночи». */
export function spiralPath({
  cx,
  cy,
  rStart,
  rEnd,
  turns,
  phase = 0,
  steps = 54,
  wobble = 0,
  seed = 1,
}: SpiralOptions): string {
  const points: string[] = [];

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const theta = phase + t * turns * Math.PI * 2;
    const radius = rStart + (rEnd - rStart) * t + wobble * jitter(seed + i);
    points.push(`${round(cx + Math.cos(theta) * radius)} ${round(cy + Math.sin(theta) * radius)}`);
  }

  return `M${points.join(" L")}`;
}

export interface EllipseOptions {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  steps?: number;
  wobble?: number;
  seed?: number;
  /** >1 — линия замыкается с перехлёстом, как при рисовании от руки. */
  overshoot?: number;
}

/** «Дрожащий» эллипс. */
export function wobblyEllipse({
  cx,
  cy,
  rx,
  ry,
  steps = 42,
  wobble = 1.4,
  seed = 1,
  overshoot = 1.12,
}: EllipseOptions): string {
  const points: string[] = [];
  const total = steps * overshoot;

  for (let i = 0; i <= total; i += 1) {
    const theta = (i / steps) * Math.PI * 2;
    const dx = Math.cos(theta) * (rx + wobble * jitter(seed + i * 1.7));
    const dy = Math.sin(theta) * (ry + wobble * jitter(seed + 40 + i * 1.3));
    points.push(`${round(cx + dx)} ${round(cy + dy)}`);
  }

  return `M${points.join(" L")}`;
}

/** Лучистая звезда с неровными лучами. */
export function starPath(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  spikes = 5,
  seed = 3,
): string {
  const points: string[] = [];
  const total = spikes * 2;

  for (let i = 0; i <= total; i += 1) {
    const isOuter = i % 2 === 0;
    const radius = (isOuter ? outer : inner) + jitter(seed + i) * (isOuter ? 1.8 : 1);
    const theta = (i / total) * Math.PI * 2 - Math.PI / 2;
    points.push(`${round(cx + Math.cos(theta) * radius)} ${round(cy + Math.sin(theta) * radius)}`);
  }

  return `M${points.join(" L")}`;
}
