import { useState, useMemo, FormEvent } from 'react';
import { 
  Search, Star, ChevronLeft, ChevronRight, 
  Plus, X, Info, Check, MessageSquare, Send 
} from 'lucide-react';
import { MenuItem, CartItem, Review } from '../types';
import { MENU_ITEMS } from '../data/menu';

interface MenuSectionProps {
  onAddToCart: (item: MenuItem, customizations: CartItem['customizations'], notes: string) => void;
}

export default function MenuSection({ onAddToCart }: MenuSectionProps) {
  // Menu filtering & search states
  const [selectedCategory, setSelectedCategory] = useState<'all' | MenuItem['category']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Customization modal states (Burgers)
  const [activeCustomizeItem, setActiveCustomizeItem] = useState<MenuItem | null>(null);
  const [extraBacon, setExtraBacon] = useState(false);
  const [extraPatty, setExtraPatty] = useState(false);
  const [extraCheese, setExtraCheese] = useState(false);
  const [removeOnions, setRemoveOnions] = useState(false);
  
  // Customization modal states (Sides, Drinks, Beers, Caipirinhas, Destilados)
  const [selectedSize, setSelectedSize] = useState<'P' | 'M' | 'G'>('P');
  const [selectedCut, setSelectedCut] = useState('Tradicional');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [selectedType, setSelectedType] = useState('Dose');
  const [selectedBeer, setSelectedBeer] = useState(''); // Armazena "Nome|Preco"
  const [customNotes, setCustomNotes] = useState('');

  const [infoItem, setInfoItem] = useState<MenuItem | null>(null);

  // Featured Carousel slider state
  const [carouselIndex, setCarouselIndex] = useState(0);
  const featuredBurgers = useMemo(() => {
    return MENU_ITEMS.filter(item => item.id === 'el-patron' || item.id === 'bart' || item.id === 'homer');
  }, []);

  const handleNextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % featuredBurgers.length);
  };

  const handlePrevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + featuredBurgers.length) % featuredBurgers.length);
  };

  // Filtered menu lists
  const filteredMenuItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Handle opening customizer
  const openCustomizer = (item: MenuItem) => {
    setActiveCustomizeItem(item);
    
    // Reseta todos os estados sempre que abre um novo item
    setExtraBacon(false);
    setExtraPatty(false);
    setExtraCheese(false);
    setRemoveOnions(false);
    setSelectedSize('P');
    setSelectedCut('Tradicional');
    setSelectedBrand('');
    setSelectedFlavor('');
    setSelectedType('Dose');
    setSelectedBeer('');
    setCustomNotes('');
  };

  // Compute live customization price
  const computedCustomizePrice = useMemo(() => {
    if (!activeCustomizeItem) return 0;
    let price = activeCustomizeItem.price;

    if (activeCustomizeItem.category === 'burgers') {
      if (extraBacon) price += 6.00;
      if (extraPatty) price += 12.00;
      if (extraCheese) price += 4.00;
    } 
    
    // Lógica de preços dinâmicos para batata agrupada
    if (activeCustomizeItem.id === 'batata-frita-opcoes') {
      if (selectedSize === 'M') price += 5.00; 
      if (selectedSize === 'G') price += 10.00; 
      if (extraBacon) price += 5.00; 
    }

    // Lógica de preço dinâmico para Cervejas
    if (activeCustomizeItem.category === 'cervejas' && selectedBeer) {
      const beerPrice = parseFloat(selectedBeer.split('|')[1]);
      if (!isNaN(beerPrice)) {
        price = beerPrice;
      }
    }

    return price;
  }, [activeCustomizeItem, extraBacon, extraPatty, extraCheese, selectedSize, selectedBeer]);

  // Handle adding customized item to cart
  const handleConfirmCustomization = () => {
    if (!activeCustomizeItem) return;

    let dynamicNotes = customNotes;
    
    if (activeCustomizeItem.id === 'batata-frita-opcoes') {
      dynamicNotes = `Tamanho: ${selectedSize} | Corte: ${selectedCut} ${dynamicNotes ? '| Obs: ' + dynamicNotes : ''}`;
    } else if (activeCustomizeItem.category === 'caipirinhas') {
      dynamicNotes = `Sabor (Time): ${selectedFlavor || 'A escolher'} | Destilado: ${selectedBrand || 'A escolher'} ${dynamicNotes ? '| Obs: ' + dynamicNotes : ''}`;
    } else if (activeCustomizeItem.category === 'cervejas') {
      const beerName = selectedBeer ? selectedBeer.split('|')[0] : 'A escolher';
      dynamicNotes = `Opção: ${beerName} ${dynamicNotes ? '| Obs: ' + dynamicNotes : ''}`;
    } else if (activeCustomizeItem.category === 'destilados') {
      dynamicNotes = `Tipo: ${selectedType} | Marca: ${selectedBrand || 'A escolher'} ${dynamicNotes ? '| Obs: ' + dynamicNotes : ''}`;
    }

    onAddToCart(
      activeCustomizeItem,
      {
        extraBacon,
        extraPatty,
        extraCheese,
        removeOnions
      },
      dynamicNotes
    );
    setActiveCustomizeItem(null);
  };

  // Predefined community reviews
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-1',
      author: 'Rodrigo "Caveira" Silva',
      role: 'Piloto de Fuga & Degustador',
      rating: 5,
      comment: 'O "Homer" é criminoso de tão bom! A combinação do pesto de pimentão com jalapeño é perfeita.',
      date: 'Hoje'
    },
    {
      id: 'rev-2',
      author: 'Letícia "Gigi" Medeiros',
      role: 'Sommelier de Porções',
      rating: 5,
      comment: 'O blend d\'El Patron é inacreditavelmente suculento. E a caipirinha Real Madrid é a melhor da região!',
      date: 'Ontem'
    },
    {
      id: 'rev-3',
      author: 'Bruno "Patrão" Santos',
      role: 'Especialista em Fritas',
      rating: 4,
      comment: 'Entregaram voando! A Batata à Moda da Casa com costela desfiada é surreal de boa. Recomendo muito.',
      date: 'Há 3 dias'
    }
  ]);

  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewRole, setNewReviewRole] = useState('Cliente Regular');

  const handleAddReview = (e: FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;
    const addedReview: Review = {
      id: `rev-${Date.now()}`,
      author: newReviewName,
      role: newReviewRole || 'Membro do Cartel',
      rating: newReviewRating,
      comment: newReviewComment,
      date: 'Agora mesmo'
    };
    setReviews([addedReview, ...reviews]);
    setNewReviewName('');
    setNewReviewComment('');
    setNewReviewRating(5);
    setNewReviewRole('');
  };

  return (
    <section id="cardapio" className="py-16 md:py-24 px-4 md:px-8 bg-brand-surface-low border-y-4 border-brand-charcoal">
      <div className="max-w-7xl mx-auto">
        
        {/* ================= SECTION 1: THE EXCLUSIVE FEATURING CAROUSEL ================= */}
        <div className="mb-20" id="featured-carousel">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <div className="inline-block bg-brand-charcoal text-white text-[10px] tracking-widest font-space font-extrabold px-3 py-1 uppercase mb-2">
                O Top 3 Mais Procurados
              </div>
              <h2 className="font-headline text-4xl md:text-5xl uppercase tracking-tight text-brand-charcoal">
                MAIS PROCURADOS
              </h2>
            </div>
            
            <div className="flex gap-4">
              <button onClick={handlePrevCarousel} className="w-12 h-12 bg-brand-charcoal text-white hover:bg-brand-yellow hover:text-brand-charcoal flex items-center justify-center neo-brutalist-border transition-colors focus:outline-none">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={handleNextCarousel} className="w-12 h-12 bg-brand-yellow text-brand-charcoal hover:bg-brand-charcoal hover:text-white flex items-center justify-center neo-brutalist-border transition-colors focus:outline-none">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {featuredBurgers.map((burger, idx) => {
              const isVisibleOnMobile = idx === carouselIndex;
              return (
                <article key={burger.id} className={`bg-white neo-brutalist-border neo-brutalist-shadow-hover transition-all flex flex-col group overflow-hidden ${isVisibleOnMobile ? 'block' : 'hidden md:flex'}`}>
                  <div className="relative h-64 md:h-72 overflow-hidden border-b-2 border-brand-charcoal">
                    <img src={burger.image} alt={burger.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                    <div className="absolute top-4 right-4 bg-brand-yellow px-3 py-1.5 neo-brutalist-border font-space font-extrabold text-sm text-brand-charcoal">
                      R$ {burger.price.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-space font-extrabold text-2xl uppercase tracking-tight text-brand-charcoal mb-2">{burger.name}</h3>
                    <p className="font-sans text-sm text-zinc-600 font-medium mb-6 leading-relaxed flex-grow">{burger.description}</p>
                    <div className="mt-auto pt-4 border-t-2 border-dashed border-zinc-200 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-space font-extrabold text-[11px] uppercase text-brand-charcoal tracking-wider">
                        <Star className="w-4 h-4 text-brand-yellow fill-brand-yellow" /> Best Seller
                      </span>
                      <button onClick={() => openCustomizer(burger)} className="w-10 h-10 bg-brand-charcoal text-white hover:bg-brand-yellow hover:text-brand-charcoal rounded-full flex items-center justify-center neo-brutalist-border transition-all hover:scale-110 focus:outline-none">
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* ================= SECTION 2: FULL MENU ================= */}
        <div className="pt-8 border-t-4 border-brand-charcoal" id="full-menu-section">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="font-headline text-3xl md:text-4xl uppercase tracking-tight text-brand-charcoal">
                NOSSO ARSENAL COMPLETO
              </h2>
            </div>
            <div className="relative max-w-md w-full">
              <input type="text" placeholder="Buscar hambúrguer, fritas, bebidas..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 neo-brutalist-border bg-white text-brand-charcoal font-sans font-semibold placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-charcoal" />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-10">
            {([
              { id: 'all', label: 'Tudo' },
              { id: 'burgers', label: 'Hambúrgueres' },
              { id: 'sides', label: 'Porções' },
              { id: 'cervejas', label: 'Cervejas' },
              { id: 'caipirinhas', label: 'Caipirinhas' },
              { id: 'destilados', label: 'Destilados' },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-5 py-2.5 neo-brutalist-border font-space font-bold text-xs uppercase tracking-widest transition-all focus:outline-none ${
                  selectedCategory === tab.id ? 'bg-brand-yellow text-brand-charcoal shadow-[3px_3px_0px_0px_#1b1b1b]' : 'bg-white text-brand-charcoal hover:bg-zinc-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filteredMenuItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMenuItems.map((item) => (
                <article key={item.id} className="bg-white neo-brutalist-border neo-brutalist-shadow-hover flex flex-col group h-full">
                  <div className="relative h-56 overflow-hidden border-b-2 border-brand-charcoal">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" referrerPolicy="no-referrer" />
                    <div className="absolute top-3 right-3 bg-brand-yellow px-2.5 py-1 neo-brutalist-border font-space font-extrabold text-xs text-brand-charcoal">
                      R$ {item.price.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h4 className="font-space font-extrabold text-lg uppercase tracking-tight text-brand-charcoal mb-2">{item.name}</h4>
                    <p className="font-sans text-xs md:text-sm text-zinc-500 font-medium mb-4 flex-grow leading-relaxed">{item.description}</p>
                    <button
                      onClick={() => openCustomizer(item)}
                      className="w-full bg-brand-charcoal text-white hover:bg-brand-yellow hover:text-brand-charcoal py-2.5 neo-brutalist-border font-space font-extrabold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 focus:outline-none"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{item.category === 'burgers' ? 'Customizar & Adicionar' : 'Escolher Opções'}</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white neo-brutalist-border p-12 text-center max-w-lg mx-auto">
              <span className="text-4xl">🕵️‍♂️</span>
              <h4 className="font-space font-extrabold text-xl uppercase mt-4 text-brand-charcoal">Nenhum item suspeito encontrado</h4>
            </div>
          )}
        </div>

      </div>

      {/* ================= INTERACTIVE CUSTOMIZATION & ADD MODAL ================= */}
      {activeCustomizeItem && (
        <div className="fixed inset-0 bg-brand-charcoal/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white neo-brutalist-border neo-brutalist-shadow max-w-lg w-full overflow-hidden relative">
            
            <div className="bg-brand-yellow text-brand-charcoal p-4 flex justify-between items-center border-b-4 border-brand-charcoal">
              <h4 className="font-space font-extrabold text-xl uppercase tracking-tight flex items-center gap-2">
                <span>⚡ {activeCustomizeItem.category === 'burgers' ? 'CUSTOMIZE SEU PEDIDO' : 'ESCOLHA SUAS OPÇÕES'}</span>
              </h4>
              <button onClick={() => setActiveCustomizeItem(null)} className="text-brand-charcoal hover:scale-110 focus:outline-none">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
              <div className="flex gap-4 bg-brand-surface-low p-4 border-2 border-brand-charcoal">
                <img src={activeCustomizeItem.image} alt={activeCustomizeItem.name} className="w-20 h-20 object-cover neo-brutalist-border shrink-0" referrerPolicy="no-referrer" />
                <div>
                  <span className="font-space font-extrabold text-lg text-brand-charcoal block">{activeCustomizeItem.name}</span>
                  <p className="font-sans text-xs text-zinc-500 font-semibold line-clamp-2">{activeCustomizeItem.description}</p>
                  <span className="font-space font-extrabold text-sm text-brand-charcoal block mt-1">
                    Preço Base: R$ {activeCustomizeItem.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* OPÇÕES PARA BURGERS */}
              {activeCustomizeItem.category === 'burgers' && (
                <div className="space-y-3">
                  <span className="block font-space font-extrabold text-xs uppercase text-brand-charcoal tracking-wide">Complementos (Opcional)</span>
                  
                  <label className="flex items-center justify-between p-3 border-2 border-brand-charcoal bg-white hover:bg-brand-yellow/5 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={extraBacon} onChange={(e) => setExtraBacon(e.target.checked)} className="w-5 h-5 accent-brand-yellow border-2 border-brand-charcoal" />
                      <div>
                        <span className="font-space font-extrabold text-sm text-brand-charcoal block">Extra Bacon</span>
                      </div>
                    </div>
                    <span className="font-space font-extrabold text-xs text-brand-charcoal">+ R$ 6,00</span>
                  </label>

                  <label className="flex items-center justify-between p-3 border-2 border-brand-charcoal bg-white hover:bg-brand-yellow/5 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={extraCheese} onChange={(e) => setExtraCheese(e.target.checked)} className="w-5 h-5 accent-brand-yellow border-2 border-brand-charcoal" />
                      <div>
                        <span className="font-space font-extrabold text-sm text-brand-charcoal block">Extra Queijo</span>
                      </div>
                    </div>
                    <span className="font-space font-extrabold text-xs text-brand-charcoal">+ R$ 4,00</span>
                  </label>
                </div>
              )}

              {/* OPÇÕES PARA BATATAS FRITAS */}
              {activeCustomizeItem.id === 'batata-frita-opcoes' && (
                <div className="space-y-4">
                  <div>
                    <span className="block font-space font-extrabold text-xs uppercase text-brand-charcoal mb-2">Tamanho:</span>
                    <div className="grid grid-cols-3 gap-2">
                      {['P', 'M', 'G'].map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size as any)}
                          className={`py-2 border-2 neo-brutalist-border font-space font-bold ${selectedSize === size ? 'bg-brand-charcoal text-white' : 'bg-white text-brand-charcoal hover:bg-zinc-50'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="block font-space font-extrabold text-xs uppercase text-brand-charcoal mb-2">Corte:</span>
                    <select 
                      value={selectedCut} 
                      onChange={(e) => setSelectedCut(e.target.value)}
                      className="w-full p-2 border-2 border-brand-charcoal bg-white font-sans font-bold focus:outline-none"
                    >
                      <option value="Tradicional">Tradicional</option>
                      <option value="Rústica">Rústica</option>
                      <option value="Canoa">Canoa</option>
                    </select>
                  </div>
                  
                  <label className="flex items-center justify-between p-3 border-2 border-brand-charcoal bg-white cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={extraBacon} onChange={(e) => setExtraBacon(e.target.checked)} className="w-5 h-5 accent-brand-yellow border-2 border-brand-charcoal" />
                      <span className="font-space font-extrabold text-sm text-brand-charcoal">Adicionar Cheddar e Bacon</span>
                    </div>
                    <span className="font-space font-extrabold text-xs text-brand-charcoal">+ R$ 5,00</span>
                  </label>
                </div>
              )}

              {/* OPÇÕES PARA CERVEJAS */}
              {activeCustomizeItem.category === 'cervejas' && (
                <div className="space-y-4">
                  <div>
                    <span className="block font-space font-extrabold text-xs uppercase text-brand-charcoal mb-2">Qual você deseja?</span>
                    <select 
                      value={selectedBeer} 
                      onChange={(e) => setSelectedBeer(e.target.value)}
                      className="w-full p-2 border-2 border-brand-charcoal bg-white font-sans font-bold focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                    >
                      <option value="">Selecione sua cerveja</option>
                      
                      {activeCustomizeItem.id === 'cervejas-600ml' && (
                        <>
                          <option value="Amstel 600ml|15">Amstel 600ml - R$ 15,00</option>
                          <option value="Budweiser 600ml|15">Budweiser 600ml - R$ 15,00</option>
                          <option value="Original 600ml|16">Original 600ml - R$ 16,00</option>
                          <option value="Heineken 600ml|17">Heineken 600ml - R$ 17,00</option>
                        </>
                      )}

                      {activeCustomizeItem.id === 'cervejas-litrao' && (
                        <>
                          <option value="Budweiser Litrão|20">Budweiser Litrão - R$ 20,00</option>
                          <option value="Original Litrão|20">Original Litrão - R$ 20,00</option>
                        </>
                      )}

                      {activeCustomizeItem.id === 'cervejas-artesanais' && (
                        <>
                          <option value="Elementum 500ml|23">Elementum 500ml - R$ 23,00</option>
                          <option value="Baden 600ml|23">Baden 600ml - R$ 23,00</option>
                          <option value="Colorado 600ml|23">Colorado 600ml - R$ 23,00</option>
                          <option value="Dama 600ml|23">Dama 600ml - R$ 23,00</option>
                          <option value="Roleta Russa 600ml|26">Roleta Russa 600ml - R$ 26,00</option>
                          <option value="Paulaner 600ml|26">Paulaner 600ml - R$ 26,00</option>
                          <option value="Patagônia 740ml|27">Patagônia 740ml - R$ 27,00</option>
                        </>
                      )}

                      {activeCustomizeItem.id === 'cervejas-long-neck-lata' && (
                        <>
                          <option value="Corona Long Neck|12">Corona Long Neck - R$ 12,00</option>
                          <option value="Heineken Long Neck|12">Heineken Long Neck - R$ 12,00</option>
                          <option value="Patagônia Lata|12">Patagônia Lata - R$ 12,00</option>
                          <option value="Baden Lata|12">Baden Lata - R$ 12,00</option>
                          <option value="Goose Island Long Neck|13">Goose Island Long Neck - R$ 13,00</option>
                          <option value="Lagunitas Long Neck|15">Lagunitas Long Neck - R$ 15,00</option>
                          <option value="Blue Moon Long Neck|17">Blue Moon Long Neck - R$ 17,00</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              )}

              {/* OPÇÕES PARA CAIPIRINHAS */}
              {activeCustomizeItem.category === 'caipirinhas' && (
                <div className="space-y-4">
                  <div>
                    <span className="block font-space font-extrabold text-xs uppercase text-brand-charcoal mb-2">Sabor (Time):</span>
                    <select 
                      value={selectedFlavor} 
                      onChange={(e) => setSelectedFlavor(e.target.value)}
                      className="w-full p-2 border-2 border-brand-charcoal bg-white font-sans font-bold focus:outline-none"
                    >
                      <option value="">Selecione um Sabor</option>
                      <option value="Real Madrid">Real Madrid (Pêra, Limão, Maçã, Hortelã)</option>
                      <option value="Barcelona">Barcelona (Morango, Amora, Açaí)</option>
                      <option value="Sevilla">Sevilla (Amora, Lichia, Gengibre)</option>
                      <option value="Valência">Valência (Pêra, Abacaxi, Limão, Cravo)</option>
                      <option value="Juventus">Juventus (Maçã, Caju, Morango)</option>
                      <option value="Milan">Milan (Morango, Hortelã, Pêssego)</option>
                      <option value="Porto">Porto (Limão Siciliano, Abacaxi, Hortelã)</option>
                      <option value="Benfica">Benfica (Pêra, Maçã, Limão Siciliano, Taiti)</option>
                      <option value="Ajax">Ajax (Amora, Morango, Limão Siciliano, Taiti)</option>
                      <option value="PSV">PSV (Abacaxi, Lima da Pérsia, Limão, Amora)</option>
                      <option value="Inter de Milão">Inter de Milão (Caju, Carambola, Maracujá)</option>
                      <option value="Roma">Roma (Laranja, Pêssego, Cereja)</option>
                      <option value="Napoli">Napoli (Morango, Maracujá, Amora)</option>
                      <option value="Manchester United">Manchester United (Lichia, Maçã, Hortelã)</option>
                      <option value="Liverpool">Liverpool (Amora, Morango, Canela)</option>
                      <option value="Arsenal">Arsenal (Laranja, Pêssego, Cereja)</option>
                      <option value="Chelsea">Chelsea (Uva Rubi, Limão Taiti, Capim Santo)</option>
                      <option value="Bayer de Munique">Bayer de Munique (Abacaxi, Gengibre, Capim Santo)</option>
                      <option value="Borussia Dortmund">Borussia Dortmund (Pêra, Manga, Tangerina)</option>
                    </select>
                  </div>
                  <div>
                    <span className="block font-space font-extrabold text-xs uppercase text-brand-charcoal mb-2">Destilado:</span>
                    <select 
                      value={selectedBrand} 
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full p-2 border-2 border-brand-charcoal bg-white font-sans font-bold focus:outline-none"
                    >
                      <option value="">Selecione a Marca</option>
                      <option value="Velho Barreiro">Velho Barreiro</option>
                      <option value="Smirnoff">Smirnoff</option>
                      <option value="Absolut">Absolut</option>
                      <option value="Stolichnaya">Stolichnaya</option>
                      <option value="Ketel One">Ketel One</option>
                      <option value="Ciroc">Ciroc</option>
                    </select>
                  </div>
                </div>
              )}

              {/* OPÇÕES PARA DESTILADOS */}
{activeCustomizeItem.category === 'destilados' && (
  <div className="space-y-4">
    <div>
      <span className="block font-space font-extrabold text-xs uppercase text-brand-charcoal mb-2">
        Qual {activeCustomizeItem.name} você deseja?
      </span>
      <select 
        value={selectedBeer} 
        onChange={(e) => setSelectedBeer(e.target.value)}
        className="w-full p-2 border-2 border-brand-charcoal bg-white font-sans font-bold focus:outline-none focus:ring-2 focus:ring-brand-yellow"
      >
        <option value="">Selecione sua bebida</option>
        
        {/* Usamos .includes() no nome para identificar o tipo, assim não depende do ID exato */}
        
        {/* VODKA */}
        {activeCustomizeItem.name.toLowerCase().includes('vodka') && (
          <>
            <option value="Smirnoff (Dose)|15">Smirnoff (Dose) - R$ 15,00</option>
            <option value="Smirnoff (Combo)|150">Smirnoff (Combo) - R$ 150,00</option>
            <option value="Absolut (Dose)|25">Absolut (Dose) - R$ 25,00</option>
            <option value="Absolut (Combo)|220">Absolut (Combo) - R$ 220,00</option>
            <option value="Ciroc (Dose)|35">Ciroc (Dose) - R$ 35,00</option>
            <option value="Ciroc (Combo)|300">Ciroc (Combo) - R$ 300,00</option>
            <option value="Grey Goose (Dose)|35">Grey Goose (Dose) - R$ 35,00</option>
            <option value="Grey Goose (Combo)|300">Grey Goose (Combo) - R$ 300,00</option>
            <option value="Belvedere (Dose)|45">Belvedere (Dose) - R$ 45,00</option>
            <option value="Belvedere (Combo)|350">Belvedere (Combo) - R$ 350,00</option>
          </>
        )}

        {/* GIN */}
        {activeCustomizeItem.name.toLowerCase().includes('gin') && (
          <>
            <option value="Hendrick's (Dose)|60">Hendrick's (Dose) - R$ 60,00</option>
            <option value="Hendrick's (Combo)|300">Hendrick's (Combo) - R$ 300,00</option>
            <option value="Bulldog (Dose)|50">Bulldog (Dose) - R$ 50,00</option>
            <option value="Bulldog (Combo)|280">Bulldog (Combo) - R$ 280,00</option>
            <option value="Beefeater (Dose)|45">Beefeater (Dose) - R$ 45,00</option>
            <option value="Beefeater (Combo)|250">Beefeater (Combo) - R$ 250,00</option>
            <option value="Bombay (Dose)|45">Bombay (Dose) - R$ 45,00</option>
            <option value="Bombay (Combo)|250">Bombay (Combo) - R$ 250,00</option>
            <option value="Tanqueray (Dose)|45">Tanqueray (Dose) - R$ 45,00</option>
            <option value="Tanqueray (Combo)|250">Tanqueray (Combo) - R$ 250,00</option>
            <option value="Arapuru (Dose)|35">Arapuru (Dose) - R$ 35,00</option>
            <option value="Arapuru (Combo)|300">Arapuru (Combo) - R$ 300,00</option>
            <option value="Larios (Dose)|35">Larios (Dose) - R$ 35,00</option>
            <option value="Larios (Combo)|300">Larios (Combo) - R$ 300,00</option>
            <option value="Gordons (Dose)|35">Gordons (Dose) - R$ 35,00</option>
            <option value="Gordons (Combo)|300">Gordons (Combo) - R$ 300,00</option>
            <option value="Apogee (Dose)|35">Apogee (Dose) - R$ 35,00</option>
            <option value="Apogee (Combo)|300">Apogee (Combo) - R$ 300,00</option>
            <option value="Rocks (Dose)|35">Rocks (Dose) - R$ 35,00</option>
            <option value="Rocks (Combo)|300">Rocks (Combo) - R$ 300,00</option>
          </>
        )}

        {/* WHISKEY */}
        {activeCustomizeItem.name.toLowerCase().includes('whiskey') && (
          <>
            <option value="Buffalo Trace (Dose)|70">Buffalo Trace (Dose) - R$ 70,00</option>
            <option value="Buffalo Trace (Combo)|350">Buffalo Trace (Combo) - R$ 350,00</option>
            <option value="Makers (Dose)|70">Makers (Dose) - R$ 70,00</option>
            <option value="Makers (Combo)|350">Makers (Combo) - R$ 350,00</option>
            <option value="Buchannas (Dose)|60">Buchannas (Dose) - R$ 60,00</option>
            <option value="Buchannas (Combo)|330">Buchannas (Combo) - R$ 330,00</option>
            <option value="Gold Label (Dose)|80">Gold Label (Dose) - R$ 80,00</option>
            <option value="Gold Label (Combo)|400">Gold Label (Combo) - R$ 400,00</option>
            <option value="Double Black (Dose)|70">Double Black (Dose) - R$ 70,00</option>
            <option value="Double Black (Combo)|350">Double Black (Combo) - R$ 350,00</option>
            <option value="Ballantines (Dose)|45">Ballantines (Dose) - R$ 45,00</option>
            <option value="Ballantines (Combo)|220">Ballantines (Combo) - R$ 220,00</option>
            <option value="White Horse (Dose)|45">White Horse (Dose) - R$ 45,00</option>
            <option value="White Horse (Combo)|220">White Horse (Combo) - R$ 220,00</option>
            <option value="Passaport (Dose)|30">Passaport (Dose) - R$ 30,00</option>
            <option value="Passaport (Combo)|160">Passaport (Combo) - R$ 160,00</option>
            <option value="Jack Daniel's (Dose)|55">Jack Daniel's (Dose) - R$ 55,00</option>
            <option value="Jack Daniel's (Combo)|300">Jack Daniel's (Combo) - R$ 300,00</option>
            <option value="Black Label (Dose)|60">Black Label (Dose) - R$ 60,00</option>
            <option value="Black Label (Combo)|320">Black Label (Combo) - R$ 320,00</option>
            <option value="Red Label (Dose)|50">Red Label (Dose) - R$ 50,00</option>
            <option value="Red Label (Combo)|250">Red Label (Combo) - R$ 250,00</option>
          </>
        )}
      </select>
    </div>
  </div>
)}

              {/* TEXT AREA GLOBAL PARA OBSERVAÇÕES */}
              <div>
                <label className="block font-space font-extrabold text-xs uppercase text-brand-charcoal mb-2">
                  ALGUMA OBSERVAÇÃO? (Opcional)
                </label>
                <textarea 
                  rows={2}
                  maxLength={150}
                  placeholder="Ex: Mandar limão espremido, carne bem passada..."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full px-3 py-2 neo-brutalist-border font-sans font-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                />
              </div>

              {/* Bottom confirmation panel with computed price */}
              <div className="pt-4 border-t-2 border-brand-charcoal flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-zinc-400 font-extrabold uppercase block">Preço</span>
                  <span className="font-space font-extrabold text-2xl text-brand-charcoal">
                    R$ {computedCustomizePrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                
                <button
                  onClick={handleConfirmCustomization}
                  className="w-full sm:w-auto bg-brand-yellow text-brand-charcoal hover:bg-brand-charcoal hover:text-white px-8 py-3.5 neo-brutalist-border neo-brutalist-shadow-hover font-space font-extrabold text-xs tracking-wider uppercase"
                >
                  Adicionar 🛒
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
}