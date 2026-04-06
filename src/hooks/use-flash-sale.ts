import { useState, useEffect } from "react";

export function useFlashSaleForProduct(productId: string | undefined, flashSaleId: string | null) {
  // Mock implementation, update when real API is available
  return { sale: null as any };
}

export function useCountdown(endDate: string | Date | null) {
  const [expired, setExpired] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!endDate) {
      setExpired(true);
      return;
    }
    const end = new Date(endDate).getTime();
    
    const update = () => {
      const now = new Date().getTime();
      const diff = end - now;
      if (diff <= 0) {
        setExpired(true);
        setLabel("Expired");
      } else {
        setExpired(false);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setLabel(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    };
    
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  return { expired, label };
}

export function isFlashSaleActive(flashSale: any) {
  if (!flashSale) return false;
  const now = new Date();
  const start = flashSale.startDate ? new Date(flashSale.startDate) : new Date(0);
  const end = flashSale.endDate ? new Date(flashSale.endDate) : new Date(8640000000000000);
  return now >= start && now <= end;
}

export function getFlashSaleProgress(flashSale: any) {
  if (!flashSale) return { claimed: 0, total: 0, left: 0, percentClaimed: 0 };
  const claimed = Number(flashSale.soldQuantity) || 0;
  const total = Number(flashSale.totalQuantity) || 100;
  const left = Math.max(0, total - claimed);
  const percentClaimed = total > 0 ? (claimed / total) * 100 : 0;
  
  return { claimed, total, left, percentClaimed };
}
