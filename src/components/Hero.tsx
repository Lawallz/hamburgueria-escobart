import { Sparkles } from 'lucide-react';

interface HeroProps {
  onScrollToMenu: () => void;
  onOpenCart: () => void;
}

export default function Hero({ onScrollToMenu, onOpenCart }: HeroProps) {
  return (
    <section 
      id="inicio" 
      className="relative min-h-[85vh] flex items-center overflow-hidden px-4 md:px-8 py-12 md:py-20 bg-white"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        {/* Left column: Texts & CTA */}
        <div className="lg:col-span-7 z-10 space-y-6 md:space-y-8" id="hero-content">
          {/* Sticker badge */}
          <div className="inline-block bg-brand-yellow px-4 py-2.5 neo-brutalist-border sticker-rotate-ccw mb-2 hover:scale-110 hover:rotate-[-8deg] transition-all duration-300 cursor-pointer">
            <span className="font-space font-extrabold text-xs md:text-sm uppercase tracking-widest text-brand-charcoal">
              🍔 Ou Plomo ?
            </span>
          </div>

          {/* Core brutalist title */}
          <h1 className="font-headline text-5xl md:text-7xl lg:text-[5.5rem] leading-none uppercase text-brand-charcoal tracking-tight" id="hero-title">
            O SABOR QUE É UM <br />
            <span className="relative inline-block bg-brand-yellow px-4 py-1 my-1 sticker-rotate-cw hover:rotate-0 transition-transform duration-300">
              CRIME
            </span>{' '}
            DEIXAR PASSAR
          </h1>

          {/* Subtitle description */}
          <p className="font-sans text-base md:text-lg max-w-xl text-zinc-600 font-medium leading-relaxed" id="hero-description">
            Hambúrgueres artesanais de respeito, preparados com blends secretos de 100% Angus, pão brioche tostado na manteiga e ingredientes de qualidade tão exclusiva que parecem ter atravessado a fronteira.
          </p>

          {/* Core Interactive Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2" id="hero-actions">
            <button
              onClick={onScrollToMenu}
              className="bg-brand-yellow text-brand-charcoal px-8 py-4.5 neo-brutalist-border neo-brutalist-shadow font-space font-extrabold text-sm md:text-base tracking-widest uppercase hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[8px_8px_0px_0px_#1b1b1b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-3"
              id="hero-view-menu-btn"
            >
              <Sparkles className="w-5 h-5 animate-spin-slow text-brand-secondary" />
              VER CARDÁPIO & PEDIR
            </button>
            <button
              onClick={onOpenCart}
              className="bg-white text-brand-charcoal px-6 py-4.5 neo-brutalist-border neo-brutalist-shadow-yellow font-space font-extrabold text-sm md:text-base tracking-widest uppercase hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[8px_8px_0px_0px_#ffd000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              id="hero-fast-order-btn"
            >
              MONTAR COMBO RÁPIDO
            </button>
          </div>
        </div>

        {/* Right column: Interactive Burger Polaroid Poster */}
        <div className="lg:col-span-5 relative flex justify-center w-full" id="hero-graphic">
          <div className="absolute -inset-4 bg-brand-yellow/15 rounded-full blur-3xl opacity-70 pointer-events-none"></div>
          
          <div className="relative neo-brutalist-border bg-white neo-brutalist-shadow p-4 transform rotate-3 hover:rotate-0 hover:scale-[1.03] transition-all duration-300 max-w-md w-full group cursor-pointer">
            <div className="overflow-hidden border-2 border-brand-charcoal bg-zinc-100">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdm6yGawmzbdRlFjGrLGx3TAKaqgnJUSG9aqQJVFvuCMev26J93Kj7VXPftLEMi1j3qbVE88i_LJBBodW7CB9po1e7d6yuJxVQ_k8MUAXFx7JWiXaO7nzjBwn0-dD7p0y569isT4aHKenFx8UWh9-7rzN2wPlbsHSnUZBDlkxdr-w_JiixtxS8VAMwm9_B72x-6R0jb9c8nQOLD7pSCOX0Y05KU10M-kHWKLFo5P_K6bb7dnPaYibe4fMB1DwCEYA9L-DidnXPYvI" 
                alt="Hambúrguer Supremo Escobart" 
                className="w-full h-[320px] md:h-[380px] object-cover filter brightness-105 contrast-105 group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Stamp sticker overlay */}
            <div className="absolute -top-6 -right-6 bg-brand-yellow p-4 neo-brutalist-border rounded-full flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 sticker-rotate-cw shadow-lg group-hover:scale-110 transition-transform">
              <span className="font-space font-extrabold text-[11px] md:text-xs leading-none text-center text-brand-charcoal uppercase tracking-widest">
                100%<br />ANGUS
              </span>
            </div>

            {/* Polaroid caption signature */}
            <div className="mt-4 text-center font-headline text-xl text-brand-charcoal tracking-wide">
              EL REY DEL SABOR
            </div>
          </div>
        </div>
      </div>

      {/* Atmospheric Dot Pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(#1b1b1b 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
    </section>
  );
}
