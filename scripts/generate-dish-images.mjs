/**
 * Генератор изображений блюд.
 *
 * Рисует «живописные» векторные плейсхолдеры в стиле настенной росписи
 * заведения и сохраняет их в `/public/images/dishes/[dish-slug].webp`.
 *
 * Когда появятся реальные 4K-фотографии из Nano Banana Pro — просто
 * положите их по тем же путям с теми же именами, код менять не нужно.
 *
 * Запуск: npm run images
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const { DISHES } = await import("../lib/menu-data.ts");

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = resolve(ROOT, "public/images/dishes");

const W = 1200;
const H = 900;
const CX = 600;
const CY = 445;

/* -------------------------------------------------------------------------- */
/*  Геометрия                                                                  */
/* -------------------------------------------------------------------------- */

const jitter = (seed) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
};

const n = (value) => Number(value).toFixed(1);

/** Гладкий замкнутый контур (Catmull-Rom → кубические Безье). */
function closedSmooth(points) {
  const total = points.length;
  let d = `M${n(points[0][0])} ${n(points[0][1])}`;
  for (let i = 0; i < total; i += 1) {
    const p0 = points[(i - 1 + total) % total];
    const p1 = points[i];
    const p2 = points[(i + 1) % total];
    const p3 = points[(i + 2) % total];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${n(c1x)} ${n(c1y)} ${n(c2x)} ${n(c2y)} ${n(p2[0])} ${n(p2[1])}`;
  }
  return `${d}Z`;
}

/** Органическое «пятно» — база для сыра, соуса, теста. */
function blob(cx, cy, r, seed, irregular = 0.08, count = 16) {
  const points = [];
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2;
    const radius = r * (1 + irregular * jitter(seed + i * 3.1));
    points.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]);
  }
  return closedSmooth(points);
}

/** Равномерная «естественная» россыпь точек (золотой угол + шум). */
function scatter(count, maxR, seed, cx = CX, cy = CY) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const points = [];
  for (let i = 0; i < count; i += 1) {
    const radius = maxR * Math.sqrt((i + 0.7) / count) * (1 + 0.09 * jitter(seed + i));
    const angle = i * golden + jitter(seed + i * 2.3) * 0.4;
    points.push({
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
      angle,
    });
  }
  return points;
}

/* -------------------------------------------------------------------------- */
/*  Примитивы начинок                                                          */
/* -------------------------------------------------------------------------- */

const LEAF = (x, y, size, rotation, fill, stroke = "#3F6212") =>
  `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(rotation)})">
     <path d="M0 0C${n(size * 0.55)} ${n(-size * 0.62)} ${n(size * 1.35)} ${n(-size * 0.4)} ${n(size * 1.5)} ${n(size * 0.1)}C${n(size * 1.05)} ${n(size * 0.62)} ${n(size * 0.4)} ${n(size * 0.5)} 0 0Z" fill="${fill}" stroke="${stroke}" stroke-width="${n(size * 0.06)}"/>
     <path d="M${n(size * 0.1)} ${n(size * 0.05)}L${n(size * 1.25)} ${n(size * 0.08)}" stroke="${stroke}" stroke-width="${n(size * 0.05)}" opacity=".55" fill="none"/>
   </g>`;

const PEPPERONI = (x, y, r) => `
  <g>
    <ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(r)}" ry="${n(r * 0.94)}" fill="#B3202F"/>
    <ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(r * 0.9)}" ry="${n(r * 0.84)}" fill="#CE3A45"/>
    <ellipse cx="${n(x - r * 0.2)}" cy="${n(y - r * 0.25)}" rx="${n(r * 0.45)}" ry="${n(r * 0.38)}" fill="#E05A5F" opacity=".75"/>
    ${[-0.4, 0.1, 0.5]
      .map(
        (offset, index) =>
          `<circle cx="${n(x + offset * r)}" cy="${n(y + (index - 1) * r * 0.5)}" r="${n(r * 0.11)}" fill="#8E1622" opacity=".7"/>`,
      )
      .join("")}
  </g>`;

const TOMATO_SLICE = (x, y, r) => `
  <g>
    <circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="#C62F35"/>
    <circle cx="${n(x)}" cy="${n(y)}" r="${n(r * 0.78)}" fill="#E05055"/>
    <circle cx="${n(x)}" cy="${n(y)}" r="${n(r * 0.5)}" fill="#EE7C74" opacity=".85"/>
    ${[0, 1, 2, 3, 4, 5]
      .map((i) => {
        const a = (i / 6) * Math.PI * 2;
        return `<ellipse cx="${n(x + Math.cos(a) * r * 0.42)}" cy="${n(y + Math.sin(a) * r * 0.42)}" rx="${n(r * 0.12)}" ry="${n(r * 0.07)}" fill="#F6D9A8" transform="rotate(${n((a * 180) / Math.PI)} ${n(x + Math.cos(a) * r * 0.42)} ${n(y + Math.sin(a) * r * 0.42)})"/>`;
      })
      .join("")}
  </g>`;

const CHEESE_DOLLOP = (x, y, r, fill = "#FBF3DC") =>
  `<path d="${blob(x, y, r, x + y, 0.24, 11)}" fill="${fill}"/>`;

const HAM_STRIP = (x, y, w, h, rotation) =>
  `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(rotation)})">
     <rect x="${n(-w / 2)}" y="${n(-h / 2)}" width="${n(w)}" height="${n(h)}" rx="${n(h / 2)}" fill="#E58C93"/>
     <rect x="${n(-w / 2)}" y="${n(-h / 2)}" width="${n(w)}" height="${n(h * 0.42)}" rx="${n(h / 4)}" fill="#F0A8AE" opacity=".8"/>
     <circle cx="${n(-w * 0.2)}" cy="${n(h * 0.1)}" r="${n(h * 0.12)}" fill="#D9737C" opacity=".7"/>
     <circle cx="${n(w * 0.22)}" cy="${n(-h * 0.12)}" r="${n(h * 0.1)}" fill="#D9737C" opacity=".7"/>
   </g>`;

const CHICKEN_CHUNK = (x, y, r, rotation = 0) => `
  <g transform="translate(${n(x)} ${n(y)}) rotate(${n(rotation)})">
    <path d="${blob(0, 0, r, x * 1.7 + y, 0.2, 10)}" fill="#E8C48D"/>
    <path d="${blob(-r * 0.2, -r * 0.2, r * 0.6, x + y * 1.3, 0.24, 9)}" fill="#F2D8AC" opacity=".8"/>
  </g>`;

const MUSHROOM = (x, y, size, rotation = 0) => `
  <g transform="translate(${n(x)} ${n(y)}) rotate(${n(rotation)})">
    <path d="M${n(-size)} ${n(size * 0.2)}C${n(-size)} ${n(-size * 0.7)} ${n(size)} ${n(-size * 0.7)} ${n(size)} ${n(size * 0.2)}Z" fill="#C9A579"/>
    <path d="M${n(-size * 0.85)} ${n(size * 0.18)}C${n(-size * 0.6)} ${n(-size * 0.35)} ${n(size * 0.6)} ${n(-size * 0.35)} ${n(size * 0.85)} ${n(size * 0.18)}Z" fill="#DCBE95"/>
    <rect x="${n(-size * 0.24)}" y="${n(size * 0.16)}" width="${n(size * 0.48)}" height="${n(size * 0.75)}" rx="${n(size * 0.16)}" fill="#EBD9BC"/>
  </g>`;

const PEAR_SLICE = (x, y, size, rotation) => `
  <g transform="translate(${n(x)} ${n(y)}) rotate(${n(rotation)})">
    <path d="M${n(-size * 1.25)} 0C${n(-size * 0.9)} ${n(-size * 0.8)} ${n(size * 0.9)} ${n(-size * 0.8)} ${n(size * 1.25)} 0C${n(size * 0.9)} ${n(size * 0.8)} ${n(-size * 0.9)} ${n(size * 0.8)} ${n(-size * 1.25)} 0Z" fill="#F0E2B6"/>
    <path d="M${n(-size * 0.95)} 0C${n(-size * 0.7)} ${n(-size * 0.5)} ${n(size * 0.7)} ${n(-size * 0.5)} ${n(size * 0.95)} 0C${n(size * 0.7)} ${n(size * 0.5)} ${n(-size * 0.7)} ${n(size * 0.5)} ${n(-size * 0.95)} 0Z" fill="#FBF3D8"/>
    <path d="M${n(-size * 0.6)} 0L${n(size * 0.6)} 0" stroke="#D9C489" stroke-width="${n(size * 0.1)}" opacity=".7"/>
  </g>`;

const OLIVE = (x, y, r) => `
  <g>
    <ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(r)}" ry="${n(r * 0.92)}" fill="#3F4A2E"/>
    <ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(r * 0.42)}" ry="${n(r * 0.38)}" fill="#8A5A3B"/>
    <ellipse cx="${n(x - r * 0.3)}" cy="${n(y - r * 0.35)}" rx="${n(r * 0.3)}" ry="${n(r * 0.2)}" fill="#7C8A5E" opacity=".6"/>
  </g>`;

const SUN_DRIED_TOMATO = (x, y, size, rotation) => `
  <g transform="translate(${n(x)} ${n(y)}) rotate(${n(rotation)})">
    <path d="${blob(0, 0, size, x + y * 2, 0.26, 10)}" fill="#9E2A24"/>
    <path d="${blob(-size * 0.15, -size * 0.1, size * 0.6, x * 2 + y, 0.3, 9)}" fill="#BE4133" opacity=".75"/>
  </g>`;

/* -------------------------------------------------------------------------- */
/*  Фоны и посуда                                                              */
/* -------------------------------------------------------------------------- */

const DEFS = `
<defs>
  <radialGradient id="bg" cx="50%" cy="38%" r="78%">
    <stop offset="0%" stop-color="#FFFDF8"/>
    <stop offset="55%" stop-color="#FBF6EC"/>
    <stop offset="100%" stop-color="#F2EADC"/>
  </radialGradient>
  <radialGradient id="board" cx="42%" cy="30%" r="80%">
    <stop offset="0%" stop-color="#FFFFFF"/>
    <stop offset="100%" stop-color="#F4EEE3"/>
  </radialGradient>
  <linearGradient id="steel" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#3A3A42"/>
    <stop offset="100%" stop-color="#1D1D22"/>
  </linearGradient>
  <filter id="paint" x="-8%" y="-8%" width="116%" height="116%">
    <feTurbulence type="fractalNoise" baseFrequency="0.014 0.019" numOctaves="3" seed="9" result="noise"/>
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="11" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <filter id="paintSoft" x="-8%" y="-8%" width="116%" height="116%">
    <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="4" result="noise"/>
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <filter id="soft" x="-30%" y="-60%" width="160%" height="220%">
    <feGaussianBlur stdDeviation="26"/>
  </filter>
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
</defs>`;

/** Живописный фон: тёплые вихри в духе «Звёздной ночи». */
function background(seed) {
  const strokes = [];
  for (let i = 0; i < 7; i += 1) {
    const cx = 120 + jitter(seed + i * 5) * 420 + (i % 3) * 380;
    const cy = 100 + jitter(seed + i * 7) * 260 + (i % 2) * 520;
    const turns = 1.5 + (i % 3) * 0.45;
    const rEnd = 120 + (i % 4) * 55;
    const points = [];
    for (let step = 0; step <= 90; step += 1) {
      const t = step / 90;
      const theta = t * turns * Math.PI * 2 + i;
      const radius = 6 + (rEnd - 6) * t;
      points.push(`${n(cx + Math.cos(theta) * radius)} ${n(cy + Math.sin(theta) * radius)}`);
    }
    const colors = ["#FFC800", "#FFBE1A", "#E0B071", "#E11D48", "#4D7C2F"];
    strokes.push(
      `<path d="M${points.join(" L")}" fill="none" stroke="${colors[i % colors.length]}" stroke-width="${n(7 + (i % 3) * 5)}" stroke-linecap="round" opacity="${(0.07 + (i % 4) * 0.02).toFixed(2)}"/>`,
    );
  }

  return `
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <g filter="url(#paint)">${strokes.join("")}</g>`;
}

/** Белая тарелка с мягкой тенью и кромкой — чтобы блюдо читалось на крафте. */
function plate(radius = 350, cy = CY) {
  return `
    <ellipse cx="${CX}" cy="${cy + radius * 0.78}" rx="${n(radius * 0.94)}" ry="${n(radius * 0.13)}" fill="#18181B" opacity=".20" filter="url(#soft)"/>
    <circle cx="${CX}" cy="${cy + 4}" r="${n(radius)}" fill="#CFC2AC" opacity=".55" filter="url(#soft)"/>
    <circle cx="${CX}" cy="${cy}" r="${n(radius)}" fill="#FFFFFF"/>
    <circle cx="${CX}" cy="${cy}" r="${n(radius)}" fill="none" stroke="#DCD0BC" stroke-width="3.5"/>
    <circle cx="${CX}" cy="${cy}" r="${n(radius * 0.88)}" fill="none" stroke="#EDE4D4" stroke-width="3"/>`;
}

/* -------------------------------------------------------------------------- */
/*  Блюда                                                                      */
/* -------------------------------------------------------------------------- */

/** «Леопардовые» подпалины на бортике — визитная карточка теста 72 ч. */
const CRUST_SPOTS = (radius, count, seed, cx = CX, cy = CY) =>
  Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + jitter(seed + i) * 0.4;
    const r = radius * (0.9 + 0.1 * jitter(seed + i * 3));
    const size = 9 + Math.abs(jitter(seed + i * 7)) * 12;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    return `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(size)}" ry="${n(size * 0.8)}" fill="#7A4A16" opacity=".7" transform="rotate(${n((angle * 180) / Math.PI)} ${n(x)} ${n(y)})"/>`;
  }).join("");

