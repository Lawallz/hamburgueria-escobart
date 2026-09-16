import { useState } from 'react';
import { Gift, X, Check, Copy, Flame } from 'lucide-react';

interface CouponMiniGameProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CouponMiniGame({ isOpen, onClose }: CouponMiniGameProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinDegrees, setSpinDegrees] = useState(0);
  const [wonPrize, setWonPrize] = useState<{ label: string; code: string; desc: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const prizes = [
    { label: '15% de Desconto', code: 'PLATA', desc: 'Desbloqueou o código contrabandista Don Escobart!' },
    { label: '10% de Desconto', code: 'BACONCRIME', desc: 'Garantiu 10% de desconto no seu carrinho completo!' },
    { label: 'Entrega Grátis', code: 'PLOMO', desc: 'Desconto equivalente à taxa de entrega do cartel!' },
    { label: 'Especial Chef', code: 'CHEF10', desc: '10% OFF para experimentar as receitas do chef.' },
  ];

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonPrize(null);

    // Pick a random prize
    const randomIndex = Math.floor(Math.random() * prizes.length);
    const selectedPrize = prizes[randomIndex];

    // Compute spin degrees: 4 complete turns (1440 degrees) + a division angle
    const targetDegrees = 1440 + (randomIndex * (360 / prizes.length)) + 45;
    setSpinDegrees(targetDegrees);

    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(selectedPrize);
    }, 3200); // Wait for the transition to complete
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-brand-charcoal/85 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-white neo-brutalist-border neo-brutalist-shadow max-w-md w-full overflow-hidden relative"
        id="mini-game-dialog"
      >
        
        {/* Header */}
        <div className="bg-brand-charcoal text-white p-4 flex justify-between items-center border-b-4 border-brand-charcoal">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-brand-yellow animate-bounce" />
            <span className="font-space font-extrabold text-sm uppercase tracking-tight">ROLETA DE CONTRABANDO</span>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-brand-yellow focus:outline-none"
            id="minigame-close-btn"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 flex flex-col items-center space-y-6">
          
          <div className="text-center space-y-2">
            <h4 className="font-headline text-3xl uppercase text-brand-charcoal">ROLETA DA SORTE</h4>
            <p className="font-sans text-xs text-zinc-500 font-semibold max-w-xs mx-auto">
              Gire a roleta oficial do cartel para descobrir descontos exclusivos e cupons imperdíveis!
            </p>
          </div>

          {/* Interactive Wheel Graphic representation */}
          <div className="relative w-64 h-64 flex items-center justify-center" id="wheel-container">
            {/* Arrow indicator pointing down */}
            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-red-600 filter drop-shadow"></div>

            {/* Circular rotating wheel */}
            <div 
              className="w-full h-full rounded-full neo-brutalist-border relative overflow-hidden bg-brand-charcoal transition-transform duration-[3000ms] ease-out shadow-lg"
              style={{ 
                transform: `rotate(${spinDegrees}deg)`,
                backgroundImage: 'conic-gradient(#ffd000 0deg 90deg, #1b1b1b 90deg 180deg, #ffd000 180deg 270deg, #1b1b1b 270deg 360deg)'
              }}
            >
              {/* Overlay labels on sectors */}
              <div className="absolute inset-0 flex items-center justify-center font-space font-extrabold text-xs uppercase text-brand-charcoal">
                <span className="absolute top-12 left-1/2 -translate-x-1/2 rotate-0 text-brand-charcoal">15% OFF</span>
                <span className="absolute right-10 top-1/2 -translate-y-1/2 rotate-90 text-white">10% OFF</span>
                <span className="absolute bottom-12 left-1/2 -translate-x-1/2 rotate-180 text-brand-charcoal">SHIPP FREE</span>
                <span className="absolute left-10 top-1/2 -translate-y-1/2 -rotate-90 text-white">CHEF 10%</span>
              </div>
            </div>

            {/* Stationary center pin */}
            <div className="absolute w-12 h-12 rounded-full bg-white neo-brutalist-border flex items-center justify-center z-10 shadow-md">
              <Flame className="w-5 h-5 text-brand-yellow fill-brand-yellow animate-pulse" />
            </div>
          </div>

          {/* Spin Trigger Button */}
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className={`w-full py-3.5 neo-brutalist-border neo-brutalist-shadow-yellow font-space font-extrabold text-sm uppercase tracking-widest transition-all focus:outline-none ${
              isSpinning 
                ? 'bg-zinc-200 text-zinc-400 border-zinc-300 cursor-not-allowed shadow-none translate-y-0' 
                : 'bg-brand-yellow text-brand-charcoal hover:scale-[1.02] active:translate-y-[2px] active:shadow-none'
            }`}
            id="minigame-spin-btn"
          >
            {isSpinning ? 'Girando o Caldeirão...' : '🎯 GIRAR A ROLETA'}
          </button>

          {/* Prize success view */}
          {wonPrize && (
            <div className="w-full bg-brand-surface-low border-2 border-dashed border-emerald-500 p-4 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <span className="text-2xl">🎉</span>
              <h5 className="font-space font-extrabold text-base uppercase text-emerald-600">
                VOCÊ GANHOU: {wonPrize.label}!
              </h5>
              <p className="font-sans text-xs text-zinc-500 font-semibold">
                {wonPrize.desc} Use no checkout para abater do valor final.
              </p>

              {/* Copy Coupon Code Box */}
              <div className="flex neo-brutalist-border max-w-xs mx-auto">
                <div className="bg-brand-charcoal text-white font-mono text-base px-4 py-2 flex-grow select-all flex items-center justify-center font-bold tracking-wider">
                  {wonPrize.code}
                </div>
                <button
                  onClick={() => handleCopyCode(wonPrize.code)}
                  className="bg-brand-yellow hover:bg-brand-charcoal hover:text-white text-brand-charcoal p-2.5 px-4 font-space font-extrabold text-xs uppercase tracking-wider focus:outline-none transition-colors shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
