import { useState, useMemo } from 'react';
import { 
  X, ShoppingCart, Plus, Minus, Trash2, Percent, 
  Truck, Store, Clock, CreditCard, CheckCircle, Compass 
} from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity, 
  onRemoveItem,
  onClearCart
}: CartDrawerProps) {
  // Checkout & Ordering flow states
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  // Shipping details states
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'money' | 'card'>('pix');
  const [paymentChange, setPaymentChange] = useState('');

  // Delivery simulation tracking state
  const [trackingActive, setTrackingActive] = useState(false);
  const [trackingStep, setTrackingStep] = useState(0);

  // Computations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      let itemPrice = item.menuItem.price;
      if (item.customizations.extraBacon) itemPrice += 6.00;
      if (item.customizations.extraPatty) itemPrice += 12.00;
      if (item.customizations.extraCheese) itemPrice += 4.00;
      return sum + (itemPrice * item.quantity);
    }, 0);
  }, [cart]);

  const deliveryFee = deliveryType === 'delivery' ? 8.00 : 0;
  
  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return subtotal * appliedCoupon.discount;
  }, [subtotal, appliedCoupon]);

  const total = useMemo(() => {
    return Math.max(0, subtotal + deliveryFee - discountAmount);
  }, [subtotal, deliveryFee, discountAmount]);

  // Apply Coupon
  const handleApplyCoupon = () => {
    setCouponError('');
    const cleanCoupon = couponCode.trim().toUpperCase();
    if (!cleanCoupon) return;

    if (cleanCoupon === 'PLATA' || cleanCoupon === 'PLOMO') {
      setAppliedCoupon({ code: cleanCoupon, discount: 0.15 });
      setCouponCode('');
    } else if (cleanCoupon === 'BACONCRIME') {
      setAppliedCoupon({ code: cleanCoupon, discount: 0.10 });
      setCouponCode('');
    } else if (cleanCoupon === 'CHEF10') {
      setAppliedCoupon({ code: cleanCoupon, discount: 0.10 });
      setCouponCode('');
    } else {
      setCouponError('Cupom inválido ou expirado.');
    }
  };

  // Build the text of the Whatsapp order
  const handleConfirmOrder = () => {
    if (!clientName.trim() || !clientPhone.trim() || (deliveryType === 'delivery' && !clientAddress.trim())) {
      alert('Por favor, preencha todos os dados obrigatórios para contato!');
      return;
    }

    // Generate WhatsApp text message
    let message = `⚡ *NOVO PEDIDO DO CARTEL ESCOBART* ⚡\n\n`;
    message += `👤 *Cliente:* ${clientName}\n`;
    message += `📞 *Tel:* ${clientPhone}\n`;
    message += `🛵 *Tipo:* ${deliveryType === 'delivery' ? 'Entrega em Casa' : 'Retirada no Balcão'}\n`;
    if (deliveryType === 'delivery') {
      message += `📍 *Endereço:* ${clientAddress}\n`;
    }
    message += `💳 *Pagamento:* ${paymentMethod.toUpperCase()}`;
    if (paymentMethod === 'money' && paymentChange) {
      message += ` (Troco para R$ ${paymentChange})`;
    }
    message += `\n\n--- *ITENS DO PEDIDO* ---\n`;

    cart.forEach((item) => {
      let options: string[] = [];
      if (item.customizations.extraBacon) options.push('Bacon Extra (+R$6)');
      if (item.customizations.extraPatty) options.push('Carne Extra Angus (+R$12)');
      if (item.customizations.extraCheese) options.push('Queijo Extra (+R$4)');
      if (item.customizations.removeOnions) options.push('Sem Cebola');
      
      const optStr = options.length > 0 ? ` [${options.join(', ')}]` : '';
      const noteStr = item.notes ? `\n   _(Obs: ${item.notes})_` : '';
      
      message += `• *${item.quantity}x ${item.menuItem.name}*${optStr}${noteStr}\n`;
    });

    message += `\n-------------------------\n`;
    message += `Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    if (deliveryType === 'delivery') {
      message += `Taxa de Entrega: R$ ${deliveryFee.toFixed(2).replace('.', ',')}\n`;
    }
    if (appliedCoupon) {
      message += `Desconto (${appliedCoupon.code}): -R$ ${discountAmount.toFixed(2).replace('.', ',')}\n`;
    }
    message += `*Total Final: R$ ${total.toFixed(2).replace('.', ',')}*\n`;

    // Encode text
    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5511983856094?text=${encodedText}`;

    // Open WhatsApp in a safe manner
    window.open(whatsappUrl, '_blank');

    // Trigger Delivery Tracker Simulator on-screen
    setTrackingActive(true);
    setTrackingStep(1);

    // Simulate cooking, packaging, and driving progress
    const intervals = [3000, 7000, 11000, 16000];
    intervals.forEach((ms, idx) => {
      setTimeout(() => {
        setTrackingStep(idx + 1);
      }, ms);
    });
  };

  const handleResetCheckout = () => {
    setIsCheckoutMode(false);
    setTrackingActive(false);
    setTrackingStep(0);
    onClearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-fade-in bg-brand-charcoal/80">
      <div 
        className="w-full max-w-lg bg-white neo-brutalist-border h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
        id="cart-drawer-panel"
      >
        
        {/* ================= HEADER PANEL ================= */}
        <div className="bg-brand-charcoal text-white p-4 flex justify-between items-center border-b-4 border-brand-charcoal">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-brand-yellow" />
            <span className="font-space font-extrabold text-lg uppercase tracking-tight">
              {trackingActive ? 'Acompanhar Distribuição' : isCheckoutMode ? 'Dados de Entrega' : 'Carrinho do Cartel'}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-brand-yellow focus:outline-none transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* ================= CASE 1: TRACKING PROGRESS FLOW (After checkout completes) ================= */}
        {trackingActive ? (
          <div className="flex-grow p-6 flex flex-col justify-between overflow-y-auto space-y-8" id="tracking-flow">
            
            <div className="text-center space-y-3">
              <span className="text-5xl animate-bounce inline-block">🍔</span>
              <h4 className="font-space font-extrabold text-xl uppercase text-brand-charcoal">
                OPERACIONAL INICIADO!
              </h4>
              <p className="font-sans text-xs md:text-sm text-zinc-500 font-semibold leading-relaxed">
                Seu pedido foi transmitido com sucesso ao WhatsApp do cartel de cozinha! Acompanhe abaixo o status logístico da sua remessa.
              </p>
            </div>

            {/* Vertical Tracker Milestones */}
            <div className="space-y-6 max-w-sm mx-auto w-full pt-4">
              {([
                { step: 1, title: 'Transmissão do Pedido', desc: 'Sinal recebido pelo radiotransmissor da cozinha.', emoji: '📡' },
                { step: 2, title: 'Angus Premium na Chapa', desc: 'Os hambúrgueres estão selando em fogo alto.', emoji: '🔥' },
                { step: 3, title: 'Montando o Arsenal', desc: 'Brioche tostado, queijo derretido e embalagem secreta.', emoji: '📦' },
                { step: 4, title: 'Remessa em Trânsito', desc: 'O mensageiro acelerou a moto para te entregar quente!', emoji: '🛵' }
              ] as const).map((milestone) => {
                const isActive = trackingStep >= milestone.step;
                const isCurrent = trackingStep === milestone.step;
                return (
                  <div key={milestone.step} className="flex gap-4 items-start">
                    {/* Circle line linkage */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-8 h-8 rounded-full neo-brutalist-border flex items-center justify-center font-space font-extrabold text-xs transition-colors ${
                        isActive ? 'bg-brand-yellow text-brand-charcoal' : 'bg-zinc-100 text-zinc-400 border-zinc-300'
                      } ${isCurrent ? 'animate-pulse scale-110' : ''}`}>
                        {milestone.emoji}
                      </div>
                      {milestone.step < 4 && (
                        <div className={`w-1 h-10 border-l-2 transition-colors ${
                          trackingStep > milestone.step ? 'border-brand-yellow' : 'border-zinc-200 border-dashed'
                        }`} />
                      )}
                    </div>

                    <div>
                      <h5 className={`font-space font-extrabold text-sm uppercase ${
                        isActive ? 'text-brand-charcoal' : 'text-zinc-400 font-medium'
                      }`}>
                        {milestone.title}
                      </h5>
                      <p className={`font-sans text-[11px] md:text-xs ${
                        isActive ? 'text-zinc-500' : 'text-zinc-300'
                      }`}>
                        {milestone.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Estimated Arrival / Success panel */}
            <div className="bg-brand-surface-low p-4 neo-brutalist-border text-center space-y-2">
              <span className="font-sans text-[10px] text-zinc-400 font-extrabold uppercase">Previsão Estimada</span>
              <div className="font-space font-extrabold text-2xl text-brand-charcoal">
                {deliveryType === 'delivery' ? '25 a 40 minutos' : '15 a 20 minutos'}
              </div>
              <span className="font-sans text-[10px] text-emerald-500 font-extrabold uppercase block">
                🚚 Entrega Segura Ativada
              </span>
            </div>

            {/* Finish action button */}
            <button
              onClick={handleResetCheckout}
              className="w-full bg-brand-charcoal text-white py-4 neo-brutalist-border font-space font-bold text-xs uppercase tracking-widest hover:bg-brand-yellow hover:text-brand-charcoal transition-colors focus:outline-none"
            >
              OK, VOLTAR AO INÍCIO
            </button>

          </div>
        ) : isCheckoutMode ? (
          /* ================= CASE 2: SHIPPING DETAILS & CONFIRMATION FORM ================= */
          <div className="flex-grow p-6 overflow-y-auto flex flex-col justify-between" id="checkout-form">
            <div className="space-y-6">
              
              {/* Type selector tabs (Delivery vs Pickup) */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`py-3 neo-brutalist-border font-space font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all focus:outline-none ${
                    deliveryType === 'delivery' 
                      ? 'bg-brand-yellow text-brand-charcoal shadow-[2px_2px_0px_0px_#1b1b1b]' 
                      : 'bg-white text-zinc-500'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Entrega (+R$ 8)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`py-3 neo-brutalist-border font-space font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all focus:outline-none ${
                    deliveryType === 'pickup' 
                      ? 'bg-brand-yellow text-brand-charcoal shadow-[2px_2px_0px_0px_#1b1b1b]' 
                      : 'bg-white text-zinc-500'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Retirada Grátis</span>
                </button>
              </div>

              {/* Form Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block font-space font-extrabold text-xs uppercase text-brand-charcoal mb-1">
                    Seu Nome Completo *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Pedro de Alcantara"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 neo-brutalist-border font-sans font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  />
                </div>

                <div>
                  <label className="block font-space font-extrabold text-xs uppercase text-brand-charcoal mb-1">
                    Telefone p/ Contato (WhatsApp) *
                  </label>
                  <input 
                    type="tel" 
                    required
                    placeholder="Ex: (11) 99999-9999"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3 py-2 neo-brutalist-border font-sans font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  />
                </div>

                {deliveryType === 'delivery' && (
                  <div>
                    <label className="block font-space font-extrabold text-xs uppercase text-brand-charcoal mb-1">
                      Endereço de Entrega Completo *
                    </label>
                    <textarea 
                      required
                      rows={2}
                      placeholder="Rua, Número, Complemento, Bairro"
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                      className="w-full px-3 py-2 neo-brutalist-border font-sans font-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                    />
                  </div>
                )}

                {/* Payment Method selector */}
                <div className="space-y-2">
                  <span className="block font-space font-extrabold text-xs uppercase text-brand-charcoal">
                    Forma de Pagamento
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { id: 'pix', label: 'PIX' },
                      { id: 'money', label: 'Dinheiro' },
                      { id: 'card', label: 'Cartão (Maquininha)' }
                    ] as const).map((pay) => (
                      <button
                        key={pay.id}
                        type="button"
                        onClick={() => setPaymentMethod(pay.id)}
                        className={`py-2.5 neo-brutalist-border font-space font-extrabold text-[11px] uppercase transition-all focus:outline-none ${
                          paymentMethod === pay.id 
                            ? 'bg-brand-charcoal text-white' 
                            : 'bg-white text-zinc-500'
                        }`}
                      >
                        {pay.label}
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'money' && (
                    <div className="pt-2 animate-in slide-in-from-top-1 duration-150">
                      <label className="block font-space font-extrabold text-[10px] uppercase text-zinc-500 mb-1">
                        Precisa de troco para quanto? (Deixe em branco se não precisar)
                      </label>
                      <input 
                        type="text" 
                        placeholder="Ex: Troco para R$ 100,00"
                        value={paymentChange}
                        onChange={(e) => setPaymentChange(e.target.value)}
                        className="w-full px-3 py-1.5 neo-brutalist-border font-sans font-semibold text-xs focus:outline-none focus:ring-1 focus:ring-brand-yellow"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Order total overview inside checkout */}
              <div className="p-4 bg-brand-surface-low neo-brutalist-border space-y-2 text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Subtotal dos itens:</span>
                  <span className="text-brand-charcoal">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                {deliveryType === 'delivery' && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Taxa de entrega terceirizada:</span>
                    <span className="text-brand-charcoal">R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Cupom ({appliedCoupon.code}) Aplicado:</span>
                    <span>- R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t-2 border-dashed border-zinc-300 text-sm font-bold">
                  <span className="font-space uppercase tracking-wide">Total a Pagar:</span>
                  <span className="font-space text-lg text-brand-charcoal">R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setIsCheckoutMode(false)}
                className="w-1/3 bg-white text-brand-charcoal py-4 neo-brutalist-border font-space font-bold text-xs uppercase"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirmOrder}
                className="w-2/3 bg-brand-yellow text-brand-charcoal py-4 neo-brutalist-border neo-brutalist-shadow font-space font-extrabold text-xs uppercase tracking-wider hover:scale-[1.02] active:translate-y-[2px] transition-all"
              >
                Enviar ao WhatsApp 🚀
              </button>
            </div>
          </div>
        ) : (
          /* ================= CASE 3: STANDARD CART ITEM LISTING & QUANTITY EDITORS ================= */
          <div className="flex-grow flex flex-col justify-between overflow-hidden" id="standard-cart">
            
            {cart.length === 0 ? (
              /* Empty Cart Panel */
              <div className="flex-grow flex flex-col items-center justify-center p-12 text-center" id="empty-cart-state">
                <span className="text-5xl animate-bounce">🛒</span>
                <h4 className="font-space font-extrabold text-lg uppercase text-brand-charcoal mt-4">Carrinho Vazio</h4>
                <p className="font-sans text-xs md:text-sm text-zinc-500 mt-1 max-w-xs font-semibold leading-relaxed">
                  Sua munição contra a fome está zerada. Adicione hambúrgueres e acompanhamentos do cardápio!
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 bg-brand-yellow text-brand-charcoal px-6 py-2.5 neo-brutalist-border font-space font-bold text-xs uppercase tracking-widest hover:scale-105 active:translate-y-[2px]"
                >
                  Carregar Arsenal
                </button>
              </div>
            ) : (
              /* Item listing */
              <div className="flex-grow overflow-y-auto p-4 space-y-4" id="cart-items-scroll">
                {cart.map((item) => {
                  // Compute customized item price
                  let baseItemPrice = item.menuItem.price;
                  let customizationsList: string[] = [];
                  if (item.customizations.extraBacon) {
                    baseItemPrice += 6.00;
                    customizationsList.push('Bacon Extra (+R$6)');
                  }
                  if (item.customizations.extraPatty) {
                    baseItemPrice += 12.00;
                    customizationsList.push('Carne Angus Extra (+R$12)');
                  }
                  if (item.customizations.extraCheese) {
                    baseItemPrice += 4.00;
                    customizationsList.push('Queijo Extra (+R$4)');
                  }
                  if (item.customizations.removeOnions) {
                    customizationsList.push('Sem Cebola');
                  }

                  const itemTotalPrice = baseItemPrice * item.quantity;

                  return (
                    <div 
                      key={item.id}
                      className="bg-white p-4 neo-brutalist-border flex gap-4 relative group"
                    >
                      {/* Image */}
                      <img 
                        src={item.menuItem.image} 
                        alt={item.menuItem.name} 
                        className="w-16 h-16 object-cover neo-brutalist-border shrink-0 bg-zinc-100"
                        referrerPolicy="no-referrer"
                      />

                      {/* Info & options */}
                      <div className="flex-grow">
                        <span className="font-space font-extrabold text-sm text-brand-charcoal block leading-tight">
                          {item.menuItem.name}
                        </span>
                        
                        {customizationsList.length > 0 && (
                          <span className="block font-sans text-[10px] text-zinc-500 font-bold leading-relaxed mt-1">
                            🔩 {customizationsList.join(', ')}
                          </span>
                        )}

                        {item.notes && (
                          <span className="block font-sans text-[10px] text-zinc-400 font-medium italic mt-0.5">
                            📝 Obs: {item.notes}
                          </span>
                        )}

                        <span className="font-space font-extrabold text-sm text-brand-charcoal block mt-2">
                          R$ {itemTotalPrice.toFixed(2).replace('.', ',')}
                        </span>
                      </div>

                      {/* Quantity editors */}
                      <div className="flex flex-col justify-between items-end gap-2">
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-zinc-400 hover:text-red-500 p-1 transition-colors"
                          title="Remover item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <div className="flex items-center neo-brutalist-border bg-zinc-100 h-8 overflow-hidden">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="px-2 bg-white text-brand-charcoal hover:bg-brand-yellow font-bold text-sm h-full"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 font-space font-extrabold text-xs text-brand-charcoal">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="px-2 bg-white text-brand-charcoal hover:bg-brand-yellow font-bold text-sm h-full"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {/* ================= BOTTOM CALCULATOR PANEL (Only if items exist) ================= */}
            {cart.length > 0 && (
              <div className="p-4 bg-brand-surface-low border-t-4 border-brand-charcoal space-y-4" id="cart-calculator-panel">
                
                {/* Coupon input */}
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <input 
                        type="text" 
                        placeholder="CUPOM DE DESCONTO"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 neo-brutalist-border bg-white text-xs font-space font-extrabold placeholder-zinc-400 focus:outline-none text-brand-charcoal"
                      />
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal" />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      className="bg-brand-charcoal text-white hover:bg-brand-yellow hover:text-brand-charcoal px-4 py-2 neo-brutalist-border font-space font-bold text-xs uppercase"
                    >
                      Aplicar
                    </button>
                  </div>
                  
                  {couponError && <span className="block text-[10px] text-red-500 font-bold">{couponError}</span>}
                  {appliedCoupon && (
                    <span className="block text-[10px] text-emerald-600 font-extrabold uppercase">
                      ✓ CUPOM {appliedCoupon.code} ATIVADO ({(appliedCoupon.discount * 100)}% DESCONTO!)
                    </span>
                  )}
                </div>

                {/* Subtotals & total breakdown */}
                <div className="space-y-2 text-xs font-semibold">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Subtotal:</span>
                    <span className="text-brand-charcoal">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Desconto Especial:</span>
                      <span>- R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t-2 border-dashed border-zinc-300 text-sm font-bold">
                    <span className="font-space uppercase tracking-wider">Total Parcial:</span>
                    <span className="font-space text-lg text-brand-charcoal">
                      R$ {total.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={() => setIsCheckoutMode(true)}
                  className="w-full bg-brand-yellow text-brand-charcoal hover:bg-brand-charcoal hover:text-white py-4 neo-brutalist-border neo-brutalist-shadow-hover font-space font-extrabold text-xs tracking-wider uppercase"
                >
                  AVANÇAR PARA CHECOUT 🛵
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