/**
 * Пицца: тесто 72 ч → «леопардовый» борт → соус → сыр → начинка.
 * `toppings` — готовая SVG-строка, `sauce`/`cheese` — цвета слоёв.
 */
function pizza({ seed = 3, sauce = "#C0392B", cheese = "#F3D98C", toppings = "", topRadius = 228 }) {
  const crustR = 312;
  const cheeseLayer = Array.from({ length: 9 }, (_, i) => {
    const points = scatter(9, topRadius * 0.86, seed + i * 13);
    const p = points[i];
    return CHEESE_DOLLOP(p.x, p.y, 30 + Math.abs(jitter(seed + i * 11)) * 26, i % 3 === 0 ? "#FDF6E4" : "#EBCB80");
  }).join("");

  return `
    ${plate(356)}
    <g filter="url(#paintSoft)">
      <path d="${blob(CX, CY, crustR, seed, 0.03, 30)}" fill="#D69C58"/>
      <path d="${blob(CX, CY, crustR * 0.93, seed + 5, 0.028, 28)}" fill="#EDC489"/>
      <path d="${blob(CX, CY, crustR * 0.85, seed + 8, 0.03, 26)}" fill="#F7DFB4"/>
      ${CRUST_SPOTS(crustR * 0.94, 26, seed + 2)}
      <path d="${blob(CX, CY, topRadius + 22, seed + 11, 0.05, 26)}" fill="${sauce}"/>
      <path d="${blob(CX, CY, topRadius + 4, seed + 17, 0.06, 24)}" fill="${cheese}"/>
      ${cheeseLayer}
    </g>
    <g filter="url(#paintSoft)">${toppings}</g>`;
}

