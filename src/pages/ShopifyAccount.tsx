import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShopifyCustomer } from '../hooks/useShopifyCustomer';
import { Button } from '../components/ui/Button';

export default function ShopifyAccount() {
  const navigate = useNavigate();
  const { isShopifyConfigured, isLoggedIn, customer, loading, error, login, logout, recover, signUp } = useShopifyCustomer();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [success, setSuccess] = useState('');
  const [showRecover, setShowRecover] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const title = useMemo(() => {
    if (isLoggedIn) return 'Account Ordini';
    if (showRecover) return 'Recupera password';
    if (showSignUp) return 'Crea account';
    return 'Accedi';
  }, [isLoggedIn, showRecover, showSignUp]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    try {
      await login(email, password, rememberMe);
      navigate('/ordini', { replace: true });
    } catch {
      // error handled by hook
    }
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    try {
      await recover(email);
      setSuccess('Email di recupero inviata. Controlla la tua casella di posta.');
    } catch {
      // error handled by hook
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    try {
      await signUp(
        {
          email,
          password,
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
        },
        rememberMe
      );
      navigate('/ordini', { replace: true });
    } catch {
      // error handled by hook
    }
  };

  if (!isShopifyConfigured) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 min-h-screen">
        <div className="max-w-lg mx-auto bg-dark-surface p-8 rounded-2xl border border-white/10 text-center">
          <h1 className="text-2xl font-bold mb-3">Account ordini non disponibile</h1>
          <p className="text-gray-400">
            Shopify non è configurato correttamente (manca Storefront token o dominio).
          </p>
        </div>
      </div>
    );
  }

  if (isLoggedIn && customer) {
    const displayName = customer.firstName || customer.email || 'Cliente';
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 min-h-screen">
        <div className="max-w-lg mx-auto bg-dark-surface p-8 rounded-2xl border border-white/10 text-center">
          <h1 className="text-3xl font-bold mb-3">Ciao, {displayName}</h1>
          <p className="text-gray-400 mb-6">Da qui puoi vedere la cronologia dei tuoi ordini Shopify.</p>
          <div className="flex flex-col gap-3">
            <Link to="/ordini">
              <Button className="w-full" size="lg">Vedi i miei ordini</Button>
            </Link>
            <Button className="w-full" variant="secondary" size="lg" onClick={logout} disabled={loading}>
              Esci
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 container mx-auto px-4 min-h-screen">
      <div className="max-w-lg mx-auto bg-dark-surface p-8 rounded-2xl border border-white/10">
        <h1 className="text-3xl font-bold text-center mb-6 text-neon-orange">{title}</h1>

        {error && <div className="text-red-400 text-sm text-center mb-4">{error}</div>}
        {success && <div className="text-green-400 text-sm text-center mb-4">{success}</div>}

        {!showRecover && !showSignUp ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-200 mb-1" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 rounded bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-neon-orange"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-gray-200 mb-1" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 rounded bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-neon-orange"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={loading}
              />
            </div>
            <label className="flex items-center justify-center gap-2 text-sm text-gray-300 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              Ricorda accesso
            </label>
            <Button className="w-full" type="submit" size="lg" disabled={loading}>
              {loading ? 'Accesso...' : 'Accedi'}
            </Button>
            <div className="text-xs text-gray-400 text-center">
              Se è il tuo primo accesso, usa “Password dimenticata?” con la stessa email usata nel checkout Shopify.
            </div>
            <Link to="/ordini" className="block w-full text-center text-neon-orange hover:underline text-sm">
              Traccia un ordine senza account
            </Link>
            <button
              type="button"
              className="w-full text-neon-orange hover:underline text-sm"
              onClick={() => { setShowSignUp(true); setShowRecover(false); setSuccess(''); }}
              disabled={loading}
            >
              Crea un account
            </button>
            <button
              type="button"
              className="w-full text-neon-orange hover:underline text-sm"
              onClick={() => { setShowRecover(true); setSuccess(''); }}
              disabled={loading}
            >
              Password dimenticata?
            </button>
          </form>
        ) : showSignUp ? (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-200 mb-1" htmlFor="firstName">Nome</label>
                <input
                  id="firstName"
                  type="text"
                  className="w-full px-4 py-2 rounded bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-neon-orange"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-gray-200 mb-1" htmlFor="lastName">Cognome</label>
                <input
                  id="lastName"
                  type="text"
                  className="w-full px-4 py-2 rounded bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-neon-orange"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-200 mb-1" htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                type="email"
                className="w-full px-4 py-2 rounded bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-neon-orange"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-gray-200 mb-1" htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                className="w-full px-4 py-2 rounded bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-neon-orange"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                disabled={loading}
              />
            </div>
            <label className="flex items-center justify-center gap-2 text-sm text-gray-300 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              Ricorda accesso
            </label>
            <Button className="w-full" type="submit" size="lg" disabled={loading}>
              {loading ? 'Creazione...' : 'Crea account'}
            </Button>
            <button
              type="button"
              className="w-full text-neon-orange hover:underline text-sm"
              onClick={() => { setShowSignUp(false); setShowRecover(false); setSuccess(''); }}
              disabled={loading}
            >
              Hai già un account? Accedi
            </button>
          </form>
        ) : (
          <form onSubmit={handleRecover} className="space-y-4">
            <div>
              <label className="block text-gray-200 mb-1" htmlFor="recover-email">Email</label>
              <input
                id="recover-email"
                type="email"
                className="w-full px-4 py-2 rounded bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-neon-orange"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>
            <Button className="w-full" type="submit" size="lg" disabled={loading}>
              {loading ? 'Invio...' : 'Invia email di recupero'}
            </Button>
            <button
              type="button"
              className="w-full text-neon-orange hover:underline text-sm"
              onClick={() => { setShowRecover(false); setShowSignUp(false); setSuccess(''); }}
              disabled={loading}
            >
              Torna al login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
