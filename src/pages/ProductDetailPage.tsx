import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Check, ShieldCheck, Truck } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { BRAND_CONFIG } from '../config/brandConfig';
import { useCartStore } from '../store/useCartStore';
import { PageTransition } from '../components/layout/PageTransition';

const ProductViewerCanvas = lazy(() =>
  import('../components/three/ProductViewerCanvas').then((m) => ({
    default: m.ProductViewerCanvas,
  }))
);

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = PRODUCTS.find((p) => p.slug === slug) || PRODUCTS[0];

  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[2] || product.sizes[0]);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedVariant(product.variants[0]);
    setSelectedSize(product.sizes[2] || product.sizes[0]);
  }, [product]);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      variantName: selectedVariant.name,
      variantHex: selectedVariant.hex,
      imageUrl: product.imageUrl,
      size: selectedSize,
      price: product.price,
    });
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
      openCart();
    }, 450);
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-28 md:px-10">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-xs font-medium text-titanium transition-colors hover:text-volt"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Collection</span>
        </Link>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* Interactive 3D Viewport */}
          <div className="lg:col-span-7">
            <Suspense
              fallback={
                <div className="flex h-[460px] w-full items-center justify-center rounded-2xl border border-zinc-800 bg-carbon font-mono text-xs text-titanium lg:h-[620px]">
                  Loading 3D studio...
                </div>
              }
            >
              <ProductViewerCanvas
                modelUrl={product.modelUrl}
                modelScale={product.modelScale}
                variant={selectedVariant}
                productName={product.name}
                fallbackImageUrl={product.imageUrl}
              />
            </Suspense>
          </div>

          {/* Contiguous Purchase Module */}
          <div className="lg:sticky lg:top-28 lg:col-span-5">
            <div className="flex items-center gap-2 text-xs font-medium text-volt">
              <span>{product.series}</span>
              <span aria-hidden="true">·</span>
              <span className="text-titanium">{product.weight}</span>
            </div>

            <div className="mt-2 flex items-baseline justify-between gap-4">
              <h1 className="font-display text-3xl font-bold tracking-tight text-bone md:text-4xl">
                {product.name}
              </h1>
              <span className="font-display text-2xl font-bold tabular-nums text-bone">
                {BRAND_CONFIG.currency}
                {product.price}
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-titanium">{product.description}</p>

            {/* Color / Material Variant Switcher */}
            <div className="mt-8">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-titanium">Colorway &amp; Finish</span>
                <span className="font-medium text-bone">{selectedVariant.name}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {product.variants.map((variant) => {
                  const active = variant.id === selectedVariant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      className={`flex items-center gap-2.5 whitespace-nowrap shrink-0 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors ${
                        active
                          ? 'border-volt bg-volt/10 text-bone'
                          : 'border-zinc-800 bg-carbon text-titanium hover:border-zinc-600'
                      }`}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: variant.hex }}
                      />
                      <span>{variant.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mt-8">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-titanium">Select Size</span>
                <span className="text-zinc-500">True to size</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2.5">
                {product.sizes.map((size) => {
                  const active = size === selectedSize;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`whitespace-nowrap shrink-0 rounded-lg border py-3 font-mono text-xs tabular-nums transition-colors ${
                        active
                          ? 'border-volt bg-volt text-obsidian font-bold'
                          : 'border-zinc-800 bg-carbon text-bone hover:border-zinc-600'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add to Bag with Micro-animation */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className={`mt-8 flex w-full items-center justify-center gap-2 rounded-lg py-4 font-display text-sm font-bold transition ${
                addedFeedback
                  ? 'bg-emerald-400 text-obsidian'
                  : 'bg-volt text-obsidian hover:brightness-110'
              }`}
            >
              {addedFeedback ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <span>
                  Add to Bag — {BRAND_CONFIG.currency}
                  {product.price}
                </span>
              )}
            </motion.button>

            {/* Technical Specs separated by subtle hairlines (zero nested cards) */}
            <div className="mt-8 divide-y divide-zinc-900 border-y border-zinc-900">
              {product.specs.map((spec) => (
                <div key={spec.label} className="flex items-center justify-between py-3 text-xs">
                  <span className="text-titanium">{spec.label}</span>
                  <span className="font-medium text-bone">{spec.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-titanium">
              <span className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-volt" /> Free 48h Express Delivery
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-volt" /> 2-Year Lab Warranty
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
