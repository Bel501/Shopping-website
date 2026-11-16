import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { Product, PRODUCTS } from '../../data/products';
import { BRAND_CONFIG } from '../../config/brandConfig';
import { StaticFallback } from '../three/StaticFallback';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';

gsap.registerPlugin(ScrollTrigger);

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [activeVariantIdx, setActiveVariantIdx] = useState(0);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });
  const { prefersReducedMotion } = useDeviceCapabilities();

  const activeVariant = product.variants[activeVariantIdx];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * 8,
      ry: (px - 0.5) * 8,
      gx: px * 100,
      gy: py * 100,
    });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: hovered ? 'transform 0.12s ease-out' : 'transform 0.5s ease-out',
      }}
      className="product-card group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/90 bg-carbon p-6 transition-colors hover:border-volt/50"
    >
      {/* Subtle radial glow tracking pointer */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(420px circle at ${tilt.gx}% ${tilt.gy}%, rgba(212,255,0,0.09), transparent 65%)`,
        }}
      />

      {/* Quiet metadata + title + tabular price */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-titanium">
            <span>{product.series}</span>
            <span aria-hidden="true">·</span>
            <span>{product.badgeText}</span>
          </div>
          <h3 className="mt-1.5 font-display text-xl font-bold tracking-tight text-bone">
            {product.name}
          </h3>
        </div>
        <span className="font-mono text-sm font-medium tabular-nums text-volt">
          {BRAND_CONFIG.currency}
          {product.price}
        </span>
      </div>

      {/* Visual Stage: Swaps studio photograph with schematic inspection overlay on hover */}
      <Link
        to={`/product/${product.slug}`}
        className="relative z-10 my-5 block aspect-[4/3] w-full overflow-hidden rounded-xl bg-obsidian"
      >
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            hovered ? 'scale-105 opacity-25' : 'scale-100 opacity-100'
          }`}
        >
          <StaticFallback
            label={product.name}
            imageUrl={product.imageUrl}
            colorHex={activeVariant.hex}
            accentHex={activeVariant.accentHex}
          />
        </div>

        <div
          className={`absolute inset-0 flex flex-col justify-between p-5 transition-all duration-500 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center justify-between font-mono text-xs text-volt">
            <span>Interactive 3D View</span>
            <span className="tabular-nums">{product.weight}</span>
          </div>

          <div className="space-y-2 border-t border-zinc-800/80 pt-4">
            {product.specs.slice(0, 2).map((spec) => (
              <div key={spec.label} className="flex items-center justify-between text-xs">
                <span className="text-titanium">{spec.label}</span>
                <span className="font-medium text-bone">{spec.value}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs font-medium text-bone">
            <span>Inspect Materials &amp; Orbit</span>
            <ArrowUpRight className="h-4 w-4 text-volt" />
          </div>
        </div>
      </Link>

      {/* Variant Switcher + Configure Link */}
      <div className="relative z-10 flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          {product.variants.map((v, idx) => (
            <button
              key={v.id}
              type="button"
              aria-label={`Select ${v.name}`}
              onClick={() => setActiveVariantIdx(idx)}
              className={`h-4 w-4 rounded-full border transition-transform ${
                idx === activeVariantIdx
                  ? 'scale-125 border-volt ring-2 ring-volt/30'
                  : 'border-zinc-700 hover:scale-110'
              }`}
              style={{ backgroundColor: v.hex }}
            />
          ))}
        </div>

        <Link
          to={`/product/${product.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-bone transition-colors group-hover:text-volt whitespace-nowrap shrink-0"
        >
          <span>Configure</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export const ProductGrid: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion } = useDeviceCapabilities();

  useEffect(() => {
    if (prefersReducedMotion || !gridRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.product-card', {
        y: 42,
        opacity: 0,
        duration: 0.7,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
          once: true,
        },
      });
    }, gridRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="collection" className="relative z-30 border-t border-zinc-900 bg-obsidian px-6 py-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-medium text-volt">Collection · 2026</p>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight text-bone md:text-5xl text-balance">
              Select Your Chassis.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-titanium">
            Every silhouette is customizable in real-time 3D. Select a model to orbit, inspect materials, and lock your colorway.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
