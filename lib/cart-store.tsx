"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { DISHES, getDishById } from "@/lib/menu-data";
import { RESTAURANT } from "@/lib/restaurant";
import { sanitizeAddress, sanitizeComment } from "@/lib/sanitize";
import type { CartLine, CartTotals } from "@/types/menu";

/* -------------------------------------------------------------------------- */
/*  Состояние                                                                  */
/* -------------------------------------------------------------------------- */

const STORAGE_KEY = "nasha-pizza:cart:v1";

interface CartState {
  /** id блюда -> количество. */
  items: Record<string, number>;
  /** Открыта ли корзина. */
  isOpen: boolean;
  /**
   * Открывали ли корзину хотя бы раз.
   *
   * Шторка живёт в DOM всегда (так работает CSS-анимация закрытия), но её
   * содержимое до первого открытия не рендерим: иначе миниатюры блюд
   * грузятся и занимают память, даже если гость в корзину не заходил.
   */
  hasOpened: boolean;
  /** Адрес доставки, сохраняется между сессиями. */
  address: string;
  comment: string;
  /** Последнее добавленное блюдо — для анимации «добавлено». */
  lastAddedId: string | null;
}

type CartAction =
  | { type: "add"; id: string; qty?: number }
  | { type: "setQty"; id: string; qty: number }
  | { type: "remove"; id: string }
  | { type: "clear" }
  | { type: "open" }
  | { type: "close" }
  | { type: "toggle" }
  | { type: "address"; value: string }
  | { type: "comment"; value: string }
  | { type: "hydrate"; items: Record<string, number>; address: string; comment: string };

const initialState: CartState = {
  items: {},
  isOpen: false,
  hasOpened: false,
  address: "",
  comment: "",
  lastAddedId: null,
};

const MAX_QTY = 20;

/** Копия корзины без указанной позиции. */
function withoutKey(items: Record<string, number>, id: string): Record<string, number> {
  const next = { ...items };
  delete next[id];
  return next;
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const current = state.items[action.id] ?? 0;
      const next = Math.min(MAX_QTY, current + (action.qty ?? 1));
      return { ...state, items: { ...state.items, [action.id]: next }, lastAddedId: action.id };
    }
    case "setQty": {
      if (action.qty <= 0) {
        return { ...state, items: withoutKey(state.items, action.id), lastAddedId: null };
      }
      return {
        ...state,
        items: { ...state.items, [action.id]: Math.min(MAX_QTY, action.qty) },
        lastAddedId: null,
      };
    }
    case "remove":
      return { ...state, items: withoutKey(state.items, action.id), lastAddedId: null };
    case "clear":
      return { ...state, items: {}, lastAddedId: null };
    case "open":
      return { ...state, isOpen: true, hasOpened: true };
    case "close":
      return { ...state, isOpen: false };
    case "toggle":
      return { ...state, isOpen: !state.isOpen, hasOpened: true };
    case "address":
      return { ...state, address: action.value };
    case "comment":
      return { ...state, comment: action.value };
    case "hydrate":
      return { ...state, items: action.items, address: action.address, comment: action.comment };
    default:
      return state;
  }
}

/* -------------------------------------------------------------------------- */
/*  Контекст                                                                   */
/* -------------------------------------------------------------------------- */

export interface CartApi {
  /** Позиции корзины с полными данными блюда. */
  lines: CartLine[];
  totals: CartTotals;
  isOpen: boolean;
  hasOpened: boolean;
  address: string;
  comment: string;
  lastAddedId: string | null;
  qtyOf: (id: string) => number;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setAddress: (value: string) => void;
  setComment: (value: string) => void;
}

const CartContext = createContext<CartApi | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  /* Восстанавливаем корзину из localStorage после монтирования —
     так серверный и клиентский рендер совпадают. Флаг гидратации держим
     в ref: он не влияет на разметку и не вызывает лишних рендеров. */
  const hydrated = useRef(false);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<CartState>;
        const items: Record<string, number> = {};
        for (const [id, qty] of Object.entries(parsed.items ?? {})) {
          if (typeof qty === "number" && qty > 0 && getDishById(id)) {
            items[id] = Math.min(MAX_QTY, Math.round(qty));
          }
        }
        /* Адрес и комментарий из старых версий хранилища намеренно не
           восстанавливаем: персональные данные на устройстве не храним. */
        dispatch({ type: "hydrate", items, address: "", comment: "" });
      }
    } catch {
      /* повреждённое хранилище — просто начинаем с пустой корзины */
    }
    hydrated.current = true;
  }, []);

  /* В хранилище уходит только состав корзины.
     Адрес доставки и комментарий — персональные данные: они живут в памяти
     вкладки, пока корзина открыта, и не оседают на устройстве гостя. */
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items }));
    } catch {
      /* приватный режим — молча игнорируем */
    }
  }, [state.items]);

  const lines = useMemo<CartLine[]>(() => {
    return Object.entries(state.items)
      .map(([id, qty]) => {
        const dish = DISHES.find((d) => d.id === id);
        return dish ? { dish, qty } : null;
      })
      .filter((line): line is CartLine => line !== null)
      .sort((a, b) => (a.dish.topRank ?? 99) - (b.dish.topRank ?? 99));
  }, [state.items]);

  const totals = useMemo<CartTotals>(
    () => ({
      count: lines.reduce((sum, line) => sum + line.qty, 0),
      subtotal: lines.reduce((sum, line) => sum + line.dish.price * line.qty, 0),
    }),
    [lines],
  );

  const add = useCallback((id: string, qty = 1) => dispatch({ type: "add", id, qty }), []);
  const setQty = useCallback((id: string, qty: number) => dispatch({ type: "setQty", id, qty }), []);
  const remove = useCallback((id: string) => dispatch({ type: "remove", id }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);
  const open = useCallback(() => dispatch({ type: "open" }), []);
  const close = useCallback(() => dispatch({ type: "close" }), []);
  const toggle = useCallback(() => dispatch({ type: "toggle" }), []);
  const setAddress = useCallback(
    (value: string) => dispatch({ type: "address", value: sanitizeAddress(value) }),
    [],
  );
  const setComment = useCallback(
    (value: string) => dispatch({ type: "comment", value: sanitizeComment(value) }),
    [],
  );
  const qtyOf = useCallback((id: string) => state.items[id] ?? 0, [state.items]);

  const value = useMemo<CartApi>(
    () => ({
      lines,
      totals,
      isOpen: state.isOpen,
      hasOpened: state.hasOpened,
      address: state.address,
      comment: state.comment,
      lastAddedId: state.lastAddedId,
      qtyOf,
      add,
      setQty,
      remove,
      clear,
      open,
      close,
      toggle,
      setAddress,
      setComment,
    }),
    [
      lines,
      totals,
      state.isOpen,
      state.hasOpened,
      state.address,
      state.comment,
      state.lastAddedId,
      qtyOf,
      add,
      setQty,
      remove,
      clear,
      open,
      close,
      toggle,
      setAddress,
      setComment,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartApi {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart должен использоваться внутри <CartProvider>");
  }
  return ctx;
}

/** Телефон заведения для быстрого звонка из корзины. */
export const PRIMARY_PHONE = RESTAURANT.phones[0];
