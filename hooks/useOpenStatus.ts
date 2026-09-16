"use client";

import { useCallback, useSyncExternalStore } from "react";
import { RESTAURANT } from "@/lib/restaurant";
import { resolveOpenState } from "@/lib/format";

const TICK_MS = 60_000;

/**
 * Живой статус «Открыто / Закрыто» по времени Астаны.
 *
 * Время — внешний по отношению к React источник, поэтому читаем его через
 * `useSyncExternalStore`: на сервере отдаётся нейтральная подпись из расписания,
 * на клиенте — актуальный статус, без рассинхрона гидратации.
 */
export function useOpenStatus(): { isOpen: boolean; label: string } {
  const { open, close } = RESTAURANT.hours;

  const subscribe = useCallback((onChange: () => void) => {
    const timer = window.setInterval(onChange, TICK_MS);
    window.addEventListener("focus", onChange);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", onChange);
    };
  }, []);

  /* Снимок — строка, поэтому сравнение идёт по значению и лишних рендеров нет. */
  const getSnapshot = useCallback(
    () => snapshotOf(resolveOpenState(RESTAURANT.timeZone, open, close, new Date())),
    [open, close],
  );

  const getServerSnapshot = useCallback(
    () => `1\u0000Ежедневно ${open}–${close}`,
    [open, close],
  );

  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const separator = snapshot.indexOf("\u0000");

  return {
    isOpen: snapshot.slice(0, separator) === "1",
    label: snapshot.slice(separator + 1),
  };
}

function snapshotOf(state: { isOpen: boolean; label: string }): string {
  return `${state.isOpen ? "1" : "0"}\u0000${state.label}`;
}
