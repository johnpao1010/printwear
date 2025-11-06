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

  const handlePreviewClick = () => {
    if (!design) return;
    
    // Crear un canvas temporal para combinar las imágenes
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    
    // Tamaño del canvas (puedes ajustar según necesites)
    canvas.width = 800;
    canvas.height = 800;
    
    // Cargar la imagen base
    const baseImg = new Image();
    baseImg.crossOrigin = 'Anonymous';
    baseImg.onload = () => {
      // Dibujar la imagen base
      ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
      
      // Cargar el diseño
      const designImg = new Image();
      designImg.crossOrigin = 'Anonymous';
      designImg.onload = () => {
        // Calcular la posición y tamaño del diseño en el canvas
        const scaleX = canvas.width / (design.width * 2);
        const scaleY = canvas.height / (design.height * 2);
        const scale = Math.min(scaleX, scaleY);
        
        const x = (canvas.width - design.width * scale) / 2;
        const y = (canvas.height - design.height * scale) / 2;
        
        // Crear un canvas temporal para el diseño
        const designCanvas = document.createElement('canvas');
        const designCtx = designCanvas.getContext('2d', { willReadFrequently: true });
        if (!designCtx) return;
        
        designCanvas.width = designImg.width;
        designCanvas.height = designImg.height;
        designCtx.drawImage(designImg, 0, 0);
        
        // Aplicar un filtro de brillo y contraste al diseño
        const imageData = designCtx.getImageData(0, 0, designCanvas.width, designCanvas.height);
        const data = imageData.data;
        
        // Ajustar brillo y contraste
        for (let i = 0; i < data.length; i += 4) {
          // Solo modificar píxeles no transparentes
          if (data[i + 3] > 0) {
            // Aumentar brillo (1.2 = +20% de brillo)
            data[i] = Math.min(255, data[i] * 1.2);     // R
            data[i + 1] = Math.min(255, data[i + 1] * 1.2); // G
            data[i + 2] = Math.min(255, data[i + 2] * 1.2); // B
            
            // Mantener la transparencia original
            data[i + 3] = data[i + 3];
          }
        }
        
        designCtx.putImageData(imageData, 0, 0);
        
        // Usar 'source-over' para mantener los colores originales
        ctx.globalCompositeOperation = 'source-over';
        
        // Ajustar la opacidad (0.9 = 90% de opacidad)
        ctx.globalAlpha = 1.0;
        
        // Dibujar el diseño con los ajustes
        ctx.drawImage(
          designCanvas,
          0, 0, designCanvas.width, designCanvas.height,
          x, y, design.width * scale, design.height * scale
        );
        
        // Guardar la imagen combinada
        setCombinedImage(canvas.toDataURL('image/png', 1.0));
        setShowPreview(true);
      };
      designImg.src = design.src;
    };
    baseImg.src = document.querySelector('img[alt="Product Base"]')?.getAttribute('src') || '';
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