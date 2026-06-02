import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Heart, Leaf, Zap, Lock } from 'lucide-react';
import { RecipeCard } from '../components/RecipeCard';
import { getAllRecipes } from '../services/recipeService';
import { Recipe } from '../types';
import { Link } from 'react-router-dom';

export function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllRecipes().then(setRecipes).finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#FAF9F6]">
      {/* Hero Section — clean text-only on brand background */}
      <section className="pt-12 md:pt-20 pb-12 md:pb-24 max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
          }}
          className="relative max-w-2xl"
        >
          {/* Subtle decorative matcha dot (top-right) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block absolute -top-8 right-0 w-24 h-24 rounded-full bg-[#7A8F4E]/8 blur-2xl pointer-events-none"
            aria-hidden
          />

          {/* Content */}
          <div className="relative flex flex-col">
            <motion.span
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] mb-4 sm:mb-5 text-[#5C5748]"
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 bg-[#7A8F4E] rounded-full animate-ping opacity-60" />
                <span className="relative w-2 h-2 bg-[#7A8F4E] rounded-full" />
              </span>
              New &amp; Exclusive
            </motion.span>

            <motion.h1
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[2.25rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] font-serif italic mb-4 sm:mb-5 leading-[1.02] text-[#1F1D1A]"
            >
              Your Guide to<br />
              <span className="italic" style={{ color: '#7A8F4E' }}>Conscious Living</span>
            </motion.h1>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm md:text-lg text-[#5C5748] mb-7 md:mb-10 max-w-md font-light leading-relaxed"
            >
              Handpicked digital guides for a slower, more intentional life — crafted with care for detail and quality.
            </motion.p>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 bg-[#1F1D1A] text-white px-7 py-3.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-[0.12em] shadow-[0_4px_18px_rgba(31,29,26,0.18)] hover:shadow-[0_8px_28px_rgba(122,143,78,0.35)] hover:bg-[#7A8F4E] transition-all duration-300 btn-press touch-manipulation"
              >
                Explore Collection
                <ArrowRight size={16} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-10 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif italic text-[#1F1D1A] mb-2">
              Current Highlights
            </h2>
            <p className="text-[#5C5748] text-xs md:text-sm font-sans uppercase tracking-[0.1em]">
              Handpicked guides for you.
            </p>
          </div>
          <Link
            to="/shop"
            className="group text-[#7A8F4E] text-xs md:text-sm font-bold uppercase tracking-wider flex items-center gap-2 hover:gap-3 transition-all duration-300"
          >
            All Products <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square blur-placeholder rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {recipes.slice(0, 3).map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
              >
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Benefits */}
      <section className="bg-white py-16 md:py-24 border-y border-[#E5E2D9]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            {[
              {
                icon: Leaf,
                title: 'Expert Guidance',
                desc: 'Every guide is thoroughly researched and tested, ensuring practical, actionable advice.',
                delay: 0,
              },
              {
                icon: Zap,
                title: 'Instant Access',
                desc: 'Download your guides immediately after purchase. Start your journey right away.',
                delay: 0.1,
              },
              {
                icon: Heart,
                title: 'Curated with Care',
                desc: 'We select only the most valuable content, saving you time and delivering real results.',
                delay: 0.2,
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: item.delay }}
                className="flex flex-col items-center text-center group cursor-default"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-[#F2EFE9] text-[#7A8F4E] flex items-center justify-center rounded-2xl md:rounded-3xl mb-5 md:mb-6 group-hover:bg-[#7A8F4E] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-md">
                  <item.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-base md:text-lg font-serif italic mb-2 md:mb-3 text-[#1F1D1A]">
                  {item.title}
                </h3>
                <p className="text-[#5C5748] text-xs md:text-sm leading-relaxed max-w-[250px]">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-[#F2EFE9] to-[#FAF9F6] rounded-2xl md:rounded-[2rem] p-6 md:p-10 text-center border border-[#E5E2D9]"
        >
          <h2 className="text-xl md:text-2xl font-serif italic text-[#1F1D1A] mb-4">
            Trust is good. <span className="gradient-text">Buying is better.</span>
          </h2>
          <p className="text-[#5C5748] text-sm md:text-base max-w-lg mx-auto mb-8 leading-relaxed">
            Secure your guide today and start your conscious living journey. Digital products for instant download.
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8">
            {[
              { text: 'SSL Encrypted', icon: Lock },
              { text: 'Instant Access', icon: Zap },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-2 text-xs md:text-sm text-[#5C5748] bg-white px-4 py-2.5 rounded-full border border-[#E5E2D9]"
              >
                <item.icon size={14} className="text-[#7A8F4E]" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
          <Link
            to="/shop"
            className="btn-press inline-flex items-center gap-2 bg-[#7A8F4E] text-white px-8 md:px-10 py-3.5 md:py-4 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-[#5C6F3A] transition-all shadow-md hover:shadow-lg"
          >
            Get Your Guide <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
