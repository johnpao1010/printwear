import React, { useState, useCallback, useMemo, useRef } from 'react';
import { ProductType, Design, CartItem, ProductVariant } from './types';
import { PRODUCT_VARIANTS, PRICE_PER_AREA_MULTIPLIER, INITIAL_DESIGN_WIDTH } from './constants';
import { Header } from './components/Header';
import { ProductSelector } from './components/ProductSelector';
import { ProductVariantSelector } from './components/ProductVariantSelector';
import { DesignCanvas } from './components/DesignCanvas';
import { Controls } from './components/Controls';
import { ShoppingCart } from './components/ShoppingCart';
import { CartContext } from './contexts/CartContext';
import { toPng } from 'html-to-image';

const App: React.FC = () => {
  const [productType, setProductType] = useState<ProductType>('tshirt');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(PRODUCT_VARIANTS.tshirt[0]);
  const [design, setDesign] = useState<Design | null>(null);
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
      const dataUrl = await toPng(canvasRef.current, { 
        cacheBust: true,
        // Exclude controls from the snapshot
        filter: (node) => (node as HTMLElement).id !== 'design-controls'
      });
      
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
      console.error('Failed to capture image', err);
      alert('Could not add item to cart. Failed to capture the final product image.');
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
              <h2 className="text-2xl font-bold text-gray-700 border-b pb-3">Customize Your Gear</h2>
              <ProductSelector selected={productType} onSelect={handleProductChange} />
              <ProductVariantSelector 
                productType={productType}
                variants={PRODUCT_VARIANTS[productType]} 
                selectedVariant={selectedVariant} 
                onSelect={handleVariantChange} 
              />
              <Controls onUpload={handleDesignUpload} design={design} price={currentPrice} onAddToCart={handleAddToCart} />
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg flex items-center justify-center">
              <DesignCanvas 
                ref={canvasRef}
                baseImage={selectedVariant.imageUrl} 
                design={design} 
                onDesignChange={handleDesignChange}
                bounds={selectedVariant.bounds}
              />
            </div>
          </div>
        </main>
        <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} onRemove={handleRemoveFromCart}/>
      </div>
    </CartContext.Provider>
  );
};

export default App;