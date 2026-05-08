
import React, { useState, useMemo } from 'react';
import { Search, ShoppingBag, ArrowRight, ExternalLink, X } from 'lucide-react';
import { LanguageCode } from '../App';
import { translations } from '../translations';

interface ProductItem {
  id: number;
  name: string;
  category: 'mech' | 'design' | 'mini' | 'arch';
  image: string;
  material: string;
  price: string;
  tag?: string;
  tech: 'FDM' | 'SLA';
}

const Products: React.FC<{ language: LanguageCode }> = ({ language }) => {
  const t = translations[language].products;
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc'>('featured');
  const locale = language === 'it' ? 'it-IT' : 'en-US';

  const productData: ProductItem[] = [
    {
      id: 1,
      name: language === 'it' ? 'Ingranaggio Industriale' : 'Industrial Gear',
      category: 'mech',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop',
      material: 'Nylon CF',
      price: '45.00',
      tag: 'Best Seller',
      tech: 'FDM'
    },
    {
      id: 2,
      name: language === 'it' ? 'Vaso Organico' : 'Organic Vase',
      category: 'design',
      image: 'https://images.unsplash.com/photo-1549484482-f7613768849c?q=80&w=800&auto=format&fit=crop',
      material: 'PLA Silk',
      price: '29.00',
      tag: 'Eco',
      tech: 'FDM'
    },
    {
      id: 3,
      name: language === 'it' ? 'Miniatura Guerriero' : 'Warrior Miniature',
      category: 'mini',
      image: 'https://images.unsplash.com/photo-1628155232283-c05171789c62?q=80&w=600&auto=format&fit=crop',
      material: 'Grey Resin 8K',
      price: '15.00',
      tag: 'High-Res',
      tech: 'SLA'
    },
    {
      id: 4,
      name: language === 'it' ? 'Modello Architettonico' : 'Architectural Model',
      category: 'arch',
      image: 'https://images.unsplash.com/photo-1503387762-592dee58c160?q=80&w=600&auto=format&fit=crop',
      material: 'White PLA',
      price: '120.00',
      tech: 'FDM'
    },
    {
      id: 5,
      name: language === 'it' ? 'Staffa Rinforzata' : 'Reinforced Bracket',
      category: 'mech',
      image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=600&auto=format&fit=crop',
      material: 'PETG Carbon',
      price: '18.00',
      tech: 'FDM'
    },
    {
      id: 6,
      name: language === 'it' ? 'Lampada Esagonale' : 'Hex Lamp',
      category: 'design',
      image: 'https://images.unsplash.com/photo-1550684848-86a5d8727436?q=80&w=600&auto=format&fit=crop',
      material: 'Translucent Resin',
      price: '85.00',
      tag: 'New',
      tech: 'SLA'
    }
  ];

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filtered = productData.filter((product) => {
      const matchesCategory = activeFilter === 'all' || product.category === activeFilter;
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.material.toLowerCase().includes(normalizedSearch) ||
        product.tech.toLowerCase().includes(normalizedSearch) ||
        String(product.tag || '').toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });

    const sorted = [...filtered];
    if (sortBy === 'price-asc') sorted.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortBy === 'price-desc') sorted.sort((a, b) => Number(b.price) - Number(a.price));
    if (sortBy === 'title-asc') sorted.sort((a, b) => a.name.localeCompare(b.name, locale, { sensitivity: 'base' }));
    if (sortBy === 'title-desc') sorted.sort((a, b) => b.name.localeCompare(a.name, locale, { sensitivity: 'base' }));

    return sorted;
  }, [activeFilter, locale, productData, searchTerm, sortBy]);

  const hasActiveControls = activeFilter !== 'all' || searchTerm.trim().length > 0 || sortBy !== 'featured';
  const formatPrice = (price: string) =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
    }).format(Number(price));

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
          </div>

          <div className="w-full md:w-auto flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative min-w-0 sm:min-w-[260px]">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-11 pr-11 py-3 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    aria-label={t.clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="featured">{t.sort.featured}</option>
                <option value="price-asc">{t.sort.priceAsc}</option>
                <option value="price-desc">{t.sort.priceDesc}</option>
                <option value="title-asc">{t.sort.titleAsc}</option>
                <option value="title-desc">{t.sort.titleDesc}</option>
              </select>

              {hasActiveControls && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter('all');
                    setSearchTerm('');
                    setSortBy('featured');
                  }}
                  className="px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-black/5 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
                >
                  {t.reset}
                </button>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span>{t.results(filteredProducts.length)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
            {(Object.entries(t.filters) as [string, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  activeFilter === key 
                    ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                    : 'bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 border border-black/5 dark:border-white/5'
                }`}
              >
                {label}
              </button>
            ))}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="group relative bg-white dark:bg-card-dark rounded-[2.5rem] border border-black/5 dark:border-white/5 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
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

                  <div className="absolute top-6 right-6 px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg">
                    {product.tech}
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{product.name}</h3>
                    <div className="text-right shrink-0">
                      <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t.startFrom}</span>
                      <span className="text-primary font-bold text-lg">{formatPrice(product.price)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
                    <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse"></div>
                    {product.material}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] px-8 py-16 text-center">
            <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-3">{t.noResultsTitle}</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">{t.noResultsDesc}</p>
          </div>
        )}

        <div className="mt-20 text-center">
          <a 
            href="#products" 
            className="inline-flex items-center gap-3 px-10 py-5 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-white/10 transition-all group shadow-sm hover:shadow-xl"
          >
            {t.browseCatalog}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform text-primary" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Products;
