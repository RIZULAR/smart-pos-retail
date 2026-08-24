import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Printer, Wallet } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useCartStore } from '../../store/useCartStore';
import { useThermalPrinter } from '../../hooks/useThermalPrinter';
import { useAuthStore } from '../../store/useAuthStore';
import { useProductStore } from '../../store/useProductStore';
import { supabase } from '../../lib/supabaseClient';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const { items, subtotal, tax, serviceCharge, grandTotal, clearCart } = useCartStore();
  const { generateReceipt, printReceipt } = useThermalPrinter();
  
  const [tenderAmount, setTenderAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'QRIS' | 'DEBIT'>('CASH');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Keyboard shortcut Listener for Modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // Only trigger Enter if we have valid tender for cash, or if it's cashless
      const parsedTender = parseInt(tenderAmount.replace(/\D/g, '') || '0');
      if (e.key === 'Enter' && !isProcessing && !isSuccess) {
        if (paymentMethod !== 'CASH' || parsedTender >= grandTotal) {
           handleProcessPayment();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, tenderAmount, paymentMethod, isProcessing, isSuccess, grandTotal]);

  if (!isOpen) return null;

  const parsedTender = parseInt(tenderAmount.replace(/\D/g, '') || '0');
  const change = paymentMethod === 'CASH' ? parsedTender - grandTotal : 0;
  const isTenderValid = paymentMethod !== 'CASH' || parsedTender >= grandTotal;

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    
    // Simulate API Call / Sync
    await new Promise(r => setTimeout(r, 1000));
    
    // Print Receipt
    const actualTender = paymentMethod === 'CASH' ? parsedTender : grandTotal;
    const bytecode = generateReceipt(items, subtotal, tax, serviceCharge, grandTotal, actualTender, change, paymentMethod);
    await printReceipt(bytecode);
    
    // Save directly to Supabase Cloud Database
    const user = useAuthStore.getState().user;
    const activeShift = useAuthStore.getState().activeShift;
    const invoiceNum = `INV-${Date.now().toString().slice(-6)}`;
    const createdAt = new Date().toISOString();

    const cashierIdClean = user?.id && user.id.trim() !== '' ? user.id : null;
    const shiftIdClean = activeShift?.id && activeShift.id.trim() !== '' ? activeShift.id : null;

    try {
      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .insert({
          invoice_number: invoiceNum,
          shift_id: shiftIdClean,
          cashier_id: cashierIdClean,
          subtotal,
          tax,
          grand_total: grandTotal,
          payment_method: paymentMethod,
          tender_amount: actualTender,
          change_amount: change,
          created_at: createdAt
        })
        .select('id')
        .single();

      if (txError) {
        console.error("Direct Supabase save error:", txError);
      } else if (txData && items.length > 0) {
        const itemsToInsert = items.map(item => ({
          transaction_id: txData.id,
          variant_id: item.variant.id,
          quantity: item.quantity,
          price_at_time: item.variant.price,
          subtotal: item.subtotal
        }));
        await supabase.from('transaction_items').insert(itemsToInsert);
      }
    } catch (e) {
      console.error("Failed to save transaction to Supabase:", e);
    }

    // Deduct stock in store
    useProductStore.getState().deductStock(items);

    setIsProcessing(false);
    setIsSuccess(true);
  };

  const handleCloseSuccess = () => {
    clearCart();
    setIsSuccess(false);
    setTenderAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      
      {!isSuccess ? (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-3xl flex overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          
          {/* Left: Summary */}
          <div className="w-1/2 bg-slate-900 p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-100 mb-6">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-slate-400">
                  <span>Items Count</span>
                  <span>{items.reduce((acc, i) => acc + i.quantity, 0)} Items</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>PPN (11%)</span>
                  <span>Rp {tax.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Service Charge (5%)</span>
                  <span>Rp {serviceCharge.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-700/50 mt-6">
              <p className="text-slate-400 text-sm mb-1">Total to Pay</p>
              <h2 className="text-4xl font-bold text-emerald-400 tracking-tight">Rp {grandTotal.toLocaleString('id-ID')}</h2>
            </div>
          </div>

          {/* Right: Payment Method & Tender */}
          <div className="w-1/2 p-8 relative flex flex-col">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-700/50 rounded-full p-2">
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-slate-100 mb-6">Payment Method</h3>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {['CASH', 'QRIS', 'DEBIT'].map(m => (
                <button 
                  key={m} 
                  onClick={() => setPaymentMethod(m as any)}
                  className={`py-3 rounded-lg font-medium border transition-colors ${paymentMethod === m ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                >
                  {m}
                </button>
              ))}
            </div>

            {paymentMethod === 'CASH' && (
              <div className="mb-8 flex-1">
                <p className="text-slate-400 text-sm mb-2">Tender Amount</p>
                <input 
                  type="text" 
                  value={tenderAmount ? parseInt(tenderAmount, 10).toLocaleString('id-ID') : ''}
                  onChange={(e) => setTenderAmount(e.target.value.replace(/\D/g, ''))}
                  placeholder="0"
                  autoFocus
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl py-4 px-4 text-3xl font-bold text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 mb-4"
                />
                
                {/* Quick Cash Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button onClick={() => setTenderAmount(grandTotal.toString())} className="bg-slate-700 hover:bg-slate-600 py-2 rounded-lg text-slate-300 font-medium transition-colors">Exact Amount</button>
                  <button onClick={() => setTenderAmount('500000')} className="bg-slate-700 hover:bg-slate-600 py-2 rounded-lg text-slate-300 font-medium transition-colors">Rp 500.000</button>
                  <button onClick={() => setTenderAmount('1000000')} className="bg-slate-700 hover:bg-slate-600 py-2 rounded-lg text-slate-300 font-medium transition-colors">Rp 1.000.000</button>
                  <button onClick={() => setTenderAmount('2000000')} className="bg-slate-700 hover:bg-slate-600 py-2 rounded-lg text-slate-300 font-medium transition-colors">Rp 2.000.000</button>
                </div>

                {change >= 0 && parsedTender > 0 && (
                  <div className="bg-slate-900 p-4 rounded-xl border border-emerald-500/30">
                    <p className="text-slate-400 text-sm mb-1">Change to Return</p>
                    <p className="text-2xl font-bold text-emerald-400">Rp {change.toLocaleString('id-ID')}</p>
                  </div>
                )}
                {change < 0 && parsedTender > 0 && (
                  <p className="text-rose-400 text-sm font-medium">Insufficient amount. Needs Rp {Math.abs(change).toLocaleString('id-ID')} more.</p>
                )}
              </div>
            )}
            
            {paymentMethod === 'QRIS' && (
              <div className="mb-8 flex-1 flex flex-col items-center justify-center bg-slate-900 rounded-xl border border-indigo-500/50 p-6 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                <div className="bg-white p-4 rounded-xl mb-4">
                  <QRCodeSVG 
                    value={`00020101021126610016COM.GO-PAY.WWW011893600000000000000002143169720612450303UMI51440014ID.CO.QRIS.WWW0215ID10200000000000303UMI520458125303360540${grandTotal.toString().length}${grandTotal}5802ID5910MYTRA POS6007JAKARTA6105123456304C926`} 
                    size={200}
                    level="Q"
                    includeMargin={false}
                  />
                </div>
                <h4 className="text-xl font-bold text-white mb-1">Scan to Pay QRIS</h4>
                <p className="text-emerald-400 font-bold text-2xl">Rp {grandTotal.toLocaleString('id-ID')}</p>
              </div>
            )}

            {paymentMethod === 'DEBIT' && (
              <div className="mb-8 flex-1 flex flex-col items-center justify-center bg-slate-900 rounded-xl border border-slate-700">
                <Wallet className="text-indigo-400 mb-4" size={48} />
                <p className="text-slate-300 font-medium">Awaiting Debit/Credit terminal payment...</p>
                <p className="text-slate-500 text-sm text-center mt-2 px-6">Press Process when terminal transaction is complete.</p>
              </div>
            )}

            <button 
              disabled={!isTenderValid || isProcessing}
              onClick={handleProcessPayment}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all mt-auto"
            >
              {isProcessing ? 'Processing & Printing...' : 'Process Payment (Enter)'}
            </button>
          </div>
        </div>
      ) : (
        /* Success Screen & Receipt Preview */
        <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl flex overflow-hidden shadow-2xl animate-in zoom-in duration-300">
          
          <div className="w-1/2 p-10 flex flex-col items-center justify-center text-center bg-slate-900 border-r border-slate-700">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="text-emerald-400" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
            <p className="text-slate-400 mb-2">Total Paid: Rp {grandTotal.toLocaleString('id-ID')}</p>
            {change > 0 && <p className="text-emerald-400 font-bold text-xl mb-8">Change: Rp {change.toLocaleString('id-ID')}</p>}
            
            <button 
              onClick={() => {
                const printContent = document.getElementById('receipt-print-area');
                const printWindow = window.open('', '', 'width=300,height=600');
                if (printWindow) {
                  printWindow.document.write(`
                    <html>
                      <head>
                        <title>Print Receipt</title>
                        <style>
                          @page { margin: 0; }
                          body { font-family: 'Courier New', Courier, monospace; font-size: 11px; margin: 0; padding: 15px; color: black; background: white; }
                          .center { text-align: center; }
                          .bold { font-weight: bold; }
                          .flex { display: flex; justify-content: space-between; }
                          .dashed { border-bottom: 2px dashed #000; margin: 10px 0; }
                          .solid { border-bottom: 1px solid #000; margin: 8px 0; }
                          .text-xl { font-size: 18px; font-weight: 900; tracking: 2px; }
                          .text-xs { font-size: 10px; }
                          .text-sm { font-size: 12px; }
                          .mb-1 { margin-bottom: 4px; }
                          .mb-2 { margin-bottom: 8px; }
                          .mt-2 { margin-top: 8px; }
                          .mt-4 { margin-top: 16px; }
                          .uppercase { text-transform: uppercase; }
                        </style>
                      </head>
                      <body>
                        ${printContent?.innerHTML}
                      </body>
                    </html>
                  `);
                  printWindow.document.close();
                  printWindow.focus();
                  setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                  }, 250);
                }
              }}
              className="w-full mb-3 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-lg transition-all flex justify-center items-center gap-2"
            >
              <Printer size={20} /> Print Receipt
            </button>

            <button 
              onClick={handleCloseSuccess}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-bold text-lg transition-all flex justify-center items-center gap-2"
              autoFocus
            >
              New Transaction (Enter)
            </button>
          </div>

          <div className="w-1/2 bg-slate-100 p-6 flex flex-col items-center justify-start overflow-y-auto max-h-[500px]">
             <div id="receipt-print-area" className="w-full max-w-[300px] bg-white text-black p-6 font-mono text-xs shadow-md flex flex-col mx-auto border border-gray-200">
                
                {/* Header */}
                <div className="center mb-4">
                  <h2 className="bold text-xl mb-1 tracking-widest">MyTRA RESTO</h2>
                  <div className="text-xs text-gray-700">RESTO & CAFE V1.0</div>
                  <div className="text-xs text-gray-700">Jl. Culinary Hub No. 88, Jakarta</div>
                  <div className="text-xs text-gray-700">Telp: 021-88997766</div>
                </div>
                
                <div className="dashed"></div>
                
                {/* Meta Info */}
                <div className="flex justify-between text-xs mb-1">
                  <span>{new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</span>
                  <span>INV-{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between text-xs mb-3">
                  <span>Kasir: {useAuthStore.getState().user?.username.toUpperCase() || 'KASIR'}</span>
                  <span>POS-01</span>
                </div>

                <div className="dashed"></div>
                
                {/* Items */}
                <div className="flex flex-col gap-2 mb-3">
                  {items.map(item => (
                    <div key={item.variant.id} className="text-xs">
                      <div className="bold">{item.variant.name}</div>
                      <div className="flex justify-between text-gray-800">
                        <span>{item.quantity} x {item.variant.price.toLocaleString('id-ID')}</span>
                        <span>{item.subtotal.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="dashed"></div>
                
                {/* Totals */}
                <div className="flex flex-col gap-1 text-xs">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PPN (11%)</span>
                    <span>{tax.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Svc Chg (5%)</span>
                    <span>{serviceCharge.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between bold text-sm mt-2 pt-2 solid border-t border-black">
                    <span>TOTAL</span>
                    <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="dashed"></div>
                
                {/* Payment */}
                <div className="flex flex-col gap-1 text-xs">
                  <div className="flex justify-between uppercase">
                    <span>{paymentMethod}</span>
                    <span>{paymentMethod === 'CASH' ? parsedTender.toLocaleString('id-ID') : grandTotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between bold">
                    <span>KEMBALI</span>
                    <span>Rp {change.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="center mt-6 text-xs text-gray-700">
                  <p className="mb-1">Terima Kasih Atas Kunjungan Anda!</p>
                  <p className="mb-4">Barang yang dibeli tidak dapat ditukar.</p>
                  
                  <div className="flex justify-center mt-4 mb-1">
                    <QRCodeSVG value={`INV-${Date.now().toString().slice(-6)}`} size={50} level="L" />
                  </div>
                  <p className="text-[9px] tracking-widest mt-1">INV-{Date.now().toString().slice(-6)}</p>
                </div>

             </div>
          </div>
        </div>
      )}
    </div>
  );
};
