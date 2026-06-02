import React, { useEffect, useState } from 'react';
import { RecipeCard } from '../components/RecipeCard';
import { getAllRecipes } from '../services/recipeService';
import { Recipe } from '../types';
import { ArrowUpDown, Grid, LayoutList, Search as SearchIcon, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCategory } from '../context/CategoryContext';
import { haptics } from '../lib/native';

// Category color system — each category has its own identity
const CATEGORY_COLORS: Record<string, {
  bg: string;
  bgLight: string;
  bgUltraLight: string;
  text: string;
  border: string;
  gradient: string;
  accent: string;
}> = {
  'All': {
    bg: '#1F1D1A',
    bgLight: '#F2EFE9',
    bgUltraLight: '#FAF9F6',
    text: '#1F1D1A',
    border: '#E5E2D9',
    gradient: 'from-[#F2EFE9] to-[#FAF9F6]',
    accent: '#7A8F4E',
  },
  'Tech': {
    bg: '#2563EB',
    bgLight: '#DBEAFE',
    bgUltraLight: '#EFF6FF',
    text: '#1E3A5F',
    border: '#BFDBFE',
    gradient: 'from-[#DBEAFE] to-[#EFF6FF]',
    accent: '#2563EB',
  },
  'Fitness': {
    bg: '#DC2626',
    bgLight: '#FEE2E2',
    bgUltraLight: '#FEF2F2',
    text: '#7F1D1D',
    border: '#FECACA',
    gradient: 'from-[#FEE2E2] to-[#FEF2F2]',
    accent: '#DC2626',
  },
  'Nutrition': {
    bg: '#7A8F4E',
    bgLight: '#E8F0D8',
    bgUltraLight: '#F4F8EE',
    text: '#3D4F1F',
    border: '#D4E0C0',
    gradient: 'from-[#E8F0D8] to-[#F4F8EE]',
    accent: '#7A8F4E',
  },
  'Finance': {
    bg: '#D4A03D',
    bgLight: '#FEF3C7',
    bgUltraLight: '#FFFBEB',
    text: '#78350F',
    border: '#FDE68A',
    gradient: 'from-[#FEF3C7] to-[#FFFBEB]',
    accent: '#D4A03D',
  },
  'Lifestyle': {
    bg: '#9333EA',
    bgLight: '#F3E8FF',
    bgUltraLight: '#FAF5FF',
    text: '#581C87',
    border: '#E9D5FF',
    gradient: 'from-[#F3E8FF] to-[#FAF5FF]',
    accent: '#9333EA',
  },
  'Wellness': {
    bg: '#0891B2',
    bgLight: '#CFFAFE',
    bgUltraLight: '#ECFEFF',
    text: '#164E63',
    border: '#A5F3FC',
    gradient: 'from-[#CFFAFE] to-[#ECFEFF]',
    accent: '#0891B2',
  },
  'Business': {
    bg: '#1E40AF',
    bgLight: '#DBEAFE',
    bgUltraLight: '#EFF6FF',
    text: '#1E3A5F',
    border: '#BFDBFE',
    gradient: 'from-[#DBEAFE] to-[#EFF6FF]',
    accent: '#1E40AF',
  },
  'Productivity': {
    bg: '#EA580C',
    bgLight: '#FFEDD5',
    bgUltraLight: '#FFF7ED',
    text: '#7C2D12',
    border: '#FED7AA',
    gradient: 'from-[#FFEDD5] to-[#FFF7ED]',
    accent: '#EA580C',
  },
  'Mindset': {
    bg: '#DB2777',
    bgLight: '#FCE7F3',
    bgUltraLight: '#FDF2F8',
    text: '#831843',
    border: '#FBCFE8',
    gradient: 'from-[#FCE7F3] to-[#FDF2F8]',
    accent: '#DB2777',
  },
};

const CATEGORIES = Object.keys(CATEGORY_COLORS);

