import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brandConfig';
import { useCartStore } from '../../store/useCartStore';
import { useLenisScroll } from '../../hooks/useLenisScroll';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items, toggleCart } = useCartStore();
  const { scrollTo } = useLenisScroll();
  const location = useLocation();
  const navigate = useNavigate();

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleAnchor = (selector: string) => {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => scrollTo(selector, -60), 350);
    } else {
      scrollTo(selector, -60);
    }
  };

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-colors duration-300 ${
          scrolled
            ? 'border-b border-zinc-800/80 bg-obsidian/92 py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 md:px-10">
          {/* Zone 1: Single-line wordmark */}
          <Link
            to="/"
            className="font-display text-xl font-bold tracking-tight text-bone whitespace-nowrap shrink-0 md:text-2xl"
          >
            {BRAND_CONFIG.name}
          </Link>

          {/* Zone 2: Clean single-line text links */}
          <nav className="hidden items-center gap-8 md:flex">
            <button
              type="button"
              onClick={() => handleAnchor('#story')}
              className="text-sm font-medium text-titanium transition-colors hover:text-bone hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              Architecture
            </button>
            <button
              type="button"
              onClick={() => handleAnchor('#collection')}
              className="text-sm font-medium text-titanium transition-colors hover:text-bone hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              Collection
            </button>
            <Link
              to="/product/velox-aero-01"
              className="text-sm font-medium text-titanium transition-colors hover:text-bone hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              3D Studio
            </Link>
            <Link
              to="/checkout"
              className="text-sm font-medium text-titanium transition-colors hover:text-bone hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              Checkout
            </Link>
          </nav>

          {/* Zone 3: Single primary action + mobile drawer trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={toggleCart}
              aria-label="Open shopping bag"
              className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-carbon px-4 py-2 text-xs font-medium text-bone transition-colors hover:border-volt/70 whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="h-4 w-4 text-volt" />
              <span>Bag</span>
              <span className="font-mono tabular-nums text-volt">({totalCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 text-bone md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[70] flex flex-col justify-between bg-obsidian p-8 md:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-xl font-bold text-bone">
                {BRAND_CONFIG.name}
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-800 text-bone"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-7">
              <button
                type="button"
                onClick={() => handleAnchor('#story')}
                className="text-left font-display text-3xl font-semibold text-bone"
              >
                01. Architecture
              </button>
              <button
                type="button"
                onClick={() => handleAnchor('#collection')}
                className="text-left font-display text-3xl font-semibold text-bone"
              >
                02. Collection
              </button>
              <Link
                to="/product/velox-aero-01"
                className="font-display text-3xl font-semibold text-volt"
              >
                03. 3D Studio
              </Link>
              <Link
                to="/checkout"
                className="font-display text-3xl font-semibold text-titanium"
              >
                04. Checkout
              </Link>
            </div>

            <div className="text-xs text-zinc-500">
              {BRAND_CONFIG.tagline} · {BRAND_CONFIG.supportEmail}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
