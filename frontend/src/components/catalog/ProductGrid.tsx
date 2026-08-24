import React, { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useProductStore } from '../../store/useProductStore';

interface ProductGridProps {
  scanIndicator: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ scanIndicator }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { addItem } = useCartStore();
  const { products } = useProductStore();

  const filteredProducts = products
    .filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Put out-of-stock items at the very end
      if (a.stock <= 0 && b.stock > 0) return 1;
      if (a.stock > 0 && b.stock <= 0) return -1;
      return 0;
    });

  return (
    <div className="flex-1 flex flex-col min-w-[60%] border-r border-slate-700/50 overflow-hidden">
      
      {/* Search & Filter Bar */}
      <div className="p-6 pb-2 border-b border-slate-700/50 bg-slate-800/50 shrink-0">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search product manually..." 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-lg"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 rounded border border-slate-700 text-xs text-slate-400 font-medium flex items-center gap-2">
             <span className={`w-2 h-2 rounded-full ${scanIndicator ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
             READY TO SCAN
          </div>
        </div>
        
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {['Semua Menu', 'Makanan Utama', 'Minuman', 'Cemilan', 'Dessert'].map((cat, i) => (
            <button 
              key={cat} 
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${i === 0 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-900">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          
          {filteredProducts.map((product) => {
            const isOutOfStock = product.stock <= 0;

            return (
              <div 
                key={product.id}
                onClick={() => !isOutOfStock && addItem(product)}
                className={`bg-slate-800 rounded-xl border overflow-hidden transition-all flex flex-col h-full relative ${isOutOfStock ? 'opacity-50 cursor-not-allowed border-slate-800' : 'cursor-pointer group ' + (product.isLowStock ? 'border-rose-900/50 hover:border-rose-500/50 hover:shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 'border-slate-700/50 hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.1)]')}`}
              >
                <div className="aspect-square bg-slate-700/50 flex items-center justify-center relative overflow-hidden">
                  {isOutOfStock ? (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-20">
                      <span className="bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                        Stok Habis
                      </span>
                    </div>
                  ) : product.isLowStock ? (
                    <div className="absolute top-2 right-2 bg-rose-500/90 text-white backdrop-blur-sm px-2 py-1 rounded text-xs font-medium border border-rose-500/30 flex items-center gap-1 z-10">
                      <AlertCircle size={12} /> Stock: {product.stock}
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-slate-300 border border-slate-700 z-10">
                      Stock: {product.stock}
                    </div>
                  )}
                  <img src={product.imageUrl} alt={product.name} className={`object-cover h-full w-full transition-transform duration-300 ${!isOutOfStock && 'group-hover:scale-105'}`} />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-medium text-slate-200 line-clamp-2 text-sm">{product.name}</h3>
                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <span className={`font-bold ${isOutOfStock ? 'text-slate-500 line-through' : 'text-emerald-400'}`}>Rp {product.price.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
};
