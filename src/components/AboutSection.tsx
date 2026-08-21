import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export default function AboutSection() {
  const [activeStatFact, setActiveStatFact] = useState<string | null>(null);

  const stats = [
    {
      id: 'stat-bacon',
      value: '12kg',
      label: 'Bacon p/ dia',
      fact: 'Isso equivale a mais de 500 tiras de pura crocância preparadas artesanalmente todas as manhãs!'
    },
    {
      id: 'stat-artesanal',
      value: '100%',
      label: 'Artesanal',
      fact: 'Do blend à maionese de trufas, absolutamente tudo é feito do zero pelos nossos chefs, sem conservantes.'
    },
    {
      id: 'stat-arrependimento',
      value: '0',
      label: 'Arrependimento',
      fact: 'Nenhum cliente jamais se arrependeu de assaltar nossa cozinha. Satisfação ou dobro de cheddar no próximo!'
    }
  ];

  return (
    <section 
      id="sobre" 
      className="py-16 md:py-24 px-4 md:px-8 bg-brand-charcoal text-white relative overflow-hidden border-b-4 border-brand-charcoal"
    >
      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Story text & interactive counters */}
        <div className="space-y-8" id="about-story">
          <div className="space-y-4">
            <div className="inline-block bg-brand-yellow text-brand-charcoal text-[10px] tracking-widest font-space font-extrabold px-3 py-1 uppercase sticker-rotate-ccw mb-1">
              Dossiê Secreto
            </div>
            <h2 className="font-headline text-5xl md:text-7xl text-brand-yellow leading-none uppercase tracking-tight">
              OPERAÇÃO <br /> SUBTERRÂNEA
            </h2>
          </div>

          <div className="space-y-6 font-sans text-sm md:text-base text-zinc-300 font-semibold leading-relaxed">
            <p>
              A Escobart não é apenas uma hamburgueria. É uma rede de distribuição de dopamina em forma de burger. Nascemos na cena urbana, inspirados pela cultura de rua e pela vontade de fazer algo que desafiasse as leis do paladar convencional.
            </p>
            <p className="border-l-4 border-brand-yellow pl-5 italic text-brand-yellow font-space font-bold text-base md:text-lg bg-white/5 py-3 pr-2 rounded-r">
              "Nossa missão é simples: entregar um sabor tão absurdo que você vai achar que deveria ser proibido. Sem frescura, sem regras, apenas carne, fogo e uma obsessão doentia pela perfeição."
            </p>
            <p>
              Trabalhamos apenas com o "mercado negro" dos fornecedores locais: ingredientes premium, técnicas artesanais e uma equipe que leva o termo 'mão na massa' ao pé da letra. Bem-vindo ao cartel do sabor.
            </p>
          </div>

          {/* Interactive Statistics Grid */}
          <div className="space-y-3 pt-4">
            <span className="block font-space font-extrabold text-xs uppercase text-zinc-400 tracking-wider">
              Clique nos números para revelar segredos da operação:
            </span>
            
            <div className="grid grid-cols-3 gap-4" id="about-stats">
              {stats.map((stat) => (
                <button
                  key={stat.id}
                  onClick={() => setActiveStatFact(activeStatFact === stat.id ? null : stat.id)}
                  className={`p-4 neo-brutalist-border flex flex-col items-start text-left hover:scale-[1.04] transition-all focus:outline-none relative group ${
                    activeStatFact === stat.id ? 'bg-brand-yellow text-brand-charcoal border-brand-yellow' : 'bg-white/5 border-zinc-600'
                  }`}
                >
                  <span className={`font-headline text-3xl md:text-5xl leading-none transition-colors ${
                    activeStatFact === stat.id ? 'text-brand-charcoal' : 'text-brand-yellow'
                  }`}>
                    {stat.value}
                  </span>
                  <span className={`font-space font-extrabold text-[10px] md:text-xs uppercase tracking-wider mt-2 block ${
                    activeStatFact === stat.id ? 'text-brand-charcoal' : 'text-zinc-400'
                  }`}>
                    {stat.label}
                  </span>
                  
                  {/* Subtle info indicator */}
                  <HelpCircle className={`absolute top-2 right-2 w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity ${
                    activeStatFact === stat.id ? 'text-brand-charcoal' : 'text-zinc-400'
                  }`} />
                </button>
              ))}
            </div>

            {/* Fact Box Overlay */}
            {activeStatFact && (
              <div className="bg-brand-yellow text-brand-charcoal p-4 neo-brutalist-border neo-brutalist-shadow animate-in zoom-in-95 duration-200">
                <p className="font-sans font-bold text-xs md:text-sm">
                  📢 <span className="font-space font-extrabold">FATO CONFIRMADO:</span> {stats.find(s => s.id === activeStatFact)?.fact}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Brutalist Collage of Images with Overlapping Badges */}
        <div className="relative w-full py-8 md:py-12" id="about-collage">
          <div className="grid grid-cols-2 gap-4">
            {/* Polaroid 1 (Hands crushing burger) */}
            <div className="neo-brutalist-border border-white p-2 rotate-3 bg-brand-yellow/10 hover:rotate-0 transition-transform duration-300 max-w-[240px]">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy7RDr1-GN8UO3eizEY9YLQ_g0st-hwvr_ap9UbWK_qxtqFpvgbTT9KEh3ZKqfb6HSwNNCGvPxIo_iRM1wyBPOsyrcFB9ux7aN30qpjDUsymGloFJCP6BQgECPhD7fdw1fNLy8FFuNMIauKeLjqc4sLuD2tUvmE7_78aGZLwCXimO1KObsUVK0zxvodOH6x9975BccXvvjwq2kGDApU7afH1ZhomjrkP1zWleDl6kogH5G_PFlkyqa98sxvrkvYJt3e_zjOcrBSCg" 
                alt="Chapa pegando fogo" 
                className="w-full h-auto grayscale brightness-110 contrast-125 border border-white"
                referrerPolicy="no-referrer"
              />
              <span className="block font-space font-bold text-[10px] text-center mt-2 text-zinc-400 uppercase">Aço e Fogo</span>
            </div>

            {/* Polaroid 2 (Burger joint neon interior) */}
            <div className="neo-brutalist-border border-white p-2 -rotate-2 bg-white text-brand-charcoal hover:rotate-0 transition-transform duration-300 mt-8 max-w-[240px]">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtj8dIpMozkrH2HFYmN5GPFIxsYVoDBKP2yGiDX1Xtvo9Yks8eoZheKmi9e1aSRi0yzWvaUdhwT4RYbtd-uSiAhYD2DuTbgRvkzrpG3_gCUwjUicsjdDvqw3WGOs5vbtEZqWkz4l-Z8C0GYgbQf4U1-_TbqnLyONm5uKn8NMH4-CCKJW155btSlB248587ow2zX3hacFu8ev0H0ezaHm4G-94ulF8hhBxQ_2jNbnjfgLyQugcjCyxN8NKsAQ5h7LgP8hPoNXxEW3k" 
                alt="Ambiente Escobart" 
                className="w-full h-auto border border-brand-charcoal"
                referrerPolicy="no-referrer"
              />
              <span className="block font-space font-bold text-[10px] text-center mt-2 text-brand-charcoal uppercase">HQ Subterrâneo</span>
            </div>

            {/* Polaroid 3 - Large banner ingredient collage */}
            <div className="col-span-2 neo-brutalist-border border-brand-yellow p-2 rotate-1 mt-4 hover:rotate-0 transition-transform duration-300">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoIekWRojbrcqK2gLThpDB_yg0vJtTYf0iXUTpyrw138XLduCAvdrLLLpKpIeUDdEJouj3duDtQiXpHkwtveRQnEEH5hP9Li6iQw0-MpPe2hz-SWoqNFzHiId86RVAoVNinkkhVXIsdWhgPYuBbEWpL2a_rnxO0Hv8Q9ccYSBq-usPI61CXHmvf7mFTubkDFCjlC_xf01MpeIqbQW8GGfEYpHOimEY2uEjdayExyFgDxKFdGM-mFB8S_sLk3ACfoAryqWV-ZwGlYU" 
                alt="Ingredientes Puros" 
                className="w-full h-36 md:h-44 object-cover border border-brand-yellow"
                referrerPolicy="no-referrer"
              />
              <span className="block font-space font-bold text-[10px] text-center mt-2 text-brand-yellow uppercase">Materia Prima Proibida</span>
            </div>
          </div>

          {/* Overlapping Badge: "Original Gangsta" */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-yellow text-brand-charcoal px-6 py-5 neo-brutalist-border sticker-rotate-ccw hover:scale-110 hover:rotate-6 transition-transform duration-300 cursor-pointer shadow-2xl select-none z-20">
            <span className="font-headline text-2xl md:text-3xl leading-none text-center block uppercase tracking-wide">
              ORIGINAL <br /> GANGSTA
            </span>
          </div>
        </div>

      </div>

      {/* Giant watermark vertical text on the right edge */}
      <div className="absolute right-0 top-0 h-full hidden xl:flex items-center pointer-events-none opacity-[0.02] select-none">
        <span className="font-headline text-[10rem] uppercase rotate-90 origin-center whitespace-nowrap tracking-[1.5em] text-white">
          ESCOBART BURGER
        </span>
      </div>
    </section>
  );
}
