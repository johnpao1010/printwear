
import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { LogoIcon } from './icons/LogoIcon';

export const Header: React.FC = () => {
  const { cartItems, openCart } = useContext(CartContext);
  const itemCount = cartItems.length;

  return (
    <header className="bg-white shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <LogoIcon className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Design Studio</h1>
        </div>
        <button onClick={openCart} className="relative text-gray-600 hover:text-indigo-600 transition-colors duration-200">
          <ShoppingCartIcon className="h-7 w-7" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
