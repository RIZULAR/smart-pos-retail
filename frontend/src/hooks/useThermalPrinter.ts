import { CartItem } from '../types/pos';

export function useThermalPrinter() {
  const generateReceipt = (
    items: CartItem[],
    subtotal: number,
    tax: number,
    serviceCharge: number,
    grandTotal: number,
    tenderAmount: number,
    change: number,
    paymentMethod: string
  ) => {
    const encoder = new TextEncoder();
    let text = '';

    // ESC/POS Command Constants
    const ESC_INIT = '\x1B\x40';
    const ESC_ALIGN_CENTER = '\x1B\x61\x01';
    const ESC_ALIGN_LEFT = '\x1B\x61\x00';
    const ESC_BOLD_ON = '\x1B\x45\x01';
    const ESC_BOLD_OFF = '\x1B\x45\x00';
    const GS_CUT = '\x1D\x56\x00';

    // Build thermal string
    text += ESC_INIT + ESC_ALIGN_CENTER + ESC_BOLD_ON + "MyTRA RESTO & CAFE\n" + ESC_BOLD_OFF;
    text += "Jl. Culinary Hub No. 88, Jakarta\n";
    text += "================================\n" + ESC_ALIGN_LEFT;

    items.forEach((item) => {
      text += `${item.variant.name}\n`;
      text += `  ${item.quantity} x Rp ${item.variant.price.toLocaleString('id-ID')} = Rp ${item.subtotal.toLocaleString('id-ID')}\n`;
    });

    text += "--------------------------------\n";
    text += `Subtotal    : Rp ${subtotal.toLocaleString('id-ID')}\n`;
    text += `PPN (11%)   : Rp ${tax.toLocaleString('id-ID')}\n`;
    text += `Svc Chg(5%) : Rp ${serviceCharge.toLocaleString('id-ID')}\n`;
    text += ESC_BOLD_ON + `GRAND TOTAL : Rp ${grandTotal.toLocaleString('id-ID')}\n` + ESC_BOLD_OFF;
    text += "--------------------------------\n";
    text += `TENDER (${paymentMethod.toUpperCase()}): Rp ${tenderAmount.toLocaleString('id-ID')}\n`;
    text += `CHANGE      : Rp ${change.toLocaleString('id-ID')}\n`;
    text += ESC_ALIGN_CENTER + "\nTerima Kasih Atas Kunjungan Anda!\n";
    text += "Powered by MyTRA POS\n\n\n" + GS_CUT;

    return encoder.encode(text);
  };

  const printReceipt = async (byteCode: Uint8Array) => {
    console.log(`[ESC/POS] Generated Receipt Bytecode: ${byteCode.byteLength} bytes.`);
    console.log('[ESC/POS] Sending to Thermal Printer via WebUSB/Bluetooth...');
    return new Promise((resolve) => setTimeout(resolve, 800));
  };

  return { generateReceipt, printReceipt };
}
