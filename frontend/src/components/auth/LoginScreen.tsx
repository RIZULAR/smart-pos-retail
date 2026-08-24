import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { ScanLine, KeyRound, Loader2, AlertCircle } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(email, password);
    if (!success) {
      setError('Invalid email or password. Please check your Supabase account.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        
        <div className="bg-slate-800/50 p-8 flex flex-col items-center border-b border-slate-800">
          <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <ScanLine size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">MyTRA POS</h1>
          <p className="text-slate-400 mt-1 text-sm">Retail Point of Sale System</p>
        </div>

        <form onSubmit={handleLogin} className="p-8">
          
          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex gap-3 text-rose-400 items-start">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kasir@mytra.local"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white tracking-widest placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !email || !password}
            className="w-full mt-8 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Authenticating...
              </>
            ) : (
              'Access Terminal'
            )}
          </button>
        </form>
      </div>
      <p className="mt-8 text-slate-600 text-sm">Please login with your Supabase credentials.</p>
    </div>
  );
};
