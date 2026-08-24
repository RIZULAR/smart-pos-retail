import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Wallet, LogOut, CheckCircle } from 'lucide-react';

export const ShiftOpenModal: React.FC = () => {
  const { user, logout, openShift } = useAuthStore();
  const [startFloat, setStartFloat] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user) return null;

  const handleOpenShift = async (e: React.FormEvent) => {
    e.preventDefault();
    const floatAmount = parseInt(startFloat.replace(/\D/g, '') || '0');
    
    setIsProcessing(true);
    await openShift(floatAmount);
    // Modal will naturally unmount because activeShift will not be null
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50 p-4">
      
      <div className="absolute top-6 right-6 flex items-center gap-4">
        <span className="text-slate-400 font-medium">Logged in as <strong className="text-white">{user.fullName}</strong></span>
        <button onClick={logout} className="bg-slate-800 hover:bg-slate-700 text-rose-400 p-2 rounded-lg flex gap-2 items-center transition-colors">
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        <div className="p-8 text-center border-b border-slate-800">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
            <Wallet className="text-emerald-400" size={36} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Open Shift Register</h2>
          <p className="text-slate-400 text-sm">Please count and enter the starting cash float in your drawer before opening the store.</p>
        </div>

        <form onSubmit={handleOpenShift} className="p-8 bg-slate-800/30">
          <label className="block text-slate-400 text-sm font-medium mb-3 text-center">Starting Cash Float (Modal Awal)</label>
          <div className="relative mb-8">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">Rp</span>
            <input 
              type="text" 
              value={startFloat ? parseInt(startFloat, 10).toLocaleString('id-ID') : ''}
              onChange={(e) => setStartFloat(e.target.value.replace(/\D/g, ''))}
              placeholder="0"
              autoFocus
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-3xl font-bold text-white placeholder-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-center transition-all"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isProcessing || !startFloat}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:shadow-none"
          >
            {isProcessing ? 'Opening Register...' : (
              <>
                <CheckCircle size={20} /> Open Shift
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
