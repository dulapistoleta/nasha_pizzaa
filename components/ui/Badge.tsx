"use client";

import { Flame, Gift, Leaf, Percent, Star, Timer, ChefHat } from "lucide-react";
import { HalalDoodle } from "@/components/art/doodles";
import type { BadgeTone, DishBadge } from "@/types/menu";

const TONES: Record<BadgeTone, string> = {
  sun: "bg-sun text-graphite shadow-[0_6px_16px_-8px_rgba(255,200,0,0.9)]",
  tomato: "bg-tomato text-cream shadow-[0_6px_16px_-8px_rgba(225,29,72,0.9)]",
  graphite: "bg-graphite text-cream",
  basil: "bg-basil text-cream",
  cream: "bg-cream/95 text-graphite ring-1 ring-graphite/10 backdrop-blur",
};

function BadgeIcon({ icon }: { icon: NonNullable<DishBadge["icon"]> }) {
  const common = { className: "h-3.5 w-3.5 shrink-0", strokeWidth: 2.6 } as const;

  switch (icon) {
    case "flame":
      return <Flame {...common} />;
    case "timer":
      return <Timer {...common} />;
    case "star":
      return <Star {...common} />;
    case "chef":
      return <ChefHat {...common} />;
    case "gift":
      return <Gift {...common} />;
    case "percent":
      return <Percent {...common} />;
    case "leaf":
      return <Leaf {...common} />;
    case "halal":
      return <HalalDoodle className="h-3.5 w-3.5 shrink-0" strokeWidth={7} />;
    default:
      return null;
  }
}

/** Яркий бейдж на карточке блюда или в модальном окне. */
export function Badge({
  badge,
  size = "md",
  className = "",
}: {
  badge: DishBadge;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wide ${
        size === "sm" ? "px-2.5 py-1 text-[0.62rem]" : "px-3 py-1.5 text-[0.7rem]"
      } ${TONES[badge.tone]} ${className}`}
    >
      {badge.icon ? <BadgeIcon icon={badge.icon} /> : null}
      {badge.label}
    </span>
  );
}
