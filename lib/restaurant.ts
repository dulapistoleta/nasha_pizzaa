/**
 * Реальные данные заведения «Наша пицца» (Астана).
 * Единый источник правды для шапки, контактов, футера и WhatsApp-заказа.
 */

const WHATSAPP_DIGITS = "77779475252";

function twoGisLink(): string {
  const query = encodeURIComponent("Наша пицца Мәңгілік Ел 52 блок В2 Астана");
  return `https://2gis.kz/astana/search/${query}`;
}

function woltLink(): string {
  /* Страница заведения, а не поиск: так гость попадает сразу в меню. */
  return "https://wolt.com/ru/kaz/nur-sultan/restaurant/nasha-pizza-mangilik-el";
}

function yandexEdaLink(): string {
  return "https://eda.yandex.kz/ru-kz/astana/r/nasha_picca_prospekt_sakena_sejfullina_470?placeSlug=nasha_picca_prospekt_mangilik_el_52";
}

export const RESTAURANT = {
  name: "Наша пицца",
  tagline: "Настоящая итальянская",
  city: "Астана",
  district: "район Есиль",
  addressShort: "Мәңгілік Ел, 52 блок В2",
  addressFull:
    "г. Астана, район Есиль, проспект Мәңгілік Ел, 52 блок В2 (ЖК «Promenade Expo»)",
  hours: {
    open: "10:00",
    close: "22:00",
    label: "Открыто ежедневно 10:00–22:00",
    short: "Ежедневно 10:00–22:00",
  },
  /** Часовой пояс Астаны — для честного статуса «Открыто/Закрыто». */
  timeZone: "Asia/Almaty",
  phones: [
    { label: "+7 (777) 947-52-52", tel: "+77779475252", primary: true },
    { label: "+7 (707) 777-96-50", tel: "+77077779650", primary: false },
  ],
  whatsapp: {
    digits: WHATSAPP_DIGITS,
    display: "+7 (777) 947-52-52",
    link: (text?: string) =>
      `https://wa.me/${WHATSAPP_DIGITS}${text ? `?text=${encodeURIComponent(text)}` : ""}`,
  },
  links: {
    twoGis: twoGisLink(),
    wolt: woltLink(),
    yandexEda: yandexEdaLink(),
  },
  /** Ключевые УТП заведения. */
  oven: {
    /** Температура выпечки, °C. */
    temperature: 457,
    /** Время выпечки, секунд. */
    seconds: 90,
    /** Время ферментации теста, часов. */
    fermentationHours: 72,
  },
  story:
    "Мы печём неаполитанскую пиццу на тесте 72-часовой ферментации: пышные «леопардовые» бортики, лёгкость и никакой тяжести после ужина. Стена с росписью в духе Ван Гога, летняя терраса на Мәңгілік Ел и дровяная печь на 457 °C — за этим и приходят в «Нашу пиццу».",
} as const;

export type Restaurant = typeof RESTAURANT;
