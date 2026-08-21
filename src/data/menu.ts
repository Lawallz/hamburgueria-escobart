import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  // ==========================================
  // ARTESANAIS & CLÁSSICOS (Categoria: 'burgers')
  // ==========================================
  {
    id: 'el-patron',
    name: 'El Patron',
    description: 'Pão de brioche, blend bovino de 180g, pesto de tomate, queijo gouda, bacon crispy, peperoni, cebola, rúcula e molho especial.',
    price: 38.00,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    category: 'burgers',
    badge: 'Artesanal',
    ingredients: ['Pão de Brioche', 'Blend Bovino 180g', 'Pesto de Tomate', 'Queijo Gouda', 'Bacon Crispy', 'Peperoni', 'Cebola', 'Rúcula', 'Molho Especial']
  },
  {
    id: 'bart',
    name: 'Bart',
    description: 'Pão de brioche, blend suíno de 90g, cheddar, bacon, queijo prato, mix de repolho c/ cenoura, maionese argentina e barbecue.',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&w=600&q=80',
    category: 'burgers',
    badge: 'Artesanal',
    ingredients: ['Pão de Brioche', 'Blend Suíno 90g', 'Cheddar', 'Bacon', 'Queijo Prato', 'Mix de Repolho c/ Cenoura', 'Maionese Argentina', 'Barbecue']
  },
  {
    id: 'homer',
    name: 'Homer',
    description: 'Pão australiano, 2 blends bovinos de 90gr, cheddar, bacon, pesto de pimentão c/ jalapeño e cebola caramelizada.',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1594212202875-86ac519fe509?auto=format&fit=crop&w=600&q=80',
    category: 'burgers',
    badge: 'Best Seller',
    ingredients: ['Pão Australiano', '2 Blends Bovinos (90g cada)', 'Cheddar', 'Bacon', 'Pesto de Pimentão c/ Jalapeño', 'Cebola Caramelizada']
  },
  {
    id: 'lisa',
    name: 'Lisa',
    description: 'Pão de gergelim, 2 blends bovino de 80gr, mussarela, picles, alface americana, cebola e molho especial.',
    price: 33.00,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    category: 'burgers',
    badge: 'Artesanal',
    ingredients: ['Pão de Gergelim', '2 Blends Bovinos (80g cada)', 'Mussarela', 'Picles', 'Alface Americana', 'Cebola', 'Molho Especial']
  },
  {
    id: 'meg',
    name: 'Meg',
    description: 'Blend suíno de 150gr, mussarela, onion rings, alface americana, tomate cereja, mostarda e mel.',
    price: 33.00,
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=600&q=80',
    category: 'burgers',
    badge: 'Artesanal',
    ingredients: ['Blend Suíno 150g', 'Mussarela', 'Onion Rings', 'Alface Americana', 'Tomate Cereja', 'Mostarda e Mel']
  },
  {
    id: 'x-burguer',
    name: 'X-Burguer',
    description: 'O clássico completo da casa.',
    price: 13.00,
    image: 'https://images.unsplash.com/photo-1603064752734-4c48eff53d05?auto=format&fit=crop&w=600&q=80',
    category: 'burgers',
    ingredients: ['Pão Tradicional', 'Hambúrguer', 'Queijo']
  },
  {
    id: 'x-salada',
    name: 'X-Salada',
    description: 'Hambúrguer tradicional com salada.',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    category: 'burgers',
    ingredients: ['Pão Tradicional', 'Hambúrguer', 'Queijo', 'Alface', 'Tomate']
  },
  {
    id: 'x-tudo',
    name: 'X-Tudo',
    description: 'O clássico completo da casa.',
    price: 23.00,
    image: 'https://images.unsplash.com/photo-1603064752734-4c48eff53d05?auto=format&fit=crop&w=600&q=80',
    category: 'burgers',
    ingredients: ['Pão Tradicional', 'Hambúrguer', 'Queijo', 'Bacon', 'Ovo', 'Salada']
  },
  {
    id: 'x-bacon',
    name: 'X-Bacon',
    description: 'Hambúrguer tradicional com bacon.',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1603064752734-4c48eff53d05?auto=format&fit=crop&w=600&q=80',
    category: 'burgers',
    ingredients: ['Pão Tradicional', 'Hambúrguer', 'Queijo', 'Bacon']
   },
   {
    id: 'x-egg',
    name: 'X-Egg',
    description: 'Hambúrguer tradicional com ovo.',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1603064752734-4c48eff53d05?auto=format&fit=crop&w=600&q=80',
    category: 'burgers',
    ingredients: ['Pão Tradicional', 'Hambúrguer', 'Queijo', 'Ovo']
   },

  // ==========================================
  // PORÇÕES (Categoria: 'sides')
  // ==========================================
  {
    id: 'batata-frita-opcoes',
    name: 'Porção de Batata Frita',
    description: 'Escolha o corte (Tradicional, Rústica ou Canoa) e o tamanho: P (R$ 15,00), M (R$ 20,00) ou G (R$ 25,00). Adicional de cheddar e bacon por R$ 5,00.',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1623120150935-827fc7f575a5?auto=format&fit=crop&w=600&q=80',
    category: 'sides',
    ingredients: ['Batata Frita', 'Cheddar e Bacon (Opcional)']
  },
  {
    id: 'batata-moda',
    name: 'Batata à Moda da Casa',
    description: 'Cupim ou costela, cebola, pimentão e cheddar.',
    price: 60.00,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    category: 'sides',
    badge: 'Limitado',
    ingredients: ['Batata Frita', 'Cupim ou Costela', 'Cebola', 'Pimentão', 'Cheddar']
  },
  {
    id: 'mandioca-carne-seca',
    name: 'Mandioca Frita c/ Carne Seca e Catupiry',
    description: 'Porção deliciosa de mandioca frita com carne seca e catupiry.',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1623120150935-827fc7f575a5?auto=format&fit=crop&w=600&q=80',
    category: 'sides',
    ingredients: ['Mandioca Frita', 'Carne Seca', 'Catupiry']
  },
   {
    id: 'queijo-gouda',
    name: 'Queijo Gouda Empanado',
    description: 'Queijo Gouda derretido e empanado.',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    category: 'sides',
    ingredients: ['Queijo Gouda']
  },
  {
    id: 'isca-de-frango',
    name: 'Isca de Frango',
    description: 'Isca de frango empanada e frita.',
    price: 40.00,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    category: 'sides',
    ingredients: ['Isca de Frango']
  },
  {
    id: 'calabresa-frita',
    name: 'Calabresa Frita',
    description: 'Calabresa frita com cebola e pimentão.',
    price: 50.00,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    category: 'sides',
    ingredients: ['Calabresa', 'Cebola', 'Pimentão']
  },
  {
    id: 'anel-de-cebola',
    name: 'Anel de Cebola',
    description: 'Anéis de cebola empanados e fritos.',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    category: 'sides',
    ingredients: ['Anel de Cebola']
  },
  {
    id: 'bolinho-de-carne-seca',
    name: 'Bolinho de Carne Seca Abóbora e Meia Cura',
    description: 'Porção com 6 unidades.',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80',
    category: 'sides',
    ingredients: ['Carne Seca', 'Abóbora', 'Queijo Meia Cura']
  },
  {
    id: 'kibe-com-mussarela',
    name: 'Kibe com Mussarela',
    description: 'Porção com 6 unidades.',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80',
    category: 'sides',
    ingredients: ['Kibe', 'Mussarela']
  },
  {
    id: 'palito-de-mussarela',
    name: 'Palito de Mussarela',
    description: 'Palitos de mussarela empanados e fritos. Porção com 6 unidades.',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80',
    category: 'sides',
    ingredients: ['Mussarela']
  },
  {
    id: 'coxinha-de-costela',
    name: 'Coxinha de Costela ou Pastrami',
    description: 'Porção com 6 unidades.',
    price: 30.00,
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80',
    category: 'sides',
    ingredients: ['Costela ou Pastrami']
  },
  {
    id: 'dadinho-de-tapioca',
    name: 'Dadinho de Tapioca',
    description: 'Porção de dadinhos de tapioca fritos.',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80',
    category: 'sides',
    ingredients: ['Tapioca']
  },
  {
    id: 'mini-pastel',
    name: 'Mini Pastel (15 Unidades)',
    description: 'Opções de recheio: Carne, Queijo c/ Orégano, Frango c/ Catupiry.',
    price: 50.00,
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80',
    category: 'sides',
    ingredients: ['Massa de Pastel', 'Recheio à escolha']
  },

  // ==========================================
  // CERVEJAS (Categoria: 'cervejas')
  // ==========================================
  {
    id: 'cervejas-600ml',
    name: 'Cervejas Tradicionais (600ml)',
    description: 'Amstel (R$ 15), Budweiser (R$ 15), Original (R$ 16) e Heineken (R$ 17).',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=600&q=80',
    category: 'cervejas',
    ingredients: []
  },
  {
    id: 'cervejas-litrao',
    name: 'Cerveja Litrão (1L)',
    description: 'Budweiser ou Original (R$ 20,00).',
    price: 20.00,
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=600&q=80',
    category: 'cervejas',
    ingredients: []
  },
  {
    id: 'cervejas-artesanais',
    name: 'Cervejas Artesanais',
    description: 'Elementum, Baden, Colorado, Dama (R$ 23). Roleta Russa, Paulaner (R$ 26). Patagônia 740ml (R$ 27).',
    price: 23.00,
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=600&q=80',
    category: 'cervejas',
    badge: 'Premium',
    ingredients: []
  },
  {
    id: 'cervejas-long-neck-lata',
    name: 'Cervejas Long Neck e Lata',
    description: 'Corona, Heineken LN, Patagônia Lata, Baden Lata (R$ 12). Goose Island (R$ 13). Lagunitas (R$ 15). Blue Moon (R$ 17).',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=600&q=80',
    category: 'cervejas',
    ingredients: []
  },

  // ==========================================
  // CAIPIRINHAS (Categoria: 'caipirinhas')
  // ==========================================
  {
    id: 'caipirinhas-champions',
    name: 'Caipirinhas da Champions League',
    description: 'Escolha seu time (sabor) e a marca do destilado. Sabores: Real Madrid, Barcelona, Sevilla, Valência, Juventus, Milan, Porto, Benfica, Ajax, PSV, Inter de Milão, Roma, Napoli, Man. United, Liverpool, Arsenal, Chelsea, Bayern ou Dortmund.',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
    category: 'caipirinhas',
    badge: 'Premium',
    ingredients: ['Frutas da Casa', 'Destilado à escolha']
  },

  // ==========================================
  // DESTILADOS (Categoria: 'destilados')
  // ==========================================
  {
    id: 'vodkas',
    name: 'Vodkas (Dose ou Combo)',
    description: 'Selecione a marca e se deseja Dose ou Combo (5 Red Bull + 5 Gelos de Coco). Opções: Smirnoff, Absolut, Ciroc, Grey Goose, Belvedere.',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
    category: 'destilados',
    ingredients: []
  },
  {
    id: 'gins',
    name: 'Gins (Dose ou Combo)',
    description: 'Selecione a marca e se deseja Dose ou Combo (5 Red Bull + 5 Gelos de Coco). Opções: Arapuru, Larios, Gordons, Apogee, Rocks, Beefeater, Bombay, Tanqueray, Bulldog, Hendrick’s.',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
    category: 'destilados',
    ingredients: []
  },
  {
    id: 'whiskeys',
    name: 'Whiskeys (Dose ou Combo)',
    description: 'Selecione a marca e se deseja Dose ou Combo (5 Red Bull + 5 Gelos de Coco). Opções: Passaport, Ballantines, White Horse, Red Label, Jack Daniel’s, Black Label, Buchannas, Buffalo Trace, Makers, Double Black, Gold Label.',
    price: 30.00,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
    category: 'destilados',
    ingredients: []
  }
];