
import React from 'react';
import { Instagram, Twitter, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import { LanguageCode } from '../App';
import { translations } from '../translations';

const Footer: React.FC<{ language: LanguageCode }> = ({ language }) => {
  const t = translations[language];

  return (
    <footer className="bg-card-dark/30 border-t border-white/5 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <div className="flex items-center group cursor-pointer">
              <span className="font-display text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-primary transition-colors">
                Dream<span className="text-primary group-hover:text-slate-900 dark:group-hover:text-white transition-colors">3D</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed font-light">
              {language === 'it' 
                ? "L'innovazione della stampa 3D alla portata di tutti. Dai piccoli hobbisti alle grandi realtà industriali, diamo forma ad ogni visione."
                : "3D printing innovation for everyone. From hobbyists to industrial leaders, we shape every vision."}
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Mail].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary text-slate-400 hover:text-white transition-all shadow-sm"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="font-bold mb-8 text-white text-sm uppercase tracking-widest">Shop</h5>
            <ul className="space-y-4 text-sm text-slate-500">
              {(language === 'it' ? ['Modelli PLA', 'Resine UV', 'Filamenti Premium', 'Componenti Ricambio'] : ['PLA Models', 'UV Resins', 'Premium Filaments', 'Spare Parts']).map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-primary transition-colors flex items-center gap-1 group">
                    {item} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-8 text-white text-sm uppercase tracking-widest">{t.nav.services}</h5>
            <ul className="space-y-4 text-sm text-slate-500">
              {(language === 'it' ? ['Stampa Service', 'Modellazione 3D', 'Post-Produzione', 'Soluzioni B2B'] : ['Printing Service', '3D Modeling', 'Post-Production', 'B2B Solutions']).map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-primary transition-colors flex items-center gap-1 group">
                    {item} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-8 text-white text-sm uppercase tracking-widest">Contatti</h5>
            <ul className="space-y-5 text-sm text-slate-500">
              <li className="flex items-start gap-3">
                <MapPin className="text-primary w-5 h-5 shrink-0" />
                <span>Treviso, IT - Via Volta, 31050</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-primary w-5 h-5 shrink-0" />
                <span>+39 347 598 3978</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-primary w-5 h-5 shrink-0" />
                <span>info@dream3d.tech</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-slate-600 font-medium uppercase tracking-[0.2em]">
          <p>© 2024 DREAM3D TECHNOLOGIES. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
