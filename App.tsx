import React, { useState, useCallback, useMemo, useRef } from 'react';
import { ProductType, Design, CartItem, ProductVariant } from './types';
import { PRODUCT_VARIANTS, PRICE_PER_AREA_MULTIPLIER, INITIAL_DESIGN_WIDTH } from './constants';
import { Header } from './components/Header';
import { ProductSelector } from './components/ProductSelector';
import { ProductVariantSelector } from './components/ProductVariantSelector';
import { AngleSelector } from './components/AngleSelector';
import { DesignCanvas } from './components/DesignCanvas';
import { Controls } from './components/Controls';
import { ShoppingCart } from './components/ShoppingCart';
import { CartContext } from './contexts/CartContext';
import { ClipartSelector } from './components/ClipartSelector';
import { toPng } from 'html-to-image';

const App: React.FC = () => {
  const [productType, setProductType] = useState<ProductType>('tshirt');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(PRODUCT_VARIANTS.tshirt[0]);
  const [design, setDesign] = useState<Design | null>(null);
  const [selectedClipart, setSelectedClipart] = useState<Design | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleProductChange = useCallback((type: ProductType) => {
    setProductType(type);
    const newVariant = PRODUCT_VARIANTS[type][0];
    setSelectedVariant(newVariant);
    setDesign(null);
  }, []);

  const handleVariantChange = useCallback((variant: ProductVariant) => {
    setSelectedVariant(variant);
    setDesign(null);
  }, []);

  const handleDesignUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.height / img.width;
        const initialHeight = INITIAL_DESIGN_WIDTH * aspectRatio;
        const bounds = selectedVariant.bounds;
        setSelectedClipart(null); // Resetear clipart seleccionado
        setDesign({
          src: e.target?.result as string,
          width: INITIAL_DESIGN_WIDTH,
          height: initialHeight,
          x: bounds.left + (bounds.right - bounds.left) / 2 - INITIAL_DESIGN_WIDTH / 2,
          y: bounds.top + (bounds.bottom - bounds.top) / 2 - initialHeight / 2,
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [selectedVariant]);

  const handleClipartSelect = useCallback((clipart: Design) => {
    setSelectedClipart(clipart);
    setDesign({
      ...clipart,
      id: `clipart-${Date.now()}`,
      x: selectedVariant.bounds.left + (selectedVariant.bounds.right - selectedVariant.bounds.left) / 2 - clipart.width / 2,
      y: selectedVariant.bounds.top + (selectedVariant.bounds.bottom - selectedVariant.bounds.top) / 2 - clipart.height / 2,
    });
  }, [selectedVariant]);
  
  const handleDesignChange = useCallback((newDesign: Design) => {
    setDesign(newDesign);
  }, []);

  const currentPrice = useMemo(() => {
    const basePrice = selectedVariant.basePrice;
    if (!design) return basePrice;
    const designArea = design.width * design.height;
    const designCost = (designArea / 1000) * PRICE_PER_AREA_MULTIPLIER;
    return basePrice + designCost;
  }, [selectedVariant, design]);

  const handleAddToCart = useCallback(async () => {
    if (!design || !canvasRef.current) return;

    try {
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
        baseImg.src = selectedVariant.imageUrl;
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
      const designElement = canvasRef.current.querySelector('#design-controls') as HTMLElement;
      if (!designElement) return;

      const rect = designElement.getBoundingClientRect();
      const containerRect = canvasRef.current.getBoundingClientRect();

      // Calcular la posición relativa dentro del contenedor
      const x = (rect.left - containerRect.left) * (canvas.width / containerRect.width);
      const y = (rect.top - containerRect.top) * (canvas.height / containerRect.height);
      const width = rect.width * (canvas.width / containerRect.width);
      const height = rect.height * (canvas.height / containerRect.height);

      // Dibujar el diseño en la posición y tamaño correctos
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(designImg, x, y, width, height);

      // Obtener la URL de la imagen final
      const dataUrl = canvas.toDataURL('image/png');

      // Agregar el ítem al carrito
      const newItem: CartItem = {
        id: new Date().toISOString(),
        productVariant: selectedVariant,
        design: { ...design },
        price: currentPrice,
        finalProductImage: dataUrl,
      };

      setCartItems(prevItems => [...prevItems, newItem]);
      setIsCartOpen(true);
    } catch (err) {
      console.error('Error al capturar la imagen:', err);
      alert('No se pudo agregar el artículo al carrito. Error al capturar la imagen del producto final.');
    }
  }, [design, selectedVariant, currentPrice]);

  const handleRemoveFromCart = useCallback((itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, openCart: () => setIsCartOpen(true) }}>
      <div className="min-h-screen flex flex-col font-sans text-gray-800">
        <Header />
        <main className="flex-grow container mx-auto p-4 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg flex flex-col space-y-6 h-fit">
              <h2 className="text-2xl font-bold text-gray-700 border-b pb-3">Personaliza tu Producto</h2>
              <ProductSelector selected={productType} onSelect={handleProductChange} />
              <ProductVariantSelector 
                productType={productType}
                variants={PRODUCT_VARIANTS[productType]} 
                selectedVariant={selectedVariant} 
                onSelect={handleVariantChange} 
              />
              <ClipartSelector onSelectClipart={handleClipartSelect} />
              <Controls onUpload={handleDesignUpload} design={design} price={currentPrice} onAddToCart={handleAddToCart} />
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg flex flex-col">
              <div className="flex-1 flex items-center justify-center mb-6">
                <DesignCanvas 
                  ref={canvasRef}
                  baseImage={selectedVariant.imageUrl} 
                  design={design} 
                  onDesignChange={handleDesignChange}
                  bounds={selectedVariant.bounds}
                />
              </div>
              {selectedVariant.angles && selectedVariant.angles.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <AngleSelector
                    angles={selectedVariant.angles}
                    selectedAngle={selectedVariant.defaultAngle || 'front'}
                    onSelectAngle={(angle) => {
                      const newVariant = {
                        ...selectedVariant,
                        imageUrl: angle.imageUrl,
                        bounds: angle.bounds
                      };
                      setSelectedVariant(newVariant);
                    }}
                    variantName={selectedVariant.name}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
        <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} onRemove={handleRemoveFromCart}/>
      </div>
    </CartContext.Provider>
  );
};

export default App;