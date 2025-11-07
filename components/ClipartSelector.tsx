import React from 'react';
import { Design } from '../types';

interface ClipartSelectorProps {
  onSelectClipart: (clipart: Design) => void;
}

// Lista de cliparts disponibles
const CLIPARTS = [
  {
    id: 'clipart-1',
    name: 'Clipart 1',
    src: 'https://eaa5q8xpiwhdnz0x.public.blob.vercel-storage.com/ClipsArts/clipArtYamas.png',
    width: 150,
    height: 150
  },
  {
    id: 'clipart-2',
    name: 'Clipart 2',
    src: 'https://eaa5q8xpiwhdnz0x.public.blob.vercel-storage.com/ClipsArts/clipaArtOsoUni.png',
    width: 150,
    height: 150
  },
  // Agrega más cliparts según sea necesario
];

export const ClipartSelector: React.FC<ClipartSelectorProps> = ({ onSelectClipart }) => {
  const handleClipartClick = (clipart: any) => {
    const bounds = {
      top: 100,
      left: 100,
      right: 400,
      bottom: 400
    };

    onSelectClipart({
      src: clipart.src,
      width: clipart.width,
      height: clipart.height,
      x: bounds.left + (bounds.right - bounds.left) / 2 - clipart.width / 2,
      y: bounds.top + (bounds.bottom - bounds.top) / 2 - clipart.height / 2,
    });
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-gray-600 mb-3">3. Agregar ClipArt</h3>
      <div className="grid grid-cols-3 gap-3">
        {CLIPARTS.map((clipart) => (
          <button
            key={clipart.id}
            onClick={() => handleClipartClick(clipart)}
            className="p-2 border rounded-lg hover:border-blue-400 transition-colors"
            aria-label={`Seleccionar ${clipart.name}`}
          >
            <img 
              src={clipart.src} 
              alt={clipart.name}
              className="w-full h-16 object-contain"
            />
            <span className="text-xs text-gray-600 mt-1 block truncate">{clipart.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
