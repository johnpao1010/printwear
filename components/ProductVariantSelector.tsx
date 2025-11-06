import React from 'react';
import { ProductVariant, ProductType } from '../types';

interface ProductVariantSelectorProps {
  productType: ProductType;
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onSelect: (variant: ProductVariant) => void;
}

export const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = ({ productType, variants, selectedVariant, onSelect }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-600 mb-3 capitalize">2. Choose a Style</h3>
      <div className="grid grid-cols-3 gap-3">
        {variants.map(variant => (
          <button
            key={variant.id}
            onClick={() => onSelect(variant)}
            className={`relative rounded-lg overflow-hidden transition-all duration-200 focus:outline-none ring-offset-2 focus:ring-2
              ${selectedVariant.id === variant.id ? 'ring-2 ring-indigo-500' : 'ring-1 ring-gray-200 hover:ring-indigo-400'}`}
            aria-label={`Select ${variant.name}`}
            title={variant.name}
          >
            <img 
              src={variant.thumbnailUrl} 
              alt={variant.name}
              className="w-full h-24 object-contain bg-gray-100"
            />
            {selectedVariant.id === variant.id && (
              <div className="absolute inset-0 bg-indigo-500 bg-opacity-20" />
            )}
             <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center p-1 truncate">
              {variant.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
