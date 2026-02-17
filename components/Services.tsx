
import React from 'react';
import { Layers, Droplets, Wand2, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { LanguageCode } from '../App';
import { translations } from '../translations';

const Services: React.FC<{ language: LanguageCode }> = ({ language }) => {
  const ts = translations[language].services;
  
  const services = [
    {
      title: ts.pla.title,
      icon: <Layers className="text-primary w-8 h-8" />,
      desc: ts.pla.desc,
      features: [ts.pla.f1, ts.pla.f2, ts.pla.f3],
      highlight: false
    },
    {
      title: ts.resina.title,
      icon: <Droplets className="text-primary w-8 h-8" />,
      desc: ts.resina.desc,
      features: [ts.resina.f1, ts.resina.f2, ts.resina.f3],
      highlight: false
    },
    {
      title: ts.custom.title,
      icon: <Wand2 className="text-white w-8 h-8" />,
      desc: ts.custom.desc,
      features: [ts.custom.f1, ts.custom.f2, ts.custom.f3],
      highlight: true
    }
  ];

  return (
    <section className="py-32 bg-white dark:bg-background-dark transition-colors duration-300" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-4">{ts.tag}</h2>
            <h3 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight">{ts.title}</h3>
          </div>
          <a href="#" className="text-primary font-semibold flex items-center gap-2 hover:translate-x-1 transition-transform group">
            {ts.all}
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, idx) => (
            <div 
              key={idx} 
              className={`group relative p-10 rounded-[2.5rem] transition-all duration-500 overflow-hidden ${
                s.highlight 
                  ? 'bg-primary/5 dark:bg-primary/5 border border-primary/30 hover:border-primary shadow-[0_0_30px_rgba(255,77,38,0.05)]' 
                  : 'bg-slate-50 dark:bg-card-dark border border-black/5 dark:border-white/5 hover:border-primary/40'
              }`}
            >
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-xl ${
                  s.highlight ? 'bg-primary shadow-primary/30 text-white' : 'bg-primary/10 text-primary'
                }`}>
                  {s.icon}
                </div>
                
                <h4 className="text-2xl font-bold mb-5 text-slate-900 dark:text-white font-display">{s.title}</h4>
                <p className="text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-light text-sm">
                  {s.desc}
                </p>
                
                <ul className="space-y-4 mb-10">
                  {s.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <CheckCircle2 className="text-primary w-4 h-4" />
                      {f}
                    </li>
                  ))}
                </ul>
                
                <a href="#" className="inline-flex items-center font-bold text-primary text-sm gap-2 group-hover:gap-4 transition-all">
                  {s.highlight ? ts.custom.cta : (language === 'it' ? 'Scopri di più' : 'Learn more')} 
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
