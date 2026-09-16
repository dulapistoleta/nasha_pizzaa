import { AppShell } from "@/components/AppShell";
import { DISHES, TOP_PICKS } from "@/lib/menu-data";
import { RESTAURANT } from "@/lib/restaurant";
import { escapeJsonForHtml } from "@/lib/sanitize";

/** Структурированные данные для поисковиков. */
function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: RESTAURANT.name,
    description:
      "Крафтовая неаполитанская пиццерия: тесто 72 часа ферментации, печь 457 °C, halal-начинки.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "проспект Мәңгілік Ел, 52 блок В2",
      addressLocality: "Астана",
      addressRegion: "район Есиль",
      addressCountry: "KZ",
    },
    telephone: RESTAURANT.phones.map((phone) => phone.tel),
    servesCuisine: ["Итальянская", "Неаполитанская пицца"],
    priceRange: "₸₸",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: RESTAURANT.hours.open,
        closes: RESTAURANT.hours.close,
      },
    ],
    hasMenu: {
      "@type": "Menu",
      hasMenuSection: TOP_PICKS.map((dish) => ({
        "@type": "MenuItem",
        name: dish.name,
        description: dish.description,
        offers: { "@type": "Offer", price: dish.price, priceCurrency: "KZT" },
      })),
    },
    /* В разметке первого экрана списка блюд больше нет (он появляется по
       клику на категорию), поэтому полное меню отдаём поисковикам здесь. */
    makesOffer: DISHES.map((dish) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Product", name: dish.name },
      price: dish.price,
      priceCurrency: "KZT",
    })),
  };

  return (
    <script
      type="application/ld+json"
      /* Данные статичны, но экранируем: `</script>` внутри строки иначе
         разорвал бы тег и открыл вектор XSS. */
      dangerouslySetInnerHTML={{ __html: escapeJsonForHtml(JSON.stringify(jsonLd)) }}
    />
  );
}

export default function HomePage() {
  return (
    <>
      <StructuredData />
      <AppShell />
    </>
  );
}
