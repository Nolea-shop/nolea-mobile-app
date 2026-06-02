import React, { useEffect, useState } from 'react';
import { Heart, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { RecipeCard } from '../components/RecipeCard';
import { useFavorites } from '../context/FavoritesContext';
import { getAllRecipes } from '../services/recipeService';
import { Recipe } from '../types';

export function Favorites() {
  const { favoriteIds } = useFavorites();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    getAllRecipes().then(setRecipes);
  }, []);

  const favorites = recipes.filter((recipe) => favoriteIds.includes(recipe.id));

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-8 md:py-14">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <header className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7A8F4E] mb-3">Saved</p>
          <h1 className="text-3xl md:text-5xl font-serif italic text-[#1F1D1A] mb-4">Favoriten</h1>
          <p className="text-[#5C5748] max-w-2xl leading-relaxed">
            Speichere Guides, die du spaeter kaufen oder vergleichen willst.
          </p>
        </header>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {favorites.map((recipe) => (
              <div key={recipe.id}>
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-[#E5E2D9] rounded-[2rem] p-8 md:p-12 text-center shadow-sm max-w-md mx-auto"
          >
            {/* Illustration */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="relative mx-auto w-24 h-24 mb-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#7A8F4E]/10 to-[#E5E2D9]/30 rounded-full blur-xl" />
              <div className="relative w-full h-full bg-gradient-to-br from-[#F2EFE9] to-[#E5E2D9] rounded-full flex items-center justify-center border border-[#E5E2D9] shadow-sm">
                <Heart size={34} strokeWidth={1.5} className="text-[#7A8F4E]" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-400/20 rounded-full"
              />
            </motion.div>

            {/* Content */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-serif italic text-[#1F1D1A] mb-3"
            >
              Noch nichts gespeichert
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[#5C5748] max-w-md mx-auto mb-7 text-sm leading-relaxed"
            >
              Tippe auf das Herz an einem Produkt, damit du es spaeter schneller wiederfindest.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link to="/shop" className="inline-flex items-center gap-2 bg-[#1F1D1A] text-white px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider btn-press hover:bg-black transition-all shadow-md">
                <Search size={15} />
                Shop durchsuchen
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
