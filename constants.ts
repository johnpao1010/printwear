import { ProductType, ProductVariant } from './types';

export const PRODUCT_VARIANTS: Record<ProductType, ProductVariant[]> = {
  tshirt: [
    {
      id: 'hoodie-black',
      name: 'Hoodie Negro',
      imageUrl: '/hoodie-black.png',
      thumbnailUrl: '/hoodie-black-thumb.png',
      basePrice: 45,
      bounds: { top: 100, left: 100, right: 460, bottom: 500 },
    },
    {
      id: 'hoodie-gray',
      name: 'Hoodie Gris',
      imageUrl: '/hoodie-gray.png',
      thumbnailUrl: '/hoodie-gray-thumb.png',
      basePrice: 45,
      bounds: { top: 100, left: 100, right: 460, bottom: 500 },
    },
    {
      id: 'sweatshirt-black',
      name: 'Buzo Negro',
      imageUrl: '/sweatshirt-black.png',
      thumbnailUrl: '/sweatshirt-black-thumb.png',
      basePrice: 40,
      bounds: { top: 100, left: 100, right: 460, bottom: 500 },
    },
  ],
  cap: [
    {
      id: 'cap-dad',
      name: 'Gorra Clásica',
      imageUrl: '/cap-classic.png',
      thumbnailUrl: '/cap-classic-thumb.png',
      basePrice: 25,
      bounds: { top: 60, left: 200, right: 360, bottom: 180 },
    },
    {
      id: 'cap-snapback',
      name: 'Gorra Snapback',
      imageUrl: '/cap-snapback.png',
      thumbnailUrl: '/cap-snapback-thumb.png',
      basePrice: 28,
      bounds: { top: 70, left: 190, right: 370, bottom: 170 },
    },
    {
      id: 'cap-beanie',
      name: 'Gorra Beanie',
      imageUrl: '/cap-beanie.png',
      thumbnailUrl: '/cap-beanie-thumb.png',
      basePrice: 22,
      bounds: { top: 50, left: 180, right: 380, bottom: 160 },
    },
  ],
};

// Price per 1000 square pixels
export const PRICE_PER_AREA_MULTIPLIER = 0.05;

export const INITIAL_DESIGN_WIDTH = 100;