function paintPizzaBySlug(slug, seed) {
  switch (slug) {
    case "pepperoni":
      return pizza({
        seed,
        toppings: scatter(11, 232, seed + 1)
          .map((p) => PEPPERONI(p.x, p.y, 46))
          .concat(
            scatter(4, 200, seed + 31).map((p, i) => LEAF(p.x, p.y, 34, i * 70, "#4D7C2F")),
          )
          .join(""),
      });

    case "margherita":
      return pizza({
        seed,
        sauce: "#C62F35",
        toppings: scatter(7, 218, seed + 5)
          .map((p) => TOMATO_SLICE(p.x, p.y, 44))
          .concat(scatter(7, 232, seed + 41).map((p, i) => LEAF(p.x, p.y, 40, i * 52 + 20, "#4D7C2F")))
          .concat(scatter(6, 200, seed + 61).map((p) => CHEESE_DOLLOP(p.x, p.y, 34, "#FFFCF2")))
          .join(""),
      });

    case "quattro-formaggi":
      return pizza({
        seed,
        sauce: "#F7EEDC",
        cheese: "#F2D79A",
        toppings: [
          ...scatter(6, 210, seed + 3).map((p) => CHEESE_DOLLOP(p.x, p.y, 52, "#FFFDF4")),
          ...scatter(5, 226, seed + 23).map((p) => CHEESE_DOLLOP(p.x, p.y, 44, "#D9DCC4")),
          ...scatter(5, 200, seed + 43).map((p) => CHEESE_DOLLOP(p.x, p.y, 38, "#F0D48F")),
          ...scatter(5, 236, seed + 63).map((p) => CHEESE_DOLLOP(p.x, p.y, 40, "#F5B93F")),
          ...scatter(4, 190, seed + 83).map((p, i) => LEAF(p.x, p.y, 26, i * 90, "#4D7C2F")),
        ].join(""),
      });

    case "pear-gorgonzola":
      return pizza({
        seed,
        sauce: "#FBF3E0",
        cheese: "#F6E7C4",
        toppings: [
          ...scatter(6, 218, seed + 7).map((p) => PEAR_SLICE(p.x, p.y, 52, (p.angle * 180) / Math.PI)),
          ...scatter(9, 226, seed + 27).map((p) => CHEESE_DOLLOP(p.x, p.y, 30, "#DCDCC6")),
          ...scatter(5, 195, seed + 47).map((p) => CHICKEN_CHUNK(p.x, p.y, 22, 20)),
          ...scatter(4, 215, seed + 67).map((p, i) => LEAF(p.x, p.y, 30, i * 76, "#4D7C2F")),
        ].join(""),
      });

    case "meat":
      return pizza({
        seed,
        toppings: [
          ...scatter(6, 224, seed + 2).map((p) => PEPPERONI(p.x, p.y, 44)),
          ...scatter(6, 208, seed + 22).map((p) => HAM_STRIP(p.x, p.y, 76, 30, (p.angle * 180) / Math.PI)),
          ...scatter(6, 228, seed + 42).map((p) => CHICKEN_CHUNK(p.x, p.y, 28, (p.angle * 180) / Math.PI)),
          ...scatter(3, 190, seed + 62).map((p, i) => LEAF(p.x, p.y, 28, i * 90, "#4D7C2F")),
        ].join(""),
      });

    case "stracciatella":
      return pizza({
        seed,
        sauce: "#F4EAD3",
        cheese: "#FBF1DA",
        toppings: [
          ...scatter(7, 216, seed + 4).map((p) => CHEESE_DOLLOP(p.x, p.y, 52, "#FFFDF6")),
          ...scatter(6, 228, seed + 24).map((p) => SUN_DRIED_TOMATO(p.x, p.y, 34, (p.angle * 180) / Math.PI)),
          ...scatter(9, 236, seed + 44).map((p, i) => LEAF(p.x, p.y, 40, i * 44, "#3F8F3F", "#2F6B2F")),
          ...scatter(4, 190, seed + 64).map((p) => CHICKEN_CHUNK(p.x, p.y, 16, 0)),
        ].join(""),
      });

    case "chicken-pizza":
      return pizza({
        seed,
        toppings: [
          ...scatter(9, 222, seed + 6).map((p) => CHICKEN_CHUNK(p.x, p.y, 34, (p.angle * 180) / Math.PI)),
          ...scatter(6, 210, seed + 26).map((p) => HAM_STRIP(p.x, p.y, 60, 22, (p.angle * 180) / Math.PI + 40)),
          ...scatter(6, 232, seed + 46).map((p, i) => LEAF(p.x, p.y, 30, i * 60, "#4D7C2F")),
        ].join(""),
      });

    default:
      return pizza({ seed, toppings: scatter(10, 220, seed + 1).map((p) => PEPPERONI(p.x, p.y, 44)).join("") });
  }
}

