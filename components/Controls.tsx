import React, { useRef, useState } from 'react';
import { Design } from '../types';
import { UploadIcon } from './icons/UploadIcon';
import { CartPlusIcon } from './icons/CartPlusIcon';
import { PreviewPanel } from './PreviewPanel';
import { PhotoIcon } from './icons/PhotoIcon';

interface ControlsProps {
  onUpload: (file: File) => void;
  design: Design | null;
  price: number;
  onAddToCart: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ onUpload, design, price, onAddToCart }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [combinedImage, setCombinedImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };
  
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handlePreviewClick = async () => {
    if (!design) return;
    
    try {
      // Obtener el contenedor del diseño
      const previewContainer = document.querySelector('#preview-container');
      if (!previewContainer) return;
      
      // Crear un canvas para la captura
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Establecer el tamaño del canvas
      canvas.width = 800;
      canvas.height = 800;
      
      // Cargar la imagen base
      const baseImg = new Image();
      baseImg.crossOrigin = 'Anonymous';
      
      await new Promise<void>((resolve, reject) => {
        baseImg.onload = () => resolve();
        baseImg.onerror = reject;
        baseImg.src = document.querySelector('img[alt="Product Base"]')?.getAttribute('src') || '';
      });
      
      // Dibujar la imagen base
      ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
      
      // Cargar el diseño
      const designImg = new Image();
      designImg.crossOrigin = 'Anonymous';
      
      await new Promise<void>((resolve, reject) => {
        designImg.onload = () => resolve();
        designImg.onerror = reject;
        designImg.src = design.src;
      });
      
      // Obtener el elemento de diseño para sus dimensiones y posición
      const designElement = document.querySelector('#design-controls') as HTMLElement;
      if (!designElement) return;
      
      const rect = designElement.getBoundingClientRect();
      const containerRect = previewContainer.getBoundingClientRect();
      
      // Calcular la posición relativa dentro del contenedor
      const x = (rect.left - containerRect.left) * (canvas.width / containerRect.width);
      const y = (rect.top - containerRect.top) * (canvas.height / containerRect.height);
      const width = rect.width * (canvas.width / containerRect.width);
      const height = rect.height * (canvas.height / containerRect.height);
      
      // Dibujar el diseño en la posición y tamaño correctos
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(designImg, x, y, width, height);
      
      // Guardar la imagen combinada
      setCombinedImage(canvas.toDataURL('image/png', 1.0));
      setShowPreview(true);
      
    } catch (error) {
      console.error('Error al generar la vista previa:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-600 mb-3">3. Subir Diseño</h3>
        <input type="file" accept="image/png, image/jpeg, image/svg+xml" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <div className="space-y-3">
          <button 
            onClick={triggerFileUpload} 
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            <UploadIcon className="w-5 h-5"/>
            <span>{design ? 'Cambiar Diseño' : 'Subir Imagen'}</span>
          </button>
          
          <button 
            onClick={handlePreviewClick}
            disabled={!design}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <PhotoIcon className="w-5 h-5"/>
            <span>Vista Previa</span>
          </button>
        </div>
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
      
      {showPreview && combinedImage && (
        <PreviewPanel 
          originalImage={document.querySelector('img[alt="Product Base"]')?.getAttribute('src') || ''}
          combinedImage={combinedImage}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};