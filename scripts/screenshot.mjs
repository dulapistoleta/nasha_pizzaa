/**
 * Визуальная проверка страницы: полные скриншоты в десктопном
 * и мобильном вьюпорте + отчёт об ошибках в консоли браузера.
 *
 * Запуск: node scripts/screenshot.mjs [url] [outDir]
 */

import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const URL = process.argv[2] ?? "http://localhost:3100";
const OUT = resolve(ROOT, process.argv[3] ?? ".screens");

const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 1000, deviceScaleFactor: 1 },
  { name: "mobile", width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
];

async function main() {
  await mkdir(OUT, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    userDataDir: resolve(ROOT, ".chrome-profile"),
    args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--font-render-hinting=none"],
  });

  for (const viewport of VIEWPORTS) {
    const page = await browser.newPage();
    const problems = [];
    page.on("console", (message) => {
      if (message.type() === "error" || message.type() === "warning") {
        problems.push(`[${message.type()}] ${message.text()}`);
      }
    });
    page.on("pageerror", (error) => problems.push(`[pageerror] ${error.message}`));
    page.on("requestfailed", (request) =>
      problems.push(`[requestfailed] ${request.url()} — ${request.failure()?.errorText}`),
    );

    await page.setViewport(viewport);
    await page.goto(URL, { waitUntil: "networkidle0", timeout: 90_000 });

    /* Даём анимациям появления отработать и подгружаем ленивые картинки. */
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 220));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 600));
    });

    const metrics = await page.evaluate(() => ({
      height: document.body.scrollHeight,
      width: document.body.scrollWidth,
      viewport: window.innerWidth,
      horizontalOverflow: document.body.scrollWidth > window.innerWidth + 1,
      images: Array.from(document.images).map((img) => ({
        src: img.currentSrc || img.src,
        loaded: img.complete && img.naturalWidth > 0,
      })),
      sections: Array.from(document.querySelectorAll("section[id]")).map((s) => s.id),
      cards: document.querySelectorAll("article").length,
    }));

    const failed = metrics.images.filter((image) => !image.loaded);
    const file = resolve(OUT, `${viewport.name}.png`);
    await page.screenshot({ path: file, fullPage: true });

    console.log(`\n=== ${viewport.name} (${viewport.width}×${viewport.height}) ===`);
    console.log(`высота страницы: ${metrics.height}px, ширина: ${metrics.width}px`);
    console.log(`горизонтальный оверфлоу: ${metrics.horizontalOverflow ? "ДА ⚠️" : "нет"}`);
    console.log(`секции: ${metrics.sections.join(", ")}`);
    console.log(`карточек блюд: ${metrics.cards}`);
    console.log(`изображений: ${metrics.images.length}, не загрузилось: ${failed.length}`);
    failed.slice(0, 8).forEach((image) => console.log(`   ✗ ${image.src}`));
    console.log(`проблемы консоли: ${problems.length}`);
    [...new Set(problems)].slice(0, 12).forEach((problem) => console.log(`   ! ${problem}`));
    console.log(`скриншот: ${file}`);

    await page.close();
  }

  await browser.close();
}

await main();
