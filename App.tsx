
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Products from './components/Products';
import Materials from './components/Materials';
import Portfolio from './components/Portfolio';
import Quality from './components/Quality';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';
import AiAssistant from './components/AiAssistant';
import { translations } from './translations';

export type LanguageCode = 'it' | 'en' | 'de' | 'fr' | 'es' | 'zh';

const App: React.FC = () => {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState<LanguageCode>('it');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const t = translations[language];

  return (
    <div className="min-h-screen font-sans selection:bg-primary/30 selection:text-white bg-slate-50 dark:bg-background-dark transition-colors duration-300">
      <Navbar 
        isDarkMode={isDarkMode} 
        onToggleTheme={toggleTheme} 
        language={language} 
        onLanguageChange={setLanguage}
      />
      <main>
        <Hero language={language} />
        <Services language={language} />
        <Products language={language} />
        <Materials language={language} />
        <Portfolio language={language} />
        <Quality language={language} />
        <CtaSection language={language} />
      </main>
      <Footer language={language} />
      
      {/* Floating AI Helper */}
      <button 
        onClick={() => setIsAiOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group"
        title="Chiedi a DreamAI"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
        </svg>
      </button>

      {isAiOpen && <AiAssistant language={language} onClose={() => setIsAiOpen(false)} />}
    </div>
  );
};

export default App;
