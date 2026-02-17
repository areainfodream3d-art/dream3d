
import React, { useState } from 'react';
import { Menu, Sun, Moon, Globe, ChevronDown } from 'lucide-react';
import { translations, languages } from '../translations';
import { LanguageCode } from '../App';

interface NavbarProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, onToggleTheme, language, onLanguageChange }) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const t = translations[language].nav;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-background-dark/80 border-b border-black/5 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <span className="font-display text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-primary transition-colors">
              Dream<span className="text-primary group-hover:text-slate-900 dark:group-hover:text-white transition-colors">3D</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 font-medium text-sm tracking-wide text-slate-500 dark:text-slate-400">
            <a href="#products" className="hover:text-primary transition-colors">{t.products}</a>
            <a href="#services" className="hover:text-primary transition-colors">{t.services}</a>
            <a href="#materials" className="hover:text-primary transition-colors">{t.materials}</a>
            <a href="#portfolio" className="hover:text-primary transition-colors">{t.portfolio}</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 p-2.5 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-400"
              >
                <Globe size={18} />
                <span className="text-xs font-bold uppercase hidden sm:inline">{language}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isLangOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 glass-card rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code as LanguageCode);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold transition-colors ${
                        language === lang.code 
                          ? 'bg-primary text-white' 
                          : 'hover:bg-primary/10 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span>{lang.name}</span>
                      <span>{lang.flag}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={onToggleTheme}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-400"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <a 
              href="#" 
              className="hidden sm:block px-6 py-2.5 bg-primary text-white font-semibold rounded-full hover:brightness-110 hover:shadow-[0_0_20px_rgba(255,77,38,0.3)] transition-all active:scale-95 text-sm"
            >
              Login
            </a>
            <button className="md:hidden p-2 text-slate-600 dark:text-slate-400">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
