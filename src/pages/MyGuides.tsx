import React from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, RefreshCw, ShieldCheck, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { useFavorites } from '../context/FavoritesContext';
import { trackAppEvent } from '../lib/analytics';

export function MyGuides() {
  const { purchasedGuides } = useFavorites();

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-8 md:py-14">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <header className="mb-8 md:mb-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7A8F4E] mb-3">Library</p>
          <h1 className="text-3xl md:text-5xl font-serif italic text-[#1F1D1A] mb-4">Meine Guides</h1>
          <p className="text-sm md:text-base text-[#5C5748] max-w-2xl leading-relaxed">
            Hier landen deine gekauften digitalen Guides. Downloads werden serverseitig gegen deine Bestellung geprueft und als 48h Links neu erstellt.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {[
            { icon: ShieldCheck, title: 'Ownership Check', text: 'Downloads nur fuer deine gekauften Guides.' },
            { icon: RefreshCw, title: '48h Tokens', text: 'Links koennen nach Login neu generiert werden.' },
            { icon: FileText, title: 'PDF Library', text: 'Alle Guides bleiben mobil schnell auffindbar.' },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-[#E5E2D9] rounded-2xl p-4 shadow-sm">
              <item.icon size={20} className="text-[#7A8F4E] mb-3" strokeWidth={1.5} />
              <h2 className="font-serif italic text-lg text-[#1F1D1A]">{item.title}</h2>
              <p className="text-sm text-[#5C5748] leading-relaxed">{item.text}</p>
            </div>
          ))}
        </section>

        {purchasedGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {purchasedGuides.map((guide, index) => (
              <motion.article
                key={guide.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-[#E5E2D9] rounded-2xl p-4 shadow-sm flex gap-4"
              >
                <img src={guide.imageUrl} alt={guide.title} className="w-20 h-24 rounded-xl object-cover bg-[#F2EFE9]" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#7A8F4E] mb-1">{guide.category}</p>
                  <h2 className="font-serif italic text-xl text-[#1F1D1A] truncate">{guide.title}</h2>
                  <p className="text-sm text-[#5C5748] line-clamp-2 mt-1">{guide.description}</p>
                  <button
                    onClick={() => {
                      trackAppEvent('guide_downloaded', { productId: guide.id, productName: guide.title, prototypeLibrary: true });
                      alert('In der echten App wird jetzt ein serverseitig gepruefter 48h Download-Link erzeugt.');
                    }}
                    className="mt-4 inline-flex items-center gap-2 bg-[#1F1D1A] text-white px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider btn-press"
                  >
                    <Download size={15} />
                    Download Link
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#E5E2D9] rounded-[2rem] p-8 md:p-12 text-center shadow-sm">
            <div className="w-20 h-20 rounded-full bg-[#F2EFE9] text-[#7A8F4E] grid place-items-center mx-auto mb-6">
              <ShoppingBag size={34} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-serif italic text-[#1F1D1A] mb-3">Noch keine Guides gespeichert</h2>
            <p className="text-[#5C5748] max-w-md mx-auto mb-7">
              Nach einem erfolgreichen Kauf werden deine Guides hier gespeichert. Gastkauf bleibt trotzdem moeglich.
            </p>
            <Link to="/shop" className="inline-flex items-center justify-center bg-[#7A8F4E] text-white px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider btn-press">
              Guides shoppen
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
