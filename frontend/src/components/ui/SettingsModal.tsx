import React from 'react';
import { X, Settings, Calculator, Receipt, Volume2 } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { useTax, toggleTax, useServiceCharge, toggleServiceCharge } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <Settings size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">Pengaturan Kasir</h2>
              <p className="text-xs text-slate-400">Konfigurasi preferensi terminal Anda</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* PAJAK & BIAYA */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Pajak & Biaya Tambahan</h3>
            <div className="space-y-3">
              
              {/* Toggle PPN */}
              <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <Calculator size={18} className="text-emerald-400" />
                  <div>
                    <h4 className="text-sm font-medium text-slate-200">Gunakan PPN (11%)</h4>
                    <p className="text-xs text-slate-400">Terapkan pajak pertambahan nilai</p>
                  </div>
                </div>
                <button 
                  onClick={toggleTax}
                  className={`w-12 h-6 rounded-full relative transition-colors ${useTax ? 'bg-indigo-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${useTax ? 'left-[26px]' : 'left-1'}`} />
                </button>
              </div>

              {/* Toggle Service Charge */}
              <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <Receipt size={18} className="text-blue-400" />
                  <div>
                    <h4 className="text-sm font-medium text-slate-200">Service Charge (5%)</h4>
                    <p className="text-xs text-slate-400">Biaya layanan restoran otomatis</p>
                  </div>
                </div>
                <button 
                  onClick={toggleServiceCharge}
                  className={`w-12 h-6 rounded-full relative transition-colors ${useServiceCharge ? 'bg-indigo-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${useServiceCharge ? 'left-[26px]' : 'left-1'}`} />
                </button>
              </div>

            </div>
          </div>

          {/* HARDWARE PREFERENCES (Mock) */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Preferensi Hardware</h3>
            <div className="space-y-3">
              
              <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 opacity-60">
                <div className="flex items-center gap-3">
                  <Volume2 size={18} className="text-slate-400" />
                  <div>
                    <h4 className="text-sm font-medium text-slate-200">Suara Barcode (Beep)</h4>
                    <p className="text-xs text-slate-400">Mainkan suara saat barang discan</p>
                  </div>
                </div>
                <button className="w-12 h-6 rounded-full relative transition-colors bg-indigo-500">
                  <div className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all left-[26px]" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
