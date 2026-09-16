import type { Dish } from "@/types/menu";

/** Канонический путь к изображению блюда: `/images/dishes/[dish-slug].webp`. */
export function dishImageSrc(dish: Dish): string {
  return `/images/dishes/${dish.id}.webp`;
}

const ACCENT_PATTERN =
  /(моцарелл\w*|страчателл\w*|горгондзол\w*|пармезан\w*|пепперони|фермент\w*|72\s?ч\w*|halal|халяльн\w*|вялен\w+\s+томат\w*|фетучини|сливочн\w+\s+соус\w*)/gi;

/**
 * Подсвечивает в составе «продающие» ингредиенты:
 * ферментированное тесто, итальянскую моцареллу, halal-мясо.
 */
export function AccentText({ text, className = "" }: { text: string; className?: string }) {
  const parts = text.split(ACCENT_PATTERN);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <strong key={`${part}-${index}`} className="font-extrabold text-graphite">
            {part}
          </strong>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </span>
  );
}
