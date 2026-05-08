
import React, { useState, useMemo } from 'react';
import { Search, ShoppingBag, ArrowRight, ExternalLink, Sparkles, Boxes, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { LanguageCode } from '../App';
import { translations } from '../translations';

interface ProductItem {
  id: number;
  name: string;
  category: 'mech' | 'design' | 'mini' | 'arch';
  image: string;
  description: string;
  material: string;
  price: string;
  tag?: string;
  tech: 'FDM' | 'SLA';
  leadTime: string;
  available: boolean;
}

const Products: React.FC<{ language: LanguageCode }> = ({ language }) => {
  const t = translations[language].products;
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTech, setActiveTech] = useState<'all' | 'FDM' | 'SLA'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name-asc'>('featured');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  const productData: ProductItem[] = [
    {
      id: 1,
      name: language === 'it' ? 'Ingranaggio Industriale' : 'Industrial Gear',
      category: 'mech',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop',
      description: language === 'it'
        ? 'Componente tecnico ad alta resistenza per prototipi funzionali e piccole serie.'
        : 'High-strength technical component for functional prototypes and low-volume production.',
      material: 'Nylon CF',
      price: '45.00',
      tag: 'Best Seller',
      tech: 'FDM',
      leadTime: language === 'it' ? '3-5 giorni' : '3-5 days',
      available: true,
    },
    {
      id: 2,
      name: language === 'it' ? 'Vaso Organico' : 'Organic Vase',
      category: 'design',
      image: 'https://images.unsplash.com/photo-1549484482-f7613768849c?q=80&w=800&auto=format&fit=crop',
      description: language === 'it'
        ? 'Elemento decorativo dal design fluido, ideale per ambienti moderni e boutique.'
        : 'Decorative statement piece with fluid shapes, perfect for modern interiors and boutiques.',
      material: 'PLA Silk',
      price: '29.00',
      tag: 'Eco',
      tech: 'FDM',
      leadTime: language === 'it' ? '2-4 giorni' : '2-4 days',
      available: true,
    },
    {
      id: 3,
      name: language === 'it' ? 'Miniatura Guerriero' : 'Warrior Miniature',
      category: 'mini',
      image: 'https://images.unsplash.com/photo-1628155232283-c05171789c62?q=80&w=600&auto=format&fit=crop',
      description: language === 'it'
        ? 'Miniatura ad altissimo dettaglio per pittura, esposizione e collezione premium.'
        : 'Ultra-detailed miniature for painting, display pieces, and premium collectors.',
      material: 'Grey Resin 8K',
      price: '15.00',
      tag: 'High-Res',
      tech: 'SLA',
      leadTime: language === 'it' ? '2-3 giorni' : '2-3 days',
      available: true,
    },
    {
      id: 4,
      name: language === 'it' ? 'Modello Architettonico' : 'Architectural Model',
      category: 'arch',
      image: 'https://images.unsplash.com/photo-1503387762-592dee58c160?q=80&w=600&auto=format&fit=crop',
      description: language === 'it'
        ? 'Modello concettuale per studi, presentazioni cliente e mockup da esposizione.'
        : 'Concept model for studios, client presentations, and showroom-ready mockups.',
      material: 'White PLA',
      price: '120.00',
      tech: 'FDM',
      leadTime: language === 'it' ? '5-7 giorni' : '5-7 days',
      available: false,
    },
    {
      id: 5,
      name: language === 'it' ? 'Staffa Rinforzata' : 'Reinforced Bracket',
      category: 'mech',
      image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=600&auto=format&fit=crop',
      description: language === 'it'
        ? 'Parte tecnica pronta per test meccanici, fissaggi e utilizzo su assemblaggi custom.'
        : 'Engineering-ready bracket for testing, mounting, and custom assemblies.',
      material: 'PETG Carbon',
      price: '18.00',
      tech: 'FDM',
      leadTime: language === 'it' ? '2-3 giorni' : '2-3 days',
      available: true,
    },
    {
      id: 6,
      name: language === 'it' ? 'Lampada Esagonale' : 'Hex Lamp',
      category: 'design',
      image: 'https://images.unsplash.com/photo-1550684848-86a5d8727436?q=80&w=600&auto=format&fit=crop',
      description: language === 'it'
        ? 'Oggetto luminoso di design con finitura premium e forte impatto visivo.'
        : 'Design lighting piece with a premium finish and a bold visual presence.',
      material: 'Translucent Resin',
      price: '85.00',
      tag: 'New',
      tech: 'SLA',
      leadTime: language === 'it' ? '4-6 giorni' : '4-6 days',
      available: true,
    },
    {
      id: 7,
      name: language === 'it' ? 'Modulo per Drone FPV' : 'FPV Drone Mount',
      category: 'mech',
      image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=900&auto=format&fit=crop',
      description: language === 'it'
        ? 'Supporto alleggerito e ottimizzato per componenti tecnici con geometrie custom.'
        : 'Lightweight custom mount optimized for technical parts and tailored geometries.',
      material: 'ASA',
      price: '24.00',
      tag: 'Pro',
      tech: 'FDM',
      leadTime: language === 'it' ? '3-4 giorni' : '3-4 days',
      available: true,
    },
    {
      id: 8,
      name: language === 'it' ? 'Bustina Fantasy Collector' : 'Fantasy Collector Bust',
      category: 'mini',
      image: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=900&auto=format&fit=crop',
      description: language === 'it'
        ? 'Pezzo da collezione ad alta definizione, perfetto per pittura artistica.'
        : 'High-definition collector bust, ideal for artistic painting and display.',
      material: 'ABS-like Resin',
      price: '39.00',
      tag: 'Collector',
      tech: 'SLA',
      leadTime: language === 'it' ? '3-5 giorni' : '3-5 days',
      available: false,
    },
    {
      id: 9,
      name: language === 'it' ? 'Masterplan Urbanistico' : 'Urban Masterplan',
      category: 'arch',
      image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=900&auto=format&fit=crop',
      description: language === 'it'
        ? 'Mockup architettonico professionale per gare, investitori e presentazioni.'
        : 'Professional architectural mockup for competitions, investors, and presentations.',
      material: 'Matte PLA',
      price: '210.00',
      tech: 'FDM',
      leadTime: language === 'it' ? '6-8 giorni' : '6-8 days',
      available: true,
    }
  ];

  const filteredProducts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return productData
      .filter((product) => activeFilter === 'all' || product.category === activeFilter)
      .filter((product) => activeTech === 'all' || product.tech === activeTech)
      .filter((product) => !showOnlyAvailable || product.available)
      .filter((product) => {
        if (!search) return true;
        return [
          product.name,
          product.description,
          product.material,
          product.tech,
          product.tag || '',
        ].some((value) => value.toLowerCase().includes(search));
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
        if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name, language);
        if (a.available !== b.available) return a.available ? -1 : 1;
        return Number(a.id) - Number(b.id);
      });
  }, [activeFilter, activeTech, language, productData, searchTerm, showOnlyAvailable, sortBy]);

  const resetFilters = () => {
    setActiveFilter('all');
    setActiveTech('all');
    setSearchTerm('');
    setSortBy('featured');
    setShowOnlyAvailable(false);
  };

  const hasActiveFilters = activeFilter !== 'all' || activeTech !== 'all' || searchTerm.trim() !== '' || sortBy !== 'featured' || showOnlyAvailable;

  return (
    <section className="py-24 bg-slate-50 dark:bg-background-dark/50 transition-colors duration-300 overflow-hidden" id="products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
              <ShoppingBag size={12} />
              {t.tag}
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">{t.title}</h2>
            <p className="mt-4 max-w-2xl text-slate-500 dark:text-slate-400 text-base lg:text-lg">
              {t.subtitle}
            </p>
          </div>
        </div>

        <div className="sticky top-24 z-20 mb-10 rounded-[2rem] border border-black/5 dark:border-white/5 bg-white/90 dark:bg-card-dark/85 backdrop-blur-xl shadow-xl shadow-slate-900/5 dark:shadow-black/10">
          <div className="p-5 lg:p-6 space-y-5">
            <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full rounded-2xl bg-slate-100/90 dark:bg-white/5 border border-black/5 dark:border-white/10 pl-12 pr-4 py-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setShowOnlyAvailable((v) => !v)}
                  className={`rounded-2xl px-4 py-4 text-xs font-bold uppercase tracking-widest border transition-all ${
                    showOnlyAvailable
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25'
                      : 'bg-slate-100/90 dark:bg-white/5 text-slate-500 dark:text-slate-300 border-black/5 dark:border-white/10'
                  }`}
                >
                  {t.inStock}
                </button>

                <div className="relative">
                  <Boxes className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <select
                    value={activeTech}
                    onChange={(e) => setActiveTech(e.target.value as 'all' | 'FDM' | 'SLA')}
                    className="w-full appearance-none rounded-2xl bg-slate-100/90 dark:bg-white/5 border border-black/5 dark:border-white/10 pl-12 pr-4 py-4 text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="all">{t.techAll}</option>
                    <option value="FDM">FDM</option>
                    <option value="SLA">SLA</option>
                  </select>
                </div>

                <div className="relative">
                  <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc' | 'name-asc')}
                    className="w-full appearance-none rounded-2xl bg-slate-100/90 dark:bg-white/5 border border-black/5 dark:border-white/10 pl-12 pr-4 py-4 text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="featured">{t.sort.featured}</option>
                    <option value="price-asc">{t.sort.priceAsc}</option>
                    <option value="price-desc">{t.sort.priceDesc}</option>
                    <option value="name-asc">{t.sort.nameAsc}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {(Object.entries(t.filters) as [string, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setActiveFilter(key)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      activeFilter === key
                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                        : 'bg-slate-100/90 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 border border-black/5 dark:border-white/5'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-900 dark:text-white">{filteredProducts.length}</span> {t.results}
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300 hover:text-primary transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {t.reset}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="group relative bg-white dark:bg-card-dark rounded-[2.5rem] border border-black/5 dark:border-white/5 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col"
            >
              <div className="aspect-[4/5] relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <button className="w-full py-4 bg-white text-slate-900 font-bold rounded-2xl flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
                    {t.view} <ExternalLink size={16} />
                  </button>
                </div>
                
                {product.tag && (
                  <div className="absolute top-6 left-6 px-3 py-1.5 bg-primary/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                    {product.tag}
                  </div>
                )}

                <div className="absolute top-6 right-6 flex flex-col gap-2 items-end">
                  <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg">
                    {product.tech}
                  </div>
                  {!product.available && (
                    <div className="px-3 py-1.5 bg-white/85 text-slate-900 text-[9px] font-bold uppercase tracking-widest rounded-lg">
                      {t.onRequest}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{product.name}</h3>
                  <div className="text-right">
                    <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t.startFrom}</span>
                    <span className="text-primary font-bold text-lg">€{product.price}</span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 mb-4">
                  {product.description}
                </p>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
                  <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse"></div>
                  {product.material}
                </div>
                <div className="mt-5 pt-5 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  <span>{product.leadTime}</span>
                  <span className="inline-flex items-center gap-1 text-primary font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    {product.available ? t.ready : t.custom}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="mt-10 rounded-[2rem] border border-dashed border-black/10 dark:border-white/10 bg-white/70 dark:bg-card-dark/50 p-12 text-center">
            <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-3">{t.emptyTitle}</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{t.emptyDesc}</p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20"
            >
              <RotateCcw className="w-4 h-4" />
              {t.reset}
            </button>
          </div>
        )}

        <div className="mt-20 text-center">
          <a 
            href="#cta" 
            className="inline-flex items-center gap-3 px-10 py-5 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-white/10 transition-all group shadow-sm hover:shadow-xl"
          >
            {t.catalogCta}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform text-primary" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Products;
