
import React from 'react';
import { CartItem } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  openCart: () => void;
}

export const CartContext = React.createContext<CartContextType>({
  cartItems: [],
  openCart: () => {},
});
