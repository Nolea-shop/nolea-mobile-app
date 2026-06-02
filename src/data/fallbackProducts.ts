import { Recipe } from '../types';

const now = new Date().toISOString();

export const fallbackProducts: Recipe[] = [
  {
    id: 'nolea-reset-guide',
    title: 'The Gentle Reset Guide',
    description:
      'A calm 7-day PDF guide for better routines, clean meals, and a lighter everyday rhythm.',
    price: 1900,
    imageUrl:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
    category: 'Wellness',
    createdAt: now,
    isOnline: true,
  },
  {
    id: 'nolea-home-rituals',
    title: 'Home Rituals for Slow Living',
    description:
      'Simple room-by-room rituals for a more intentional home, from morning light to evening reset.',
    price: 2400,
    imageUrl:
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80',
    category: 'Lifestyle',
    createdAt: now,
    isOnline: true,
  },
  {
    id: 'nolea-nutrition-starter',
    title: 'Nutrition Starter Notes',
    description:
      'A concise nutrition PDF with grocery lists, plate templates, and meal-prep decisions that reduce friction.',
    price: 1700,
    imageUrl:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    category: 'Nutrition',
    createdAt: now,
    isOnline: true,
  },
  {
    id: 'nolea-focus-systems',
    title: 'Focus Systems Workbook',
    description:
      'A practical workbook for weekly planning, attention hygiene, and turning ideas into finished work.',
    price: 2200,
    imageUrl:
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    category: 'Productivity',
    createdAt: now,
    isOnline: true,
  },
];
