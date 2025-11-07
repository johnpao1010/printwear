import React from 'react';
import { ProductAngle } from '../types';

interface AngleSelectorProps {
  angles: ProductAngle[];
  selectedAngle: string;
  onSelectAngle: (angle: ProductAngle) => void;
  variantName: string;
}

export const AngleSelector: React.FC<AngleSelectorProps> = ({
  angles,
  selectedAngle,
  onSelectAngle,
  variantName,
}) => {
  const getAngleLabel = (view: string) => {
    switch (view) {
      case 'front':
        return 'Frente';
      case 'back':
        return 'Atrás';
      case 'left':
        return 'Izquierda';
      case 'right':
        return 'Derecha';
      default:
        return view;
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-2 mt-2">
        {angles.map((angle) => (
          <button
            key={angle.view}
            onClick={() => onSelectAngle(angle)}
            className={`flex flex-col items-center p-1.5 rounded transition-colors ${
              selectedAngle === angle.view
                ? 'bg-indigo-100 border border-indigo-300'
                : 'bg-white border border-gray-200 hover:bg-gray-50'
            }`}
            aria-label={`Vista ${getAngleLabel(angle.view)}`}
          >
            <div className="w-full aspect-square bg-gray-50 rounded overflow-hidden flex items-center justify-center p-1">
              <img
                src={angle.thumbnailUrl}
                alt={`${variantName} - ${getAngleLabel(angle.view)}`}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xs mt-1 text-gray-700 font-medium">
              {getAngleLabel(angle.view)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
