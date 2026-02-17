
import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Target, Activity, Cpu } from 'lucide-react';
import { LanguageCode } from '../App';
import { translations } from '../translations';

// Fix: Simplified global JSX augmentation to add 'model-viewer' without shadowing standard HTML elements.
// Avoid re-declaring the 'React' namespace globally as it interferes with React's built-in type definitions.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

const models = [
  {
    src: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    alt: "Astronauta ad alta fedeltà",
    tag: "Sci-Fi Precision",
    theme: "cyan",
    accent: "#00F2FF",
    details: ["ZERO-G CERTIFIED", "MICRON ACCURACY", "SEAMLESS FDM"]
  },
  {
    src: "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",
    alt: "Elmo danneggiato iper-realistico",
    tag: "Industrial Detail",
    theme: "amber",
    accent: "#F59E0B",
    details: ["WEAR ANALYSIS", "HIGH-TEMP RESIN", "STRESS TESTED"]
  },
  {
    src: "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb",
    alt: "Scarpa sportiva con varianti materiali",
    tag: "Consumer Product",
    theme: "fuchsia",
    accent: "#D946EF",
    details: ["MULTI-MATERIAL", "SOFT-TOUCH", "COLOR ACCURACY"]
  },
  {
    src: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/FlowerVase/glTF-Binary/FlowerVase.glb",
    alt: "Vaso organico stampato in resina",
    tag: "Organic Design",
    theme: "emerald",
    accent: "#10B981",
    details: ["ORGANIC TOPOLOGY", "SLA PRECISION", "GENERATIVE ART"]
  }
];

