/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import AboutSection from './components/AboutSection';
import FindUsSection from './components/FindUsSection';
import CartDrawer from './components/CartDrawer';
import CouponMiniGame from './components/CouponMiniGame';
import { MenuItem, CartItem } from './types';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMiniGameOpen, setIsMiniGameOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor scroll height to trigger back-to-top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll helper for sections
  const scrollToMenu = () => {
    const section = document.getElementById('cardapio');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add item to cart with custom option combinations grouped nicely
  const handleAddToCart = (
    item: MenuItem, 
    customizations: CartItem['customizations'], 
    notes: string
  ) => {
    // Generate unique composite key
    const customId = `${item.id}-${customizations.extraBacon ? 'b' : 'x'}-${customizations.extraPatty ? 'p' : 'x'}-${customizations.extraCheese ? 'c' : 'x'}-${customizations.removeOnions ? 'o' : 'x'}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((cartItem) => cartItem.id === customId);
      
      if (existingIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += 1;
        return updatedCart;
      }

      const newCartItem: CartItem = {
        id: customId,
        menuItem: item,
        quantity: 1,
        customizations,
        notes
      };
      return [...prevCart, newCartItem];
    });

    // Auto open the cart drawer to give immediate feedback to user
    setIsCartOpen(true);
  };

  // Change quantities from cart drawer
  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  // Remove single item group
  const handleRemoveItem = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Flush cart on success
  const handleClearCart = () => {
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-brand-background text-brand-charcoal overflow-x-hidden font-sans selection:bg-brand-yellow selection:text-brand-charcoal">
      {/* Header and top navigation */}
      <Header 
        cart={cart} 
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenMiniGame={() => setIsMiniGameOpen(true)} 
      />

      {/* Main app body */}
      <main className="mt-20">
        <Hero 
          onScrollToMenu={scrollToMenu} 
          onOpenCart={() => setIsCartOpen(true)} 
        />
        
        <MenuSection onAddToCart={handleAddToCart} />
        
        <AboutSection />
        
        <FindUsSection />
      </main>

      {/* Footer */}
      <footer className="bg-brand-charcoal dark:bg-brand-charcoal w-full py-16 border-t-4 border-brand-yellow text-white">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-8 space-y-8 md:space-y-0 max-w-7xl mx-auto">
          <div className="text-center md:text-left space-y-2">
            <a 
              href="#" 
              className="font-headline text-3xl text-brand-yellow uppercase tracking-tighter"
              id="footer-logo"
            >
              Escobart
            </a>
            <p className="font-sans text-xs md:text-sm text-zinc-400 font-bold">O vício que faz bem.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 font-space text-xs tracking-wider uppercase font-bold" id="footer-links">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-white hover:underline hover:text-brand-yellow transition-colors">Instagram</a>
            <a href="#contato" className="text-white hover:underline hover:text-brand-yellow transition-colors">WhatsApp</a>
            <a href="https://ifood.com.br" target="_blank" rel="noreferrer" className="text-white hover:underline hover:text-brand-yellow transition-colors">iFood</a>
            <a href="#contato" className="text-white hover:underline hover:text-brand-yellow transition-colors">Localização</a>
          </div>

          <div className="text-center md:text-right">
            <p className="font-sans text-xs text-zinc-500 font-bold">© 2026 Escobart. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Slide-out cart drawer for checkout tracking */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Gamified coupon mini-game */}
      <CouponMiniGame 
        isOpen={isMiniGameOpen}
        onClose={() => setIsMiniGameOpen(false)}
      />

      {/* Back to top scroll micro-interaction */}
      <button 
        onClick={handleScrollToTop}
        className={`fixed bottom-8 right-8 w-12 h-12 md:w-14 md:h-14 bg-brand-yellow neo-brutalist-border neo-brutalist-shadow flex items-center justify-center transition-all duration-300 z-30 hover:scale-110 active:scale-90 focus:outline-none ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'
        }`}
        title="Voltar ao Topo"
        id="scroll-to-top-btn"
      >
        <ArrowUp className="w-6 h-6 text-brand-charcoal stroke-[2.5]" />
      </button>
    </div>
  );
}
