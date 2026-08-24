import React, { useState, useRef, useEffect } from 'react';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import { ChefHat, ShoppingBag } from 'lucide-react';

export const CustomerMenu: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle Wheel (Mouse)
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      setActiveIndex((prev) => Math.min(prev + 1, MOCK_PRODUCTS.length - 1));
    } else if (e.deltaY < 0) {
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  // Handle Touch (Mobile Swipe)
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.changedTouches[0].screenY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault(); // Prevent default scrolling
  };

  const handleTouchEnd = (e: TouchEvent) => {
    touchEndY.current = e.changedTouches[0].screenY;
    if (touchStartY.current !== null && touchEndY.current !== null) {
      const deltaY = touchStartY.current - touchEndY.current;
      if (deltaY > 50) {
        // Swipe Up (Next)
        setActiveIndex((prev) => Math.min(prev + 1, MOCK_PRODUCTS.length - 1));
      } else if (deltaY < -50) {
        // Swipe Down (Prev)
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const activeProduct = MOCK_PRODUCTS[activeIndex];

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-slate-950 text-white font-sans overflow-hidden flex flex-col touch-none select-none"
    >
      
      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 p-6 z-50 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-full text-white border border-white/20">
            <ChefHat size={20} />
          </div>
          <h1 className="font-bold tracking-widest uppercase text-sm">MyTRA Resto</h1>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-2 rounded-full text-white border border-white/20">
          <ShoppingBag size={20} />
        </div>
      </div>

      {/* 3D WHEEL IMAGES */}
      <div className="relative flex-1 w-full flex items-center justify-center [perspective:1000px]">
        {MOCK_PRODUCTS.map((product, idx) => {
          // Calculate relative distance from active index
          const offset = idx - activeIndex;
          const absOffset = Math.abs(offset);
          
          // CSS variables for transform
          const rotateX = offset * -25; // Rotate 25deg per item
          const translateY = offset * 120; // Move vertically 120px per item
          const translateZ = absOffset * -150; // Push back non-active items
          const opacity = absOffset > 2 ? 0 : 1 - (absOffset * 0.3);
          const scale = absOffset === 0 ? 1 : 0.8;
          const isVisible = absOffset <= 2;

          if (!isVisible) return null;

          return (
            <div
              key={product.id}
              className="absolute transition-all duration-700 ease-out"
              style={{
                transform: `translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`,
                opacity: opacity,
                zIndex: 50 - absOffset,
              }}
            >
              {/* Product Image as a Circle (Plate style) */}
              <div className={`w-64 h-64 md:w-80 md:h-80 rounded-full border-4 shadow-2xl overflow-hidden transition-all duration-700 ${absOffset === 0 ? 'border-amber-400 shadow-[0_0_50px_rgba(251,191,36,0.3)]' : 'border-slate-800 shadow-none'}`}>
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ACTIVE PRODUCT DETAILS (Fixed at Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 z-50 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none">
        <div className="text-center animate-in fade-in slide-in-from-bottom-5 duration-500" key={activeProduct.id}>
          <div className="inline-block bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            {activeProduct.category || 'Menu Spesial'}
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-3 leading-tight drop-shadow-lg">
            {activeProduct.name}
          </h2>
          <p className="text-2xl text-emerald-400 font-bold mb-6">
            Rp {activeProduct.price.toLocaleString('id-ID')}
          </p>
          
          <div className="flex flex-col items-center gap-1 opacity-50">
            <span className="text-[10px] uppercase tracking-widest">Swipe Up / Down</span>
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-white/50 to-transparent animate-pulse"></div>
          </div>
        </div>
      </div>

    </div>
  );
};
