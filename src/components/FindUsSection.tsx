import { useState, FormEvent } from 'react';
import { MapPin, Clock, Phone, Send, X } from 'lucide-react';

export default function FindUsSection() {
  const [activeLocation, setActiveLocation] = useState<'sp' | 'rj' | 'bh'>('sp');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'cartel'; text: string }>>([
    { sender: 'cartel', text: 'Saudações, subordinado. Aqui é o Don Escobart. Qual é a sua emergência de fome?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const locations = {
    sp: {
      name: 'São Paulo - Underground HQ',
      address: 'Rua: Manuel Mourato, 124, São Paulo, Brazil 08340-540',
      hours: 'Terça a Domingo: 18h às 23:30h',
      phone: '(11) 98385-6094',
      description: 'Nossa sede principal oculta sob um armazém industrial desativado na Zona Sul. Procure o letreiro neon amarelo.'
    }
  }

  const currentInfo = locations[activeLocation];

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    // Cartel auto answers based on message
    setTimeout(() => {
      let cartelReply = 'A chapa está quente por aqui! Faça seu pedido ou diga "PLATA O PLOMO" para códigos secretos.';
      const lower = userMsg.toLowerCase();
      if (lower.includes('plata') || lower.includes('plomo')) {
        cartelReply = '🤫 Silêncio! Você descobriu a senha de contrabando. Use o cupom "PLATA" no carrinho para 15% de desconto imediato!';
      } else if (lower.includes('cupom') || lower.includes('desconto')) {
        cartelReply = 'Temos uma roleta de cupons secreta no topo do site! Dê um giro de sorte lá.';
      } else if (lower.includes('endereço') || lower.includes('onde')) {
        cartelReply = `Atualmente você está consultando nosso bunker em ${currentInfo.name}. O endereço é: ${currentInfo.address}.`;
      } else if (lower.includes('horário') || lower.includes('aberto')) {
        cartelReply = `Operamos de vento em popa! Nosso horário em ${activeLocation.toUpperCase()} é ${currentInfo.hours}.`;
      } else if (lower.includes('oi') || lower.includes('olá')) {
        cartelReply = 'Olá! Que bom que entrou em contato. Qual hambúrguer do cartel vai escoltar hoje?';
      }

      setChatMessages(prev => [...prev, { sender: 'cartel', text: cartelReply }]);
    }, 800);
  };

  return (
    <section 
      id="contato" 
      className="py-16 md:py-24 px-4 md:px-8 bg-white border-b-4 border-brand-charcoal"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">
        
        {/* Left Column: Contact details & Location Switcher */}
        <div className="lg:w-5/12 space-y-8" id="contact-info">
          <div>
            <div className="inline-block bg-teal-400 text-brand-charcoal text-[10px] tracking-widest font-space font-extrabold px-3 py-1 uppercase sticker-rotate-ccw mb-2">
              Pontos de Abastecimento
            </div>
            <h2 className="font-headline text-4xl md:text-5xl uppercase text-brand-charcoal">
              ONDE NOS ENCONTRAR
            </h2>
            <p className="font-sans text-sm md:text-base text-zinc-500 font-semibold mt-1">
              Escolha o bunker do cartel mais próximo para carregar seus blends.
            </p>
          </div>

          {/* Sede/Location toggle tabs */}
          <div className="flex gap-2" id="location-tabs">
            {([
              { id: 'sp', label: 'SP' }
            ] as const).map((loc) => (
              <button
                key={loc.id}
                onClick={() => setActiveLocation(loc.id)}
                className={`px-4 py-2 neo-brutalist-border font-space font-extrabold text-xs tracking-wider transition-all focus:outline-none ${
                  activeLocation === loc.id 
                    ? 'bg-brand-yellow text-brand-charcoal shadow-[2px_2px_0px_0px_#1b1b1b]' 
                    : 'bg-white text-zinc-500 hover:bg-zinc-50'
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>

          {/* Details based on selected Headquarters */}
          <div className="space-y-6 bg-brand-surface-low p-6 neo-brutalist-border relative overflow-hidden" id="active-location-details">
            <h3 className="font-space font-extrabold text-lg text-brand-charcoal uppercase tracking-tight">
              {currentInfo.name}
            </h3>
            <p className="font-sans text-xs md:text-sm text-zinc-600 font-medium leading-relaxed italic">
              "{currentInfo.description}"
            </p>

            <div className="space-y-4 pt-2 border-t-2 border-dashed border-zinc-300">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-yellow neo-brutalist-border flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-brand-charcoal" />
                </div>
                <div>
                  <h4 className="font-space font-extrabold text-xs uppercase text-brand-charcoal tracking-wide">Endereço</h4>
                  <p className="font-sans text-xs md:text-sm text-zinc-600 font-semibold">{currentInfo.address}</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-yellow neo-brutalist-border flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-brand-charcoal" />
                </div>
                <div>
                  <h4 className="font-space font-extrabold text-xs uppercase text-brand-charcoal tracking-wide">Horário</h4>
                  <p className="font-sans text-xs md:text-sm text-zinc-600 font-semibold">{currentInfo.hours}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-yellow neo-brutalist-border flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-brand-charcoal" />
                </div>
                <div>
                  <h4 className="font-space font-extrabold text-xs uppercase text-brand-charcoal tracking-wide">WhatsApp Oficial</h4>
                  <p className="font-sans text-xs md:text-sm text-zinc-600 font-semibold">{currentInfo.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Chat CTA trigger */}
          <div className="pt-2">
            <button
              onClick={() => setChatOpen(true)}
              className="w-full py-4 neo-brutalist-border neo-brutalist-shadow-yellow bg-brand-charcoal text-white font-space font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-brand-charcoal hover:shadow-[6px_6px_0px_0px_#ffd000] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-3 focus:outline-none"
              id="talk-to-cartel-btn"
            >
              💬 FALAR COM O CARTEL
            </button>
          </div>
        </div>

        {/* Right Column: Dynamic Satelite Map Poster */}
        <div className="lg:w-7/12" id="contact-map">
          <div className="relative h-[400px] md:h-[480px] w-full neo-brutalist-border neo-brutalist-shadow grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden group cursor-pointer">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_iyG4HI_ANGU1Nrdk97rs1wsDg67dsuWMj9U7TBcegk8og55wgfyQC4YyUbNLOC1Xw7djftLGJoP6BZiZKpKyJeckA6rnMOSmTDgoXiRZiE242n_Tluq8bWBYLI3wbRgTkUxNhZtJTTG_2yflFHmP_LurCPl-BI-nDtA2NgK0_nfoK626WB6ug9rHrc_mdTJ_b8nLCgCnwZXvImfWdD72yc0aUD0nOYe0t2obuJ56Dta7-2xBY2TwtTb1sPqHtMk7xV9zIN59oS0" 
              alt={`Mapa de São Paulo - Bunker ${activeLocation.toUpperCase()}`}
              className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            
            {/* Pop-art badge on map */}
            <div className="absolute top-6 left-6 bg-brand-yellow text-brand-charcoal px-4 py-2 neo-brutalist-border font-space font-extrabold text-[10px] tracking-wider uppercase sticker-rotate-ccw">
              Área de Cobertura Segura
            </div>

            {/* Simulated bouncing pin locator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="relative">
                <span className="absolute -top-3 -right-3 flex h-6 w-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-yellow opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-brand-yellow/30"></span>
                </span>
                <div className="w-12 h-12 bg-brand-charcoal text-brand-yellow neo-brutalist-border rounded-full flex items-center justify-center animate-bounce shadow-lg">
                  <MapPin className="w-6 h-6 fill-brand-yellow text-brand-charcoal" />
                </div>
              </div>
              <div className="bg-brand-charcoal text-white font-space font-bold text-[9px] tracking-wider uppercase px-2.5 py-1 neo-brutalist-border mt-2 shadow">
                {activeLocation.toUpperCase()} BUNKER
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ================= FALAR COM O CARTEL SLIDE-IN CHATBOX BOX ================= */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 z-50 bg-white neo-brutalist-border neo-brutalist-shadow flex flex-col max-h-[500px] animate-in slide-in-from-bottom-8 duration-300">
          
          {/* Chat Header */}
          <div className="bg-brand-charcoal text-white px-4 py-3 flex justify-between items-center border-b-4 border-brand-charcoal">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <div>
                <span className="font-space font-extrabold text-sm uppercase tracking-wide">Don Escobart</span>
                <span className="block text-[9px] text-zinc-400 font-bold uppercase leading-none">Chef Executivo do Cartel</span>
              </div>
            </div>
            <button 
              onClick={() => setChatOpen(false)}
              className="text-zinc-400 hover:text-brand-yellow focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-zinc-50 h-64 font-sans text-sm font-semibold max-h-[300px]">
            {chatMessages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 neo-brutalist-border rounded text-xs md:text-sm font-medium ${
                    msg.sender === 'user' 
                      ? 'bg-brand-yellow text-brand-charcoal border-brand-charcoal rounded-br-none' 
                      : 'bg-white text-brand-charcoal border-zinc-400 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t-2 border-brand-charcoal bg-white flex gap-2">
            <input 
              type="text" 
              placeholder="Digite aqui... (Tente 'senha')"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-grow px-3 py-2 neo-brutalist-border text-xs md:text-sm placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-brand-yellow"
            />
            <button
              type="submit"
              className="bg-brand-yellow p-2.5 neo-brutalist-border hover:bg-brand-charcoal hover:text-white transition-colors flex items-center justify-center focus:outline-none"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </section>
  );
}