function paintCombo(seed) {
  const radius = 168;
  const centers = [
    { x: 388, y: 292, slug: "pepperoni" },
    { x: 812, y: 292, slug: "margherita" },
    { x: 388, y: 626, slug: "chicken-pizza" },
    { x: 812, y: 626, slug: "quattro-formaggi" },
  ];

  const minis = centers
    .map(({ x, y, slug }, index) => {
      const topping =
        slug === "pepperoni"
          ? scatter(6, radius * 0.6, seed + index * 17, x, y).map((p) => PEPPERONI(p.x, p.y, 24)).join("")
          : slug === "margherita"
            ? scatter(5, radius * 0.58, seed + index * 17, x, y).map((p) => TOMATO_SLICE(p.x, p.y, 22)).join("") +
              scatter(5, radius * 0.62, seed + index * 29, x, y).map((p, i) => LEAF(p.x, p.y, 22, i * 72, "#4D7C2F")).join("")
            : slug === "chicken-pizza"
              ? scatter(7, radius * 0.6, seed + index * 17, x, y).map((p) => CHICKEN_CHUNK(p.x, p.y, 20, (p.angle * 180) / Math.PI)).join("")
              : scatter(6, radius * 0.58, seed + index * 17, x, y).map((p) => CHEESE_DOLLOP(p.x, p.y, 26, "#FFFDF4")).join("");

      return `
        <g filter="url(#paintSoft)">
          <ellipse cx="${x}" cy="${n(y + radius * 0.72)}" rx="${n(radius * 0.86)}" ry="${n(radius * 0.14)}" fill="#18181B" opacity=".14" filter="url(#soft)"/>
          <path d="${blob(x, y, radius, seed + index * 5, 0.03, 26)}" fill="#DFA968"/>
          <path d="${blob(x, y, radius * 0.9, seed + index * 5 + 2, 0.03, 24)}" fill="#EFC88E"/>
          ${CRUST_SPOTS(radius * 0.95, 12, seed + index * 3, x, y)}
          <path d="${blob(x, y, radius * 0.76, seed + index * 7, 0.05, 22)}" fill="#C0392B"/>
          <path d="${blob(x, y, radius * 0.7, seed + index * 7 + 4, 0.06, 20)}" fill="#F3D98C"/>
        </g>
        ${topping}`;
    })
    .join("");

  return `
    <ellipse cx="${CX}" cy="${n(CY + 360)}" rx="470" ry="58" fill="#18181B" opacity=".16" filter="url(#soft)"/>
    <rect x="120" y="140" width="960" height="640" rx="60" fill="url(#steel)"/>
    <rect x="140" y="160" width="920" height="600" rx="48" fill="#2A2A31"/>
    ${minis}`;
}

