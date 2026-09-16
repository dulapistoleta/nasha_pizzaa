import Link from "next/link";
import type { ReactNode } from "react";
import { LEGAL } from "@/lib/legal";

/** Шапка юридической страницы: заголовок, редакция, оглавление документов. */
export function LegalPage({
  title,
  lead,
  current,
  children,
}: {
  title: string;
  lead: string;
  /** href текущего документа — чтобы не подсвечивать его в списке как ссылку. */
  current: string;
  children: ReactNode;
}) {
  return (
    <section className="relative pb-16 pt-8 sm:pb-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <span className="font-marker text-lg text-tomato">документы заведения</span>
        <h1 className="mt-1 font-display text-3xl font-black leading-tight text-graphite sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-50">{lead}</p>
        <p className="mt-2 text-xs text-ink-30">
          Редакция {LEGAL.version} · обновлено {LEGAL.updated}
        </p>

        <nav aria-label="Юридические документы" className="mt-5 flex flex-wrap gap-2">
          {LEGAL.docs.map((doc) =>
            doc.href === current ? (
              <span
                key={doc.href}
                aria-current="page"
                className="rounded-xl bg-sun px-3 py-2 text-xs font-extrabold text-graphite"
              >
                {doc.short}
              </span>
            ) : (
              <Link
                key={doc.href}
                href={doc.href}
                className="rounded-xl border border-graphite/10 bg-cream px-3 py-2 text-xs font-bold text-graphite transition hover:border-graphite/30 hover:bg-sun-soft"
              >
                {doc.short}
              </Link>
            ),
          )}
        </nav>

        {!LEGAL.requisitesReady ? (
          <p className="mt-5 rounded-2xl border border-dashed border-graphite/20 bg-cream/70 p-4 text-xs leading-relaxed text-ink-50">
            <strong className="font-bold text-graphite">Реквизиты продавца заполняются.</strong> Поля
            с прочерками — шаблон: наименование, БИН/ИИН, юридический адрес, почта для обращений и
            ответственное лицо за обработку персональных данных указываются после заключения
            договора с заведением.
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-8 rounded-4xl border border-line bg-white p-6 shadow-card sm:p-8">
          {children}
        </div>

        <RequisitesBlock />
      </div>
    </section>
  );
}

/** Раздел документа. */
export function LegalSection({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-black text-graphite">
        <span className="mr-2 text-ink-30">{n}.</span>
        {title}
      </h2>
      <div className="flex flex-col gap-2 text-sm leading-relaxed text-ink-70">{children}</div>
    </section>
  );
}

/** Маркированный список внутри раздела. */
export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item, index) => (
        <li key={index} className="flex gap-2">
          <span aria-hidden className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-sun-deep" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Реквизиты продавца и контакты — блок в конце каждого документа. */
export function RequisitesBlock() {
  const rows: Array<[string, string]> = [
    ["Продавец", LEGAL.seller.name],
    ["БИН/ИИН", LEGAL.seller.bin],
    ["Юридический адрес", LEGAL.seller.address],
    ["Адрес заведения", LEGAL.contact.address],
    ["Телефон", LEGAL.contact.phoneLabel],
    ["WhatsApp", LEGAL.contact.whatsappLabel],
    ["Почта для обращений", LEGAL.contact.email],
    ["Ответственный за персональные данные", LEGAL.seller.responsible],
    ["Часы работы", LEGAL.contact.hours],
  ];

  return (
    <section className="mt-8 rounded-4xl border border-line bg-cream/70 p-6">
      <h2 className="font-display text-lg font-black text-graphite">Реквизиты и контакты</h2>
      <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-ink-50">{label}</dt>
            <dd className="font-semibold text-graphite">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
