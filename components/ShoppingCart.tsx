import React from 'react';
import { CartItem } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (itemId: string) => void;
}

export const ShoppingCart: React.FC<ShoppingCartProps> = ({ isOpen, onClose, items, onRemove }) => {
  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end" onClick={onClose}>
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-5 flex justify-between items-center border-b">
          <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-xl">Your cart is empty</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-5 space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                <div className="w-24 h-24 bg-gray-100 rounded-md flex-shrink-0">
                   <img src={item.finalProductImage} alt="Customized Product" className="w-full h-full object-contain"/>
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.productVariant.name}</h3>
                  <p className="text-sm text-gray-500">Custom Design</p>
                  <p className="font-bold text-lg text-indigo-600">${item.price.toFixed(2)}</p>
                </div>
                <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2">
                  <TrashIcon className="w-5 h-5"/>
                </button>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="p-5 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-600">Total:</span>
              <span className="text-2xl font-bold text-gray-800">${total.toFixed(2)}</span>
            </div>
            <button className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};