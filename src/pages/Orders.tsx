import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { useShopifyCustomer } from '../hooks/useShopifyCustomer';
import { fetchCustomerOrders, type ShopifyOrder } from '../lib/shopifyCustomer';

function formatDate(iso: string, locale: string) {
  try {
    return new Date(iso).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: '2-digit' });
  } catch {
    return iso;
  }
}

export default function Orders() {
  const { t, i18n } = useTranslation();
  const { isShopifyConfigured, accessToken, customer, loading: authLoading, error: authError, refreshCustomer } = useShopifyCustomer();
  const [orders, setOrders] = useState<ShopifyOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [guestStatusUrl, setGuestStatusUrl] = useState('');
  const [guestUrlError, setGuestUrlError] = useState('');
  const [lastCheckoutWebUrl, setLastCheckoutWebUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem('lastCheckoutWebUrl');
    } catch {
      return null;
    }
  });
  const [lastCheckoutAt, setLastCheckoutAt] = useState<string | null>(() => {
    try {
      return localStorage.getItem('lastCheckoutAt');
    } catch {
      return null;
    }
  });

  const title = useMemo(() => {
    const name = customer?.firstName || customer?.email;
    return name ? `${t('orders.my_orders')} (${name})` : t('orders.my_orders');
  }, [customer?.email, customer?.firstName, t]);

  const openGuestStatusUrl = () => {
    const raw = guestStatusUrl.trim();
    if (!raw) {
      setGuestUrlError(t('orders.guest_insert_link'));
      return;
    }
    try {
      const u = new URL(raw);
      if (u.protocol !== 'https:' && u.protocol !== 'http:') {
        throw new Error('Invalid protocol');
      }
      setGuestUrlError('');
      window.open(u.toString(), '_blank', 'noreferrer');
    } catch {
      setGuestUrlError(t('orders.guest_invalid_link'));
    }
  };

  const openLastCheckout = () => {
    const raw = (lastCheckoutWebUrl || '').trim();
    if (!raw) return;
    try {
      const u = new URL(raw);
      if (u.protocol !== 'https:' && u.protocol !== 'http:') {
        return;
      }
      window.open(u.toString(), '_blank', 'noreferrer');
    } catch {}
  };

  const clearLastCheckout = () => {
    try {
      localStorage.removeItem('lastCheckoutWebUrl');
      localStorage.removeItem('lastCheckoutAt');
    } catch {}
    setLastCheckoutWebUrl(null);
    setLastCheckoutAt(null);
  };

  useEffect(() => {
    refreshCustomer();
  }, [refreshCustomer]);

  useEffect(() => {
    if (!accessToken) return;
    let aborted = false;
    setLoading(true);
    setError('');
    fetchCustomerOrders(accessToken, 20)
      .then((o) => {
        if (aborted) return;
        setOrders(o);
      })
      .catch((e: any) => {
        if (aborted) return;
        setError(e?.message || t('orders.load_error'));
      })
      .finally(() => {
        if (aborted) return;
        setLoading(false);
      });

    return () => {
      aborted = true;
    };
  }, [accessToken]);

  if (!isShopifyConfigured) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 min-h-screen">
        <div className="max-w-3xl mx-auto bg-dark-surface p-8 rounded-2xl border border-white/10 text-center">
          <h1 className="text-2xl font-bold mb-3">{t('orders.unavailable_title')}</h1>
          <p className="text-gray-400">{t('orders.unavailable_desc')}</p>
        </div>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 min-h-screen">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-dark-surface p-8 rounded-2xl border border-white/10 text-center">
            <h1 className="text-2xl font-bold mb-3">{t('orders.login_title')}</h1>
            <p className="text-gray-400 mb-6">{t('orders.login_desc')}</p>
            <Link to="/account">
              <Button size="lg">{t('orders.go_to_login')}</Button>
            </Link>
          </div>

          <div className="bg-dark-surface p-8 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold text-center mb-2">{t('orders.guest_title')}</h2>
            <div className="text-gray-400 text-sm text-center mb-4">
              {t('orders.guest_desc')}
            </div>

            {guestUrlError && <div className="text-red-400 text-sm text-center mb-3">{guestUrlError}</div>}

            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="url"
                className="w-full px-4 py-2 rounded bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-neon-orange"
                placeholder={t('orders.guest_placeholder')}
                value={guestStatusUrl}
                onChange={(e) => setGuestStatusUrl(e.target.value)}
              />
              <Button size="lg" onClick={openGuestStatusUrl}>{t('orders.open')}</Button>
            </div>

            {lastCheckoutWebUrl && (
              <div className="mt-6 border-t border-white/10 pt-4 text-center">
                <div className="text-gray-300 text-sm font-bold mb-1">{t('orders.last_checkout')}</div>
                {lastCheckoutAt && <div className="text-gray-500 text-xs mb-3">{formatDate(lastCheckoutAt, i18n.language)}</div>}
                <div className="flex flex-col md:flex-row justify-center gap-3">
                  <Button variant="secondary" size="lg" onClick={openLastCheckout}>{t('orders.open_last_checkout')}</Button>
                  <Button variant="outline" size="lg" onClick={clearLastCheckout}>{t('orders.remove')}</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 container mx-auto px-4 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{title}</h1>

        {authError && <div className="text-red-400 text-sm mb-4">{authError}</div>}
        {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

        {(authLoading || loading) ? (
          <div className="bg-dark-surface p-8 rounded-2xl border border-white/10 text-center text-gray-300">
            {t('orders.loading')}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-dark-surface p-8 rounded-2xl border border-white/10 text-center">
            <div className="text-gray-300 font-bold mb-2">{t('orders.none_title')}</div>
            <div className="text-gray-400 text-sm">{t('orders.none_desc')}</div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="bg-dark-surface p-6 rounded-2xl border border-white/10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <div className="text-white font-bold text-lg">{o.name}</div>
                    <div className="text-gray-400 text-sm">{formatDate(o.processedAt, i18n.language)}</div>
                  </div>
                  <div className="text-right">
                    {o.currentTotalPrice && (
                      <div className="text-white font-bold">
                        {o.currentTotalPrice.amount} {o.currentTotalPrice.currencyCode}
                      </div>
                    )}
                    <div className="text-gray-400 text-sm">
                      {o.financialStatus ? `${t('orders.payment_label')}: ${o.financialStatus}` : null}
                      {o.fulfillmentStatus ? ` • ${t('orders.shipping_label')}: ${o.fulfillmentStatus}` : null}
                    </div>
                  </div>
                </div>

                {o.lineItems.length > 0 && (
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <div className="text-gray-300 text-sm font-bold mb-2">{t('orders.items')}</div>
                    <div className="text-gray-400 text-sm space-y-1">
                      {o.lineItems.slice(0, 5).map((li, idx) => (
                        <div key={`${o.id}-${idx}`}>{li.quantity}× {li.title}</div>
                      ))}
                      {o.lineItems.length > 5 && <div>…</div>}
                    </div>
                  </div>
                )}

                {o.statusUrl && (
                  <div className="mt-4">
                    <a
                      href={o.statusUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-neon-orange hover:underline text-sm font-bold"
                    >
                      {t('orders.open_status')}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
