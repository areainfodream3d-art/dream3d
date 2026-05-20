import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifica in corso...');

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const type = url.searchParams.get('type');

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        const { data } = await supabase.auth.getSession();
        const hasSession = Boolean(data.session);

        if (!mounted) return;

        if (type === 'recovery') {
          navigate('/update-password', { replace: true });
          return;
        }

        if (hasSession) {
          navigate('/user', { replace: true });
          return;
        }

        setMessage('Operazione completata. Ora puoi accedere.');
        setTimeout(() => navigate('/login', { replace: true }), 800);
      } catch (e: any) {
        if (!mounted) return;
        setMessage(e?.message ? `Errore: ${e.message}` : 'Errore durante la verifica.');
        setTimeout(() => navigate('/login', { replace: true }), 1200);
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return (
    <div className="pt-32 pb-20 container mx-auto px-4 min-h-screen flex justify-center items-center">
      <div className="bg-dark-surface rounded-xl shadow-lg p-8 w-full max-w-md border border-white/10 text-center">
        <h1 className="text-2xl font-bold text-neon-orange mb-3">Autenticazione</h1>
        <p className="text-gray-200">{message}</p>
      </div>
    </div>
  );
}