function paintPasta(seed, { toppings }) {
  /* «Гнездо» из лент: длинные волны с нарастающей амплитудой, сложенные стопкой. */
  const ROWS = 15;
  const ribbons = Array.from({ length: ROWS }, (_, i) => {
    const t = i / (ROWS - 1);
    const y = CY - 158 + t * 306;
    const half = 232 * Math.sqrt(Math.max(0.12, 1 - Math.pow((t - 0.5) * 2, 2) * 0.62));
    const amp = 20 + (i % 4) * 9 + jitter(seed + i) * 6;
    const lift = jitter(seed + i * 3) * 16;

    const band = (offset, color, width) =>
      `<path d="M${n(CX - half)} ${n(y + offset)}C${n(CX - half * 0.45)} ${n(y - amp + offset)} ${n(CX + half * 0.45)} ${n(y + amp + offset)} ${n(CX + half)} ${n(y + offset)}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;

    return [
      band(lift + 7, "#DDB265", 22 + (i % 3) * 3),
      band(lift, i % 4 === 0 ? "#F8E1AB" : "#EFC886", 17 + (i % 3) * 3),
      band(lift - 5, "#FDF0CD", 6 + (i % 2) * 2),
    ].join("");
  }).join("");

  const sauce = Array.from({ length: 9 }, (_, i) => {
    const p = scatter(9, 150, seed + i * 9)[i];
    return CHEESE_DOLLOP(p.x, p.y, 40 + Math.abs(jitter(seed + i * 5)) * 26, i % 3 === 0 ? "#FDF7E6" : "#F5E7C8");
  }).join("");

  return `
    ${plate(340, CY + 20)}
    <g filter="url(#paintSoft)">
      <ellipse cx="${CX}" cy="${n(CY + 34)}" rx="256" ry="188" fill="#F3DCAE" opacity=".5"/>
      ${ribbons}
      ${sauce}
    </g>
    <g filter="url(#paintSoft)">${toppings}</g>`;
}

function paintSoup(seed, { liquid, garnish }) {
  const steam = [0, 1, 2]
    .map((i) => {
      const x = CX - 150 + i * 150;
      return `<path d="M${x} 190C${x + 40} 150 ${x - 40} 118 ${x} 78C${x + 34} 44 ${x - 10} 30 ${x + 4} 6" fill="none" stroke="#B9AE9C" stroke-width="9" stroke-linecap="round" opacity="${0.42 - i * 0.06}" filter="url(#paintSoft)"/>`;
    })
    .join("");

  const swirl = (() => {
    const points = [];
    for (let i = 0; i <= 80; i += 1) {
      const t = i / 80;
      const theta = t * Math.PI * 3.2;
      const radius = 8 + t * 138;
      points.push(`${n(CX + Math.cos(theta) * radius)} ${n(CY + Math.sin(theta) * radius * 0.94)}`);
    }
    return `<path d="M${points.join(" L")}" fill="none" stroke="#FFFDF6" stroke-width="16" stroke-linecap="round" opacity=".8"/>`;
  })();

  return `
    <ellipse cx="${CX}" cy="${n(CY + 260)}" rx="300" ry="46" fill="#18181B" opacity=".14" filter="url(#soft)"/>
    <g>${steam}</g>
    <g filter="url(#paintSoft)">
      <circle cx="${CX}" cy="${CY}" r="330" fill="url(#board)"/>
      <circle cx="${CX}" cy="${CY}" r="330" fill="none" stroke="#E7DFD1" stroke-width="3"/>
      <circle cx="${CX}" cy="${CY}" r="286" fill="none" stroke="#F0E9DC" stroke-width="3"/>
      <path d="${blob(CX, CY, 268, seed, 0.02, 26)}" fill="#EFE7D8"/>
    </g>
    <g filter="url(#paintSoft)">
      <path d="${blob(CX, CY, 252, seed + 4, 0.045, 24)}" fill="${liquid}"/>
      <path d="${blob(CX, CY + 8, 232, seed + 9, 0.05, 22)}" fill="${liquid}" opacity=".55"/>
      ${swirl}
    </g>
    <g filter="url(#paintSoft)">${garnish}</g>`;
}

function paintBreakfast(seed, variant) {
  const shared = `
    <path d="${blob(CX, CY, 348, seed, 0.028, 28)}" fill="url(#board)"/>
    <path d="${blob(CX, CY, 348, seed, 0.028, 28)}" fill="none" stroke="#E7DFD1" stroke-width="3"/>
    <path d="${blob(CX, CY, 300, seed + 3, 0.024, 26)}" fill="none" stroke="#F0E9DC" stroke-width="3"/>`;

  if (variant === "shakshuka") {
    const eggs = scatter(3, 130, seed + 7)
      .map(
        (p) =>
          `<path d="${blob(p.x, p.y, 62, p.x + p.y, 0.14, 12)}" fill="#FFFCF4" stroke="#E4D6BE" stroke-width="3"/><circle cx="${n(p.x + 4)}" cy="${n(p.y + 2)}" r="26" fill="#F0A81E"/><circle cx="${n(p.x - 4)}" cy="${n(p.y - 6)}" r="11" fill="#FBD37A" opacity=".8"/>`,
      )
      .join("");
    const herbs = scatter(10, 210, seed + 27)
      .map((p, i) => LEAF(p.x, p.y, 22, i * 40, "#3F8F3F", "#2F6B2F"))
      .join("");
    return `
      <ellipse cx="${CX}" cy="${n(CY + 280)}" rx="320" ry="48" fill="#18181B" opacity=".16" filter="url(#soft)"/>
      <g filter="url(#paintSoft)">
        <circle cx="${CX}" cy="${CY}" r="330" fill="url(#steel)"/>
        <circle cx="${CX}" cy="${CY}" r="300" fill="#2E2E35"/>
        <path d="${blob(CX, CY, 272, seed + 5, 0.05, 26)}" fill="#B7302C"/>
        <path d="${blob(CX, CY, 254, seed + 11, 0.06, 24)}" fill="#D2493A"/>
      </g>
      <g filter="url(#paintSoft)">${eggs}${herbs}</g>`;
  }

  if (variant === "italian") {
    const croissant = `
      <g transform="translate(${CX - 128} ${CY - 20}) rotate(-12)">
        <path d="M-190 40C-190 -40 -120 -86 -40 -78C-50 -30 -60 6 -46 46C-110 62 -160 66 -190 40Z" fill="#E0A855"/>
        <path d="M190 40C190 -40 120 -86 40 -78C50 -30 60 6 46 46C110 62 160 66 190 40Z" fill="#E0A855"/>
        <path d="M-46 -78C-16 -74 16 -74 46 -78C50 -30 60 6 46 46C16 56 -16 56 -46 46C-60 6 -50 -30 -46 -78Z" fill="#EDBB6C"/>
        ${[-30, 0, 30].map((x) => `<path d="M${x} -74C${x + 6} -30 ${x + 8} 6 ${x} 44" fill="none" stroke="#C98F3F" stroke-width="6" opacity=".55"/>`).join("")}
        <path d="${blob(-120, -10, 40, 12, 0.2, 10)}" fill="#FBF3DC"/>
      </g>`;
    const cup = `
      <g transform="translate(${CX + 168} ${CY + 24})">
        <ellipse cx="0" cy="122" rx="118" ry="26" fill="#18181B" opacity=".14" filter="url(#soft)"/>
        <path d="M-96 -70H96L82 100C78 122 -78 122 -82 100Z" fill="#FFFDF8" stroke="#E7DFD1" stroke-width="3"/>
        <ellipse cx="0" cy="-70" rx="96" ry="30" fill="#6B4630"/>
        <ellipse cx="0" cy="-74" rx="80" ry="22" fill="#C79A6B" opacity=".9"/>
        <path d="${blob(0, -74, 46, 33, 0.22, 10)}" fill="#F3E3C9"/>
        <path d="M96 -30C150 -34 158 40 100 48" fill="none" stroke="#E7DFD1" stroke-width="16" stroke-linecap="round"/>
        <path d="M-34 -140C6 -164 -30 -186 6 -212" fill="none" stroke="#B9AE9C" stroke-width="9" stroke-linecap="round" opacity=".4" filter="url(#paintSoft)"/>
      </g>`;
    const greens = scatter(8, 240, seed + 31)
      .map((p, i) => LEAF(p.x - 60, p.y + 120, 26, i * 46, "#3F8F3F", "#2F6B2F"))
      .join("");
    return `${shared}${croissant}${cup}${greens}`;
  }

  /* english breakfast */
  const eggs = `
    <g transform="translate(${CX - 120} ${CY - 78})">
      <path d="${blob(0, 0, 108, 21, 0.15, 14)}" fill="#FFFCF4" stroke="#E4D6BE" stroke-width="3.5"/>
      <path d="${blob(-6, -4, 88, 27, 0.12, 12)}" fill="#FFFDF8" stroke="#EDE0C9" stroke-width="3"/>
      <circle cx="6" cy="4" r="42" fill="#F0A81E"/>
      <circle cx="-4" cy="-6" r="17" fill="#FBD37A" opacity=".8"/>
    </g>`;
  const sausages = `
    <g transform="translate(${CX + 130} ${CY - 110}) rotate(-16)">
      <rect x="-150" y="-26" width="300" height="52" rx="26" fill="#B4663C"/>
      <rect x="-140" y="-20" width="280" height="20" rx="10" fill="#C97C4C" opacity=".85"/>
      ${[-110, -40, 30, 100].map((x) => `<path d="M${x} -24L${x + 14} 24" stroke="#8E4C2A" stroke-width="6" opacity=".5"/>`).join("")}
    </g>
    <g transform="translate(${CX + 150} ${CY + 10}) rotate(8)">
      <rect x="-120" y="-22" width="240" height="44" rx="22" fill="#A85B33"/>
      <rect x="-112" y="-16" width="224" height="16" rx="8" fill="#C97C4C" opacity=".8"/>
    </g>`;
  const beans = scatter(16, 90, seed + 13, CX - 150, CY + 130)
    .map((p) => `<ellipse cx="${n(p.x)}" cy="${n(p.y)}" rx="26" ry="17" fill="#9A5A31" transform="rotate(${n((p.angle * 180) / Math.PI)} ${n(p.x)} ${n(p.y)})"/><ellipse cx="${n(p.x - 6)}" cy="${n(p.y - 4)}" rx="14" ry="7" fill="#B87B4B" opacity=".7" transform="rotate(${n((p.angle * 180) / Math.PI)} ${n(p.x)} ${n(p.y)})"/>`)
    .join("");
  const toast = `
    <g transform="translate(${CX + 128} ${CY + 128}) rotate(-8)">
      <rect x="-104" y="-92" width="208" height="184" rx="34" fill="#D9A15C"/>
      <rect x="-92" y="-80" width="184" height="160" rx="28" fill="#EBBE7C"/>
      <path d="${blob(0, 0, 62, 55, 0.2, 11)}" fill="#FFF3D2" opacity=".85"/>
    </g>`;
  const tomato = `
    <g transform="translate(${CX - 250} ${CY + 150})">
      <circle cx="0" cy="0" r="62" fill="#C62F35"/>
      <circle cx="0" cy="0" r="46" fill="#E05055"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = (i / 8) * Math.PI * 2; return `<ellipse cx="${n(Math.cos(a) * 26)}" cy="${n(Math.sin(a) * 26)}" rx="10" ry="6" fill="#F6D9A8"/>`; }).join("")}
    </g>`;

  return `${shared}${eggs}${sausages}${beans}${toast}${tomato}`;
}

function paintSide(seed, variant) {
  if (variant === "fries" || variant === "wedges") {
    const isFries = variant === "fries";
    const sticks = scatter(isFries ? 22 : 11, 190, seed + 3)
      .map((p, i) => {
        const rot = (p.angle * 180) / Math.PI + jitter(seed + i * 5) * 26;
        if (isFries) {
          return `<g transform="translate(${n(p.x)} ${n(p.y - 40)}) rotate(${n(rot)})"><rect x="-16" y="-120" width="32" height="240" rx="12" fill="${i % 3 === 0 ? "#F2C14E" : "#EFB63C"}"/><rect x="-16" y="-120" width="12" height="240" rx="6" fill="#FBD87F" opacity=".7"/></g>`;
        }
        return `<g transform="translate(${n(p.x)} ${n(p.y - 20)}) rotate(${n(rot)})"><path d="M-52 66C-56 -6 -30 -78 0 -96C30 -78 56 -6 52 66Z" fill="#E8A94A"/><path d="M-40 60C-44 -4 -22 -64 0 -80C22 -64 44 -4 40 60Z" fill="#F3C468"/><path d="M-30 54C-34 0 -16 -50 0 -64C16 -50 34 0 30 54Z" fill="#F7D68E" opacity=".8"/></g>`;
      })
      .join("");

    const carton = isFries
      ? `<g transform="translate(${CX} ${CY + 96})">
           <ellipse cx="0" cy="212" rx="230" ry="36" fill="#18181B" opacity=".15" filter="url(#soft)"/>
           <path d="M-208 -60H208L168 200C164 220 -164 220 -168 200Z" fill="#C62F35"/>
           <path d="M-208 -60H208L196 10H-196Z" fill="#E11D48"/>
           <path d="M-40 -60H40L30 200H-30Z" fill="#FFFDF8" opacity=".9"/>
           <path d="M-14 -50H14L10 190H-10Z" fill="#C62F35" opacity=".55"/>
         </g>`
      : `<g transform="translate(${CX} ${CY + 120})">
           <ellipse cx="0" cy="188" rx="220" ry="34" fill="#18181B" opacity=".15" filter="url(#soft)"/>
           <path d="${blob(0, 60, 210, seed + 9, 0.08, 20)}" fill="#FFFDF8"/>
           <path d="${blob(0, 60, 210, seed + 9, 0.08, 20)}" fill="none" stroke="#E7DFD1" stroke-width="3"/>
         </g>`;

    return `${carton}<g filter="url(#paintSoft)">${sticks}</g>`;
  }

  /* наггетсы и сырные палочки */
  const isNuggets = variant === "nuggets";
  const pieces = scatter(6, 168, seed + 5)
    .map((p, i) => {
      const rot = (p.angle * 180) / Math.PI + jitter(seed + i * 7) * 20;
      if (isNuggets) {
        return `<g transform="translate(${n(p.x)} ${n(p.y)}) rotate(${n(rot)})">
            <path d="${blob(0, 0, 84, p.x + p.y, 0.16, 11)}" fill="#D89A45"/>
            <path d="${blob(-4, -6, 68, p.x + p.y * 1.3, 0.18, 10)}" fill="#EDBB6C"/>
            <path d="${blob(-10, -14, 40, p.x * 1.4 + p.y, 0.22, 9)}" fill="#F7D89B" opacity=".8"/>
          </g>`;
      }
      return `<g transform="translate(${n(p.x)} ${n(p.y)}) rotate(${n(rot)})">
          <rect x="-118" y="-40" width="236" height="80" rx="24" fill="#D89A45"/>
          <rect x="-110" y="-32" width="220" height="64" rx="20" fill="#EFBE70"/>
          <path d="${blob(0, 6, 42, p.x + p.y, 0.18, 10)}" fill="#FFFDF4"/>
          <path d="M46 34C60 70 96 84 128 74" fill="none" stroke="#FFFDF4" stroke-width="22" stroke-linecap="round" opacity=".9"/>
        </g>`;
    })
    .join("");

  const dip = `
    <g transform="translate(${CX + 290} ${CY + 250})">
      <ellipse cx="0" cy="70" rx="120" ry="22" fill="#18181B" opacity=".14" filter="url(#soft)"/>
      <path d="M-104 -50H104L88 62C84 78 -84 78 -88 62Z" fill="#FFFDF8" stroke="#E7DFD1" stroke-width="3"/>
      <ellipse cx="0" cy="-50" rx="104" ry="30" fill="#C62F35"/>
      <ellipse cx="0" cy="-54" rx="86" ry="22" fill="#E05055" opacity=".8"/>
    </g>`;

  return `
    <ellipse cx="${CX}" cy="${n(CY + 280)}" rx="330" ry="48" fill="#18181B" opacity=".14" filter="url(#soft)"/>
    <path d="${blob(CX, CY + 20, 340, seed, 0.03, 26)}" fill="url(#board)"/>
    <path d="${blob(CX, CY + 20, 340, seed, 0.03, 26)}" fill="none" stroke="#E7DFD1" stroke-width="3"/>
    <g filter="url(#paintSoft)">${pieces}</g>${dip}`;
}

