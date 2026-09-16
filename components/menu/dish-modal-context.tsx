"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Dish } from "@/types/menu";

interface DishModalApi {
  /** Блюдо, открытое сейчас (null — окно закрыто). */
  activeDish: Dish | null;
  /**
   * Последнее открытое блюдо.
   *
   * Нужно, чтобы содержимое окна не исчезало в момент закрытия: пока идёт
   * CSS-переход затухания, панель всё ещё должна что-то показывать.
   */
  displayDish: Dish | null;
  isOpen: boolean;
  openDish: (dish: Dish) => void;
  closeDish: () => void;
}

const DishModalContext = createContext<DishModalApi | null>(null);

/** Состояние pop-up окна блюда. */
export function DishModalProvider({ children }: { children: ReactNode }) {
  const [activeDish, setActiveDish] = useState<Dish | null>(null);
  const [displayDish, setDisplayDish] = useState<Dish | null>(null);

  const openDish = useCallback((dish: Dish) => {
    setDisplayDish(dish);
    setActiveDish(dish);
  }, []);

  const closeDish = useCallback(() => setActiveDish(null), []);

  const value = useMemo<DishModalApi>(
    () => ({
      activeDish,
      displayDish,
      isOpen: activeDish !== null,
      openDish,
      closeDish,
    }),
    [activeDish, displayDish, openDish, closeDish],
  );

  return <DishModalContext.Provider value={value}>{children}</DishModalContext.Provider>;
}

export function useDishModal(): DishModalApi {
  const ctx = useContext(DishModalContext);
  if (!ctx) throw new Error("useDishModal должен использоваться внутри <DishModalProvider>");
  return ctx;
}
