import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { trackAppEvent } from '../lib/analytics';
import { PurchaseReveal } from '../components/ui/PurchaseReveal';

export function Success() {
  const [downloadLinks, setDownloadLinks] = useState<Array<{ title: string; url: string; coverUrl?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { cart, clearCart } = useCart();
  const { savePurchasedGuides } = useFavorites();

  useEffect(() => {
    if (cart.length > 0) {
      savePurchasedGuides(cart);
      trackAppEvent('checkout_completed', {
        items: cart.map((item) => item.id),
        value: cart.reduce((sum, item) => sum + item.price, 0) / 100,
        currency: 'EUR',
      });
      clearCart();
    }

    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (!sessionId) {
      setError('No session ID found.');
      setLoading(false);
      return;
    }

    let attempts = 0;
    const maxAttempts = 10;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`/api/download-links?session_id=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.downloadLinks && data.downloadLinks.length > 0) {
            const links = data.downloadLinks.map((l: any) => ({
              title: l.title,
              url: l.url,
              coverUrl: l.coverUrl || '/placeholder-guide.jpg',
            }));
            setDownloadLinks(links);
            setLoading(false);
            clearInterval(interval);

            // Pinterest: Track Checkout conversion
            if (typeof window !== 'undefined' && (window as any).pintrk) {
              const totalValue = links.reduce((sum: number) => sum + 4.99, 0);
              (window as any).pintrk('track', 'checkout', {
                event_id: sessionId,
                value: totalValue,
                order_quantity: links.length,
                currency: 'EUR',
                order_id: sessionId,
                line_items: links.map((l: any) => ({
                  product_name: l.title,
                  product_id: l.title.toLowerCase().replace(/\s+/g, '-'),
                  product_category: 'Digital Guide',
                  product_price: 4.99,
                  product_quantity: 1,
                  product_brand: 'Nolea',
                })),
              });
            }
          }
        }
      } catch (e) {
        console.error('Polling error:', e);
      }
      if (attempts >= maxAttempts) {
        setError('Download links could not be loaded. Please contact support.');
        setLoading(false);
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#FAF9F6] min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full bg-white rounded-[2.5rem] p-8 md:p-12 text-center shadow-xl border border-[#E5E2D9]"
      >
        <h1 className="text-3xl md:text-4xl font-serif italic text-[#1F1D1A] mb-4">Thank you for your purchase!</h1>
        <p className="text-[#5C5748] mb-10 leading-relaxed font-serif italic text-base md:text-lg">
          Your digital products are ready. We have sent you a confirmation email.
        </p>

        {loading && !error && (
          <div className="bg-[#F2EFE9] rounded-2xl p-8 mb-10 border border-[#E5E2D9]">
            <PurchaseReveal
              title="Your Guide"
              coverUrl="/placeholder-guide.jpg"
              downloadUrl="#"
            />
          </div>
        )}

        {error && (
          <div className="bg-[#F2EFE9] rounded-2xl p-8 mb-10 border border-[#E5E2D9]">
            <p className="text-sm text-red-600 uppercase tracking-[0.2em] font-bold">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && downloadLinks.length > 0 && (
          <div className="flex flex-col gap-6 mb-10">
            {downloadLinks.map((link, idx) => (
              <PurchaseReveal
                key={idx}
                title={link.title}
                coverUrl={link.coverUrl || '/placeholder-guide.jpg'}
                downloadUrl={link.url}
                onDownload={() => trackAppEvent('guide_downloaded', { title: link.title })}
              />
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link to="/guides" className="text-[#1F1D1A] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:gap-4 transition-all py-2">
            Meine Guides <ArrowRight size={18} />
          </Link>
          <Link to="/shop" className="text-[#7A8F4E] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:gap-4 transition-all py-2">
            Continue Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
