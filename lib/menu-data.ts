import type { Category, Dish, DishBadge } from "@/types/menu";

/**
 * Моковые данные меню «Наша пицца».
 *
 * Цены и позиции из блока «Топ выбор» — реальные.
 * Позиции с флагом `demo: true` добавлены, чтобы категории
 * «Паста», «Пицца» и «Супы & Салаты» не выглядели пустыми.
 *
 * БЖУ и граммовки — демонстрационные, уточняются у технолога.
 * Изображения лежат в `/public/images/dishes/[slug].webp`:
 * достаточно заменить файл с тем же именем на реальное 4K-фото.
 */

/* -------------------------------------------------------------------------- */
/*  Категории                                                                  */
/* -------------------------------------------------------------------------- */

export const CATEGORIES: Category[] = [
  { id: "top", label: "Топ выбор", emoji: "⭐", hint: "Восемь позиций, которые мы советуем" },
  { id: "pizza", label: "Пицца", emoji: "🍕", hint: "Неаполитанская пицца из печи 457 °C" },
  { id: "pasta", label: "Паста", emoji: "🍝", hint: "Свежая паста с соусами на заказ" },
  { id: "breakfast", label: "Завтраки", emoji: "🍳", hint: "Завтраки ежедневно с 10:00" },
  { id: "soups", label: "Супы & Салаты", emoji: "🥣", hint: "Супы утренней варки и свежие салаты" },
  { id: "sides", label: "Закуски / Сайды", emoji: "🍟", hint: "Хрустящие закуски к пицце" },
  { id: "combo", label: "Комбо сеты", emoji: "🎁", hint: "Сеты для компании и семьи" },
  { id: "drinks", label: "Напитки", emoji: "🥤", hint: "Домашние морсы, компоты и лимонады" },
];

/* -------------------------------------------------------------------------- */
/*  Бейджи                                                                     */
/* -------------------------------------------------------------------------- */

const BADGE_OVEN: DishBadge = { label: "457 °C", tone: "tomato", icon: "flame" };
const BADGE_HALAL: DishBadge = { label: "Halal", tone: "basil", icon: "halal" };
const BADGE_VEG: DishBadge = { label: "Вегетарианская", tone: "basil", icon: "leaf" };

/* -------------------------------------------------------------------------- */
/*  Технология приготовления                                                   */
/* -------------------------------------------------------------------------- */

const TECH_PIZZA =
  "Тесто после 72 часов холодной ферментации раскатываем вручную, добавляем соус и начинку — и отправляем в дровяную печь на 457 °C ровно на 90 секунд. Отсюда пышный «леопардовый» борт, тонкое хрустящее дно и лёгкость, с которой пицца усваивается.";

const TECH_PASTA =
  "Пасту отвариваем аль денте под заказ и соединяем с соусом на сковороде — так соус обволакивает каждую ленту, а не остаётся на дне тарелки.";

const TECH_BREAKFAST =
  "Готовим с открытия, каждое утро: яйца на сквороде, свежая зелень и горячий напиток в комплекте. Подаём до 13:00.";

const TECH_SOUP =
  "Варим небольшими партиями каждое утро на овощном бульоне, без загустителей и концентратов. Подаём с хлебом из печи.";

const TECH_SIDE =
  "Обжариваем во фритюре при 180 °C до золотистой корочки и сразу подаём — с соусом на выбор.";

const TECH_DRINK =
  "Готовим сами: ягоды и фрукты, минимум сахара, никаких концентратов. Наливаем в литровую бутыль.";

const TECH_COMBO =
  "Четыре пиццы 30 см из печи 457 °C в одной коробке-сете. Идеально на компанию 4–6 человек — выгоднее, чем заказывать по одной.";

/* -------------------------------------------------------------------------- */
/*  Меню                                                                       */
/* -------------------------------------------------------------------------- */

