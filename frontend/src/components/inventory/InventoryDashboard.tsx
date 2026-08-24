import React, { useState } from 'react';
import { useProductStore } from '../../store/useProductStore';
import { Package, Plus, Edit2, Trash2, Search, AlertCircle } from 'lucide-react';
import { ProductVariant } from '../../types/pos';

export const InventoryDashboard: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductVariant | null>(null);

  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isAlertClosing, setIsAlertClosing] = useState(false);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setIsAlertClosing(false);
    
    // Mulai animasi menghilang ke kanan setelah 1.5 detik
    setTimeout(() => {
      setIsAlertClosing(true);
      
      // Hapus elemen dari DOM setelah animasi selesai (300ms)
      setTimeout(() => {
        setAlert(null);
        setIsAlertClosing(false);
      }, 300);
    }, 1500);
  };

  const [quickRestockTarget, setQuickRestockTarget] = useState<ProductVariant | null>(null);
  const [quickRestockAmount, setQuickRestockAmount] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    price: '',
    stock: '',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (product?: ProductVariant) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        sku: product.sku,
        barcode: product.barcode,
        price: product.price.toString(),
        stock: product.stock.toString(),
        imageUrl: product.imageUrl,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        sku: `SKU-${Math.floor(Math.random() * 1000)}`,
        barcode: `899${Math.floor(Math.random() * 1000000)}`,
        price: '',
        stock: '',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        sku: formData.sku,
        barcode: formData.barcode,
        price: Number(formData.price),
        stock: Number(formData.stock),
        imageUrl: formData.imageUrl,
      });
      showAlert('success', 'Produk berhasil diperbarui!');
    } else {
      addProduct({
        name: formData.name,
        sku: formData.sku,
        barcode: formData.barcode,
        price: Number(formData.price),
        stock: Number(formData.stock),
        imageUrl: formData.imageUrl,
      });
      showAlert('success', 'Produk baru berhasil ditambahkan!');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      deleteProduct(id);
      showAlert('success', 'Produk berhasil dihapus.');
    }
  };

  const openQuickRestock = (product: ProductVariant) => {
    setQuickRestockTarget(product);
    setQuickRestockAmount('');
  };

  const handleQuickRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickRestockTarget) return;
    
    const amount = parseInt(quickRestockAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      showAlert('error', 'Jumlah tidak valid!');
      return;
    }
    
    updateProduct(quickRestockTarget.id, { stock: quickRestockTarget.stock + amount });
    setQuickRestockTarget(null);
    showAlert('success', 'Stok berhasil ditambahkan!');
  };

  return (
    <div className="flex-1 bg-slate-950 p-8 overflow-y-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="text-indigo-400" size={28} />
            Manajemen Inventaris
          </h1>
          <p className="text-slate-400 text-sm mt-1">Kelola stok barang, harga, dan daftar menu toko Anda.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all"
          >
            <Plus size={16} /> Tambah Produk
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6 rounded-tl-xl">Produk</th>
                <th className="py-4 px-6">SKU / Barcode</th>
                <th className="py-4 px-6">Harga</th>
                <th className="py-4 px-6">Stok Tersedia</th>
                <th className="py-4 px-6 text-right rounded-tr-xl">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-slate-700" />
                      <div>
                        <p className="font-bold text-white">{p.name}</p>
                        {p.isLowStock && <p className="text-[10px] text-rose-400 font-medium flex items-center gap-1 mt-0.5"><AlertCircle size={10}/> Low Stock</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <p className="text-slate-300 font-mono text-xs">{p.sku}</p>
                    <p className="text-slate-500 font-mono text-[10px]">{p.barcode}</p>
                  </td>
                  <td className="py-3 px-6 font-semibold text-emerald-400">
                    Rp {p.price.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.stock <= 0 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : p.stock <= 5 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
                      {p.stock} item
                    </span>
                  </td>
                  <td className="py-3 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {p.stock <= 5 && (
                        <button onClick={() => openQuickRestock(p)} className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors text-xs font-bold flex items-center gap-1 shadow-md shadow-rose-500/20" title="Isi Ulang Stok">
                          Restock Cepat
                        </button>
                      )}
                      <button onClick={() => handleOpenModal(p)} className="p-2 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg transition-colors" title="Edit Master Data">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-lg transition-colors" title="Hapus Produk">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">Tidak ada produk yang ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
              <h2 className="text-lg font-bold text-white">{editingProduct ? 'Edit / Restock Produk' : 'Tambah Produk Baru'}</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Nama Produk</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">SKU</label>
                  <input required type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Barcode (Optional)</label>
                  <input type="text" value={formData.barcode} onChange={e => setFormData({...formData, barcode: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Harga Jual (Rp)</label>
                  <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-emerald-400 font-bold focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Jumlah Stok</label>
                  <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">URL Gambar</label>
                <input required type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-xs focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-lg font-medium transition-colors">Batal</button>
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-bold transition-colors">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Restock Modal */}
      {quickRestockTarget && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden p-6 text-center">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <img 
                src={quickRestockTarget.imageUrl} 
                alt={quickRestockTarget.name} 
                className="w-full h-full object-cover rounded-2xl border-2 border-slate-700 shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-lg border-2 border-slate-900">
                <Package size={14} />
              </div>
            </div>
            <h2 className="text-lg font-bold text-white mb-1">Isi Ulang Stok</h2>
            <p className="text-sm text-slate-400 mb-6">
              Stok saat ini untuk <span className="font-bold text-white">{quickRestockTarget.name}</span> adalah <strong className="text-rose-400">{quickRestockTarget.stock}</strong>
            </p>
            <form onSubmit={handleQuickRestockSubmit}>
              <div className="mb-6">
                <label className="block text-xs font-medium text-slate-400 mb-2 text-left">Jumlah Barang yang Masuk:</label>
                <input 
                  type="number" 
                  min="1" 
                  autoFocus
                  required
                  value={quickRestockAmount}
                  onChange={(e) => setQuickRestockAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold text-center text-lg focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  placeholder="Contoh: 50"
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setQuickRestockTarget(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-medium transition-colors">Batal</button>
                <button type="submit" className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-bold transition-colors">Tambah Stok</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {alert && (
        <div className={`fixed top-6 right-6 z-[100] ${isAlertClosing ? 'animate-toast-out' : 'animate-toast-in'}`}>
          {alert.type === 'success' ? (
            <div className="bg-emerald-50 text-sm p-4 rounded-xl border-2 border-emerald-200 shadow-2xl min-w-[300px]" role="alert">
              <div className="flex items-center gap-3 text-emerald-900 font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 330 330" aria-hidden="true">
                  <path d="M165 0C74.019 0 0 74.019 0 165s74.019 165 165 165 165-74.019 165-165S255.981 0 165 0m0 300c-74.44 0-135-60.561-135-135S90.56 30 165 30s135 60.561 135 135-60.561 135-135 135" />
                  <path d="m226.872 106.664-84.854 84.853-38.89-38.891c-5.857-5.857-15.355-5.858-21.213-.001-5.858 5.858-5.858 15.355 0 21.213l49.496 49.498a15 15 0 0 0 10.606 4.394h.001c3.978 0 7.793-1.581 10.606-4.393l95.461-95.459c5.858-5.858 5.858-15.355 0-21.213s-15.355-5.859-21.213-.001" />
                </svg>
                <p>{alert.message}</p>
              </div>
            </div>
          ) : (
            <div className="bg-rose-50 text-sm p-4 rounded-xl border-2 border-rose-200 shadow-2xl min-w-[300px]" role="alert">
              <div className="flex items-center gap-3 text-rose-900 font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 512 512" aria-hidden="true">
                  <path d="M256 0C114.508 0 0 114.497 0 256c0 141.493 114.497 256 256 256 141.492 0 256-114.497 256-256C512 114.507 397.503 0 256 0m0 472c-119.384 0-216-96.607-216-216 0-119.385 96.607-216 216-216 119.384 0 216 96.607 216 216 0 119.385-96.607 216-216 216" />
                  <path d="M343.586 315.302 284.284 256l59.302-59.302c7.81-7.81 7.811-20.473.001-28.284-7.812-7.811-20.475-7.81-28.284 0L256 227.716l-59.303-59.302c-7.809-7.811-20.474-7.811-28.284 0s-7.81 20.474.001 28.284L227.716 256l-59.302 59.302c-7.811 7.811-7.812 20.474-.001 28.284 7.813 7.812 20.476 7.809 28.284 0L256 284.284l59.303 59.302c7.808 7.81 20.473 7.811 28.284 0s7.81-20.474-.001-28.284" />
                </svg>
                <p>{alert.message}</p>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
