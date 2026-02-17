
import React, { useState } from 'react';
import { Microscope, FlaskConical, Zap, Ruler } from 'lucide-react';
import { LanguageCode } from '../App';
import { translations } from '../translations';

interface Material {
  name: string;
  type: string;
  desc: string;
  stats: { strength: number; detail: number; flex: number; cost: number };
  color: string;
}

const Materials: React.FC<{ language: LanguageCode }> = ({ language }) => {
  const t = translations[language].materials;
  const [activeMaterial, setActiveMaterial] = useState(0);

  const materials: Material[] = [
    {
      name: 'Nylon Carbon Fiber',
      type: 'Industrial FDM',
      desc: language === 'it' ? 'Composito ultra-resistente per parti meccaniche sollecitate.' : 'Ultra-strong composite for stressed mechanical parts.',
      stats: { strength: 95, detail: 60, flex: 20, cost: 80 },
      color: '#FF4D26'
    },
    {
      name: 'Tough Resin V4',
      type: 'Technical SLA',
      desc: language === 'it' ? 'Resina con proprietà simili all\'ABS per incastri e prototipi funzionali.' : 'Resin with ABS-like properties for snaps and functional prototypes.',
      stats: { strength: 75, detail: 95, flex: 40, cost: 70 },
      color: '#00F2FF'
    },
    {
      name: 'PLA Professional',
      type: 'Standard FDM',
      desc: language === 'it' ? 'Facile da stampare, ottimo per visual design e modelli architettonici.' : 'Easy to print, great for visual design and architectural models.',
      stats: { strength: 50, detail: 70, flex: 10, cost: 30 },
      color: '#10B981'
    }
  ];

  return (
    <section className="py-32 bg-slate-900 overflow-hidden" id="materials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
            <FlaskConical size={12} />
            {t.tag}
          </div>
          <h2 className="text-4xl lg:text-6xl font-display font-bold text-white mb-6">{t.title}</h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-light">{t.desc}</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex flex-col gap-4">
            {materials.map((m, idx) => (
              <button
                key={idx}
                onClick={() => setActiveMaterial(idx)}
                className={`text-left p-6 rounded-3xl transition-all duration-500 border flex items-center justify-between group ${
                  activeMaterial === idx 
                    ? 'bg-white/10 border-white/20 shadow-2xl' 
                    : 'bg-transparent border-white/5 hover:border-white/10'
                }`}
              >
                <div>
                  <h4 className={`font-bold text-xl mb-1 transition-colors ${activeMaterial === idx ? 'text-white' : 'text-slate-500'}`}>{m.name}</h4>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40 text-white">{m.type}</span>
                </div>
                <div 
                  className="w-3 h-3 rounded-full transition-transform duration-500 group-hover:scale-150" 
                  style={{ backgroundColor: m.color, boxShadow: `0 0 15px ${m.color}60` }}
                ></div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-7">
            <div className="glass-card p-10 lg:p-16 rounded-[3rem] border-white/10 relative overflow-hidden group">
              <div 
                className="absolute top-0 right-0 w-64 h-64 blur-[120px] opacity-20 transition-all duration-700"
                style={{ backgroundColor: materials[activeMaterial].color }}
              ></div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white">
                    <Microscope size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">{materials[activeMaterial].name}</h3>
                    <p className="text-slate-400 font-light">{materials[activeMaterial].desc}</p>
                  </div>
                </div>

                <div className="space-y-8">
                  {Object.entries(materials[activeMaterial].stats).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                        <span>{t.stats[key as keyof typeof t.stats]}</span>
                        <span className="text-white">{value}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all duration-1000 ease-out rounded-full"
                          style={{ 
                            width: `${value}%`, 
                            backgroundColor: materials[activeMaterial].color,
                            boxShadow: `0 0 10px ${materials[activeMaterial].color}40`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                    <Zap size={18} className="text-primary" />
                    <span className="text-xs text-white/60 font-medium">Auto-Support Ready</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                    <Ruler size={18} className="text-primary" />
                    <span className="text-xs text-white/60 font-medium">Tolerances ±0.1mm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Materials;
