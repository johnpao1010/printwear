
import React from 'react';
import { ProductType } from '../types';

interface ProductSelectorProps {
  selected: ProductType;
  onSelect: (type: ProductType) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({ selected, onSelect }) => {
  const baseButtonClasses = "w-full py-3 px-4 rounded-lg font-semibold text-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const selectedClasses = "bg-indigo-600 text-white shadow-md";
  const unselectedClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300";

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-600 mb-3">1. Choose a Product</h3>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onSelect('tshirt')}
          className={`${baseButtonClasses} ${selected === 'tshirt' ? selectedClasses : unselectedClasses}`}
        >
          T-Shirt
        </button>
        <button
          onClick={() => onSelect('cap')}
          className={`${baseButtonClasses} ${selected === 'cap' ? selectedClasses : unselectedClasses}`}
        >
          Cap
        </button>
      </div>
    </div>
  );
};
