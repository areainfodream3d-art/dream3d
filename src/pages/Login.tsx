import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import Printer3DAnimation from '../components/ui/Printer3DAnimation';
import { useNavigate } from 'react-router-dom';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [showReset, setShowReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthRedirect();

  // Se già loggato, redirect automatico
  useEffect(() => {
    if (user) navigate('/user');
  }, [user, navigate]);

  // Focus automatico su email all'apertura
  useEffect(() => {
    if (showReset || !isRegister) {
      emailRef.current?.focus();
    }
  }, [showReset, isRegister]);

  const validateEmail = (email) => /.+@.+\..+/.test(email);
  const validatePassword = (pw) => pw.length >= 6;
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  const redirectTo = `${siteUrl}/auth/callback`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!isSupabaseConfigured) {
      setError(t('auth.login_unavailable_error'));
      return;
    }
    if (!validateEmail(email)) {
      setError(t('auth.invalid_email'));
      emailRef.current?.focus();
      return;
    }
    if (!validatePassword(password)) {
      setError(t('auth.min_password'));
      passwordRef.current?.focus();
      return;
    }
    setLoading(true);
    try {
      if (isRegister) {
        // REGISTRAZIONE
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo } });
        if (error) throw error;
        setIsRegister(false);
        setSuccess(t('auth.register_success'));
      } else {
        // LOGIN
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        if (!data.session) throw new Error(t('auth.login_failed'));
        if (remember) {
          localStorage.setItem('supabase-persist-session', 'true');
        } else {
          localStorage.removeItem('supabase-persist-session');
        }
        setSuccess(t('auth.login_success'));
        setTimeout(() => navigate('/user'), 800);
      }
    } catch (err) {
      setError(err.message || t('auth.auth_error'));
    } finally {
      setLoading(false);
    }
  };

  // Funzione recupero password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setResetSent(false);
    if (!isSupabaseConfigured) {
      setError(t('auth.recovery_unavailable'));
      return;
    }
    if (!validateEmail(email)) {
      setError(t('auth.invalid_email_recovery'));
      emailRef.current?.focus();
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${redirectTo}?type=recovery` });
      if (error) throw error;
      setResetSent(true);
      setSuccess(t('auth.recovery_sent'));
    } catch (err) {
      setError(err.message || t('auth.recovery_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
      <Printer3DAnimation />
      <div className="bg-dark-surface rounded-xl shadow-lg p-8 w-full max-w-md border border-white/10 mt-4" aria-live="polite">
        <h1 className="text-3xl font-bold text-center mb-6 text-neon-orange">
          {isRegister ? t('auth.register_title') : showReset ? t('auth.recover_title') : t('auth.login_title')}
        </h1>
        {!isSupabaseConfigured && (
          <div className="text-amber-400 text-sm text-center mb-4">
            {t('auth.login_unavailable')}
          </div>
        )}
        {!showReset ? (
          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on" aria-label={isRegister ? t('auth.form_register') : t('auth.form_login')}>
            <div>
              <label className="block text-gray-200 mb-1" htmlFor="email">{t('commission.email')}</label>
              <input
                id="email"
                ref={emailRef}
                type="email"
                className="w-full px-4 py-2 rounded bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-neon-orange"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
                aria-required="true"
                aria-invalid={!!error && !validateEmail(email)}
                disabled={loading}
              />
            </div>
            {!isRegister && (
              <div>
                <label className="block text-gray-200 mb-1" htmlFor="password">{t('auth.password_label')}</label>
                <input
                  id="password"
                  ref={passwordRef}
                  type="password"
                  className="w-full px-4 py-2 rounded bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-neon-orange"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  aria-required="true"
                  aria-invalid={!!error && !validatePassword(password)}
                  disabled={loading}
                />
              </div>
            )}
            {isRegister && (
              <div>
                <label className="block text-gray-200 mb-1" htmlFor="password">{t('auth.password_label')}</label>
                <input
                  id="password"
                  ref={passwordRef}
                  type="password"
                  className="w-full px-4 py-2 rounded bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-neon-orange"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  aria-required="true"
                  aria-invalid={!!error && !validatePassword(password)}
                  disabled={loading}
                />
              </div>
            )}
            {!isRegister && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="mr-2 accent-neon-orange"
                    disabled={loading}
                  />
                  <label htmlFor="remember" className="text-gray-300">{t('auth.remember_access')}</label>
                </div>
                <button
                  type="button"
                  className="text-xs text-neon-orange hover:underline ml-2"
                  onClick={() => { setShowReset(true); setError(''); setSuccess(''); }}
                  disabled={loading}
                >
                  {t('auth.forgot_password')}
                </button>
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center text-red-500 text-sm text-center gap-2 mt-2" role="alert">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /></svg>
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center justify-center text-green-500 text-sm text-center gap-2 mt-2" role="status">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></svg>
                <span>{success}</span>
              </div>
            )}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-neon-orange text-black font-bold rounded hover:bg-neon-fire transition-colors disabled:opacity-60 focus:ring-2 focus:ring-neon-orange focus:ring-offset-2"
              disabled={loading || !isSupabaseConfigured}
              aria-busy={loading}
            >
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <span>{isRegister ? t('auth.registering') : t('auth.logging_in')}</span>
                </span>
              ) : (
                (isRegister ? t('auth.register_title') : t('auth.login_title'))
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6" aria-label={t('auth.form_reset')}>
            <div>
              <label className="block text-gray-200 mb-1" htmlFor="reset-email">{t('commission.email')}</label>
              <input
                id="reset-email"
                ref={emailRef}
                type="email"
                className="w-full px-4 py-2 rounded bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-neon-orange"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
                aria-required="true"
                aria-invalid={!!error && !validateEmail(email)}
                disabled={loading}
              />
            </div>
            {error && (
              <div className="flex items-center justify-center text-red-500 text-sm text-center gap-2 mt-2" role="alert">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /></svg>
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center justify-center text-green-500 text-sm text-center gap-2 mt-2" role="status">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></svg>
                <span>{success}</span>
              </div>
            )}
            {resetSent && <div className="text-green-400 text-xs text-center">{t('auth.reset_hint_spam')}</div>}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-neon-orange text-black font-bold rounded hover:bg-neon-fire transition-colors disabled:opacity-60 focus:ring-2 focus:ring-neon-orange focus:ring-offset-2"
              disabled={loading || !isSupabaseConfigured}
              aria-busy={loading}
            >
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <span>{t('auth.sending_recovery')}</span>
                </span>
              ) : (
                t('auth.send_recovery')
              )}
            </button>
            <button
              type="button"
              className="w-full mt-2 text-neon-orange hover:underline"
              onClick={() => { setShowReset(false); setError(''); setSuccess(''); setResetSent(false); }}
              disabled={loading}
            >
              {t('auth.back_to_login')}
            </button>
          </form>
        )}
        <div className="text-center mt-4">
          <button
            className="text-neon-orange hover:underline"
            onClick={() => { setIsRegister(r => !r); setError(''); setSuccess(''); setShowReset(false); setResetSent(false); }}
            aria-label={isRegister ? t('auth.switch_to_login_aria') : t('auth.switch_to_register_aria')}
          >
            {isRegister ? t('auth.switch_to_login') : t('auth.switch_to_register')}
          </button>
        </div>
      </div>
    </section>
  );
}
