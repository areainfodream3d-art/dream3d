import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const sectorKeys = [
  { key: 'food_beverage', icon: '🍞' },
  { key: 'steel', icon: '🔩' },
  { key: 'chemical', icon: '⚗️' },
  { key: 'packaging', icon: '📦' },
  { key: 'recycling', icon: '♻️' },
  { key: 'agriculture', icon: '🌾' },
];

const serviceKeys = [
  'mechanical_design',
  'turnkey_plants',
  'industrial_automation',
  'special_machines',
  'rnd',
  'manufacturing',
];


export default function EngineeringSolutions() {
  const { t, i18n } = useTranslation();
  // Preventivo form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactDesc, setContactDesc] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const services = useMemo(
    () =>
      serviceKeys.map((key) => ({
        title: t(`engineering.services.${key}.title`),
        desc: t(`engineering.services.${key}.desc`),
      })),
    [t, i18n.language]
  );

  const sectors = useMemo(
    () =>
      sectorKeys.map((sector) => ({
        icon: sector.icon,
        name: t(`engineering.sectors.${sector.key}`),
      })),
    [t, i18n.language]
  );

  const handleSendContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactDesc.trim()) {
      alert(t('commission.fill_all'));
      return;
    }
    setSending(true);
    try {
      const response = await fetch("https://formspree.io/f/mojnnave", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactDesc,
          type: 'Quote Request (Engineering Solutions)'
        })
      });
      if (response.ok) {
        setSent(true);
        setContactName("");
        setContactEmail("");
        setContactDesc("");
      } else {
        alert(t('engineering.submit_error'));
      }
    } catch (error) {
      alert(t('commission.error_conn'));
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-6 text-neon-orange">{t('engineering.title')}</h1>
      <p className="text-center text-lg text-gray-300 mb-12">
        {t('engineering.subtitle')}
      </p>
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {services.map((service) => (
          <div key={service.title} className="bg-dark-surface rounded-xl shadow-lg p-6 border border-white/10 hover:border-neon-orange transition-colors">
            <h2 className="text-xl font-semibold text-neon-orange mb-2">{service.title}</h2>
            <p className="text-gray-200">{service.desc}</p>
          </div>
        ))}
      </div>
      <h2 className="text-2xl font-bold text-center mb-4 text-neon-orange">{t('engineering.sectors_title')}</h2>
      <div className="flex flex-wrap justify-center gap-6 mb-16">
        {sectors.map((sector) => (
          <div key={sector.name} className="flex flex-col items-center bg-dark-surface rounded-lg p-4 w-36 border border-white/10">
            <span className="text-4xl mb-2">{sector.icon}</span>
            <span className="text-gray-200 text-center">{sector.name}</span>
          </div>
        ))}
      </div>


      {/* Portfolio PDF */}
      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-center mb-4 text-neon-orange mt-20">{t('engineering.portfolio_title')}</h2>
        <div className="flex flex-col md:flex-row items-center gap-6 bg-dark-surface rounded-xl p-6 border border-white/10 shadow-lg">
          <iframe
            src="/macchina%20design%20portfolio/macchina-design-portfolio.pdf"
            title={t('engineering.portfolio_title')}
            className="w-full md:w-1/2 h-80 rounded border border-white/10"
            loading="lazy"
          />
          <div className="flex-1 flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold text-neon-orange mb-2">{t('engineering.portfolio_heading')}</h3>
            <p className="text-gray-300 text-sm mb-4 text-center md:text-left">
              {t('engineering.portfolio_desc')}
            </p>
            <a
              href="/macchina%20design%20portfolio/macchina-design-portfolio.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2 bg-neon-orange text-black font-bold rounded hover:bg-neon-fire transition-colors"
            >
              {t('engineering.portfolio_button')}
            </a>
          </div>
        </div>
      </div>

      {/* Preventivo Section */}
      <div className="max-w-2xl mx-auto bg-dark-surface p-8 rounded-2xl border border-white/5 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 justify-center text-center text-neon-orange">
          {t('commission.quote_title')}
        </h2>
        {sent ? (
          <div className="text-green-500 text-center text-lg font-semibold py-8">{t('engineering.form_success')}</div>
        ) : (
        <form onSubmit={handleSendContact} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">{t('commission.name')}</label>
            <input 
              type="text" 
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-orange outline-none transition-colors" 
              placeholder={t('commission.name_placeholder')}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">{t('commission.email')}</label>
            <input 
              type="email" 
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-orange outline-none transition-colors" 
              placeholder={t('commission.email_placeholder')}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">{t('commission.desc')}</label>
            <textarea 
              value={contactDesc}
              onChange={(e) => setContactDesc(e.target.value)}
              className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-orange outline-none transition-colors h-32" 
              placeholder={t('engineering.desc_placeholder')}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-neon-orange text-black font-bold rounded hover:bg-neon-fire transition-colors disabled:opacity-60"
            disabled={sending}
          >
            {sending ? t('commission.sending') : t('commission.send')}
          </button>
        </form>
        )}
      </div>
    </section>
  );
}
