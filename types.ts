export type ProductType = 'tshirt' | 'cap';

export interface Design {
  id?: string;
  src: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface DesignBounds {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export type GenderCategory = 'hombre' | 'mujer' | 'juvenil' | 'niños';

export interface ProductAngle {
  view: 'front' | 'back' | 'left' | 'right';
  imageUrl: string;
  thumbnailUrl: string;
  bounds: DesignBounds;
}

export interface ProductVariant {
  id: string;
  name: string;
  imageUrl: string;
  thumbnailUrl: string;
  basePrice: number;
  bounds: DesignBounds;
  gender: GenderCategory;
  angles: ProductAngle[];
  defaultAngle?: 'front' | 'back' | 'left' | 'right';
}

export interface CartItem {
  id: string;
  productVariant: ProductVariant;
  design: Design;
  price: number;
  finalProductImage: string; // A snapshot of the final customized product
}