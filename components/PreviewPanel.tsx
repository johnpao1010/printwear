import React from 'react';

interface PreviewPanelProps {
  originalImage: string;
  combinedImage: string | null;
  onClose: () => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ originalImage, combinedImage, onClose }) => {
  if (!combinedImage) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Vista Previa del Diseño</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Cerrar vista previa"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center">
            <h4 className="text-lg font-medium text-gray-700 mb-3">Antes</h4>
            <img 
              src={originalImage} 
              alt="Producto original" 
              className="max-h-[400px] w-auto mx-auto bg-gray-100 p-4 rounded-lg"
            />
          </div>
          
          <div className="text-center">
            <h4 className="text-lg font-medium text-gray-700 mb-3">Después</h4>
            <img 
              src={combinedImage} 
              alt="Producto con diseño" 
              className="max-h-[400px] w-auto mx-auto bg-gray-100 p-4 rounded-lg"
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <a
            href={combinedImage}
            download="diseño-personalizado.png"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Descargar Imagen
          </a>
        </div>
      </div>
    </div>
  );
};
