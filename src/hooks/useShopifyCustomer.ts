import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createCustomer,
  createCustomerAccessToken,
  deleteCustomerAccessToken,
  fetchCustomer,
  isShopifyConfigured,
  recoverCustomer,
  type ShopifyCustomer,
} from '../lib/shopifyCustomer';

const STORAGE_KEY = 'shopifyCustomerAccessToken';

function readStoredToken(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function clearStoredToken() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {}
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

function writeStoredToken(token: string, remember: boolean) {
  try {
    if (remember) {
      localStorage.setItem(STORAGE_KEY, token);
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      sessionStorage.setItem(STORAGE_KEY, token);
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
}

export function useShopifyCustomer() {
  const [accessToken, setAccessToken] = useState<string | null>(() => readStoredToken());
  const [customer, setCustomer] = useState<ShopifyCustomer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const isLoggedIn = Boolean(accessToken);

  const refreshCustomer = useCallback(async () => {
    if (!accessToken) {
      setCustomer(null);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const c = await fetchCustomer(accessToken);
      setCustomer(c);
    } catch (e: any) {
      clearStoredToken();
      setAccessToken(null);
      setCustomer(null);
      setError(e?.message || 'Sessione Shopify non valida.');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!isShopifyConfigured) return;
    refreshCustomer();
  }, [refreshCustomer]);

  const login = useCallback(async (email: string, password: string, remember = true) => {
    setLoading(true);
    setError('');
    try {
      const token = await createCustomerAccessToken(email, password);
      writeStoredToken(token, remember);
      setAccessToken(token);
      const c = await fetchCustomer(token);
      setCustomer(c);
    } catch (e: any) {
      setError(e?.message || 'Login Shopify fallito.');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (accessToken) {
        await deleteCustomerAccessToken(accessToken);
      }
    } catch (e: any) {
      setError(e?.message || 'Logout Shopify fallito.');
    } finally {
      clearStoredToken();
      setAccessToken(null);
      setCustomer(null);
      setLoading(false);
    }
  }, [accessToken]);

  const recover = useCallback(async (email: string) => {
    setLoading(true);
    setError('');
    try {
      await recoverCustomer(email);
    } catch (e: any) {
      setError(e?.message || 'Errore recupero password Shopify.');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(
    async (
      input: { email: string; password: string; firstName?: string; lastName?: string },
      remember = true
    ) => {
      setLoading(true);
      setError('');
      try {
        await createCustomer(input);
        const token = await createCustomerAccessToken(input.email, input.password);
        writeStoredToken(token, remember);
        setAccessToken(token);
        const c = await fetchCustomer(token);
        setCustomer(c);
      } catch (e: any) {
        setError(e?.message || 'Creazione account Shopify fallita.');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return useMemo(
    () => ({
      isShopifyConfigured,
      isLoggedIn,
      accessToken,
      customer,
      loading,
      error,
      login,
      logout,
      recover,
      signUp,
      refreshCustomer,
    }),
    [accessToken, customer, error, isLoggedIn, loading, login, logout, recover, signUp, refreshCustomer]
  );
}
