import React, { useRef } from 'react';
import { Design } from '../types';
import { UploadIcon } from './icons/UploadIcon';
import { CartPlusIcon } from './icons/CartPlusIcon';

interface ControlsProps {
  onUpload: (file: File) => void;
  design: Design | null;
  price: number;
  onAddToCart: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ onUpload, design, price, onAddToCart }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };
  
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-600 mb-3">3. Upload Design</h3>
        <input type="file" accept="image/png, image/jpeg, image/svg+xml" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <button onClick={triggerFileUpload} className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-200 text-gray-700 hover:bg-gray-300">
            <UploadIcon className="w-5 h-5"/>
            <span>{design ? 'Change Design' : 'Upload Image'}</span>
        </button>
      </div>

      <div className="border-t pt-6 space-y-4">
         <h3 className="text-lg font-semibold text-gray-600">4. Finalize</h3>
         <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
            <span className="font-semibold text-gray-600">Estimated Price:</span>
            <span className="text-2xl font-bold text-gray-800">${price.toFixed(2)}</span>
         </div>
         <button 
           onClick={onAddToCart} 
           disabled={!design}
           className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow"
         >
           <CartPlusIcon className="w-6 h-6"/>
           <span>Add to Cart</span>
         </button>
      </div>
    </div>
  );
};