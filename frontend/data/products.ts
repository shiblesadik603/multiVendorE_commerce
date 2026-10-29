export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  seller: string;
  description: string;
  status?: 'Active' | 'Archived' | 'Draft';
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Wireless Noise-Canceling Headphones',
    price: 199.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    rating: 4.8,
    seller: 'SoundWave Audio',
    description: 'Immersive high-fidelity sound with active noise cancellation and 30-hour battery life.'
  },
  {
    id: '2',
    title: 'Minimalist Mechanical Keyboard',
    price: 89.50,
    category: 'Gadgets',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
    rating: 4.6,
    seller: 'KeyCraft Tech',
    description: 'RGB backlit mechanical keyboard with tactile switches designed for productivity and gaming.'
  },
  {
    id: '3',
    title: 'Smart Fitness Tracker Watch',
    price: 129.00,
    category: 'Gadgets',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    rating: 4.5,
    seller: 'PulseFit Co.',
    description: 'Track your heart rate, sleep cycles, workouts, and smartphone notifications on the go.'
  },
  {
    id: '4',
    title: 'Professional DSLR Camera Kit',
    price: 749.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80',
    rating: 4.9,
    seller: 'OpticPro Store',
    description: 'Capture stunning 4K video and high-resolution photos with interchangeable lens capability.'
  },
  {
    id: '5',
    title: 'Ergonomic Executive Office Chair',
    price: 259.99,
    category: 'Home & Decor',
    image: 'https://images.unsplash.com/photo-1580481077494-e3299ac25e94?w=500&q=80',
    rating: 4.7,
    seller: 'ComfortLiving',
    description: 'All-day lumbar support, breathable mesh back, and fully adjustable armrests.'
  },
  {
    id: '6',
    title: 'Modern Ceramic Coffee Mug Set',
    price: 34.99,
    category: 'Home & Decor',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80',
    rating: 4.3,
    seller: 'ArtisanHome',
    description: 'Hand-glazed ceramic mugs crafted for your morning coffee or evening tea rituals.'
  },
  {
    id: '7',
    title: 'Ultra-Wide Curved Gaming Monitor',
    price: 449.00,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80',
    rating: 4.8,
    seller: 'VisionTech',
    description: 'Stunning visual clarity with a high refresh rate for seamless multi-tasking and immersive gaming.'
  },
  {
    id: '8',
    title: 'Waterproof Portable Bluetooth Speaker',
    price: 59.99,
    category: 'Gadgets',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80',
    rating: 4.4,
    seller: 'SoundWave Audio',
    description: 'Rugged, waterproof speaker with punchy bass and 12 hours of continuous playback.'
  },
  {
    id: '9',
    title: 'Insulated Stainless Steel Water Bottle',
    price: 24.99,
    category: 'Home & Decor',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80',
    rating: 4.7,
    seller: 'EcoLife Goods',
    description: 'Keeps your drinks ice-cold for 24 hours or piping hot for 12 hours with double-wall vacuum insulation.'
  },
  {
    id: '10',
    title: 'LED Desk Lamp with Wireless Charger',
    price: 45.00,
    category: 'Home & Decor',
    image: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=500&q=80',
    rating: 4.6,
    seller: 'BrightSpace',
    description: 'Dimmable eye-caring desk lamp featuring a built-in wireless charging pad for your phone.'
  }
];