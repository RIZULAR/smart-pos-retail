import React, { useState, useEffect } from 'react';
import { MOCK_PRODUCTS, CATEGORIES } from '../../data/mockProducts';
import { Search, ChefHat, Sparkles } from 'lucide-react';

export const CustomerMenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Semua Menu');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Hero Carousel State
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featuredItems = MOCK_PRODUCTS.slice(0, 4); // Top 4 items for the hero carousel

  useEffect(() => {
    // Auto-slide hero image every 3 seconds
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % featuredItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [featuredItems.length]);

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    // In a real app, you would filter by p.category, but for mock we just use search as proxy if 'Semua' is not selected.
    // Since mockProducts doesn't have category string yet, we'll just show all.
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* HEADER */}
      <div className="bg-white px-6 py-4 sticky top-0 z-50 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-xl text-white">
            <ChefHat size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight">MyTRA Resto</h1>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">E-Menu Digital</p>
          </div>
        </div>
      </div>

      {/* ANIMATED HERO SECTION (Slide Up Transition) */}
      <div className="relative w-full h-[350px] bg-slate-900 overflow-hidden">
        {featuredItems.map((item, idx) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              idx === featuredIndex 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 -translate-y-10 scale-105 pointer-events-none'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10" />
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute bottom-8 left-6 right-6 z-20">
              <div className="inline-flex items-center gap-1 bg-amber-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider mb-2">
                <Sparkles size={12} /> Chef's Recommendation
              </div>
              <h2 className="text-3xl font-black text-white leading-tight drop-shadow-lg mb-1">
                {item.name}
              </h2>
              <p className="text-emerald-400 font-bold text-lg drop-shadow-md">
                Rp {item.price.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        ))}
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          {featuredItems.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-500 ${idx === featuredIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} 
            />
          ))}
        </div>
      </div>

      {/* SEARCH & CATEGORIES */}
      <div className="px-5 mt-6 mb-2">
        <div className="relative mb-4 shadow-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari makanan atau minuman..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['Semua Menu', 'Makanan Utama', 'Minuman', 'Cemilan', 'Dessert'].map((cat) => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                activeCategory === cat 
                ? 'bg-indigo-600 text-white shadow-indigo-200' 
                : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* MENU GRID */}
      <div className="px-5 pt-4">
        <h3 className="font-bold text-slate-800 mb-4">{activeCategory}</h3>
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col active:scale-95 transition-transform">
              <div className="aspect-square bg-slate-100 relative overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 flex flex-col flex-1">
                <h4 className="font-bold text-slate-800 text-sm leading-tight mb-2 line-clamp-2">{product.name}</h4>
                <div className="mt-auto">
                  <span className="font-black text-indigo-600 text-sm">Rp {product.price.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
