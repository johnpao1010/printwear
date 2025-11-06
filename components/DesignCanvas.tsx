
import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Design } from '../types';

interface DesignCanvasProps {
  baseImage: string;
  design: Design | null;
  onDesignChange: (design: Design) => void;
  bounds: { top: number; left: number; right: number; bottom: number };
}

type InteractionState = 'move' | 'resize' | null;

export const DesignCanvas = forwardRef<HTMLDivElement, DesignCanvasProps>(({ baseImage, design, onDesignChange, bounds }, ref) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [interaction, setInteraction] = useState<InteractionState>(null);
  const interactionStartRef = useRef<{ x: number, y: number, designX: number, designY: number, width: number, height: number } | null>(null);

  useImperativeHandle(ref, () => canvasRef.current!, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, type: InteractionState) => {
    if (!design) return;
    e.preventDefault();
    setInteraction(type);
    interactionStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      designX: design.x,
      designY: design.y,
      width: design.width,
      height: design.height,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!interaction || !interactionStartRef.current || !design) return;

    const dx = e.clientX - interactionStartRef.current.x;
    const dy = e.clientY - interactionStartRef.current.y;
    let newDesign = { ...design };

    if (interaction === 'move') {
      // Mover el diseño
      newDesign.x = interactionStartRef.current.designX + dx;
      newDesign.y = interactionStartRef.current.designY + dy;
    } else if (interaction === 'resize') {
      // Calcular el nuevo tamaño manteniendo la relación de aspecto
      const aspectRatio = interactionStartRef.current.height / interactionStartRef.current.width;
      
      // Calcular el nuevo ancho basado en el movimiento del ratón
      const newWidth = Math.max(40, interactionStartRef.current.width + dx);
      const newHeight = newWidth * aspectRatio;
      
      // Asegurarse de que el diseño no sea más pequeño que el tamaño mínimo
      const minSize = 40;
      if (newWidth >= minSize && newHeight >= minSize) {
        newDesign.width = newWidth;
        newDesign.height = newHeight;
        
        // Ajustar la posición para que el redimensionamiento se haga desde la esquina inferior derecha
        newDesign.x = interactionStartRef.current.designX;
        newDesign.y = interactionStartRef.current.designY;
      }
    }

    // Aplicar límites de los bordes
    newDesign.x = Math.max(bounds.left, Math.min(newDesign.x, bounds.right - newDesign.width));
    newDesign.y = Math.max(bounds.top, Math.min(newDesign.y, bounds.bottom - newDesign.height));
    
    // Asegurarse de que el diseño no se salga de los límites al redimensionar
    if (newDesign.x + newDesign.width > bounds.right) {
      newDesign.width = bounds.right - newDesign.x;
      newDesign.height = newDesign.width * (design.height / design.width);
    }
    
    if (newDesign.y + newDesign.height > bounds.bottom) {
      newDesign.height = bounds.bottom - newDesign.y;
      newDesign.width = newDesign.height * (design.width / design.height);
    }


    onDesignChange(newDesign);
  };

  const handleMouseUp = () => {
    setInteraction(null);
    interactionStartRef.current = null;
  };

  useEffect(() => {
    if (interaction) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interaction]);

  return (
    <div id="preview-container" ref={canvasRef} className="relative w-[560px] h-[560px] select-none bg-gray-100 rounded-lg">
      {/* Contenedor para la imagen base con posición relativa */}
      <div className="relative w-full h-full">
        <img 
          src={baseImage} 
          alt="Product Base" 
          className="absolute top-0 left-0 w-full h-full object-contain" 
        />
        
        {/* Capa de diseño superpuesta */}
        {design && (
          <div
            id="design-controls"
            className="absolute border-2 border-dashed border-indigo-500 cursor-move overflow-hidden"
            style={{
              left: design.x,
              top: design.y,
              width: design.width,
              height: design.height,
              transform: 'translateZ(0)', // Mejora el rendimiento de la capa
              pointerEvents: 'auto', // Asegura que los eventos del ratón funcionen
            }}
            onMouseDown={(e) => handleMouseDown(e, 'move')}
          >
            <img 
              src={design.src} 
              alt="User Design" 
              className="w-full h-full object-contain pointer-events-none" 
              style={{
                mixBlendMode: 'multiply', // Mejora la integración con la prenda
              }}
              draggable="false" 
            />
            <div
              className="absolute -bottom-2 -right-2 w-6 h-6 bg-indigo-600 rounded-full border-2 border-white cursor-se-resize z-10 flex items-center justify-center"
              onMouseDown={(e) => {
                e.stopPropagation();
                handleMouseDown(e, 'resize');
              }}
            >
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 8h16M4 16h16" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
