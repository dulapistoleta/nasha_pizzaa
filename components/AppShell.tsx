"use client";

import { DoodleBackground } from "@/components/art/DoodleBackground";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CookieBanner } from "@/components/legal/CookieBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { DishModal } from "@/components/menu/DishModal";
import { DishModalProvider } from "@/components/menu/dish-modal-context";
import { Atmosphere } from "@/components/sections/Atmosphere";
import { Contacts } from "@/components/sections/Contacts";
import { Hero } from "@/components/sections/Hero";
import { MenuExperience } from "@/components/sections/MenuExperience";
import { useRevealObserver } from "@/hooks/useRevealObserver";
import { CartProvider } from "@/lib/cart-store";
import { ConsentProvider } from "@/lib/consent";

/**
 * Клиентская оболочка приложения: провайдеры состояния,
 * рисованный фон и вся структура страницы.
 *
 * Анимации открытия/закрытия модального окна и корзины сделаны на CSS,
 * поэтому Framer Motion в стартовом бандле отсутствует.
 */
export function AppShell() {
  /* Один IntersectionObserver на всю страницу вместо motion на каждую карточку. */
  useRevealObserver();

  return (
    <ConsentProvider>
      <CartProvider>
        <DishModalProvider>
          <DoodleBackground />

          <div className="relative flex min-h-dvh flex-col">
            <Header />

            <main className="flex-1">
              <Hero />
              <MenuExperience />
              <Atmosphere />
              <Contacts />
            </main>

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