// Hauptkategorien: sichtbar in der Pill-Leiste (Top 4 Nischen)
// Weitere Kategorien: gruppiert im "Mehr"-Bottom-Sheet
const MAIN_CATEGORIES = ['All', 'Tech', 'Fitness', 'Nutrition', 'Finance'];
const MORE_CATEGORIES = CATEGORIES.filter((c) => !MAIN_CATEGORIES.includes(c));

export function Shop() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { setActiveCategory } = useCategory();

  // Beim Kategorie-Wechsel: leichtes haptisches Feedback
  const handleCategoryChange = (cat: string) => {
    haptics.impact('light');
    setCategory(cat);
  };

  // Beim Öffnen des "Mehr"-Sheets: mittleres haptisches Feedback
  const openMore = () => {
    haptics.impact('medium');
    setIsMoreOpen(true);
  };
  const closeMore = () => {
    haptics.impact('light');
    setIsMoreOpen(false);
  };

  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS['All'];

  // Sync category with global context for nav/footer colors
  useEffect(() => {
    setActiveCategory(category, colors);
  }, [category, colors, setActiveCategory]);

  useEffect(() => {
    getAllRecipes().then(setRecipes).finally(() => setLoading(false));
  }, []);

  const filteredRecipes = recipes.filter(
    (r) =>
      r.isOnline &&
      (category === 'All' || r.category.toLowerCase().includes(category.toLowerCase())) &&
      (r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div
      className="min-h-screen py-10 md:py-16 transition-colors duration-700 ease-in-out"
      style={{ backgroundColor: colors.bgUltraLight }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Filter & Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-6 mb-8 pb-6 transition-colors duration-700"
          style={{ borderBottomColor: colors.border, borderBottomWidth: '1px' }}
        >
          {/* Search Row */}
          <div className="relative w-full max-w-2xl">
            <SearchIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-700"
              size={18}
              style={{ color: colors.text, opacity: 0.5 }}
            />
            <input
              type="text"
              placeholder={`Find your ${category === 'All' ? 'guide' : category.toLowerCase()} guide...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 transition-all duration-700 font-sans"
              style={{
                backgroundColor: '#FFFFFF',
                border: `1px solid ${colors.border}`,
                color: colors.text,
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 px-2 text-xs font-bold uppercase tracking-widest transition-colors duration-700"
                style={{ color: colors.text, opacity: 0.6 }}
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start lg:items-center justify-between w-full">
            {/* Category Pills — Top 4 + Mehr Button */}
            <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">
              {MAIN_CATEGORIES.map((cat) => {
                const catColors = CATEGORY_COLORS[cat];
                const isActive = category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className="relative px-4 sm:px-5 py-2.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors duration-300 btn-press touch-manipulation overflow-hidden"
                    style={{
                      color: isActive ? '#FFFFFF' : colors.text,
                      opacity: isActive ? 1 : 0.7,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.opacity = '0.7';
                    }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeCategoryPill"
                        className="absolute inset-0 rounded-full -z-0"
                        style={{ backgroundColor: catColors.bg }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                );
              })}

              {/* "Mehr" Button — öffnet Bottom-Sheet mit den restlichen Kategorien */}
              <button
                onClick={openMore}
                aria-label={`Mehr Kategorien (${MORE_CATEGORIES.length})`}
                aria-expanded={isMoreOpen}
                className="relative flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 btn-press touch-manipulation"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  color: colors.text,
                  border: '1px solid rgba(229, 222, 217, 0.6)',
                }}
              >
                Mehr
                <motion.span
                  animate={{ rotate: isMoreOpen ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex"
                >
                  <ChevronDown size={13} strokeWidth={2.5} />
                </motion.span>
                {/* Badge: zeigt Anzahl der versteckten Kategorien */}
                {MORE_CATEGORIES.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm pointer-events-none"
                    style={{ backgroundColor: colors.accent }}
                  >
                    {MORE_CATEGORIES.length}
                  </motion.span>
                )}
              </button>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <ArrowUpDown size={14} className="transition-colors duration-700" style={{ color: colors.text, opacity: 0.5 }} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 cursor-pointer transition-all duration-700"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                  }}
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>

              {/* View Mode Toggle (Desktop only) */}
              <div className="hidden md:flex items-center gap-1 rounded-xl p-1 transition-colors duration-700" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${colors.border}` }}>
                <button
                  onClick={() => setViewMode('grid')}
                  className="p-2 rounded-lg transition-all duration-500"
                  style={
                    viewMode === 'grid'
                      ? { backgroundColor: colors.bg, color: '#FFFFFF' }
                      : { color: colors.text, opacity: 0.6 }
                  }
                  title="Grid view"
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className="p-2 rounded-lg transition-all duration-500"
                  style={
                    viewMode === 'list'
                      ? { backgroundColor: colors.bg, color: '#FFFFFF' }
                      : { color: colors.text, opacity: 0.6 }
                  }
                  title="List view"
                >
                  <LayoutList size={16} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── "Mehr Kategorien" Bottom-Sheet ───────────────────────────── */}
        <AnimatePresence>
          {isMoreOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={closeMore}
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                aria-hidden
              />
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Alle Kategorien"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl shadow-2xl overflow-hidden pb-[max(env(safe-area-inset-bottom),1rem)]"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(28px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                  borderTop: '1px solid rgba(229, 222, 217, 0.5)',
                }}
              >
                {/* Drag-Handle */}
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 rounded-full" style={{ backgroundColor: colors.border }} />
                </div>

                <div className="px-6 pt-2 pb-6">
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <h3 className="text-lg font-serif italic" style={{ color: colors.text }}>
                        Weitere Kategorien
                      </h3>
                      <p className="text-xs mt-0.5" style={{ color: colors.text, opacity: 0.55 }}>
                        {MORE_CATEGORIES.length} zusätzliche Nischen
                      </p>
                    </div>
                    <button
                      onClick={closeMore}
                      aria-label="Schließen"
                      className="p-2 rounded-full active:scale-90 transition-transform"
                      style={{ backgroundColor: colors.bgLight }}
                    >
                      <X size={18} style={{ color: colors.text }} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {MORE_CATEGORIES.map((cat) => {
                      const catColors = CATEGORY_COLORS[cat];
                      const isActive = category === cat;
                      return (
                        <motion.button
                          key={cat}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            handleCategoryChange(cat);
                            closeMore();
                          }}
                          className="relative px-5 py-3 rounded-2xl text-sm font-medium transition-all overflow-hidden"
                          style={{
                            color: isActive ? '#FFFFFF' : colors.text,
                            backgroundColor: isActive ? catColors.bg : colors.bgLight,
                          }}
                        >
                          {isActive && (
                            <motion.span
                              layoutId="activeCategoryPill"
                              className="absolute inset-0 rounded-2xl -z-0"
                              style={{ backgroundColor: catColors.bg }}
                              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            />
                          )}
                          <span className="relative z-10">{cat}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl animate-pulse transition-colors duration-700"
                style={{ backgroundColor: colors.bgLight }}
              />
            ))}
          </div>
        ) : sortedRecipes.length > 0 ? (
          <div
            className={`grid gap-4 md:gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            }`}
          >
            {sortedRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <RecipeCard recipe={recipe} categoryColor={CATEGORY_COLORS[recipe.category] || CATEGORY_COLORS['All']} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 md:py-24 rounded-2xl md:rounded-[2rem] border transition-colors duration-700"
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: colors.border,
            }}
          >
            <SearchIcon size={48} className="mx-auto mb-4 transition-colors duration-700" strokeWidth={1.5} style={{ color: colors.border }} />
            <h2 className="text-xl md:text-2xl font-serif italic mb-2 transition-colors duration-700" style={{ color: colors.text }}>
              No products found
            </h2>
            <p className="text-sm mb-6 transition-colors duration-700" style={{ color: colors.text, opacity: 0.7 }}>
              Try adjusting your search or filters to find what you are looking for.
            </p>
            <button
              onClick={() => {
                setCategory('All');
                setSearchTerm('');
              }}
              className="btn-press inline-flex items-center gap-2 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-500 hover:opacity-90"
              style={{ backgroundColor: colors.accent }}
            >
              Show All Categories
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