export const DISHES: Dish[] = [
  /* ---------------------------- ТОП ВЫБОР (8) ---------------------------- */
  {
    id: "pepperoni",
    name: "Пицца «Пепперони»",
    shortName: "Пепперони",
    category: "pizza",
    description:
      "Говяжья пепперони, моцарелла, томатный соус. Хит нашего меню.",
    composition: [
      "Тесто 72 ч ферментации",
      "Томатный соус из томатов San Marzano",
      "Моцарелла итальянская",
      "Говяжья пепперони (halal)",
      "Орегано, оливковое масло",
    ],
    price: 3690,
    badges: [{ label: "Хит меню", tone: "sun", icon: "star" }, BADGE_OVEN, BADGE_HALAL],
    nutrition: { weight: 520, kcal: 1180, protein: 52, fat: 44, carbs: 138 },
    technology: TECH_PIZZA,
    isTop: true,
    topRank: 1,
    spicy: true,
    allergens: ["Глютен", "Лактоза"],
  },
  {
    id: "margherita",
    name: "Пицца «Маргарита»",
    shortName: "Маргарита",
    category: "pizza",
    description:
      "Томатный соус, итальянская моцарелла, оливковое масло, базилик. Классика Неаполя.",
    composition: [
      "Тесто 72 ч ферментации",
      "Томатный соус",
      "Моцарелла итальянская",
      "Свежий базилик",
      "Оливковое масло extra virgin",
    ],
    price: 2890,
    badges: [{ label: "Классика", tone: "sun", icon: "chef" }, BADGE_OVEN, BADGE_VEG],
    nutrition: { weight: 470, kcal: 980, protein: 42, fat: 30, carbs: 136 },
    technology: TECH_PIZZA,
    isTop: true,
    topRank: 2,
    vegetarian: true,
    allergens: ["Глютен", "Лактоза"],
  },
  {
    id: "quattro-formaggi",
    name: "Пицца «4 Сыра»",
    shortName: "4 Сыра",
    category: "pizza",
    description:
      "Моцарелла, горгондзола, пармезан, голландский сыр, белый соус. Любимец сыроманов.",
    composition: [
      "Тесто 72 ч ферментации",
      "Белый сливочный соус",
      "Моцарелла итальянская",
      "Горгондзола",
      "Пармезан 12 месяцев",
      "Голландский сыр",
    ],
    price: 3690,
    badges: [{ label: "Любимец сыроманов", tone: "sun", icon: "chef" }, BADGE_OVEN, BADGE_VEG],
    nutrition: { weight: 500, kcal: 1240, protein: 56, fat: 58, carbs: 126 },
    technology: TECH_PIZZA,
    isTop: true,
    topRank: 3,
    vegetarian: true,
    allergens: ["Глютен", "Лактоза"],
  },
  {
    id: "pear-gorgonzola",
    name: "Пицца «Груша с горгондзолой»",
    shortName: "Груша с горгондзолой",
    category: "pizza",
    description:
      "Сладкая груша, пикантная горгондзола, сливочный соус. Шеф-выбор нашего повара.",
    composition: [
      "Тесто 72 ч ферментации",
      "Сливочный соус",
      "Груша конференция",
      "Горгондзола",
      "Моцарелла итальянская",
      "Грецкий орех, мёд",
    ],
    price: 3990,
    badges: [{ label: "Шеф-выбор", tone: "sun", icon: "chef" }, BADGE_OVEN, BADGE_VEG],
    nutrition: { weight: 490, kcal: 1120, protein: 44, fat: 46, carbs: 128 },
    technology: TECH_PIZZA,
    isTop: true,
    topRank: 4,
    vegetarian: true,
    allergens: ["Глютен", "Лактоза", "Орехи"],
  },
  {
    id: "meat",
    name: "Пицца «Мясная»",
    shortName: "Мясная",
    category: "pizza",
    description:
      "Говяжья ветчина, пепперони, куриное филе, соус, сыр. Самая сытная в меню.",
    composition: [
      "Тесто 72 ч ферментации",
      "Томатный соус",
      "Говяжья ветчина (halal)",
      "Говяжья пепперони (halal)",
      "Куриное филе",
      "Моцарелла итальянская",
    ],
    price: 4090,
    badges: [{ label: "Сытная", tone: "sun", icon: "flame" }, BADGE_OVEN, BADGE_HALAL],
    nutrition: { weight: 620, kcal: 1390, protein: 68, fat: 54, carbs: 146 },
    technology: TECH_PIZZA,
    isTop: true,
    topRank: 5,
    allergens: ["Глютен", "Лактоза"],
  },
  {
    id: "stracciatella",
    name: "Пицца «Со страчателлой и вялеными томатами»",
    shortName: "Со страчателлой",
    category: "pizza",
    description:
      "Нежная страчателла, свежая руккола, вяленые томаты. Премиальная позиция меню.",
    composition: [
      "Тесто 72 ч ферментации",
      "Белый соус",
      "Страчателла",
      "Вяленые томаты",
      "Свежая руккола",
      "Кедровый орех, бальзамик",
    ],
    price: 4190,
    badges: [{ label: "Премиум", tone: "sun", icon: "star" }, BADGE_OVEN, BADGE_VEG],
    nutrition: { weight: 510, kcal: 1080, protein: 46, fat: 40, carbs: 124 },
    technology: TECH_PIZZA,
    isTop: true,
    topRank: 6,
    vegetarian: true,
    allergens: ["Глютен", "Лактоза", "Орехи"],
  },
  {
    id: "fettuccine-chicken-mushroom",
    name: "Паста «Фетучини с курицей и грибами»",
    shortName: "Фетучини с курицей",
    category: "pasta",
    description:
      "Сливочный соус, нежное филе птицы, шампиньоны. Тёплая классика на каждый день.",
    composition: [
      "Фетучини аль денте",
      "Сливочный соус",
      "Куриное филе",
      "Шампиньоны",
      "Пармезан",
      "Тимьян",
    ],
    price: 3090,
    badges: [{ label: "Хит", tone: "sun", icon: "star" }, { label: "Halal", tone: "basil", icon: "halal" }],
    nutrition: { weight: 380, kcal: 720, protein: 34, fat: 28, carbs: 78 },
    technology: TECH_PASTA,
    isTop: true,
    topRank: 7,
    allergens: ["Глютен", "Лактоза"],
  },
  {
    id: "combo-4-pizza",
    name: "Сет «КОМБО 4 пиццы»",
    shortName: "КОМБО 4 пиццы",
    category: "combo",
    description:
      "Пепперони, Маргарита, С курицей, 4 сыра. Выгода для компании — четыре пиццы 30 см.",
    composition: [
      "Пицца «Пепперони» 30 см",
      "Пицца «Маргарита» 30 см",
      "Пицца «С курицей» 30 см",
      "Пицца «4 Сыра» 30 см",
      "Соус на выбор",
    ],
    price: 12990,
    badges: [
      { label: "Выгода компании", tone: "sun", icon: "percent" },
      { label: "4 пиццы 30 см", tone: "graphite", icon: "gift" },
      BADGE_OVEN,
    ],
    nutrition: { weight: 1900, kcal: 4600, protein: 200, fat: 170, carbs: 520 },
    technology: TECH_COMBO,
    isTop: true,
    topRank: 8,
    allergens: ["Глютен", "Лактоза"],
  },

  /* ------------------------------- ПИЦЦА -------------------------------- */
  {
    id: "chicken-pizza",
    name: "Пицца «С курицей»",
    shortName: "С курицей",
    category: "pizza",
    description: "Куриное филе, моцарелла, томатный соус, болгарский перец. Мягкий вкус.",
    composition: [
      "Тесто 72 ч ферментации",
      "Томатный соус",
      "Куриное филе",
      "Моцарелла итальянская",
      "Болгарский перец",
    ],
    price: 3890,
    badges: [BADGE_OVEN, BADGE_HALAL],
    nutrition: { weight: 560, kcal: 1180, protein: 58, fat: 42, carbs: 132 },
    technology: TECH_PIZZA,
    demo: true,
    allergens: ["Глютен", "Лактоза"],
  },

  /* -------------------------------- ПАСТА ------------------------------- */
  {
    id: "carbonara",
    name: "Паста «Карбонара»",
    shortName: "Карбонара",
    category: "pasta",
    description: "Говяжий бекон, сливочно-яичный соус, пармезан, чёрный перец.",
    composition: ["Спагетти аль денте", "Говяжий бекон (halal)", "Сливочно-яичный соус", "Пармезан", "Чёрный перец"],
    price: 3190,
    badges: [BADGE_HALAL],
    nutrition: { weight: 380, kcal: 780, protein: 32, fat: 34, carbs: 80 },
    technology: TECH_PASTA,
    demo: true,
    allergens: ["Глютен", "Лактоза", "Яйцо"],
  },

  /* ------------------------------ ЗАВТРАКИ ------------------------------ */
  {
    id: "english-breakfast",
    name: "Английский завтрак + напиток",
    shortName: "Английский завтрак",
    category: "breakfast",
    description:
      "Яичница глазунья, сосиски, фасоль в томате, тост, овощи и напиток на выбор.",
    composition: ["Яичница из 2 яиц", "Говяжьи сосиски (halal)", "Фасоль в томате", "Тост из печи", "Овощи", "Чай или кофе"],
    price: 2390,
    badges: [{ label: "С напитком", tone: "sun", icon: "star" }, BADGE_HALAL],
    nutrition: { weight: 420, kcal: 640, protein: 28, fat: 34, carbs: 52 },
    technology: TECH_BREAKFAST,
    allergens: ["Глютен", "Яйцо"],
  },
  {
    id: "shakshuka",
    name: "Шакшука",
    shortName: "Шакшука",
    category: "breakfast",
    description: "Яйца, томлёные в томатах с болгарским перцем и специями. Подаём с хлебом.",
    composition: ["Яйца", "Томаты", "Болгарский перец", "Лук, чеснок", "Специи", "Хлеб из печи"],
    price: 2390,
    badges: [{ label: "Хит завтраков", tone: "sun", icon: "star" }, { label: "Вегетарианская", tone: "basil", icon: "leaf" }],
    nutrition: { weight: 350, kcal: 480, protein: 18, fat: 30, carbs: 32 },
    technology: TECH_BREAKFAST,
    vegetarian: true,
    spicy: true,
    allergens: ["Глютен", "Яйцо"],
  },
  {
    id: "italian-breakfast",
    name: "Итальянский завтрак",
    shortName: "Итальянский завтрак",
    category: "breakfast",
    description: "Круассан, страчателла, вяленые томаты, руккола и капучино.",
    composition: ["Круассан", "Страчателла", "Вяленые томаты", "Руккола", "Капучино"],
    price: 2390,
    badges: [{ label: "С кофе", tone: "graphite", icon: "chef" }, { label: "Вегетарианская", tone: "basil", icon: "leaf" }],
    nutrition: { weight: 320, kcal: 520, protein: 22, fat: 28, carbs: 44 },
    technology: TECH_BREAKFAST,
    vegetarian: true,
    allergens: ["Глютен", "Лактоза"],
  },

  /* --------------------------- СУПЫ & САЛАТЫ ---------------------------- */
  {
    id: "mushroom-soup",
    name: "Грибной суп",
    shortName: "Грибной суп",
    category: "soups",
    description: "Шампиньоны, овощной бульон, сливки, тимьян. Подаём с хлебом из печи.",
    composition: ["Шампиньоны", "Овощной бульон", "Сливки", "Тимьян", "Хлеб из печи"],
    price: 1990,
    badges: [{ label: "Вегетарианский", tone: "basil", icon: "leaf" }],
    nutrition: { weight: 300, kcal: 240, protein: 8, fat: 12, carbs: 24 },
    technology: TECH_SOUP,
    vegetarian: true,
    allergens: ["Лактоза", "Глютен"],
  },
  {
    id: "lentil-soup",
    name: "Чечевичный суп",
    shortName: "Чечевичный суп",
    category: "soups",
    description: "Красная чечевица, морковь, куркума, кинза. Сытный и тёплый.",
    composition: ["Красная чечевица", "Морковь", "Лук", "Куркума", "Кинза"],
    price: 1990,
    badges: [{ label: "Вегетарианский", tone: "basil", icon: "leaf" }],
    nutrition: { weight: 300, kcal: 280, protein: 14, fat: 6, carbs: 42 },
    technology: TECH_SOUP,
    vegetarian: true,
    allergens: [],
  },
  {
    id: "pumpkin-soup",
    name: "Тыквенный суп",
    shortName: "Тыквенный суп",
    category: "soups",
    description: "Запечённая тыква, сливки, тыквенные семечки, имбирь.",
    composition: ["Тыква", "Сливки", "Тыквенные семечки", "Имбирь", "Мускатный орех"],
    price: 1990,
    badges: [{ label: "Сезонный", tone: "sun", icon: "star" }, { label: "Вегетарианский", tone: "basil", icon: "leaf" }],
    nutrition: { weight: 300, kcal: 260, protein: 6, fat: 10, carbs: 36 },
    technology: TECH_SOUP,
    vegetarian: true,
    allergens: ["Лактоза"],
  },
  {
    id: "caesar-chicken",
    name: "Салат «Цезарь с курицей»",
    shortName: "Цезарь с курицей",
    category: "soups",
    description: "Романо, куриное филе гриль, пармезан, гренки, соус цезарь.",
    composition: ["Салат романо", "Куриное филе гриль", "Пармезан", "Гренки", "Соус цезарь"],
    price: 2690,
    badges: [BADGE_HALAL],
    nutrition: { weight: 260, kcal: 420, protein: 26, fat: 26, carbs: 22 },
    technology: "Салат собираем под заказ: курицу грилим на углях, гренки подсушиваем в печи, соус готовим сами.",
    demo: true,
    allergens: ["Глютен", "Лактоза", "Яйцо"],
  },
  {
    id: "greek-salad",
    name: "Салат «Греческий»",
    shortName: "Греческий салат",
    category: "soups",
    description: "Огурец, томаты, фета, оливки, красный лук, орегано.",
    composition: ["Огурец", "Томаты", "Фета", "Оливки", "Красный лук", "Орегано"],
    price: 2290,
    badges: [{ label: "Вегетарианский", tone: "basil", icon: "leaf" }],
    nutrition: { weight: 240, kcal: 320, protein: 9, fat: 24, carbs: 18 },
    technology: "Овощи нарезаем под заказ, заправляем оливковым маслом extra virgin с орегано.",
    demo: true,
    vegetarian: true,
    allergens: ["Лактоза"],
  },

  /* ------------------------------- САЙДЫ -------------------------------- */
  {
    id: "fries",
    name: "Картофель фри",
    shortName: "Картофель фри",
    category: "sides",
    description: "Тонкая соломка, морская соль, хрустящая корочка.",
    composition: ["Картофель", "Морская соль", "Соус на выбор"],
    price: 990,
    badges: [{ label: "Вегетарианский", tone: "basil", icon: "leaf" }],
    nutrition: { weight: 150, kcal: 420, protein: 5, fat: 18, carbs: 56 },
    technology: TECH_SIDE,
    vegetarian: true,
    allergens: [],
  },
  {
    id: "potato-wedges",
    name: "Картофель дольки",
    shortName: "Дольки",
    category: "sides",
    description: "Дольки с паприкой и розмарином, запечённые до золотистого цвета.",
    composition: ["Картофель", "Паприка", "Розмарин", "Оливковое масло", "Соус на выбор"],
    price: 1390,
    badges: [{ label: "Вегетарианский", tone: "basil", icon: "leaf" }],
    nutrition: { weight: 200, kcal: 480, protein: 6, fat: 20, carbs: 64 },
    technology: TECH_SIDE,
    vegetarian: true,
    allergens: [],
  },
  {
    id: "nuggets",
    name: "Наггетсы",
    shortName: "Наггетсы",
    category: "sides",
    description: "Куриное филе в хрустящей панировке, 6 штук, с соусом.",
    composition: ["Куриное филе (halal)", "Панировка", "Соус на выбор"],
    price: 1090,
    badges: [BADGE_HALAL],
    nutrition: { weight: 180, kcal: 460, protein: 22, fat: 26, carbs: 36 },
    technology: TECH_SIDE,
    allergens: ["Глютен", "Яйцо"],
  },
  {
    id: "cheese-sticks",
    name: "Сырные палочки",
    shortName: "Сырные палочки",
    category: "sides",
    description: "Моцарелла в панировке, 6 штук, с томатным соусом.",
    composition: ["Моцарелла итальянская", "Панировка", "Томатный соус"],
    price: 1590,
    badges: [{ label: "Вегетарианский", tone: "basil", icon: "leaf" }],
    nutrition: { weight: 180, kcal: 540, protein: 20, fat: 32, carbs: 42 },
    technology: TECH_SIDE,
    vegetarian: true,
    allergens: ["Глютен", "Лактоза"],
  },

  /* ------------------------------- НАПИТКИ ------------------------------ */
  {
    id: "mors-1l",
    name: "Домашний морс 1 л",
    shortName: "Морс 1л",
    category: "drinks",
    description: "Ягодный морс собственного приготовления: смородина, клюква, минимум сахара.",
    composition: ["Смородина", "Клюква", "Вода", "Тростниковый сахар"],
    price: 1690,
    badges: [{ label: "Домашний", tone: "sun", icon: "star" }],
    nutrition: { weight: 1000, kcal: 380, protein: 1, fat: 0, carbs: 94 },
    technology: TECH_DRINK,
    vegetarian: true,
    allergens: [],
  },
  {
    id: "kompot-1l",
    name: "Компот 1 л",
    shortName: "Компот 1л",
    category: "drinks",
    description: "Компот из сухофруктов: курага, чернослив, изюм.",
    composition: ["Курага", "Чернослив", "Изюм", "Вода"],
    price: 1590,
    badges: [{ label: "Домашний", tone: "sun", icon: "star" }],
    nutrition: { weight: 1000, kcal: 340, protein: 1, fat: 0, carbs: 84 },
    technology: TECH_DRINK,
    vegetarian: true,
    allergens: [],
  },
  {
    id: "cola-1l",
    name: "Cola 1 л",
    shortName: "Cola 1л",
    category: "drinks",
    description: "Классическая охлаждённая кола, бутылка 1 литр.",
    composition: ["Газированный напиток", "Бутылка 1 л"],
    price: 1090,
    badges: [],
    nutrition: { weight: 1000, kcal: 420, protein: 0, fat: 0, carbs: 106 },
    technology: "Подаём охлаждённой до +4 °C.",
    vegetarian: true,
    allergens: [],
  },
];

/* -------------------------------------------------------------------------- */
/*  Селекторы                                                                  */
/* -------------------------------------------------------------------------- */

/** Ровно 8 позиций блока «Топ выбор», отсортированные по рангу. */
export const TOP_PICKS: Dish[] = DISHES.filter((d) => d.isTop).sort(
  (a, b) => (a.topRank ?? 99) - (b.topRank ?? 99),
);

/** Бейджи, которые показываем прямо на карточке (остальные — в модалке). */
export const CARD_BADGE_LIMIT = 2;

export function getDishById(id: string): Dish | undefined {
  return DISHES.find((d) => d.id === id);
}

export function getDishesByCategory(category: Dish["category"]): Dish[] {
  return DISHES.filter((d) => d.category === category);
}

/** Категории, в которых есть хотя бы одна позиция. */
export function getFilledCategories(): Category[] {
  return CATEGORIES.filter(
    (c) => c.id === "top" || DISHES.some((d) => d.category === c.id),
  );
}

export const DISH_COUNT = DISHES.length;
