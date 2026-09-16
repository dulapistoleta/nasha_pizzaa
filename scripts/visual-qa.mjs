/**
 * Точечная визуальная проверка: скриншоты ключевых состояний интерфейса
 * (герой, карточки, каталог, модальное окно блюда, корзина, атмосфера, контакты).
 *
 * Запуск: node scripts/visual-qa.mjs [url] [outDir]
 */

import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const URL = process.argv[2] ?? "http://localhost:3100";
const OUT = resolve(ROOT, process.argv[3] ?? ".screens");

const CHROME =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const DESKTOP = { width: 1440, height: 950, deviceScaleFactor: 1 };
const MOBILE = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function shoot(page, name) {
  const file = resolve(OUT, `${name}.png`);
  await page.screenshot({ path: file });
  console.log(`  → ${name}.png`);
}

async function scrollToSection(page, selector) {
  await page.evaluate((sel) => {
    const node = document.querySelector(sel);
    if (!node) return;
    const top = node.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top, behavior: "instant" });
  }, selector);
  await wait(900);
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    userDataDir: resolve(ROOT, ".chrome-profile"),
    args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--font-render-hinting=none"],
  });

  const problems = [];
  const page = await browser.newPage();
  page.on("pageerror", (error) => problems.push(`[pageerror] ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") problems.push(`[console] ${message.text()}`);
  });

  /* ---------------- Десктоп ---------------- */
  await page.setViewport(DESKTOP);
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 90_000 });
  await wait(1200);

  console.log("desktop:");
  await shoot(page, "d1-hero");

  await scrollToSection(page, "#top-picks");
  await wait(500);
  await shoot(page, "d2-top-picks");

  /* Модальное окно блюда */
  await page.evaluate(() => {
    const card = document.querySelector("#top-picks article");
    const button = card?.querySelector("button[aria-label^='Открыть описание']");
    button?.click();
  });
  await wait(1100);
  await shoot(page, "d3-dish-modal");
  await page.keyboard.press("Escape");
  await wait(600);

  /* Карточка крупным планом */
  const card = await page.$("#top-picks article");
  if (card) {
    await card.screenshot({ path: resolve(OUT, "d4-card.png") });
    console.log("  → d4-card.png");
  }

  /* Корзина с товарами */
  await page.evaluate(() => {
    const adds = Array.from(document.querySelectorAll("#top-picks article button")).filter((b) =>
      b.textContent?.includes("В корзину"),
    );
    adds[0]?.click();
    adds[1]?.click();
  });
  await wait(500);
  await page.evaluate(() => {
    const header = document.querySelector("header");
    const cart = Array.from(header?.querySelectorAll("button") ?? []).find((b) =>
      b.getAttribute("aria-label")?.startsWith("Корзина"),
    );
    cart?.click();
  });
  await wait(1100);
  await shoot(page, "d5-cart");
  await page.keyboard.press("Escape");
  await wait(600);

  /* Фильтр категории */
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll("[role='tab']"));
    const pasta = tabs.find((t) => t.textContent?.includes("Паста"));
    pasta?.click();
  });
  await wait(1400);
  await shoot(page, "d6-filtered-pasta");

  await scrollToSection(page, "#atmosphere");
  await wait(900);
  await shoot(page, "d7-atmosphere");

  await scrollToSection(page, "#contacts");
  await wait(900);
  await shoot(page, "d8-contacts");

  await page.close();

  /* ---------------- Мобильный ---------------- */
  const mobile = await browser.newPage();
  mobile.on("pageerror", (error) => problems.push(`[mobile pageerror] ${error.message}`));
  await mobile.setViewport(MOBILE);
  await mobile.goto(URL, { waitUntil: "networkidle0", timeout: 90_000 });
  await wait(1200);

  console.log("mobile:");
  await shoot(mobile, "m1-hero");

  await scrollToSection(mobile, "#top-picks");
  await wait(600);
  await shoot(mobile, "m2-top-picks");

  await mobile.evaluate(() => {
    const card = document.querySelector("#top-picks article");
    card?.querySelector("button[aria-label^='Открыть описание']")?.click();
  });
  await wait(1100);
  await shoot(mobile, "m3-dish-modal");
  await mobile.keyboard.press("Escape");
  await wait(500);

  await mobile.evaluate(() => {
    const adds = Array.from(document.querySelectorAll("#top-picks article button")).filter((b) =>
      b.textContent?.includes("В корзину"),
    );
    adds[0]?.click();
  });
  await wait(500);
  await mobile.evaluate(() => {
    const header = document.querySelector("header");
    const cart = Array.from(header?.querySelectorAll("button") ?? []).find((b) =>
      b.getAttribute("aria-label")?.startsWith("Корзина"),
    );
    cart?.click();
  });
  await wait(1100);
  await shoot(mobile, "m4-cart");

  await mobile.close();
  await browser.close();

  console.log(`\nпроблем в консоли: ${problems.length}`);
  [...new Set(problems)].forEach((problem) => console.log(`  ! ${problem}`));
}

await main();
