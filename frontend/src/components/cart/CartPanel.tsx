import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, CreditCard, X } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { PaymentModal } from '../checkout/PaymentModal';

export const CartPanel: React.FC = () => {
  const { items, subtotal, tax, grandTotal, useTax, toggleTax, removeItem, updateQuantity, clearCart } = useCartStore();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Global F2 listener for Pay button
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2' && items.length > 0 && !isPaymentModalOpen) {
        setIsPaymentModalOpen(true);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items.length, isPaymentModalOpen]);

  return (
    <div className="w-[40%] min-w-[350px] max-w-[500px] bg-slate-800 flex flex-col shadow-2xl relative z-10 border-l border-slate-700 shrink-0">
      
      {/* Cart Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-700 bg-slate-800/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2">
          <ShoppingCart className="text-indigo-400" />
          <h2 className="text-lg font-bold">Current Order</h2>
        </div>
        <div className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-sm font-medium">
          {items.reduce((sum, item) => sum + item.quantity, 0)} Items
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
            <ShoppingCart size={48} className="opacity-20" />
            <p>Cart is empty. Scan an item.</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.variant.id} className="bg-slate-700/30 border border-slate-700 rounded-xl p-4 flex gap-4 relative group shrink-0">
              <button 
                onClick={() => removeItem(item.variant.id)}
                className="absolute -top-2 -right-2 bg-slate-800 border border-slate-600 text-slate-400 hover:text-rose-400 hover:border-rose-500 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
              <div className="w-16 h-16 bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shrink-0">
                <img src={item.variant.imageUrl} alt={item.variant.name} className="object-cover h-full w-full" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-medium text-slate-200 line-clamp-1">{item.variant.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">SKU: {item.variant.sku}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-emerald-400 text-sm">Rp {item.subtotal.toLocaleString('id-ID')}</span>
                  <div className="flex items-center bg-slate-900 rounded-lg border border-slate-700 overflow-hidden h-8">
                    <button 
                      onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                      className="px-3 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    >-</button>
                    <span className="px-2 text-sm font-medium min-w-[2rem] text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                      className="px-3 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    >+</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

      </div>

      {/* Totals & Checkout Panel */}
      <div className="bg-slate-900 p-6 border-t border-slate-700/80 rounded-tl-2xl shrink-0">
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-slate-400 text-sm">
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <span>PPN (11%)</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTax();
                }}
                className={`w-8 h-4 rounded-full relative transition-colors ${useTax ? 'bg-indigo-500' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${useTax ? 'left-4.5 right-0.5' : 'left-0.5'}`} style={useTax ? { right: '2px' } : { left: '2px' }}></div>
              </button>
            </div>
            <span>Rp {tax.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-rose-400 text-sm">
            <span>Discount</span>
            <span>- Rp 0</span>
          </div>
          <div className="h-px bg-slate-700/50 w-full my-2"></div>
          <div className="flex justify-between items-end">
            <span className="text-lg text-slate-300 font-medium">Grand Total</span>
            <span className="text-3xl font-bold text-white tracking-tight">Rp {grandTotal.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
           <button className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 p-3 rounded-xl flex items-center justify-center gap-2 transition-colors h-14">
            <Menu size={20} />
            <span className="font-medium">Hold</span>
          </button>
          <button 
            onClick={clearCart}
            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 p-3 rounded-xl flex items-center justify-center gap-2 transition-colors h-14"
          >
            <span className="font-medium">Clear (Esc)</span>
          </button>
        </div>

        <button 
          onClick={() => setIsPaymentModalOpen(true)}
          disabled={items.length === 0}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white p-4 rounded-xl flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:hover:shadow-none h-16 active:scale-[0.98]"
        >
          <CreditCard size={24} />
          <span className="text-xl font-bold">Pay (F2)</span>
        </button>
      </div>
      
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
      />
    </div>
  );
};

