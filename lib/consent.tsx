"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

/**
 * Согласие гостя на необязательные технологии (аналитика, маркетинг).
 *
 * Сейчас сайт не использует ни рекламных трекеров, ни аналитики — в браузере
 * лежат только корзина и сам выбор. Баннер нужен как основание для хранения
 * данных в браузере и как «выключатель» на будущее: аналитика подключается
 * только при analytics === true.
 *
 * Выбор читается через `useSyncExternalStore`: localStorage — это внешнее
 * хранилище, поэтому на сервере отдаём заглушку, а после гидратации React сам
 * перечитывает реальное значение. Так нет setState внутри эффекта и нет
 * расхождения серверной и клиентской разметки.
 */

export const CONSENT_STORAGE_KEY = "nasha-pizza:consent:v1";
const CONSENT_VERSION = 1;
/** Событие внутри вкладки: storage в том же окне не срабатывает. */
const CONSENT_CHANGED_EVENT = "nasha-pizza:consent-changed";
/** Значение на сервере — «состояние ещё неизвестно». */
const SERVER_SNAPSHOT = "server";
/** В хранилище пусто — гость ещё не делал выбор. */
const NO_CHOICE = "none";

export interface ConsentState {
  version: number;
  /** Технические данные: без них корзина и сам выбор работать не будут. */
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  /** Момент выбора — доказательство согласия. */
  decidedAt: string;
}

interface ConsentApi {
  consent: ConsentState | null;
  /** Баннер открыт: первый визит или гость сам открыл настройки. */
  isBannerOpen: boolean;
  save: (choice?: Partial<Pick<ConsentState, "analytics" | "marketing">>) => void;
  openSettings: () => void;
  closeBanner: () => void;
}

const ConsentContext = createContext<ConsentApi | null>(null);

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(CONSENT_CHANGED_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CONSENT_CHANGED_EVENT, onChange);
  };
}

function getSnapshot(): string {
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY) ?? NO_CHOICE;
  } catch {
    return NO_CHOICE;
  }
}

function getServerSnapshot(): string {
  return SERVER_SNAPSHOT;
}

function parseConsent(raw: string): ConsentState | null {
  if (raw === NO_CHOICE || raw === SERVER_SNAPSHOT) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (parsed.version !== CONSENT_VERSION) return null;
    return {
      version: CONSENT_VERSION,
      necessary: true,
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
      decidedAt: typeof parsed.decidedAt === "string" ? parsed.decidedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const consent = useMemo(() => parseConsent(raw), [raw]);

  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isHiddenThisVisit, setHiddenThisVisit] = useState(false);

  /* Состояние известно только после гидратации: на сервере raw === SERVER_SNAPSHOT,
     поэтому серверная разметка совпадает с первым клиентским рендером. */
  const isKnown = raw !== SERVER_SNAPSHOT;
  const isBannerOpen = isKnown && (isSettingsOpen || (consent === null && !isHiddenThisVisit));

  const save = useCallback(
    (choice?: Partial<Pick<ConsentState, "analytics" | "marketing">>) => {
      const next: ConsentState = {
        version: CONSENT_VERSION,
        necessary: true,
        analytics: choice?.analytics ?? consent?.analytics ?? false,
        marketing: choice?.marketing ?? consent?.marketing ?? false,
        decidedAt: new Date().toISOString(),
      };
      try {
        window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
      } catch {
        /* приватный режим — согласие просто не сохранится */
      }
      setSettingsOpen(false);
      setHiddenThisVisit(true);
    },
    [consent],
  );

  const openSettings = useCallback(() => {
    setHiddenThisVisit(false);
    setSettingsOpen(true);
  }, []);

  const closeBanner = useCallback(() => {
    setSettingsOpen(false);
    setHiddenThisVisit(true);
  }, []);

  const api = useMemo<ConsentApi>(
    () => ({ consent, isBannerOpen, save, openSettings, closeBanner }),
    [consent, isBannerOpen, save, openSettings, closeBanner],
  );

  return <ConsentContext.Provider value={api}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentApi {
  const api = useContext(ConsentContext);
  if (!api) throw new Error("useConsent нужно вызывать внутри ConsentProvider");
  return api;
}
