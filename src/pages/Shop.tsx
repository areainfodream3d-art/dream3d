import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { isShopifyConfigured, shopify } from '../lib/shopify';
import { ProductCard } from '../components/shop/ProductCard';
import { enrichProductWithMockMedia } from '../data/mockData';
import { useTranslation } from 'react-i18next';

export const Shop = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<{ type: 'all' | 'tag' | 'collection'; value: string }>({
    type: 'all',
    value: 'all',
  });
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const normalizeTags = (product: any): string[] => {
    const tags = product?.tags;
    if (!tags) return [];
    if (Array.isArray(tags)) return tags.filter(Boolean);
    if (typeof tags === 'string') return tags.split(',').map((s) => s.trim()).filter(Boolean);
    return [];
  };

  const normalizeCollections = (product: any): { title: string; handle: string }[] => {
    const collections = product?.collections;
    const edges = collections?.edges;
    if (!edges || !Array.isArray(edges)) return [];
    return edges
      .map((e: any) => e?.node)
      .filter(Boolean)
      .map((n: any) => ({
        title: String(n.title || '').trim(),
        handle: String(n.handle || '').trim(),
      }))
      .filter((c: any) => c.title && c.handle);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        if (!isShopifyConfigured) {
          setProducts([]);
          return;
        }
        // Pass current language to Shopify
        const fetchedProducts = await shopify.products.fetchAll(i18n.language);

        const enrichedProducts = (fetchedProducts || []).map(enrichProductWithMockMedia);
        setProducts(enrichedProducts);
      } catch (error) {
        console.error("Failed to fetch products", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [i18n.language]);

  const availableTags = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const p of products) {
      for (const tag of normalizeTags(p)) {
        const normalized = tag.trim();
        if (!normalized) continue;
        const key = normalized.toLowerCase();
        if (!map.has(key)) map.set(key, normalized);
      }
    }
    return Array.from(map.values()).sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }));
  }, [products]);

  const availableCollections = React.useMemo(() => {
    const map = new Map<string, { title: string; titleKey: string }>();
    for (const p of products) {
      for (const c of normalizeCollections(p)) {
        const title = String(c.title || '').trim();
        if (!title) continue;
        const titleKey = title.toLowerCase();
        if (!map.has(titleKey)) map.set(titleKey, { title, titleKey });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.title.localeCompare(b.title, 'it', { sensitivity: 'base' }));
  }, [products]);

  const displayTags = React.useMemo(() => {
    const collectionTitleKeys = new Set(availableCollections.map((c) => c.titleKey));
    return availableTags.filter((tag) => !collectionTitleKeys.has(tag.toLowerCase()));
  }, [availableTags, availableCollections]);

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const s = searchTerm.toLowerCase().trim();
    const title = String(product.title || product.name || '').toLowerCase();
    const tags = normalizeTags(product).map((x) => x.toLowerCase());
    const collections = normalizeCollections(product).map((c) => ({ title: c.title.toLowerCase(), handle: c.handle.toLowerCase() }));
    const matchesSearch =
      !s ||
      title.includes(s) ||
      tags.some((t) => t.includes(s)) ||
      collections.some((c) => c.title.includes(s) || c.handle.includes(s));
    
    if (!matchesSearch) return false;

    if (selectedFilter.type === 'all') return true;

    if (selectedFilter.type === 'tag') {
      const target = selectedFilter.value.toLowerCase();
      const matchesTag = tags.some((t) => t === target);
      const matchesType = String(product.productType || '').toLowerCase() === target;
      return matchesTag || matchesType;
    }

    const target = selectedFilter.value.toLowerCase();
    return collections.some((c) => c.title === target);
  });

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100">
      {/* Hero Section Compact */}
      <div className="relative pt-24 pb-8 bg-gradient-to-b from-black/50 to-dark-bg overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1633412802994-5c058f151b66?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 blur-sm pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-left"
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-2">
                Dream3D <span className="text-neon-orange">Shop</span>
              </h1>
              <p className="text-gray-400 max-w-lg text-sm md:text-base">
                {t('shop.subtitle')}
              </p>
            </motion.div>

            {/* Compact Search & Filter */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full md:w-auto flex flex-col sm:flex-row gap-3 bg-dark-surface/80 backdrop-blur-md p-3 rounded-xl border border-white/5 shadow-lg"
            >
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                    type="text"
                    placeholder={t('shop.search_placeholder')}
                    className="w-full bg-black/40 border border-gray-700/50 rounded-lg pl-9 pr-3 py-2 text-sm focus:border-neon-orange focus:ring-1 focus:ring-neon-orange outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setSelectedFilter({ type: 'all', value: 'all' })}
                        className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                        selectedFilter.type === 'all'
                            ? 'bg-neon-orange text-black'
                            : 'bg-black/40 text-gray-400 hover:text-white border border-gray-700/50'
                        }`}
                    >
                        {t('shop.filter_all')}
                    </button>

                    {availableCollections.map((c) => (
                    <button
                        key={`col-${c.titleKey}`}
                        onClick={() => setSelectedFilter({ type: 'collection', value: c.titleKey })}
                        className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                        selectedFilter.type === 'collection' && selectedFilter.value.toLowerCase() === c.titleKey.toLowerCase()
                            ? 'bg-neon-orange text-black'
                            : 'bg-black/40 text-gray-400 hover:text-white border border-gray-700/50'
                        }`}
                    >
                        {c.title}
                    </button>
                    ))}

                    {displayTags.map((tag) => (
                    <button
                        key={`tag-${tag}`}
                        onClick={() => setSelectedFilter({ type: 'tag', value: tag })}
                        className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                        selectedFilter.type === 'tag' && selectedFilter.value.toLowerCase() === tag.toLowerCase()
                            ? 'bg-neon-orange text-black'
                            : 'bg-black/40 text-gray-400 hover:text-white border border-gray-700/50'
                        }`}
                    >
                        {tag}
                    </button>
                    ))}
                </div>
            </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-dark-surface rounded-2xl h-[400px] border border-white/5"></div>
            ))}
          </div>
        ) : !isShopifyConfigured ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-white/5 p-8 rounded-full mb-6">
              <ShoppingBag className="w-16 h-16 text-gray-600" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Shop non configurato
            </h2>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
              Il catalogo Shopify non è disponibile in questo momento.
            </p>
            <Button variant="primary" onClick={() => window.location.href = '/commissioni'}>
              {t('shop.request_commission')}
            </Button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-white/5 p-8 rounded-full mb-6">
              <ShoppingBag className="w-16 h-16 text-gray-600" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {searchTerm ? t('shop.no_products') : t('shop.coming_soon')}
            </h2>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
              {searchTerm 
                ? t('shop.no_products_desc')
                : t('shop.coming_soon_desc')}
            </p>
            {!searchTerm && (
              <Button variant="primary" onClick={() => window.location.href = '/commissioni'}>
                {t('shop.request_commission')}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
