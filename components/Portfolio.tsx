
import React from 'react';
import { ImageIcon, ArrowUpRight, Clock, Target } from 'lucide-react';
import { LanguageCode } from '../App';
import { translations } from '../translations';

const Portfolio: React.FC<{ language: LanguageCode }> = ({ language }) => {
  const t = translations[language].portfolio;

  const projects = [
    {
      title: 'Drone Frame Prototype',
      cat: 'tech',
      img: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800&auto=format&fit=crop',
      time: '18h',
      material: 'Nylon CF',
      size: 'large'
    },
    {
      title: 'Vase Collection',
      cat: 'art',
      img: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=600&auto=format&fit=crop',
      time: '4h',
      material: 'PLA Silk',
      size: 'small'
    },
    {
      title: 'Miniature Set',
      cat: 'art',
      img: 'https://images.unsplash.com/photo-1628155232283-c05171789c62?q=80&w=600&auto=format&fit=crop',
      time: '2h',
      material: 'Resin 8K',
      size: 'small'
    },
    {
      title: 'Turbine Housing',
      cat: 'tech',
      img: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=800&auto=format&fit=crop',
      time: '34h',
      material: 'PETG Carbon',
      size: 'medium'
    }
  ];

  return (
    <section className="py-32 bg-white dark:bg-background-dark transition-colors duration-300" id="portfolio">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
              <ImageIcon size={12} />
              {t.tag}
            </div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white">{t.title}</h2>
          </div>
          <button className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-105 transition-all">
            {t.viewAll} <ArrowUpRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
          {projects.map((p, idx) => (
            <div 
              key={idx}
              className={`group relative rounded-[2rem] overflow-hidden border border-black/5 dark:border-white/5 bg-slate-100 dark:bg-card-dark transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 ${
                p.size === 'large' ? 'md:col-span-2 md:row-span-2' : 
                p.size === 'medium' ? 'md:col-span-2' : ''
              }`}
            >
              <img 
                src={p.img} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" 
                alt={p.title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-primary text-[10px] font-black uppercase tracking-widest mb-2 block">{p.cat}</span>
                    <h4 className="text-white font-bold text-2xl mb-4">{p.title}</h4>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase">
                        <Clock size={12} className="text-primary" /> {p.time}
                      </div>
                      <div className="flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase">
                        <Target size={12} className="text-primary" /> {p.material}
                      </div>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                    <ArrowUpRight size={20} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
