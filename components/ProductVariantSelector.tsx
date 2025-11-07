import React, { useState, useEffect } from 'react';
import { ProductVariant, ProductType, GenderCategory } from '../types';

interface ProductVariantSelectorProps {
  productType: ProductType;
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onSelect: (variant: ProductVariant) => void;
}

const GENDER_OPTIONS: { value: GenderCategory | 'all', label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'hombre', label: 'Hombre' },
  { value: 'mujer', label: 'Mujer' },
  { value: 'juvenil', label: 'Juvenil' },
  { value: 'niños', label: 'Niños' },
];

export const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = ({ productType, variants, selectedVariant, onSelect }) => {
  const [selectedGender, setSelectedGender] = useState<GenderCategory | 'all'>('all');
  const [filteredVariants, setFilteredVariants] = useState<ProductVariant[]>(variants);

  useEffect(() => {
    if (selectedGender === 'all') {
      setFilteredVariants(variants);
    } else {
      setFilteredVariants(variants.filter(variant => variant.gender === selectedGender));
    }
  }, [selectedGender, variants]);

  // Update selected variant if it's not in the filtered list
  useEffect(() => {
    if (!filteredVariants.some(v => v.id === selectedVariant.id) && filteredVariants.length > 0) {
      onSelect(filteredVariants[0]);
    }
  }, [filteredVariants, selectedVariant.id, onSelect]);

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">1. Seleccione una Categoría</h3>
        <div className="flex flex-wrap gap-2">
          {GENDER_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedGender(option.value as GenderCategory | 'all')}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                selectedGender === option.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-600 mb-3">2. Seleccione un Estilo</h3>
      {filteredVariants.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {filteredVariants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => onSelect(variant)}
              className={`relative rounded-lg overflow-hidden transition-all duration-200 focus:outline-none ring-offset-2 focus:ring-2
                ${
                  selectedVariant.id === variant.id
                    ? 'ring-2 ring-indigo-500'
                    : 'ring-1 ring-gray-200 hover:ring-indigo-400'
                }`}
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
      ) : (
        <p className="text-gray-500 text-center py-4">
          No hay productos disponibles en esta categoría.
        </p>
      )}
    </div>
  );
};
