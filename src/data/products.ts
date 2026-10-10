export type Category = 'Fruits' | 'Dairy' | 'Snacks' | 'Bakery' | 'Beverages' | 'Frozen';

// A weight/volume pack size a product comes in — e.g. "500 ml" vs "1 L".
// `mrp`, when set, is the pre-discount price shown struck through next to
// `price`, the same "bigger pack = better deal" pattern Swiggy/Blinkit use.
export type ProductVariant = {
  id: string;
  label: string;
  price: number;
  mrp?: number;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: Category;
  emoji: string;
  rating: number;
  confidence: 'High Confidence' | 'Good Match' | 'Try Something New';
  description: string;
  tag?: string;
  /** Only present for weight/volume-measured products (grams, kg, ml,
   * litres) — these show a pack-size picker instead of a flat add.
   * `price`/`unit` above stay as the default-pack fallback for anything
   * that still reads them (search cards, etc.) and should match one of
   * these variants. */
  variants?: ProductVariant[];
};

export const PRODUCTS: Product[] = [
  {
    id: 'oat-milk',
    name: 'Oat Milk',
    price: 120,
    unit: '/litre',
    category: 'Dairy',
    emoji: '🥛',
    rating: 4.6,
    confidence: 'High Confidence',
    description:
      'Fresh, creamy oat milk made from 100% whole oats. No added sugar, naturally dairy-free. Rich in fibre and calcium — perfect for your morning coffee or cereal.',
    tag: 'Frequently bought',
    variants: [
      { id: '500ml', label: '500 ml', price: 65, mrp: 70 },
      { id: '1l', label: '1 L', price: 120 },
      { id: '2l', label: '2 L', price: 220, mrp: 240 },
    ],
  },
  {
    id: 'apples',
    name: 'Apples',
    price: 40,
    unit: '/kg',
    category: 'Fruits',
    emoji: '🍎',
    rating: 4.4,
    confidence: 'Good Match',
    description:
      'Crisp, hand-picked apples sourced from local orchards. A sweet-tart snack packed with fibre and vitamin C.',
    variants: [
      { id: '500g', label: '500 g', price: 22, mrp: 25 },
      { id: '1kg', label: '1 kg', price: 40 },
      { id: '2kg', label: '2 kg', price: 75, mrp: 80 },
    ],
  },
  {
    id: 'bananas',
    name: 'Bananas',
    price: 30,
    unit: '/dozen',
    category: 'Fruits',
    emoji: '🍌',
    rating: 4.5,
    confidence: 'High Confidence',
    description:
      'Naturally ripened bananas — a quick source of potassium and energy. Great for smoothies, baking, or a quick snack.',
    tag: 'Price drop',
  },
  {
    id: 'bread',
    name: 'Bread',
    price: 35,
    unit: '/loaf',
    category: 'Bakery',
    emoji: '🍞',
    rating: 4.2,
    confidence: 'Good Match',
    description:
      'Soft, freshly baked whole-wheat bread, baked daily with no preservatives. Stays fresh for up to 4 days when refrigerated.',
  },
  {
    id: 'eggs',
    name: 'Eggs',
    price: 80,
    unit: '/dozen',
    category: 'Dairy',
    emoji: '🥚',
    rating: 4.7,
    confidence: 'High Confidence',
    description:
      'Farm-fresh eggs from free-range hens. A versatile protein source for breakfast, baking, or dinner.',
  },
  {
    id: 'cheese',
    name: 'Cheese',
    price: 150,
    unit: '/200g',
    category: 'Dairy',
    emoji: '🧀',
    rating: 4.3,
    confidence: 'Good Match',
    description:
      'Rich, creamy cheddar cheese block — sliced or grated, it melts beautifully for sandwiches, pasta, and snacks.',
    variants: [
      { id: '100g', label: '100 g', price: 80, mrp: 85 },
      { id: '200g', label: '200 g', price: 150 },
      { id: '400g', label: '400 g', price: 280, mrp: 300 },
    ],
  },
  {
    id: 'butter',
    name: 'Butter',
    price: 90,
    unit: '/500g',
    category: 'Dairy',
    emoji: '🧈',
    rating: 4.5,
    confidence: 'Good Match',
    description:
      'Smooth, churned butter made from fresh cream. Ideal for baking, toast, or cooking.',
    variants: [
      { id: '100g', label: '100 g', price: 20, mrp: 22 },
      { id: '500g', label: '500 g', price: 90 },
      { id: '1kg', label: '1 kg', price: 170, mrp: 180 },
    ],
  },
  {
    id: 'yogurt',
    name: 'Yogurt',
    price: 45,
    unit: '/400g',
    category: 'Dairy',
    emoji: '🥣',
    rating: 4.4,
    confidence: 'Try Something New',
    description:
      'Thick, probiotic-rich yogurt made the traditional way. Great on its own or with fruit and honey.',
    variants: [
      { id: '200g', label: '200 g', price: 25, mrp: 28 },
      { id: '400g', label: '400 g', price: 45 },
      { id: '900g', label: '900 g', price: 95, mrp: 105 },
    ],
  },
  {
    id: 'chips',
    name: 'Potato Chips',
    price: 20,
    unit: '/pack',
    category: 'Snacks',
    emoji: '🥔',
    rating: 4.1,
    confidence: 'Try Something New',
    description: 'Crispy, lightly salted potato chips — the classic snack-time favourite.',
  },
  {
    id: 'cookies',
    name: 'Cookies',
    price: 60,
    unit: '/pack',
    category: 'Snacks',
    emoji: '🍪',
    rating: 4.3,
    confidence: 'Good Match',
    description: 'Buttery, crumbly cookies baked with real chocolate chips.',
  },
  {
    id: 'orange-juice',
    name: 'Orange Juice',
    price: 70,
    unit: '/litre',
    category: 'Beverages',
    emoji: '🧃',
    rating: 4.2,
    confidence: 'Good Match',
    description: '100% cold-pressed orange juice with no added sugar — a daily dose of vitamin C.',
    variants: [
      { id: '500ml', label: '500 ml', price: 38, mrp: 40 },
      { id: '1l', label: '1 L', price: 70 },
      { id: '2l', label: '2 L', price: 130, mrp: 140 },
    ],
  },
  {
    id: 'ice-cream',
    name: 'Vanilla Ice Cream',
    price: 110,
    unit: '/500ml',
    category: 'Frozen',
    emoji: '🍦',
    rating: 4.6,
    confidence: 'High Confidence',
    description: 'Classic, creamy vanilla ice cream made with real Madagascar vanilla.',
    variants: [
      { id: '500ml', label: '500 ml', price: 110 },
      { id: '1l', label: '1 L', price: 200, mrp: 220 },
    ],
  },
];

export const CATEGORIES: Category[] = ['Fruits', 'Dairy', 'Snacks', 'Bakery', 'Beverages', 'Frozen'];

export function searchProducts(query: string, category?: Category | 'All') {
  const q = query.trim().toLowerCase();
  return PRODUCTS.filter((p) => {
    const matchesQuery =
      q.length === 0 || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    const matchesCategory = !category || category === 'All' || p.category === category;
    return matchesQuery && matchesCategory;
  });
}

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

/** Cheapest pack price for a variant product — what a card shows as
 * "From ₹X" before a size is picked. Falls back to the flat price for
 * products with no pack sizes. */
export function startingPrice(product: Product) {
  if (!product.variants?.length) return product.price;
  return Math.min(...product.variants.map((v) => v.price));
}

export function getRecommendations() {
  return PRODUCTS.filter((p) => p.tag || p.confidence === 'High Confidence').slice(0, 6);
}
