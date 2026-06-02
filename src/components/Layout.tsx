import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBasket, Menu, X, Home, Store, BookOpen, Heart, UserCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCategory, DEFAULT_COLORS } from '../context/CategoryContext';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { haptics } from '../lib/native';

// motion-wrapped Link for whileTap press physics
const MotionLink = motion.create(Link);

export function Navigation() {
  const { totalItems } = useCart();
  const { favoriteIds, purchasedGuides } = useFavorites();
  const { colors } = useCategory();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartAnimate, setCartAnimate] = useState(false);

  // Badge counts for BottomTab
  const favoritesCount = favoriteIds.length;
  const purchasedGuidesCount = purchasedGuides.length;

  // Trigger animation when items change
  useEffect(() => {
    if (totalItems > 0) {
      setCartAnimate(true);
      const timer = setTimeout(() => setCartAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Handle scroll for sticky effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/shop', label: 'Shop', icon: Store },
    { to: '/guides', label: 'Meine Guides', icon: BookOpen },
    { to: '/favorites', label: 'Favoriten', icon: Heart },
    { to: '/account', label: 'Konto', icon: UserCircle },
    { to: '/cart', label: 'Cart', icon: ShoppingBasket },
  ];

  const isShopPage = location.pathname === '/shop';
  const activeColors = isShopPage ? colors : DEFAULT_COLORS;

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-700 ${
          isScrolled
            ? 'liquid-glass-strong border-b border-[#E5E2D9]/60'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden transition-transform duration-300 hover:scale-105 active:scale-95 block shrink-0"
            aria-label="Nolea — Home"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 18px rgba(122,143,78,0.25)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(31,29,26,0.06)';
            }}
            style={{ boxShadow: '0 2px 8px rgba(31,29,26,0.06)' }}
          >
            <img
              src="/nolea-logo.webp"
              alt="Nolea"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-1 lg:gap-2 items-center">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-500"
                  style={
                    isActive
                      ? {
                          color: activeColors.text,
                          backgroundColor: activeColors.bgLight,
                        }
                      : {
                          color: activeColors.text,
                          opacity: 0.6,
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = activeColors.bgLight;
                      (e.currentTarget as HTMLElement).style.opacity = '1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                      (e.currentTarget as HTMLElement).style.opacity = '0.6';
                    }
                  }}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-xl -z-10 transition-colors duration-700"
                      style={{ backgroundColor: activeColors.bgLight }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side - Cart only */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 sm:p-3 rounded-xl transition-colors duration-500 btn-press touch-target"
              style={{
                color: activeColors.text,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = activeColors.bgLight;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              }}
              aria-label={`Shopping cart with ${totalItems} items`}
            >
              <motion.div
                animate={cartAnimate ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <ShoppingBasket size={22} strokeWidth={1.5} />
              </motion.div>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm transition-colors duration-700"
                  style={{ backgroundColor: activeColors.accent }}
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </motion.span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 rounded-xl transition-colors duration-500 touch-target"
              style={{ color: activeColors.text }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = activeColors.bgLight;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              }}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm z-50 md:hidden shadow-2xl transition-colors duration-700"
              style={{ backgroundColor: activeColors.bgUltraLight }}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div
                  className="flex justify-between items-center p-6 border-b transition-colors duration-700"
                  style={{ borderColor: activeColors.border }}
                >
                  <span
                    className="text-xl font-serif font-bold italic transition-colors duration-700"
                    style={{ color: activeColors.text }}
                  >
                    Menu
                  </span>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2.5 rounded-xl touch-target transition-colors duration-500"
                    style={{ color: activeColors.text }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = activeColors.bgLight;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                    aria-label="Close menu"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-4">
                  <nav className="px-4 space-y-1">
                    {navLinks.map((link) => {
                      const isActive = location.pathname === link.to;
                      return (
                        <Link
                          key={link.to}
                          to={link.to}
                          className="flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-500 text-base font-medium"
                          style={
                            isActive
                              ? {
                                  backgroundColor: activeColors.bgLight,
                                  color: activeColors.text,
                                }
                              : {
                                  color: activeColors.text,
                                  opacity: 0.6,
                                }
                          }
                        >
                          <link.icon size={20} strokeWidth={1.5} />
                          <span>{link.label}</span>
                          {link.to === '/cart' && totalItems > 0 && (
                            <span
                              className="ml-auto text-white text-xs font-bold px-2.5 py-1 rounded-full transition-colors duration-700"
                              style={{ backgroundColor: activeColors.accent }}
                            >
                              {totalItems}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Bar — iOS 26 Floating Liquid Glass */}
      <motion.nav
        role="navigation"
        aria-label="Hauptnavigation"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="fixed left-3 right-3 z-40 md:hidden rounded-[28px] transition-colors duration-700"
        style={{
          bottom: 'max(env(safe-area-inset-bottom), 0.75rem)',
          backgroundColor: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          border: '1px solid rgba(229, 222, 217, 0.55)',
          boxShadow:
            '0 1px 0 rgba(255,255,255,0.7) inset, ' +
            '0 8px 24px -8px rgba(31, 29, 26, 0.12), ' +
            '0 24px 48px -16px rgba(31, 29, 26, 0.18)',
        }}
      >
        <div className="flex justify-around items-stretch max-w-md mx-auto px-1.5 py-1">
          <BottomTab to="/" label="Home" icon={Home} activeColors={activeColors} />
          <BottomTab to="/shop" label="Shop" icon={Store} activeColors={activeColors} />
          <BottomTab to="/guides" label="Guides" icon={BookOpen} activeColors={activeColors} badge={purchasedGuidesCount} />
          <BottomTab to="/favorites" label="Saved" icon={Heart} activeColors={activeColors} badge={favoritesCount} />
          <BottomTab to="/account" label="Konto" icon={UserCircle} activeColors={activeColors} />
        </div>
      </motion.nav>
    </>
  );
}

// ── BottomTab: Liquid Glass Tab mit 7 Premium-Verbesserungen ──────────────
//
// 1. Frosted Glass Background (auf parent, hier pro Pill lokal)
// 2. Spring Physics Press (whileTap)
// 3. Tactile Haptics (bei Tab-Wechsel)
// 4. Animated Pill Indicator (layoutId sliding pill)
// 5. Icon State Cross-Fade (Outline ↔ Filled mit AnimatePresence)
// 6. Contextual Labels (Label nur bei aktivem Tab, animiert)
// 7. Bouncing Badge (key-basiertes Scale-Pop bei Count-Änderung)
//
function BottomTab({
  to,
  label,
  icon: Icon,
  activeColors,
  badge,
}: {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string; fill?: string }>;
  activeColors: typeof DEFAULT_COLORS;
  badge?: number;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const isActive = location.pathname === to;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Tactile Haptics (Suggestion #3)
    haptics.impact('light');
  };

  return (
    <MotionLink
      to={to}
      onClick={handleClick}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      // Spring Physics Press (Suggestion #2)
      whileTap={reduceMotion ? undefined : { scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2 px-1 rounded-[20px] touch-manipulation outline-none focus-visible:ring-2 focus-visible:ring-[#7A8F4E]/40"
    >
      {/* Animated Pill Indicator (Suggestion #4) */}
      {isActive && (
        <motion.span
          layoutId="bottomTabPill"
          aria-hidden
          className="absolute inset-x-1 inset-y-0.5 rounded-[18px] -z-0"
          style={{ backgroundColor: activeColors.bgLight }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}

      <span className="relative z-10 flex items-center justify-center h-7">
        {/* Icon State Cross-Fade (Suggestion #5) */}
        <AnimatePresence mode="wait" initial={false}>
          {isActive ? (
            <motion.span
              key="filled"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex"
            >
              <Icon size={22} strokeWidth={1.75} fill={activeColors.accent} className="text-[color:var(--accent)]" style={{ color: activeColors.accent }} />
            </motion.span>
          ) : (
            <motion.span
              key="outline"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex"
            >
              <Icon size={22} strokeWidth={1.5} className="text-[#1F1D1A]/45" style={{ color: activeColors.text, opacity: 0.45 }} />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Bouncing Cart/Favorites Badge (Suggestion #7) */}
        {typeof badge === 'number' && badge > 0 && (
          <AnimatePresence>
            <motion.span
              key={badge}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              className="absolute -top-0.5 -right-2.5 min-w-[16px] h-4 px-1 text-white text-[9px] font-bold leading-none flex items-center justify-center rounded-full shadow-sm pointer-events-none"
              style={{ backgroundColor: activeColors.accent }}
            >
              {badge > 9 ? '9+' : badge}
            </motion.span>
          </AnimatePresence>
        )}
      </span>

      {/* Contextual Label (Suggestion #6) — Label nur beim aktiven Tab sichtbar */}
      <motion.span
        aria-hidden={!isActive}
        className="relative z-10 text-[10px] font-semibold tracking-tight overflow-hidden"
        animate={
          reduceMotion
            ? { opacity: isActive ? 1 : 0, maxWidth: isActive ? 60 : 0 }
            : { opacity: isActive ? 1 : 0, maxWidth: isActive ? 60 : 0, height: isActive ? 'auto' : 0 }
        }
        initial={false}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        style={{ color: activeColors.accent, whiteSpace: 'nowrap' }}
      >
        {label}
      </motion.span>
    </MotionLink>
  );
}

export function Footer() {
  const { colors } = useCategory();
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const isShopPage = location.pathname === '/shop';
  const activeColors = isShopPage ? colors : DEFAULT_COLORS;

  return (
    <footer
      className="border-t pt-12 md:pt-16 pb-28 md:pb-8 transition-colors duration-700"
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: activeColors.border,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3
              className="text-2xl font-serif font-bold italic mb-4 transition-colors duration-700"
              style={{ color: activeColors.text }}
            >
              Nolea
            </h3>
            <p
              className="text-sm leading-relaxed max-w-xs transition-colors duration-700"
              style={{ color: activeColors.text, opacity: 0.6 }}
            >
              Curated digital guides for a conscious lifestyle. Quality, inspiration, and aesthetics in every product.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4
              className="text-xs font-bold uppercase tracking-widest mb-4 md:mb-6 transition-colors duration-700"
              style={{ color: activeColors.text }}
            >
              Shop
            </h4>
            <ul className="flex flex-col gap-2.5 md:gap-3 text-sm">
              {[
                { label: 'All Products', href: '/shop' },
                { label: 'Tech', href: '/shop?cat=Tech' },
                { label: 'Fitness', href: '/shop?cat=Fitness' },
                { label: 'Nutrition', href: '/shop?cat=Nutrition' },
                { label: 'Finance', href: '/shop?cat=Finance' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="transition-colors duration-500 hover:opacity-100"
                    style={{ color: activeColors.text, opacity: 0.6 }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = activeColors.accent;
                      (e.target as HTMLElement).style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = activeColors.text;
                      (e.target as HTMLElement).style.opacity = '0.6';
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4
              className="text-xs font-bold uppercase tracking-widest mb-4 md:mb-6 transition-colors duration-700"
              style={{ color: activeColors.text }}
            >
              Support
            </h4>
            <ul className="flex flex-col gap-2.5 md:gap-3 text-sm">
              {[
                { label: 'Legal Notice', to: '/impressum' },
                { label: 'Privacy Policy', to: '/privacy' },
                { label: 'Terms of Service', to: '/terms' },
                { label: 'Contact', href: 'mailto:noleashop@gmail.com' },
              ].map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="transition-colors duration-500 hover:opacity-100"
                      style={{ color: activeColors.text, opacity: 0.6 }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.color = activeColors.accent;
                        (e.target as HTMLElement).style.opacity = '1';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.color = activeColors.text;
                        (e.target as HTMLElement).style.opacity = '0.6';
                      }}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.to}
                      className="transition-colors duration-500 hover:opacity-100"
                      style={{ color: activeColors.text, opacity: 0.6 }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.color = activeColors.accent;
                        (e.target as HTMLElement).style.opacity = '1';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.color = activeColors.text;
                        (e.target as HTMLElement).style.opacity = '0.6';
                      }}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Trust */}
          <div>
            <h4
              className="text-xs font-bold uppercase tracking-widest mb-4 md:mb-6 transition-colors duration-700"
              style={{ color: activeColors.text }}
            >
              Trust & Safety
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { icon: 'shield', text: 'SSL Encrypted' },
                { icon: 'basket', text: 'Stripe Checkout' },
                { icon: 'shield', text: 'Buyer Protection' },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-2 text-sm transition-colors duration-700"
                  style={{ color: activeColors.text, opacity: 0.6 }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="transition-colors duration-700"
                    style={{ color: activeColors.accent }}
                  >
                    {item.icon === 'shield' ? (
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    ) : (
                      <>
                        <path d="m15 11-1 9" />
                        <path d="m19 11-4-7" />
                        <path d="M2 11h20" />
                        <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4" />
                        <path d="M4.5 15.5h15" />
                        <path d="m5 11 4-7" />
                        <path d="m9 11 1 9" />
                      </>
                    )}
                  </svg>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-10 md:mt-16 pt-6 md:pt-8 border-t flex flex-col md:flex-row justify-between items-center text-xs gap-3 transition-colors duration-700"
          style={{ borderColor: activeColors.border, color: activeColors.text, opacity: 0.5 }}
        >
          <span>© {currentYear} Nolea Studio. All rights reserved.</span>
          <div className="flex gap-4 md:gap-6 items-center">
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Secure Payment
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