const Hero: React.FC<{ language: LanguageCode }> = ({ language }) => {
  const t = translations[language].hero;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const currentModel = models[currentIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % models.length);
      setIsTransitioning(false);
    }, 400);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + models.length) % models.length);
      setIsTransitioning(false);
    }, 400);
  };

  return (
    <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40 hero-gradient">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-[0.2em] animate-fade-in-up transition-colors duration-500"
              style={{ 
                backgroundColor: `${currentModel.accent}15`, 
                borderColor: `${currentModel.accent}40`,
                color: currentModel.accent 
              }}
            >
              <Cpu size={12} className="animate-pulse" />
              {currentModel.tag}
            </div>
            
            <h1 className="font-display text-5xl lg:text-[5rem] font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white animate-fade-in-up reveal-delay-1">
              <span className="block cursor-default">{t.title1}</span>
              <span 
                className="text-shimmer-effect glow-overlay transition-all duration-700" 
                data-text={t.title2}
                style={{ 
                  backgroundImage: `linear-gradient(120deg, ${currentModel.accent} 25%, #ffffff 50%, ${currentModel.accent} 75%)` 
                }}
              >
                {t.title2}
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed font-light animate-fade-in-up reveal-delay-2">
              {t.desc}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 animate-fade-in-up reveal-delay-3">
              <a 
                href="#" 
                className="px-8 py-4 text-white font-bold rounded-xl hover:brightness-110 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-primary/20"
                style={{ backgroundColor: currentModel.accent }}
              >
                {t.cta1}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#" 
                className="px-8 py-4 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-900 dark:text-white font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {t.cta2}
              </a>
            </div>
          </div>

          <div className="relative group animate-fade-in-up reveal-delay-2">
            {/* Glow effect based on model theme */}
            <div 
              className="absolute -inset-10 rounded-[3rem] blur-[100px] opacity-20 dark:opacity-40 transition-all duration-1000"
              style={{ backgroundColor: currentModel.accent }}
            ></div>
            
            <div className="relative glass-card rounded-[2.5rem] p-3 border-black/5 dark:border-white/10 shadow-2xl overflow-hidden group">
              <div className="aspect-square relative rounded-[2rem] overflow-hidden bg-slate-900 flex items-center justify-center">
                
                {/* HUD OVERLAY - SCI-FI ELEMENTS */}
                <div className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-500 overflow-hidden">
                  {/* Corners */}
                  <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 opacity-50 transition-colors duration-500" style={{ borderColor: currentModel.accent }}></div>
                  <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 opacity-50 transition-colors duration-500" style={{ borderColor: currentModel.accent }}></div>
                  <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 opacity-50 transition-colors duration-500" style={{ borderColor: currentModel.accent }}></div>
                  <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 opacity-50 transition-colors duration-500" style={{ borderColor: currentModel.accent }}></div>
                  
                  {/* Laser Scanning Line */}
                  <div 
                    className="absolute inset-x-0 h-[2px] blur-[2px] opacity-30 animate-[scan_4s_ease-in-out_infinite]"
                    style={{ backgroundColor: currentModel.accent, boxShadow: `0 0 15px ${currentModel.accent}` }}
                  ></div>

                  {/* Technical Readouts */}
                  <div className="absolute top-10 left-10 flex flex-col gap-1 text-[8px] font-mono text-white/40 tracking-tighter transition-opacity duration-500">
                    <span className="flex items-center gap-1"><Target size={8} /> TRK_ID: {Math.random().toString(16).slice(2,8).toUpperCase()}</span>
                    <span className="flex items-center gap-1"><Activity size={8} /> SIG_STRENGTH: 98.4%</span>
                  </div>

                  <div className="absolute bottom-10 right-10 flex flex-col items-end gap-1 text-[8px] font-mono text-white/40 tracking-tighter">
                    <span>X: 192.44</span>
                    <span>Y: 882.10</span>
                    <span style={{ color: currentModel.accent }} className="font-bold">STATUS: ANALYZING...</span>
                  </div>

                  {/* Feature Tags */}
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                    {currentModel.details.map((detail, idx) => (
                      <div 
                        key={idx} 
                        className="bg-black/40 backdrop-blur-md border border-white/10 px-2 py-1 rounded text-[7px] font-bold text-white/70 tracking-widest vertical-text transform -rotate-180 animate-fade-in"
                        style={{ animationDelay: `${idx * 0.2}s` }}
                      >
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`w-full h-full transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
                  {/* Fix: model-viewer is now recognized via simplified global declaration */}
                  <model-viewer
                    key={currentModel.src}
                    src={currentModel.src}
                    alt={currentModel.alt}
                    auto-rotate
                    camera-controls
                    shadow-intensity="1.5"
                    environment-image="neutral"
                    exposure="1.2"
                    interaction-prompt="auto"
                    ar
                    className="w-full h-full"
                  >
                    {/* Floating Model Tag */}
                    <div 
                      className="absolute top-6 right-6 z-10 px-3 py-1.5 backdrop-blur-md rounded border text-[9px] font-black uppercase tracking-widest transition-all duration-500"
                      style={{ 
                        backgroundColor: `${currentModel.accent}20`, 
                        borderColor: `${currentModel.accent}50`,
                        color: currentModel.accent,
                        boxShadow: `0 0 20px ${currentModel.accent}20`
                      }}
                    >
                      {currentModel.tag}
                    </div>
                  </model-viewer>
                </div>

                {/* Navigation Controls */}
                <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={handlePrev}
                    className="w-12 h-12 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:text-white transition-all active:scale-90 pointer-events-auto shadow-2xl"
                    style={{ '--hover-bg': currentModel.accent } as React.CSSProperties}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={handleNext}
                    className="w-12 h-12 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:text-white transition-all active:scale-90 pointer-events-auto shadow-2xl"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>

                {/* Bottom Timeline Indicator */}
                <div className="absolute bottom-6 inset-x-10 flex gap-2 z-30 items-center justify-center">
                  {models.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setIsTransitioning(true);
                        setTimeout(() => {
                          setCurrentIndex(idx);
                          setIsTransitioning(false);
                        }, 400);
                      }}
                      className={`h-1 transition-all duration-500 rounded-full ${currentIndex === idx ? 'w-12' : 'w-4 hover:bg-white/40 bg-white/10'}`}
                      style={{ backgroundColor: currentIndex === idx ? currentModel.accent : undefined }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </section>
  );
};

export default Hero;
