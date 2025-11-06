
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
      newDesign.x = interactionStartRef.current.designX + dx;
      newDesign.y = interactionStartRef.current.designY + dy;
    } else if (interaction === 'resize') {
      const newWidth = Math.max(20, interactionStartRef.current.width + dx);
      const aspectRatio = design.height / design.width;
      newDesign.width = newWidth;
      newDesign.height = newWidth * aspectRatio;
    }

    // Enforce boundaries
    newDesign.x = Math.max(bounds.left, Math.min(newDesign.x, bounds.right - newDesign.width));
    newDesign.y = Math.max(bounds.top, Math.min(newDesign.y, bounds.bottom - newDesign.height));
    if (newDesign.width > (bounds.right - bounds.left)) {
        newDesign.width = bounds.right - bounds.left;
        newDesign.height = newDesign.width * (design.height/design.width);
    }
    if (newDesign.height > (bounds.bottom - bounds.top)) {
        newDesign.height = bounds.bottom - bounds.top;
        newDesign.width = newDesign.height * (design.width/design.height);
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
    <div ref={canvasRef} className="relative w-[560px] h-[560px] select-none bg-gray-200/50 rounded-lg">
      <img src={baseImage} alt="Product Base" className="w-full h-full object-contain" />
      {design && (
        <div
          id="design-controls"
          className="absolute border-2 border-dashed border-indigo-500 cursor-move"
          style={{
            left: design.x,
            top: design.y,
            width: design.width,
            height: design.height,
          }}
          onMouseDown={(e) => handleMouseDown(e, 'move')}
        >
          <img src={design.src} alt="User Design" className="w-full h-full" draggable="false" />
          <div
            className="absolute -bottom-2 -right-2 w-4 h-4 bg-indigo-600 rounded-full border-2 border-white cursor-se-resize"
            onMouseDown={(e) => handleMouseDown(e, 'resize')}
          />
        </div>
      )}
    </div>
  );
});