function paintDrink(seed, variant) {
  const palette = {
    mors: { liquid: "#8E1B3A", top: "#B32548", fruit: "#5E1029" },
    kompot: { liquid: "#C57A2A", top: "#E0A24A", fruit: "#8E5320" },
    cola: { liquid: "#4A2413", top: "#6B3A20", fruit: "#2A1409" },
  }[variant] ?? { liquid: "#8E1B3A", top: "#B32548", fruit: "#5E1029" };

  const bubbles = scatter(16, 116, seed + 3, CX + 4, CY + 20)
    .map((p) => `<circle cx="${n(p.x)}" cy="${n(p.y)}" r="${n(5 + Math.abs(jitter(seed + p.x)) * 11)}" fill="#FFFDF8" opacity="${(0.18 + Math.abs(jitter(seed + p.y)) * 0.3).toFixed(2)}"/>`)
    .join("");

  const fruits = variant === "cola"
    ? scatter(4, 90, seed + 11).map((p) => `<rect x="${n(p.x - 34)}" y="${n(p.y - 34)}" width="68" height="68" rx="14" fill="#FFFDF8" opacity=".28" transform="rotate(${n((p.angle * 180) / Math.PI)} ${n(p.x)} ${n(p.y)})"/>`).join("")
    : scatter(9, 110, seed + 11).map((p) => `<circle cx="${n(p.x)}" cy="${n(p.y)}" r="${n(20 + Math.abs(jitter(seed + p.x)) * 12)}" fill="${palette.fruit}" opacity=".85"/>`).join("");

  return `
    <ellipse cx="${CX}" cy="${n(CY + 382)}" rx="250" ry="42" fill="#18181B" opacity=".18" filter="url(#soft)"/>
    <g filter="url(#paintSoft)">
      <path d="M${CX - 40} 116C${CX - 40} 74 ${CX + 40} 74 ${CX + 40} 116L${CX + 40} 158H${CX - 40}Z" fill="#2A2A31"/>
      <rect x="${CX - 26}" y="70" width="52" height="60" rx="14" fill="#3A3A42"/>
      <path d="M${CX - 196} 190C${CX - 216} 320 ${CX - 206} 560 ${CX - 190} 706C${CX - 180} 780 ${CX + 180} 780 ${CX + 190} 706C${CX + 206} 560 ${CX + 216} 320 ${CX + 196} 190C${CX + 150} 158 ${CX - 150} 158 ${CX - 196} 190Z" fill="#EDF3F2" opacity=".55"/>
      <path d="M${CX - 186} 210C${CX - 200} 340 ${CX - 194} 556 ${CX - 180} 690C${CX - 172} 748 ${CX + 172} 748 ${CX + 180} 690C${CX + 194} 556 ${CX + 200} 340 ${CX + 186} 210C${CX + 144} 186 ${CX - 144} 186 ${CX - 186} 210Z" fill="${palette.liquid}"/>
      <path d="M${CX - 176} 236C${CX - 188} 350 ${CX - 182} 540 ${CX - 172} 660C${CX - 166} 706 ${CX - 60} 720 ${CX - 40} 700L${CX - 40} 214C${CX - 100} 206 ${CX - 150} 212 ${CX - 176} 236Z" fill="${palette.top}" opacity=".55"/>
      <ellipse cx="${CX}" cy="200" rx="176" ry="42" fill="${palette.top}"/>
      ${bubbles}${fruits}
      <path d="M${CX - 150} 300C${CX - 164} 420 ${CX - 160} 560 ${CX - 152} 640" fill="none" stroke="#FFFDF8" stroke-width="14" stroke-linecap="round" opacity=".35"/>
      <rect x="${CX - 120}" y="600" width="240" height="120" rx="20" fill="#FFFDF8" opacity=".92"/>
      <text x="${CX}" y="676" text-anchor="middle" font-family="Georgia, serif" font-size="58" fill="#18181B" opacity=".8">1 L</text>
    </g>
    <g filter="url(#paintSoft)">
      ${scatter(4, 300, seed + 31, CX, CY + 320).map((p, i) => LEAF(p.x, p.y, 40, i * 88, "#4D7C2F")).join("")}
    </g>`;
}

