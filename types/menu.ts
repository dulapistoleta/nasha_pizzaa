/**
 * Типы домена «Наша пицца».
 * Меню описано моковыми данными (см. `lib/menu-data.ts`),
 * структура готова к подключению реального API/CRM.
 */

/** Идентификаторы категорий меню (совпадают с якорями на странице). */
export type CategoryId =
  | "top"
  | "pizza"
  | "pasta"
  | "breakfast"
  | "soups"
  | "sides"
  | "combo"
  | "drinks";

/** Категории, в которых реально лежат блюда (без виртуальной «Топ выбор»). */
export type DishCategory = Exclude<CategoryId, "top">;

export interface Category {
  id: CategoryId;
  /** Подпись на плашке горизонтальной ленты. */
  label: string;
  /** Эмодзи-акцент из фирменной навигации. */
  emoji: string;
  /** Короткое описание для скринридеров и подсказок. */
  hint: string;
}

/** Тональность бейджа на карточке. */
export type BadgeTone = "sun" | "tomato" | "graphite" | "basil" | "cream";

export interface DishBadge {
  label: string;
  tone: BadgeTone;
  /** Иконка слева от текста (имя иконки из набора карточки). */
  icon?: "flame" | "timer" | "halal" | "star" | "chef" | "gift" | "leaf" | "percent";
}

/** Пищевая ценность и вес порции. */
export interface Nutrition {
  /** Вес порции, г. */
  weight: number;
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface Dish {
  /** Slug — он же имя файла изображения `/images/dishes/[slug].webp`. */
  id: string;
  name: string;
  /** Короткое имя для сообщения в WhatsApp. */
  shortName: string;
  category: DishCategory;
  /** Состав/описание для карточки. */
  description: string;
  /** Список ингредиентов для модального окна. */
  composition: string[];
  /** Цена в тенге. */
  price: number;
  badges: DishBadge[];
  nutrition: Nutrition;
  /** Технология приготовления — показывается в модальном окне. */
  technology: string;
  /** Входит в блок «Топ выбор». */
  isTop?: boolean;
  /** Позиция в блоке «Топ выбор» (1..8). */
  topRank?: number;
  vegetarian?: boolean;
  spicy?: boolean;
  /** Аллергены. */
  allergens?: string[];
  /** Пометка, что позиция добавлена для полноты демо-меню. */
  demo?: boolean;
}

export interface CartLine {
  dish: Dish;
  qty: number;
}

export interface CartTotals {
  count: number;
  subtotal: number;
}
