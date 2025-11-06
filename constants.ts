import { ProductType, ProductVariant } from './types';

export const PRODUCT_VARIANTS: Record<ProductType, ProductVariant[]> = {
  tshirt: [
    {
      id: 'tshirt-crew',
      name: 'Crew Neck T-Shirt',
      imageUrl: 'https://i.imgur.com/2eyp60S.png',
      thumbnailUrl: 'https://i.imgur.com/2eyp60S.png',
      basePrice: 25.00,
      bounds: { top: 120, left: 180, right: 380, bottom: 400 },
    },
    {
      id: 'tshirt-vneck',
      name: 'V-Neck T-Shirt',
      imageUrl: 'https://i.imgur.com/5Jm2M2m.png',
      thumbnailUrl: 'https://i.imgur.com/5Jm2M2m.png',
      basePrice: 26.50,
      bounds: { top: 140, left: 180, right: 380, bottom: 400 },
    },
    {
      id: 'tshirt-sweatshirt',
      name: 'Sweatshirt',
      imageUrl: 'https://i.imgur.com/2s3aX2x.png',
      thumbnailUrl: 'https://i.imgur.com/2s3aX2x.png',
      basePrice: 35.00,
      bounds: { top: 130, left: 170, right: 390, bottom: 380 },
    },
  ],
  cap: [
    {
      id: 'cap-baseball',
      name: 'Baseball Cap',
      imageUrl: 'https://i.imgur.com/8zXSR2Y.png',
      thumbnailUrl: 'https://i.imgur.com/8zXSR2Y.png',
      basePrice: 18.00,
      bounds: { top: 60, left: 200, right: 360, bottom: 180 },
    },
    {
      id: 'cap-snapback',
      name: 'Snapback Cap',
      imageUrl: 'https://i.imgur.com/h5n4RLf.png',
      thumbnailUrl: 'https://i.imgur.com/h5n4RLf.png',
      basePrice: 20.00,
      bounds: { top: 70, left: 190, right: 370, bottom: 170 },
    },
  ],
};


// Price per 1000 square pixels
export const PRICE_PER_AREA_MULTIPLIER = 0.05;

export const INITIAL_DESIGN_WIDTH = 100;