/* -------------------------------------------------------------------------- */
/*  Сборка                                                                     */
/* -------------------------------------------------------------------------- */

const RECIPES = {
  pepperoni: (seed) => paintPizzaBySlug("pepperoni", seed),
  margherita: (seed) => paintPizzaBySlug("margherita", seed),
  "quattro-formaggi": (seed) => paintPizzaBySlug("quattro-formaggi", seed),
  "pear-gorgonzola": (seed) => paintPizzaBySlug("pear-gorgonzola", seed),
  meat: (seed) => paintPizzaBySlug("meat", seed),
  stracciatella: (seed) => paintPizzaBySlug("stracciatella", seed),
  "chicken-pizza": (seed) => paintPizzaBySlug("chicken-pizza", seed),
  "combo-4-pizza": (seed) => paintCombo(seed),

  "fettuccine-chicken-mushroom": (seed) =>
    paintPasta(seed, {
      toppings: [
        ...scatter(7, 168, seed + 5).map((p) => CHICKEN_CHUNK(p.x, p.y, 34, (p.angle * 180) / Math.PI)),
        ...scatter(7, 190, seed + 25).map((p) => MUSHROOM(p.x, p.y, 30, (p.angle * 180) / Math.PI)),
        ...scatter(4, 150, seed + 45).map((p, i) => LEAF(p.x, p.y, 24, i * 90, "#4D7C2F")),
      ].join(""),
    }),
  carbonara: (seed) =>
    paintPasta(seed, {
      toppings: [
        ...scatter(8, 170, seed + 7).map((p) => HAM_STRIP(p.x, p.y, 78, 26, (p.angle * 180) / Math.PI)),
        ...scatter(8, 150, seed + 27).map((p) => CHEESE_DOLLOP(p.x, p.y, 22, "#F6E3B4")),
        ...scatter(6, 180, seed + 47).map((p) => `<circle cx="${n(p.x)}" cy="${n(p.y)}" r="5" fill="#2A2A31" opacity=".7"/>`),
      ].join(""),
    }),

  "english-breakfast": (seed) => paintBreakfast(seed, "english"),
  shakshuka: (seed) => paintBreakfast(seed, "shakshuka"),
  "italian-breakfast": (seed) => paintBreakfast(seed, "italian"),

  "mushroom-soup": (seed) =>
    paintSoup(seed, {
      liquid: "#C9A87A",
      garnish: [
        ...scatter(6, 150, seed + 5).map((p) => MUSHROOM(p.x, p.y, 34, (p.angle * 180) / Math.PI)),
        ...scatter(5, 180, seed + 25).map((p, i) => LEAF(p.x, p.y, 24, i * 72, "#3F8F3F", "#2F6B2F")),
      ].join(""),
    }),
  "lentil-soup": (seed) =>
    paintSoup(seed, {
      liquid: "#D08A34",
      garnish: [
        ...scatter(22, 190, seed + 9).map((p) => `<circle cx="${n(p.x)}" cy="${n(p.y)}" r="${n(9 + Math.abs(jitter(seed + p.x)) * 6)}" fill="#B06A22" opacity=".85"/>`),
        ...scatter(5, 170, seed + 29).map((p, i) => LEAF(p.x, p.y, 24, i * 72, "#3F8F3F", "#2F6B2F")),
      ].join(""),
    }),
  "pumpkin-soup": (seed) =>
    paintSoup(seed, {
      liquid: "#E08A28",
      garnish: [
        ...scatter(14, 170, seed + 11).map((p) => `<ellipse cx="${n(p.x)}" cy="${n(p.y)}" rx="${n(11)}" ry="${n(7)}" fill="#F6E4C0" transform="rotate(${n((p.angle * 180) / Math.PI)} ${n(p.x)} ${n(p.y)})"/>`),
        ...scatter(6, 140, seed + 31).map((p) => `<path d="${blob(p.x, p.y, 16, p.x + p.y, 0.3, 9)}" fill="#7A5A22"/>`),
      ].join(""),
    }),
  "caesar-chicken": (seed) => {
    const croutons = scatter(9, 180, seed + 13)
      .map((p) => `<rect x="${n(p.x - 26)}" y="${n(p.y - 26)}" width="52" height="52" rx="12" fill="#E0B071" transform="rotate(${n((p.angle * 180) / Math.PI)} ${n(p.x)} ${n(p.y)})"/>`)
      .join("");
    const chicken = scatter(7, 150, seed + 33).map((p) => CHICKEN_CHUNK(p.x, p.y, 36, (p.angle * 180) / Math.PI)).join("");
    const leaves = Array.from({ length: 22 }, (_, i) => {
      const angle = i * 1.4;
      const radius = 40 + (i % 7) * 30;
      return LEAF(CX + Math.cos(angle) * radius, CY + Math.sin(angle) * radius * 0.8, 46, (angle * 180) / Math.PI + 30, i % 2 === 0 ? "#4E9B3A" : "#3F8F3F", "#2F6B2F");
    }).join("");
    return `
      <ellipse cx="${CX}" cy="${n(CY + 268)}" rx="300" ry="46" fill="#18181B" opacity=".14" filter="url(#soft)"/>
      <g filter="url(#paintSoft)">
        <circle cx="${CX}" cy="${CY}" r="330" fill="url(#board)"/>
        <circle cx="${CX}" cy="${CY}" r="330" fill="none" stroke="#E7DFD1" stroke-width="3"/>
        ${leaves}${chicken}${croutons}
        ${scatter(9, 210, seed + 53).map((p) => CHEESE_DOLLOP(p.x, p.y, 18, "#F6E3B4")).join("")}
      </g>`;
  },
  "greek-salad": (seed) => {
    const cubes = scatter(7, 160, seed + 15)
      .map((p) => `<rect x="${n(p.x - 40)}" y="${n(p.y - 34)}" width="80" height="68" rx="10" fill="#FFFDF8" transform="rotate(${n((p.angle * 180) / Math.PI)} ${n(p.x)} ${n(p.y)})"/><rect x="${n(p.x - 34)}" y="${n(p.y - 28)}" width="68" height="56" rx="8" fill="#F4F1E6" transform="rotate(${n((p.angle * 180) / Math.PI)} ${n(p.x)} ${n(p.y)})"/>`)
      .join("");
    const olives = scatter(7, 210, seed + 35).map((p) => OLIVE(p.x, p.y, 26)).join("");
    const veg = scatter(9, 190, seed + 55)
      .map((p, i) =>
        i % 2 === 0
          ? `<circle cx="${n(p.x)}" cy="${n(p.y)}" r="46" fill="#4E9B3A"/><circle cx="${n(p.x)}" cy="${n(p.y)}" r="34" fill="#7BC24E" opacity=".8"/>`
          : TOMATO_SLICE(p.x, p.y, 44),
      )
      .join("");
    return `
      <ellipse cx="${CX}" cy="${n(CY + 268)}" rx="300" ry="46" fill="#18181B" opacity=".14" filter="url(#soft)"/>
      <g filter="url(#paintSoft)">
        <circle cx="${CX}" cy="${CY}" r="330" fill="url(#board)"/>
        <circle cx="${CX}" cy="${CY}" r="330" fill="none" stroke="#E7DFD1" stroke-width="3"/>
        ${veg}${olives}${cubes}
      </g>`;
  },

  fries: (seed) => paintSide(seed, "fries"),
  "potato-wedges": (seed) => paintSide(seed, "wedges"),
  nuggets: (seed) => paintSide(seed, "nuggets"),
  "cheese-sticks": (seed) => paintSide(seed, "cheese-sticks"),

  "mors-1l": (seed) => paintDrink(seed, "mors"),
  "kompot-1l": (seed) => paintDrink(seed, "kompot"),
  "cola-1l": (seed) => paintDrink(seed, "cola"),
};

