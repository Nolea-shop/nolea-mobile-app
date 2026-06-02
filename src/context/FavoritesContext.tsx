import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Recipe } from '../types';
import { trackAppEvent } from '../lib/analytics';

const FAVORITES_KEY = 'nolea-favorites';
const PURCHASED_KEY = 'nolea-purchased-guides';

interface FavoritesContextType {
  favoriteIds: string[];
  purchasedGuides: Recipe[];
  isFavorite: (recipeId: string) => boolean;
  toggleFavorite: (recipe: Recipe) => void;
  savePurchasedGuides: (recipes: Recipe[]) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '');
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => readJson<string[]>(FAVORITES_KEY, []));
  const [purchasedGuides, setPurchasedGuides] = useState<Recipe[]>(() => readJson<Recipe[]>(PURCHASED_KEY, []));

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  useEffect(() => {
    localStorage.setItem(PURCHASED_KEY, JSON.stringify(purchasedGuides));
  }, [purchasedGuides]);

  const value = useMemo<FavoritesContextType>(() => ({
    favoriteIds,
    purchasedGuides,
    isFavorite: (recipeId: string) => favoriteIds.includes(recipeId),
    toggleFavorite: (recipe: Recipe) => {
      setFavoriteIds((current) => {
        if (current.includes(recipe.id)) {
          return current.filter((id) => id !== recipe.id);
        }
        trackAppEvent('favorite_saved', {
          productId: recipe.id,
          productName: recipe.title,
          category: recipe.category,
        });
        return [...current, recipe.id];
      });
    },
    savePurchasedGuides: (recipes: Recipe[]) => {
      if (recipes.length === 0) return;
      setPurchasedGuides((current) => {
        const byId = new Map(current.map((guide) => [guide.id, guide]));
        recipes.forEach((recipe) => byId.set(recipe.id, recipe));
        return Array.from(byId.values());
      });
    },
  }), [favoriteIds, purchasedGuides]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
}
