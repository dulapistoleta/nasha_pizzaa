import type { Metadata } from "next";
import { LegalShell } from "@/components/legal/LegalShell";
import { LegalList, LegalPage, LegalSection } from "@/components/legal/legal-ui";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Cookie и локальное хранилище",
  description:
    "Что сайт «Наша пицца» хранит в браузере гостя, зачем, на какой срок и как это отключить.",
  robots: { index: true, follow: true },
};

export default function CookiesPage() {
  return (
    <LegalShell>
      <LegalPage
        current="/cookies"
        title="Cookie и локальное хранилище"
        lead="Коротко: рекламных cookie и трекеров на сайте нет. В браузере хранится только то, без чего не работает корзина, — и ваш выбор по этому документу."
      >
        <LegalSection n={1} title="Что такое cookie и локальное хранилище">
          <p>
            Это небольшие записи, которые сайт оставляет в вашем браузере. Cookie передаются на
            сервер при каждом запросе, а локальное хранилище (localStorage) остаётся только у вас в
            браузере и на сервер не отправляется. Наш сайт использует именно локальное хранилище.
          </p>
        </LegalSection>

        <LegalSection n={2} title="Что именно хранится">
          <div className="overflow-hidden rounded-2xl border border-line">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-milk/70 text-xs uppercase tracking-wide text-ink-50">
                <tr>
                  <th className="px-4 py-3 font-bold">Ключ</th>
                  <th className="px-4 py-3 font-bold">Зачем</th>
                  <th className="px-4 py-3 font-bold">Срок</th>
                </tr>
              </thead>
              <tbody>
                {LEGAL.storage.map((row) => (
                  <tr key={row.key} className="border-t border-line align-top">
                    <td className="px-4 py-3 font-mono text-xs text-graphite">{row.key}</td>
                    <td className="px-4 py-3 text-ink-70">{row.purpose}</td>
                    <td className="px-4 py-3 text-ink-50">{row.ttl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Данные банковских карт, пароли и документы сайт не хранит: оплата на сайте не
            принимается, регистрации и личного кабинета нет.
          </p>
        </LegalSection>

        <LegalSection n={3} title="Чего на сайте нет">
          <LegalList
            items={[
              "рекламных cookie и пикселей (Google Ads, Meta Pixel и подобных);",
              "систем веб-аналитики (Google Analytics, Яндекс Метрика и других) — на момент публикации документа они не подключены;",
              "сторонних cookie: встраиваемых карт, чатов поддержки и виджетов соцсетей;",
              "передачи ваших данных рекламным сетям.",
            ]}
          />
        </LegalSection>

        <LegalSection n={4} title="Ваш выбор">
          <LegalList
            items={[
              "при первом заходе баннер предлагает три равнозначных варианта: принять все, оставить только необходимые или настроить категории;",
              "необязательные категории по умолчанию выключены, заранее ничего не отмечено;",
              "изменить решение можно в любой момент — кнопка «Настройки cookie» в подвале сайта;",
              "отказ от необязательных категорий не ограничивает работу сайта и оформление заказа.",
            ]}
          />
        </LegalSection>

        <LegalSection n={5} title="Как удалить данные">
          <LegalList
            items={[
              "кнопка «Очистить корзину» в корзине удаляет состав заказа;",
              "полностью убрать записи сайта можно в настройках браузера: раздел с данными сайтов → удалить данные для этого сайта;",
              "в режиме инкогнито данные удаляются автоматически при закрытии окна.",
            ]}
          />
        </LegalSection>

        <LegalSection n={6} title="Если появятся аналитика или реклама">
          <p>
            Если заведение подключит аналитику или рекламные инструменты, они будут загружаться
            только после вашего согласия — до нажатия кнопки в баннере никакие сторонние скрипты не
            запускаются. Документ будет обновлён, а решение можно будет изменить в настройках.
          </p>
        </LegalSection>

        <LegalSection n={7} title="Изменения документа">
          <p>
            Действующая редакция — {LEGAL.version} от {LEGAL.updated}. Дата и версия указаны в начале
            страницы.
          </p>
        </LegalSection>
      </LegalPage>
    </LegalShell>
  );
}
