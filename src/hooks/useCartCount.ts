import { useCallback, useEffect, useState } from 'react';
import { isShopifyConfigured, shopify } from '../lib/shopify';

function countFromCheckout(checkout: any): number {
  const items = checkout?.lineItems;
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce((sum: number, li: any) => sum + (Number(li?.quantity) || 0), 0);
}

export function useCartCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!isShopifyConfigured) {
      setCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    const checkoutId = (() => {
      try {
        return localStorage.getItem('checkoutId');
      } catch {
        return null;
      }
    })();

    if (!checkoutId) {
      setCount(0);
      setLoading(false);
      return;
    }

    try {
      const checkout = await shopify.checkout.fetch(checkoutId);
      if (!checkout || checkout.completedAt || !checkout.webUrl) {
        try {
          localStorage.removeItem('checkoutId');
        } catch {}
        setCount(0);
        setLoading(false);
        return;
      }
      setCount(countFromCheckout(checkout));
    } catch {
      try {
        localStorage.removeItem('checkoutId');
      } catch {}
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();

    const onUpdated = (event: Event) => {
      const e = event as CustomEvent;
      const checkout = e.detail?.checkout;
      if (checkout) {
        setCount(countFromCheckout(checkout));
        setLoading(false);
        return;
      }
      refresh();
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === 'checkoutId') {
        refresh();
      }
    };

    window.addEventListener('dream3d:cart-updated', onUpdated as EventListener);
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', refresh);

    return () => {
      window.removeEventListener('dream3d:cart-updated', onUpdated as EventListener);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', refresh);
    };
  }, [refresh]);

  return { count, loading, refresh };
}

