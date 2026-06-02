import React, { useEffect, useState } from 'react';
import { Heart, Search } from 'lucide-react';
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
          <div className="bg-white border border-[#E5E2D9] rounded-[2rem] p-8 md:p-12 text-center shadow-sm">
            <div className="w-20 h-20 rounded-full bg-[#F2EFE9] text-[#7A8F4E] grid place-items-center mx-auto mb-6">
              <Heart size={34} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-serif italic text-[#1F1D1A] mb-3">Noch nichts gespeichert</h2>
            <p className="text-[#5C5748] max-w-md mx-auto mb-7">
              Tippe auf das Herz an einem Produkt, damit du es spaeter schneller wiederfindest.
            </p>
            <Link to="/shop" className="inline-flex items-center gap-2 bg-[#1F1D1A] text-white px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider btn-press">
              <Search size={15} />
              Shop durchsuchen
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
