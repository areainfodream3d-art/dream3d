
import React from 'react';
import { BadgeCheck, Leaf, Truck, Headphones, Zap } from 'lucide-react';
import { LanguageCode } from '../App';
import { translations } from '../translations';

const Quality: React.FC<{ language: LanguageCode }> = ({ language }) => {
  const t = translations[language].quality;

  return (
    <section className="py-32 border-t border-black/5 dark:border-white/5 bg-slate-50 dark:bg-background-dark transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -inset-10 bg-black/5 dark:bg-white/5 rounded-[4rem] blur-3xl opacity-20"></div>
            <img 
              alt="3D Printed Parts" 
              className="rounded-[2.5rem] shadow-2xl relative z-10 border border-black/5 dark:border-white/10 grayscale hover:grayscale-0 transition-all duration-700" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwuCzDx-Sq7HUPYhV7U37GZFQGO_Smh8pFzSNv2ME9o1uLmDjvd48FkC-5lsFZoN0zjxDXsv7v2nF6qSy6XOdoav4hkjfC6ZdYE40acqMfuBbCwPvz15KK6n2KOPXTDp2afQhnGsGv86tP0SApnm3JK5-JUqgGwKTp_Co47jPppAckDvcd5krNDPDY7VptI81--6fe7c_AeslqbRl0MX70qbfC5KRuyzXtRiS5v9RYwiDfyK8VbRdqSIswoYzOSzHtJ9BrVqegqNE" 
            />
            <div className="absolute -bottom-10 -right-6 lg:-right-10 glass-card p-8 rounded-3xl shadow-2xl z-20 border-black/5 dark:border-white/10">
              <div className="flex items-center gap-5">
                <div className="bg-primary/20 p-3 rounded-xl">
                  <Zap className="text-primary w-6 h-6 fill-primary" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{t.delivery}</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">{t.days}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 space-y-8">
            <h2 className="font-display text-4xl lg:text-5xl font-extrabold leading-[1.15] text-slate-900 dark:text-white">
              {t.title}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-light leading-relaxed">
              {t.desc}
            </p>
            
            <div className="grid sm:grid-cols-2 gap-10 pt-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <BadgeCheck className="text-primary w-6 h-6" />
                  <h5 className="font-bold text-slate-900 dark:text-white">{t.prec.t}</h5>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{t.prec.d}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Leaf className="text-primary w-6 h-6" />
                  <h5 className="font-bold text-slate-900 dark:text-white">{t.eco.t}</h5>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{t.eco.d}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Truck className="text-primary w-6 h-6" />
                  <h5 className="font-bold text-slate-900 dark:text-white">{t.ship.t}</h5>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{t.ship.d}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Headphones className="text-primary w-6 h-6" />
                  <h5 className="font-bold text-slate-900 dark:text-white">{t.supp.t}</h5>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{t.supp.d}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Quality;
