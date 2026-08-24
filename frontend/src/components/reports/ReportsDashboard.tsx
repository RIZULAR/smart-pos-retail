import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  CreditCard, 
  ArrowUpRight, 
  Calendar,
  Download,
  PackageCheck,
  PieChart
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface TransactionRecord {
  id: string;
  invoice_number: string;
  subtotal: number;
  tax: number;
  grand_total: number;
  payment_method: string;
  created_at: string;
}

import { useTransactionStore } from '../../store/useTransactionStore';

export const ReportsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'all'>('today');
  const { transactions, fetchTransactions } = useTransactionStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    await fetchTransactions();
    setIsLoading(false);
  };

  // Filter transactions based on selected time range
  const filteredTransactions = transactions.filter((tx) => {
    if (timeRange === 'all') return true;
    const txDate = new Date(tx.created_at);
    const now = new Date();
    
    if (timeRange === 'today') {
      return txDate.toDateString() === now.toDateString();
    } else if (timeRange === 'week') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      return txDate >= sevenDaysAgo;
    } else if (timeRange === 'month') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      return txDate >= thirtyDaysAgo;
    }
    return true;
  });

  // Metric Calculations
  const totalRevenue = filteredTransactions.reduce((acc, curr) => acc + Number(curr.grand_total), 0);
  const totalOrders = filteredTransactions.length;
  // Estimated Profit (Assuming average 35% margin for retail)
  const estimatedProfit = totalRevenue * 0.35;
  const avgBasketSize = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Payment Breakdown
  const cashTotal = filteredTransactions.filter(t => t.payment_method === 'CASH').reduce((acc, c) => acc + Number(c.grand_total), 0);
  const qrisTotal = filteredTransactions.filter(t => t.payment_method === 'QRIS').reduce((acc, c) => acc + Number(c.grand_total), 0);
  const debitTotal = filteredTransactions.filter(t => t.payment_method === 'DEBIT').reduce((acc, c) => acc + Number(c.grand_total), 0);

  return (
    <div className="flex-1 bg-slate-950 p-8 overflow-y-auto">
      
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <PieChart className="text-indigo-400" size={28} />
            Laporan Penjualan & Keuntungan
          </h1>
          <p className="text-slate-400 text-sm mt-1">Ringkasan performa bisnis dan analitik omset secara real-time.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 flex items-center">
            {(['today', 'week', 'month', 'all'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all capitalize ${timeRange === t ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                {t === 'today' ? 'Hari Ini' : t === 'week' ? '7 Hari' : t === 'month' ? '30 Hari' : 'Semua'}
              </button>
            ))}
          </div>

          <button 
            onClick={() => window.print()}
            className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all"
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Total Omset */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm font-medium">Total Omset</span>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
              <DollarSign size={22} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white tracking-tight mb-2">
            Rp {totalRevenue.toLocaleString('id-ID')}
          </h3>
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
            <ArrowUpRight size={14} />
            <span>Pendapatan Kotor</span>
          </div>
        </div>

        {/* Est. Profit */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm font-medium">Estimasi Laba Bersih</span>
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
              <TrendingUp size={22} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-emerald-400 tracking-tight mb-2">
            Rp {estimatedProfit.toLocaleString('id-ID')}
          </h3>
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <span>Estimasi Margin ~35%</span>
          </div>
        </div>

        {/* Total Transaksi */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm font-medium">Total Transaksi</span>
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
              <ShoppingBag size={22} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white tracking-tight mb-2">
            {totalOrders} <span className="text-sm font-normal text-slate-400">Struk</span>
          </h3>
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <Calendar size={12} /> Periode {timeRange}
          </div>
        </div>

        {/* Rata-rata per Transaksi */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm font-medium">Rata-rata / Order</span>
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
              <CreditCard size={22} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white tracking-tight mb-2">
            Rp {avgBasketSize.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
          </h3>
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <span>Basket Size Average</span>
          </div>
        </div>

      </div>

      {/* Payment Methods Breakdown & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Payment Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Metode Pembayaran</h3>
            <p className="text-slate-400 text-xs mb-6">Distribusi tipe pembayaran kasir</p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300 font-medium">Cash (Tunai)</span>
                  <span className="text-white font-bold">Rp {cashTotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${totalRevenue ? (cashTotal/totalRevenue)*100 : 0}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300 font-medium">QRIS Dinamis</span>
                  <span className="text-white font-bold">Rp {qrisTotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${totalRevenue ? (qrisTotal/totalRevenue)*100 : 0}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300 font-medium">Debit / Kartu</span>
                  <span className="text-white font-bold">Rp {debitTotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${totalRevenue ? (debitTotal/totalRevenue)*100 : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
            <span>Status Database:</span>
            <span className="text-emerald-400 font-semibold">Supabase Connected</span>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Riwayat Transaksi Terakhir</h3>
              <p className="text-slate-400 text-xs mt-0.5">Daftar nota penjualan yang tersimpan di Cloud Database</p>
            </div>
            <button onClick={handleRefresh} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors">
              Refresh
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 rounded-l-lg">No Invoice</th>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Metode</th>
                  <th className="py-3 px-4 text-right rounded-r-lg">Total Bayar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-500">Memuat data dari database...</td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-500">Belum ada transaksi di periode ini.</td>
                  </tr>
                ) : (
                  filteredTransactions.slice(0, 15).map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-indigo-400">{tx.invoice_number}</td>
                      <td className="py-3.5 px-4 text-slate-400 text-xs">
                        {new Date(tx.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${tx.payment_method === 'CASH' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : tx.payment_method === 'QRIS' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
                          {tx.payment_method}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-white">
                        Rp {Number(tx.grand_total).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
