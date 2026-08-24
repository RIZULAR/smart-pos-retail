import React from 'react';
import { LogOut, ScanLine, WifiOff, RefreshCw, LayoutDashboard, Store } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useOfflineQueue } from '../../hooks/useOfflineQueue';

interface HeaderProps {
  scanIndicator: boolean;
  activeTab: 'pos' | 'reports';
  setActiveTab: (tab: 'pos' | 'reports') => void;
}

export const Header: React.FC<HeaderProps> = ({ scanIndicator, activeTab, setActiveTab }) => {
  const { user, activeShift, logout, closeShift } = useAuthStore();
  const { queueCount, isOnline, syncQueue } = useOfflineQueue();

  const handleLogout = () => {
    if (activeShift) {
      if (confirm('You still have an active shift. Are you sure you want to close it and logout?')) {
        closeShift();
        logout();
      }
    } else {
      logout();
    }
  };

  return (
    <header className="h-16 bg-slate-800 flex items-center justify-between px-6 shadow-sm border-b border-slate-700/50 shrink-0">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg text-white transition-colors duration-300 ${scanIndicator ? 'bg-emerald-500 scale-110' : 'bg-indigo-500'}`}>
          <ScanLine size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold leading-tight">MyTRA Resto & Cafe</h1>
          <p className="text-xs text-slate-400 font-medium">Kasir: {user?.fullName}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-700/50">
        <button
          onClick={() => setActiveTab('pos')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'pos' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          <Store size={16} /> Terminal Kasir
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'reports' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          <LayoutDashboard size={16} /> Laporan & Analitik
        </button>
      </div>

      <div className="flex items-center gap-4">
        
        {/* Offline Queue Indicator */}
        {queueCount > 0 && (
          <div className="flex items-center gap-2 bg-rose-500/10 px-3 py-1.5 rounded-full text-sm border border-rose-500/20 text-rose-400">
            {!isOnline ? <WifiOff size={14} /> : <RefreshCw size={14} className="animate-spin" />}
            <span className="font-semibold">{queueCount} Pending</span>
            {isOnline && (
              <button onClick={syncQueue} className="ml-2 text-xs bg-rose-500/20 hover:bg-rose-500/30 px-2 py-0.5 rounded transition-colors">
                Sync Now
              </button>
            )}
          </div>
        )}

        {activeShift && (
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full text-sm border border-slate-700 cursor-pointer hover:bg-slate-700" onClick={handleLogout} title="Click to close shift">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Shift: <span className="font-semibold text-emerald-400">OPEN</span>
            <span className="text-slate-500 ml-1 text-xs">| Float: Rp {activeShift.startFloat.toLocaleString('id-ID')}</span>
          </div>
        )}
        <button onClick={handleLogout} className="text-slate-400 hover:text-rose-400 transition-colors p-2" title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};
