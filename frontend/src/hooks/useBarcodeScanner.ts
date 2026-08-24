import { useEffect, useRef } from 'react';

export function useBarcodeScanner(onScan: (barcode: string) => void) {
  const bufferRef = useRef<string>('');
  const lastKeyTimeRef = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an actual input field (except body)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTimeRef.current;
      lastKeyTimeRef.current = currentTime;

      // Enter key marks end of barcode scan
      if (e.key === 'Enter') {
        if (bufferRef.current.length >= 3 && timeDiff < 50) {
          onScan(bufferRef.current);
          e.preventDefault();
        }
        bufferRef.current = '';
        return;
      }

      // If it's a single character
      if (e.key.length === 1) {
        // If time diff is > 50ms, it's human typing. Reset buffer.
        if (timeDiff > 50) {
          bufferRef.current = e.key; 
        } else {
          bufferRef.current += e.key;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onScan]);
}
