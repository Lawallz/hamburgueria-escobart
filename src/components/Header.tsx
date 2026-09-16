import { useState } from 'react';
import { ShoppingCart, Menu, X, Gift } from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenMiniGame: () => void;
}

export default function Header({ cart, onOpenCart, onOpenMiniGame }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Cardápio', href: '#cardapio' },
    { label: 'Sobre Nós', href: '#sobre' },
    { label: 'Contato', href: '#contato' },
  ];

  return (
        <header
      id="app-header"
      className="fixed top-0 w-full z-40 bg-brand-background border-b-4 border-brand-charcoal"
    >
      <div className="flex justify-between items-center px-4 md:px-8 py-3 max-w-7xl mx-auto h-20">
        {/* Logo */}
        <a
          href="#"
          id="header-logo"
          className="transition-transform hover:scale-105"
        >
          <img
            src="/assets/img/logo.png"
            alt="Escobart"
            className="h-14 md:h-16 w-auto object-contain"
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8" id="desktop-nav">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-brand-charcoal font-space font-bold text-sm tracking-widest uppercase hover:text-brand-secondary border-b-2 border-transparent hover:border-brand-charcoal pb-1 transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Header Action Buttons */}
        <div className="flex items-center space-x-3 md:space-x-4" id="header-actions">
          {/* Spin Wheel Mini Game Trigger */}
          <button
            onClick={onOpenMiniGame}
            className="relative bg-teal-400 text-brand-charcoal p-2.5 neo-brutalist-border neo-brutalist-shadow-hover rounded-full transition-all focus:outline-none"
            title="Girar a Roleta de Cupons"
            id="minigame-trigger-btn"
          >
            <Gift className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
            </span>
          </button>

          {/* Cart Icon Button */}
          <button
            onClick={onOpenCart}
            className="relative bg-brand-yellow text-brand-charcoal p-2.5 neo-brutalist-border neo-brutalist-shadow-hover rounded-full transition-all focus:outline-none"
            id="cart-trigger-btn"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span 
                className="absolute -top-2 -right-2 bg-brand-charcoal text-white font-space font-extrabold text-xs h-6 w-6 rounded-full flex items-center justify-center border-2 border-brand-yellow animate-bounce"
                id="cart-badge"
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Pedir Agora CTA Button */}
          <button
            onClick={onOpenCart}
            className="hidden sm:inline-block bg-brand-yellow text-brand-charcoal px-5 py-2.5 neo-brutalist-border neo-brutalist-shadow font-space font-bold text-xs tracking-widest uppercase hover:scale-105 active:translate-y-[2px] transition-all"
            id="header-order-now-btn"
          >
            Pedir Agora
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden bg-white text-brand-charcoal p-2.5 neo-brutalist-border neo-brutalist-shadow-hover rounded-full transition-all focus:outline-none"
            id="mobile-menu-toggle-btn"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden bg-brand-background border-b-4 border-brand-charcoal px-6 py-8 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-300"
          id="mobile-drawer"
        >
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-brand-charcoal font-space font-bold text-lg tracking-wider uppercase border-l-4 border-brand-yellow pl-3 py-1 hover:bg-brand-yellow/10 transition-all"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMiniGame();
              }}
              className="w-full bg-teal-400 text-brand-charcoal py-3 neo-brutalist-border neo-brutalist-shadow font-space font-bold text-sm tracking-wider uppercase flex items-center justify-center space-x-2"
            >
              <Gift className="w-5 h-5" />
              <span>Girar Roleta de Cupons</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCart();
              }}
              className="w-full bg-brand-yellow text-brand-charcoal py-3 neo-brutalist-border neo-brutalist-shadow font-space font-bold text-sm tracking-wider uppercase"
            >
              Fazer Pedido ({cartCount})
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
