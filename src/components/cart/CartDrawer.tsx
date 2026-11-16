import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { BRAND_CONFIG } from '../../config/brandConfig';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCartStore();
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[80] bg-black/75"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="fixed bottom-0 right-0 top-0 z-[90] flex w-full max-w-md flex-col border-l border-zinc-800 bg-obsidian p-6 md:p-8"
          >
            <div className="flex items-center justify-between border-b border-zinc-900 pb-5">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-5 w-5 text-volt" />
                <h2 className="font-display text-lg font-bold tracking-tight text-bone">
                  Your Bag <span className="font-mono tabular-nums text-titanium">({totalCount})</span>
                </h2>
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close bag"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 text-titanium transition-colors hover:border-bone hover:text-bone"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="font-display text-xl font-medium text-bone">Your bag is empty.</p>
                  <p className="mt-2 max-w-xs text-sm text-titanium">
                    Configure a sneaker in 3D to add it to your bag.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.key}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800/80 bg-carbon p-4"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-obsidian">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover"
                            />
                            <span
                              className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full border border-black/40"
                              style={{ backgroundColor: item.variantHex }}
                            />
                          </div>
                          <div>
                            <h3 className="font-display text-sm font-bold text-bone">
                              {item.name}
                            </h3>
                            <p className="text-xs text-titanium">
                              {item.variantName} · {item.size}
                            </p>
                            <p className="mt-1 font-mono text-xs tabular-nums text-volt">
                              {BRAND_CONFIG.currency}
                              {item.price * item.quantity}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <button
                            type="button"
                            onClick={() => removeItem(item.key)}
                            aria-label="Remove item"
                            className="p-1 text-zinc-500 transition-colors hover:text-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>

                          <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-obsidian px-2 py-1">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() => updateQuantity(item.key, item.quantity - 1)}
                              className="p-0.5 text-titanium hover:text-bone"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-[18px] text-center font-mono text-xs tabular-nums text-bone">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() => updateQuantity(item.key, item.quantity + 1)}
                              className="p-0.5 text-titanium hover:text-bone"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-zinc-900 pt-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-medium text-titanium">Estimated Total</span>
                  <motion.span
                    key={subtotal}
                    initial={{ scale: 1.08, color: '#D4FF00' }}
                    animate={{ scale: 1, color: '#F4F4F5' }}
                    className="font-display text-2xl font-bold tabular-nums"
                  >
                    {BRAND_CONFIG.currency}
                    {subtotal.toLocaleString()}
                  </motion.span>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full rounded-lg bg-volt py-3.5 font-display text-sm font-bold text-obsidian transition hover:brightness-110"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
