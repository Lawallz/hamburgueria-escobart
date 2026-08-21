export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'burgers' | 'sides' | 'drinks' | 'desserts';
  badge?: 'Best Seller' | 'Picante' | 'Premium' | 'Veggie' | 'Limitado';
  ingredients: string[];
}

export interface CartItem {
  id: string; // unique item id (composite of menuItem.id + custom options)
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
  customizations: {
    extraBacon: boolean; // + R$ 6,00
    extraPatty: boolean; // + R$ 12,00
    extraCheese: boolean; // + R$ 4,00
    removeOnions: boolean;
  };
}

export interface Review {
  id: string;
  author: string;
  role: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SecretCoupon {
  code: string;
  discountPercentage: number;
  description: string;
}
