import React, { useState } from 'react';
import { useCartStore } from './store/useCartStore';
import { useAuthStore } from './store/useAuthStore';
import { useBarcodeScanner } from './hooks/useBarcodeScanner';
import { MOCK_PRODUCTS } from './data/mockProducts';

import { Header } from './components/ui/Header';
import { ProductGrid } from './components/catalog/ProductGrid';
import { CartPanel } from './components/cart/CartPanel';
import { LoginScreen } from './components/auth/LoginScreen';
import { ShiftOpenModal } from './components/shift/ShiftOpenModal';
import { ReportsDashboard } from './components/reports/ReportsDashboard';
import { CustomerMenu } from './components/customer/CustomerMenu';

function App() {
  const { addItem } = useCartStore();
  const { user, activeShift } = useAuthStore();
  const [scanIndicator, setScanIndicator] = useState(false);
  const [activeTab, setActiveTab] = useState<'pos' | 'reports'>('pos');

  // Enforce role-based access for tabs
  React.useEffect(() => {
    if (user?.role === 'CASHIER' && activeTab === 'reports') {
      setActiveTab('pos');
    }
  }, [user, activeTab]);

  // Simple routing for Customer E-Menu
  if (window.location.pathname === '/menu') {
    return <CustomerMenu />;
  }

  // Global Hardware Barcode Scanner Listener
  useBarcodeScanner((barcode) => {
    if (!user || !activeShift || activeTab !== 'pos') return; // Only scan if on POS tab

    // Flash indicator
    setScanIndicator(true);
    setTimeout(() => setScanIndicator(false), 500);

    // Find and add product
    const product = MOCK_PRODUCTS.find(p => p.barcode === barcode);
    if (product) {
      addItem(product);
    } else {
      alert(`Barcode ${barcode} not found in database!`);
    }
  });

  // 1. If not logged in, show Login Screen
  if (!user) {
    return <LoginScreen />;
  }

  // 2. If logged in but no active shift, show Shift Open Modal (layered over background)
  if (user && !activeShift) {
    return (
      <div className="flex h-screen bg-slate-900 overflow-hidden">
        <ShiftOpenModal />
      </div>
    );
  }

  // 3. Otherwise, show main Interface
  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
      
      {/* Top Navigation Header */}
      <Header 
        scanIndicator={scanIndicator} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {activeTab === 'pos' ? (
          <>
            {/* LEFT COLUMN: Catalog & Products */}
            <div className="flex-1 flex flex-col min-w-[60%] border-r border-slate-700/50">
              <ProductGrid scanIndicator={scanIndicator} />
            </div>

            {/* RIGHT COLUMN: Cart & Checkout */}
            <CartPanel />
          </>
        ) : (
          /* Reports & Analytics Dashboard */
          <ReportsDashboard />
        )}
      </div>

    </div>
  );
}

export default App;