/** Фолбэк по категории — если появится новое блюдо без рецепта. */
const CATEGORY_FALLBACK = {
  pizza: (seed) => paintPizzaBySlug("default", seed),
  pasta: (seed) => paintPasta(seed, { toppings: scatter(8, 170, seed + 3).map((p) => CHICKEN_CHUNK(p.x, p.y, 34, 0)).join("") }),
  breakfast: (seed) => paintBreakfast(seed, "english"),
  soups: (seed) => paintSoup(seed, { liquid: "#C9A87A", garnish: scatter(6, 160, seed + 3).map((p, i) => LEAF(p.x, p.y, 26, i * 60, "#3F8F3F")).join("") }),
  sides: (seed) => paintSide(seed, "nuggets"),
  drinks: (seed) => paintDrink(seed, "mors"),
  combo: (seed) => paintCombo(seed),
};

function buildSvg(dish, index) {
  const seed = index * 17 + 3;
  const painter = RECIPES[dish.id] ?? CATEGORY_FALLBACK[dish.category] ?? CATEGORY_FALLBACK.pizza;
  const art = painter(seed);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${DEFS}
${background(seed + 5)}
<g filter="url(#paint)">${art}</g>
<rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.05" style="mix-blend-mode:multiply"/>
<rect width="${W}" height="${H}" fill="none" stroke="#18181B" stroke-opacity="0.04" stroke-width="4"/>
</svg>`;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  let total = 0;
  for (const [index, dish] of DISHES.entries()) {
    const svg = buildSvg(dish, index);
    const buffer = await sharp(Buffer.from(svg))
      .resize(1200, 900, { fit: "cover" })
      .webp({ quality: 88, effort: 5 })
      .toBuffer();

    const target = resolve(OUT_DIR, `${dish.id}.webp`);
    await writeFile(target, buffer);
    total += buffer.length;
    console.log(`✓ ${dish.id.padEnd(30)} ${(buffer.length / 1024).toFixed(0)} КБ`);
  }

  console.log(`\nГотово: ${DISHES.length} изображений, ${(total / 1024 / 1024).toFixed(2)} МБ → public/images/dishes/`);
}

await main();
