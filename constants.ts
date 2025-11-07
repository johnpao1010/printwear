import { ProductType, ProductVariant } from './types';

export const PRODUCT_VARIANTS: Record<ProductType, ProductVariant[]> = {
  tshirt: [
    {
      id: 'hoodie-black',
      name: 'Buso Verde',
      imageUrl: 'https://eaa5q8xpiwhdnz0x.public.blob.vercel-storage.com/camisas/franellafosforecente.webp',
      thumbnailUrl: 'https://eaa5q8xpiwhdnz0x.public.blob.vercel-storage.com/camisas/franellafosforecente.webp',
      basePrice: 45,
      bounds: { top: 100, left: 100, right: 460, bottom: 500 },
      gender: 'hombre',
    },
    {
      id: 'hoodie-gray',
      name: 'Buzo Gris',
      imageUrl: 'https://eaa5q8xpiwhdnz0x.public.blob.vercel-storage.com/camisas/franelagris.webp',
      thumbnailUrl: 'https://eaa5q8xpiwhdnz0x.public.blob.vercel-storage.com/camisas/franelagris.webp',
      basePrice: 45,
      bounds: { top: 100, left: 100, right: 460, bottom: 500 },
      gender: 'mujer',
    },
    {
      id: 'sweatshirt-black',
      name: 'Buzo Naranja',
      imageUrl: 'https://eaa5q8xpiwhdnz0x.public.blob.vercel-storage.com/camisas/franellamarilla.webp',
      thumbnailUrl: 'https://eaa5q8xpiwhdnz0x.public.blob.vercel-storage.com/camisas/franellamarilla.webp',
      basePrice: 40,
      bounds: { top: 100, left: 100, right: 460, bottom: 500 },
      gender: 'juvenil',
    },
  ],
  cap: [
    {
      id: 'cap-dad',
      name: 'Gorra Clásica',
      imageUrl: 'https://printwear.vercel.app/cap-classic.png',
      thumbnailUrl: 'https://printwear.vercel.app/cap-classic-thumb.png',
      basePrice: 25,
      bounds: { top: 60, left: 200, right: 360, bottom: 180 },
      gender: 'hombre',
    },
    {
      id: 'cap-snapback',
      name: 'Gorra Snapback',
      imageUrl: 'https://printwear.vercel.app/cap-snapback.png',
      thumbnailUrl: 'https://printwear.vercel.app/cap-snapback-thumb.png',
      basePrice: 28,
      bounds: { top: 70, left: 190, right: 370, bottom: 170 },
      gender: 'mujer',
    },
    {
      id: 'cap-beanie',
      name: 'Gorra Beanie',
      imageUrl: 'https://printwear.vercel.app/cap-beanie.png',
      gender: 'niños',
      thumbnailUrl: '/cap-beanie-thumb.png',
      basePrice: 22,
      bounds: { top: 50, left: 180, right: 380, bottom: 160 },
    },
  ],
};

// Price per 1000 square pixels
export const PRICE_PER_AREA_MULTIPLIER = 0.05;

export const INITIAL_DESIGN_WIDTH = 100;