import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useShopifyCustomer } from '../hooks/useShopifyCustomer';
import { fetchCustomerOrders, type ShopifyOrder } from '../lib/shopifyCustomer';

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('it-IT', { year: 'numeric', month: 'short', day: '2-digit' });
  } catch {
    return iso;
  }
}

export default function Orders() {
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
    return name ? `I miei ordini (${name})` : 'I miei ordini';
  }, [customer?.email, customer?.firstName]);

  const openGuestStatusUrl = () => {
    const raw = guestStatusUrl.trim();
    if (!raw) {
      setGuestUrlError('Inserisci il link dello stato ordine.');
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
      setGuestUrlError('Link non valido. Incolla un URL completo (https://...).');
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
        setError(e?.message || 'Impossibile caricare gli ordini.');
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
          <h1 className="text-2xl font-bold mb-3">Ordini non disponibili</h1>
          <p className="text-gray-400">Shopify non è configurato correttamente.</p>
        </div>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 min-h-screen">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-dark-surface p-8 rounded-2xl border border-white/10 text-center">
            <h1 className="text-2xl font-bold mb-3">Accedi per vedere i tuoi ordini</h1>
            <p className="text-gray-400 mb-6">La cronologia ordini completa è collegata all’account cliente Shopify.</p>
            <Link to="/account">
              <Button size="lg">Vai al login</Button>
            </Link>
          </div>

          <div className="bg-dark-surface p-8 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold text-center mb-2">Traccia un ordine senza account</h2>
            <div className="text-gray-400 text-sm text-center mb-4">
              Se hai acquistato come ospite, nella mail di conferma Shopify c’è un link “Stato ordine”. Incollalo qui per aprire tracking e dettagli.
            </div>

            {guestUrlError && <div className="text-red-400 text-sm text-center mb-3">{guestUrlError}</div>}

            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="url"
                className="w-full px-4 py-2 rounded bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-neon-orange"
                placeholder="https://… (link stato ordine)"
                value={guestStatusUrl}
                onChange={(e) => setGuestStatusUrl(e.target.value)}
              />
              <Button size="lg" onClick={openGuestStatusUrl}>Apri</Button>
            </div>

            {lastCheckoutWebUrl && (
              <div className="mt-6 border-t border-white/10 pt-4 text-center">
                <div className="text-gray-300 text-sm font-bold mb-1">Ultimo checkout su questo dispositivo</div>
                {lastCheckoutAt && <div className="text-gray-500 text-xs mb-3">{formatDate(lastCheckoutAt)}</div>}
                <div className="flex flex-col md:flex-row justify-center gap-3">
                  <Button variant="secondary" size="lg" onClick={openLastCheckout}>Apri ultimo checkout</Button>
                  <Button variant="outline" size="lg" onClick={clearLastCheckout}>Rimuovi</Button>
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
            Caricamento ordini...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-dark-surface p-8 rounded-2xl border border-white/10 text-center">
            <div className="text-gray-300 font-bold mb-2">Nessun ordine trovato</div>
            <div className="text-gray-400 text-sm">Gli ordini appariranno qui dopo un acquisto completato.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="bg-dark-surface p-6 rounded-2xl border border-white/10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <div className="text-white font-bold text-lg">{o.name}</div>
                    <div className="text-gray-400 text-sm">{formatDate(o.processedAt)}</div>
                  </div>
                  <div className="text-right">
                    {o.currentTotalPrice && (
                      <div className="text-white font-bold">
                        {o.currentTotalPrice.amount} {o.currentTotalPrice.currencyCode}
                      </div>
                    )}
                    <div className="text-gray-400 text-sm">
                      {o.financialStatus ? `Pagamento: ${o.financialStatus}` : null}
                      {o.fulfillmentStatus ? ` • Spedizione: ${o.fulfillmentStatus}` : null}
                    </div>
                  </div>
                </div>

                {o.lineItems.length > 0 && (
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <div className="text-gray-300 text-sm font-bold mb-2">Articoli</div>
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
                      Apri stato ordine / tracking
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
