import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function UpdatePassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (!data.session) {
        setError('Sessione non valida. Richiedi di nuovo il recupero password.');
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('La password deve essere di almeno 6 caratteri.');
      return;
    }
    if (password !== confirm) {
      setError('Le password non coincidono.');
      return;
    }

    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error('Sessione non valida.');

      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setSuccess('Password aggiornata. Ora puoi accedere.');
      setTimeout(() => navigate('/login', { replace: true }), 800);
    } catch (e: any) {
      setError(e?.message || 'Errore durante aggiornamento password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 container mx-auto px-4 min-h-screen flex justify-center items-center">
      <div className="bg-dark-surface rounded-xl shadow-lg p-8 w-full max-w-md border border-white/10">
        <h1 className="text-2xl font-bold text-neon-orange mb-6 text-center">Imposta nuova password</h1>

        {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}
        {success && <div className="text-green-500 text-sm text-center mb-4">{success}</div>}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-gray-200 mb-1" htmlFor="new-password">Nuova password</label>
            <input
              id="new-password"
              type="password"
              className="w-full px-4 py-2 rounded bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-neon-orange"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-200 mb-1" htmlFor="confirm-password">Conferma password</label>
            <input
              id="confirm-password"
              type="password"
              className="w-full px-4 py-2 rounded bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-neon-orange"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-neon-orange text-black font-bold rounded hover:bg-neon-fire transition-colors disabled:opacity-60"
            disabled={loading || Boolean(success) || Boolean(error && error.includes('Sessione non valida'))}
          >
            {loading ? 'Salvataggio...' : 'Salva password'}
          </button>
        </form>
      </div>
    </div>
  );
}

