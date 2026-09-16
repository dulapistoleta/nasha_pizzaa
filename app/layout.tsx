import type { Metadata, Viewport } from "next";
import { Caveat, Manrope, Playfair_Display } from "next/font/google";
import { RESTAURANT } from "@/lib/restaurant";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

/* Только реально используемое начертание: все заголовки и цены набраны
   font-black (900). 600/700/800 не использовались, но каждое начертание —
   это отдельный файл шрифта в двух подмножествах. */
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  weight: ["900"],
  display: "swap",
});

/* Одно начертание вместо трёх: маркерные надписи везде идут весом 700
   (см. утилиту `font-marker` в globals.css). */
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin", "cyrillic"],
  weight: ["700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Наша пицца — неаполитанская пицца в Астане | Печь 457 °C, тесто 72 ч",
    template: "%s · Наша пицца",
  },
  description:
    "Крафтовая неаполитанская пиццерия «Наша пицца» в Астане: тесто 72 часа ферментации, печь 457 °C, итальянская моцарелла и halal-начинки. Мәңгілік Ел, 52 блок В2. Ежедневно 10:00–22:00.",
  keywords: [
    "пицца Астана",
    "неаполитанская пицца",
    "Наша пицца",
    "Мәңгілік Ел 52",
    "пиццерия Есиль",
    "halal пицца Астана",
    "доставка пиццы Астана",
  ],
  authors: [{ name: RESTAURANT.name }],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    title: "Наша пицца — искусство неаполитанской пиццы в Астане",
    description:
      "Тесто 72 часа ферментации, печь 457 °C за 90 секунд, итальянская моцарелла и halal-начинки. Заказ в WhatsApp, Wolt и Яндекс Еда.",
    siteName: RESTAURANT.name,
  },
  twitter: {
    card: "summary_large_image",
    title: "Наша пицца — неаполитанская пицца в Астане",
    description: "Печь 457 °C, тесто 72 ч, halal-начинки. Мәңгілік Ел, 52 блок В2.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FAF7F2",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${playfair.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
