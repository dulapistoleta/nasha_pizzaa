"use client";

import type { ReactNode } from "react";
import { DoodleBackground } from "@/components/art/DoodleBackground";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CookieBanner } from "@/components/legal/CookieBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { DishModal } from "@/components/menu/DishModal";
import { DishModalProvider } from "@/components/menu/dish-modal-context";
import { useRevealObserver } from "@/hooks/useRevealObserver";
import { CartProvider } from "@/lib/cart-store";
import { ConsentProvider } from "@/lib/consent";

/**
 * Оболочка юридических страниц: та же шапка, подвал, корзина и баннер согласия,
 * что и на главной, но без секций меню. Так переход по документам не выкидывает
 * гостя из интерфейса и не ломает корзину.
 */
export function LegalShell({ children }: { children: ReactNode }) {
  useRevealObserver();

  return (
    <ConsentProvider>
      <CartProvider>
        <DishModalProvider>
          <DoodleBackground />

          <div className="relative flex min-h-dvh flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>

          <MobileActionBar />
          <CartDrawer />
          <DishModal />
          <CookieBanner />
        </DishModalProvider>
      </CartProvider>
    </ConsentProvider>
  );
}
