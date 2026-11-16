import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND_CONFIG } from '../../config/brandConfig';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-900 bg-obsidian px-6 py-16 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 md:flex-row md:items-end">
        <div>
          <h3 className="font-display text-2xl font-bold tracking-tight text-bone">
            {BRAND_CONFIG.name}
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-titanium">
            {BRAND_CONFIG.tagline}. Real-time WebGL commerce engineered for sub-gram performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-8 text-xs text-titanium">
          <Link to="/" className="transition-colors hover:text-volt">
            Home
          </Link>
          <Link to="/product/velox-aero-01" className="transition-colors hover:text-volt">
            Flagship Aero 01
          </Link>
          <Link to="/checkout" className="transition-colors hover:text-volt">
            Checkout
          </Link>
          <span className="text-zinc-500">
            © {new Date().getFullYear()} {BRAND_CONFIG.name}
          </span>
        </div>
      </div>
    </footer>
  );
};
