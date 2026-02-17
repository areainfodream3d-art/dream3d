
import React from 'react';
import { Upload, MessageSquare } from 'lucide-react';
import { LanguageCode } from '../App';
import { translations } from '../translations';

const CtaSection: React.FC<{ language: LanguageCode }> = ({ language }) => {
  const t = translations[language].cta;

  return (
    <section className="py-24 bg-white dark:bg-background-dark transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-[3rem] p-12 lg:p-24 relative overflow-hidden text-center shadow-2xl shadow-primary/20">
          <div className="absolute inset-0 opacity-10" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')"}}></div>
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <h2 className="font-display text-4xl lg:text-7xl font-extrabold text-white leading-tight">
              {t.title}
            </h2>
            <p className="text-white/80 text-lg lg:text-xl font-light">
              {t.desc}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-4">
              <button className="px-10 py-5 bg-white text-primary font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-2xl group">
                <Upload className="w-6 h-6 group-hover:animate-bounce" />
                {t.upload}
              </button>
              <button className="px-10 py-5 bg-black/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-2xl hover:bg-black/20 transition-all flex items-center justify-center gap-3">
                <MessageSquare className="w-6 h-6" />
                {t.contact}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
