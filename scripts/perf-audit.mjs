/**
 * Аудит производительности на мобильном профиле.
 *
 * Снимает метрики, которые реально влияют на «плавность»: FPS при скролле,
 * длинные задачи в главном потоке, сдвиги макета (CLS), вес JS, количество
 * узлов DOM и число постоянно анимируемых элементов.
 *
 * Запуск: node scripts/perf-audit.mjs [url] [--json]
 */

import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TARGET = process.argv[2] ?? "http://localhost:3200";
const AS_JSON = process.argv.includes("--json");

const CHROME =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

/* Мобильный профиль: средний Android + throttling, как в Lighthouse. */
const MOBILE = {
  viewport: { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  cpuThrottle: 4,
};

async function audit(browser) {
  const page = await browser.newPage();
  const client = await page.createCDPSession();

  /* Точный вес ответов: у чанков Next нет content-length, поэтому считаем
     encodedDataLength из CDP и раскладываем по типам ресурсов. */
  const transfer = { js: 0, css: 0, font: 0, img: 0, html: 0, other: 0 };
  const requestType = new Map();
  /* Прогревочный заход (очистка localStorage) в статистику не входит. */
  let counting = false;

  await client.send("Network.enable");
  /* Без этого повторные прогоны берут ресурсы из кэша и вес показывается нулевым. */
  await client.send("Network.setCacheDisabled", { cacheDisabled: true });
  client.on("Network.responseReceived", ({ requestId, type, response }) => {
    requestType.set(requestId, { type, url: response.url });
  });
  client.on("Network.loadingFinished", ({ requestId, encodedDataLength }) => {
    if (!counting) return;
    const meta = requestType.get(requestId);
    if (!meta) return;
    const bucket =
      meta.type === "Script" ? "js"
      : meta.type === "Stylesheet" ? "css"
      : meta.type === "Font" ? "font"
      : meta.type === "Image" ? "img"
      : meta.type === "Document" ? "html"
      : "other";
    transfer[bucket] += encodedDataLength;
  });

  /* Чистим хранилище: состояние корзины из прошлых прогонов меняет картину. */
  await page.goto(new globalThis.URL(TARGET).origin, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.evaluate(() => window.localStorage.clear());


  await page.setViewport(MOBILE.viewport);
  await page.emulateCPUThrottling(MOBILE.cpuThrottle);

  /* Считаем сдвиги макета и длинные задачи до начала взаимодействия. */
  await page.evaluateOnNewDocument(() => {
    window.__audit = { cls: 0, longTasks: [], shifts: [] };

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          window.__audit.cls += entry.value;
          window.__audit.shifts.push({
            value: Number(entry.value.toFixed(4)),
            sources: entry.sources?.map((s) => s.node?.className?.toString?.().slice(0, 60) ?? "?"),
          });
        }
      }
    }).observe({ type: "layout-shift", buffered: true });

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__audit.longTasks.push(Number(entry.duration.toFixed(1)));
      }
    }).observe({ type: "longtask", buffered: true });
  });

  counting = true;
  const started = Date.now();
  await page.goto(TARGET, { waitUntil: "networkidle0", timeout: 120_000 });
  const loadMs = Date.now() - started;

  const paint = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const fcp = performance.getEntriesByName("first-contentful-paint")[0];
    return {
      domContentLoaded: Math.round(nav?.domContentLoadedEventEnd ?? 0),
      load: Math.round(nav?.loadEventEnd ?? 0),
      fcp: Math.round(fcp?.startTime ?? 0),
    };
  });

  /* Прогреваем ленивые изображения и заодно даём сработать reveal-анимациям. */
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 160));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 800));
  });

  /* Стоимость скролла меряем по времени главного потока (CDP Performance),
     а не по rAF: в headless кадры идут фиксированным тайтлом и FPS врёт. */
  await client.send("Performance.enable");
  const readCpu = async () => {
    const { metrics } = await client.send("Performance.getMetrics");
    return Object.fromEntries(metrics.map((m) => [m.name, m.value]));
  };

  const cpuBefore = await readCpu();
  const scrollStarted = Date.now();

  await page.evaluate(
    () =>
      new Promise((resolve) => {
        let y = 0;
        const max = document.body.scrollHeight - window.innerHeight;
        const step = () => {
          y += 48;
          window.scrollTo(0, y);
          if (y < max) setTimeout(step, 16);
          else setTimeout(resolve, 250);
        };
        step();
      }),
  );

  const scrollSeconds = (Date.now() - scrollStarted) / 1000;
  const cpuAfter = await readCpu();

  const delta = (key) => (cpuAfter[key] ?? 0) - (cpuBefore[key] ?? 0);
  const cpu = {
    seconds: Number(scrollSeconds.toFixed(2)),
    taskSeconds: Number(delta("TaskDuration").toFixed(3)),
    scriptSeconds: Number(delta("ScriptDuration").toFixed(3)),
    layoutSeconds: Number(delta("LayoutDuration").toFixed(3)),
    styleSeconds: Number(delta("RecalcStyleDuration").toFixed(3)),
    layoutCount: Math.round(delta("LayoutCount")),
    recalcStyleCount: Math.round(delta("RecalcStyleCount")),
  };
  cpu.mainThreadBusyPercent = Number(((cpu.taskSeconds / scrollSeconds) * 100).toFixed(1));
  /* Сколько кадров 60 Гц потеряно бы из-за занятости главного потока. */
  cpu.droppedFramesEstimate = Math.round(cpu.taskSeconds * 60);

  const metrics = await page.metrics();
  const auditData = await page.evaluate(() => {
    const animated = Array.from(document.querySelectorAll("*")).filter((el) => {
      const style = getComputedStyle(el);
      return style.animationName !== "none" && style.animationIterationCount === "infinite";
    });

    return {
      cls: Number(window.__audit.cls.toFixed(4)),
      shifts: window.__audit.shifts.slice(0, 6),
      longTasks: window.__audit.longTasks,
      domNodes: document.querySelectorAll("*").length,
      infiniteAnimations: animated.length,
      animatedSample: animated.slice(0, 8).map((el) => el.className?.toString?.().slice(0, 70)),
      fixedLayers: Array.from(document.querySelectorAll("*")).filter((el) => {
        const style = getComputedStyle(el);
        return (
          (style.position === "fixed" || style.position === "sticky") &&
          (style.backdropFilter !== "none" || style.filter !== "none" || style.mixBlendMode !== "normal")
        );
      }).length,
    };
  });

  await page.close();

  const longTasksTotal = auditData.longTasks.reduce((s, d) => s + d, 0);

  return {
    url: TARGET,
    loadMs,
    paint,
    cpu,
    cls: auditData.cls,
    clsShifts: auditData.shifts,
    longTasks: { count: auditData.longTasks.length, totalMs: Number(longTasksTotal.toFixed(1)) },
    dom: {
      nodes: auditData.domNodes,
      jsHeapMB: Number(((metrics.JSHeapUsedSize ?? 0) / 1024 / 1024).toFixed(1)),
      layoutCount: metrics.LayoutCount,
      recalcStyleCount: metrics.RecalcStyleCount,
    },
    css: {
      infiniteAnimations: auditData.infiniteAnimations,
      animatedSample: auditData.animatedSample,
      expensiveFixedLayers: auditData.fixedLayers,
    },
    transferKB: Object.fromEntries(
      Object.entries(transfer).map(([k, v]) => [k, Math.round(v / 1024)]),
    ),
  };
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    userDataDir: resolve(ROOT, ".chrome-profile"),
    args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--font-render-hinting=none"],
  });

  const result = await audit(browser);
  await browser.close();

  if (AS_JSON) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(`\n═══ Аудит производительности (мобильный профиль, CPU ×${MOBILE.cpuThrottle}) ═══`);
  console.log(`URL: ${result.url}\n`);

  console.log("СКОРОСТЬ ЗАГРУЗКИ");
  console.log(`  FCP:                  ${result.paint.fcp} мс`);
  console.log(`  DOMContentLoaded:     ${result.paint.domContentLoaded} мс`);
  console.log(`  load:                 ${result.paint.load} мс`);

  console.log("\nСТОИМОСТЬ СКРОЛЛА (главный поток)");
  console.log(`  длительность:         ${result.cpu.seconds} с`);
  console.log(`  занятость потока:     ${result.cpu.mainThreadBusyPercent}%  ← ключевая метрика`);
  console.log(`  задача / скрипт:      ${result.cpu.taskSeconds} с / ${result.cpu.scriptSeconds} с`);
  console.log(`  layout / style:       ${result.cpu.layoutSeconds} с / ${result.cpu.styleSeconds} с`);
  console.log(`  layout / recalc всего:${result.cpu.layoutCount} / ${result.cpu.recalcStyleCount}`);
  console.log(`  потерянных кадров:    ~${result.cpu.droppedFramesEstimate} (при 60 Гц)`);

  console.log("\nГЛАВНЫЙ ПОТОК");
  console.log(`  длинных задач:        ${result.longTasks.count}, суммарно ${result.longTasks.totalMs} мс`);

  console.log("\nСТАБИЛЬНОСТЬ МАКЕТА");
  console.log(`  CLS:                  ${result.cls}`);
  result.clsShifts.forEach((s) => console.log(`     · ${s.value} — ${s.sources?.join(", ")}`));

  console.log("\nDOM И ПАМЯТЬ");
  console.log(`  узлов DOM:            ${result.dom.nodes}`);
  console.log(`  JS heap:              ${result.dom.jsHeapMB} МБ`);
  console.log(`  layout / recalcStyle: ${result.dom.layoutCount} / ${result.dom.recalcStyleCount}`);

  console.log("\nАНИМАЦИИ");
  console.log(`  бесконечных анимаций: ${result.css.infiniteAnimations}`);
  result.css.animatedSample.forEach((s) => console.log(`     · ${s}`));
  console.log(`  «дорогих» fixed/sticky слоёв (blur/filter/blend): ${result.css.expensiveFixedLayers}`);

  console.log("\nПЕРЕДАНО ПО СЕТИ (КБ, без сжатия)");
  console.log(
    `  JS ${result.transferKB.js} · CSS ${result.transferKB.css} · шрифты ${result.transferKB.font} · картинки ${result.transferKB.img} · HTML ${result.transferKB.html}`,
  );
  console.log("");
}

await main();
