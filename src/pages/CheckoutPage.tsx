import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Lock } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { BRAND_CONFIG } from '../config/brandConfig';
import { PageTransition } from '../components/layout/PageTransition';

type Step = 1 | 2 | 3;

export const CheckoutPage: React.FC = () => {
  const { items, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>(1);
  const [orderId] = useState(() => `VLX-${Math.floor(100000 + Math.random() * 900000)}`);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [shipping, setShipping] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const [payment, setPayment] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const validateShipping = () => {
    const errs: Record<string, string> = {};
    if (!shipping.fullName.trim()) errs.fullName = 'Full name is required';
    if (!/^\S+@\S+\.\S+$/.test(shipping.email)) errs.email = 'Valid email is required';
    if (!shipping.address.trim()) errs.address = 'Street address is required';
    if (!shipping.city.trim()) errs.city = 'City is required';
    if (!shipping.postalCode.trim()) errs.postalCode = 'Postal code is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePayment = () => {
    const errs: Record<string, string> = {};
    const digits = payment.cardNumber.replace(/\s+/g, '');
    if (digits.length < 12) errs.cardNumber = 'Enter a valid card number';
    if (!/^\d{2}\/\d{2}$/.test(payment.expiry)) errs.expiry = 'Use MM/YY format';
    if (!/^\d{3,4}$/.test(payment.cvc)) errs.cvc = 'Invalid CVC';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShipping()) {
      setErrors({});
      setStep(2);
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePayment()) {
      setErrors({});
      clearCart();
      setStep(3);
    }
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-6 pb-24 pt-32 md:px-10">
        <div className="mb-12 flex items-center justify-between border-b border-zinc-900 pb-6 text-xs font-medium">
          <span className={step >= 1 ? 'text-volt' : 'text-zinc-600'}>01. Shipping</span>
          <span className={step >= 2 ? 'text-volt' : 'text-zinc-600'}>02. Payment</span>
          <span className={step === 3 ? 'text-volt' : 'text-zinc-600'}>03. Confirmation</span>
        </div>

        {step === 3 ? (
          <div className="rounded-2xl border border-zinc-800 bg-carbon p-10 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-volt" />
            <h1 className="mt-5 font-display text-3xl font-bold text-bone md:text-4xl">
              Order Confirmed
            </h1>
            <p className="mt-2 font-mono text-sm tabular-nums text-titanium">
              Order #{orderId} · Preparing Shipment
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm text-titanium">
              A confirmation receipt has been dispatched to{' '}
              <span className="text-bone">{shipping.email || 'your email'}</span>.
            </p>
            <Link
              to="/"
              className="mt-8 inline-block rounded-lg bg-volt px-8 py-3.5 font-display text-sm font-bold text-obsidian"
            >
              Return to Storefront
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-carbon p-10 text-center">
            <h1 className="font-display text-2xl font-bold text-bone">Your bag is empty.</h1>
            <p className="mt-2 text-sm text-titanium">
              Explore our collection and configure a silhouette in 3D before checking out.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-lg bg-volt px-7 py-3 font-display text-sm font-bold text-obsidian"
            >
              Explore Models
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            <div className="md:col-span-7">
              {step === 1 && (
                <form
                  onSubmit={handleShippingSubmit}
                  className="space-y-4 rounded-2xl border border-zinc-800 bg-carbon p-6 md:p-8"
                >
                  <h2 className="font-display text-2xl font-bold text-bone">Shipping Details</h2>

                  <div>
                    <label className="text-xs font-medium text-titanium">Full Name</label>
                    <input
                      type="text"
                      value={shipping.fullName}
                      onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-obsidian px-4 py-3 text-sm text-bone outline-none transition-colors focus:border-volt"
                      placeholder="Alex Mercer"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-400">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-titanium">Email</label>
                    <input
                      type="email"
                      value={shipping.email}
                      onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-obsidian px-4 py-3 text-sm text-bone outline-none transition-colors focus:border-volt"
                      placeholder="alex@studio.io"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-titanium">Street Address</label>
                    <input
                      type="text"
                      value={shipping.address}
                      onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-obsidian px-4 py-3 text-sm text-bone outline-none transition-colors focus:border-volt"
                      placeholder="742 Kinetic Ave"
                    />
                    {errors.address && (
                      <p className="mt-1 text-xs text-red-400">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-titanium">City</label>
                      <input
                        type="text"
                        value={shipping.city}
                        onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                        className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-obsidian px-4 py-3 text-sm text-bone outline-none transition-colors focus:border-volt"
                        placeholder="Tokyo"
                      />
                      {errors.city && <p className="mt-1 text-xs text-red-400">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-titanium">Postal Code</label>
                      <input
                        type="text"
                        value={shipping.postalCode}
                        onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                        className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-obsidian px-4 py-3 text-sm text-bone outline-none transition-colors focus:border-volt"
                        placeholder="150-0001"
                      />
                      {errors.postalCode && (
                        <p className="mt-1 text-xs text-red-400">{errors.postalCode}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-4 w-full rounded-lg bg-volt py-3.5 font-display text-sm font-bold text-obsidian transition hover:brightness-110"
                  >
                    Continue to Payment
                  </button>
                </form>
              )}

              {step === 2 && (
                <form
                  onSubmit={handlePaymentSubmit}
                  className="space-y-4 rounded-2xl border border-zinc-800 bg-carbon p-6 md:p-8"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-2xl font-bold text-bone">Payment</h2>
                    <Lock className="h-4 w-4 text-volt" />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-titanium">Card Number</label>
                    <input
                      type="text"
                      value={payment.cardNumber}
                      onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-obsidian px-4 py-3 font-mono text-sm text-bone outline-none transition-colors focus:border-volt"
                      placeholder="4242 4242 4242 4242"
                    />
                    {errors.cardNumber && (
                      <p className="mt-1 text-xs text-red-400">{errors.cardNumber}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-titanium">Expiry</label>
                      <input
                        type="text"
                        value={payment.expiry}
                        onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                        className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-obsidian px-4 py-3 font-mono text-sm text-bone outline-none transition-colors focus:border-volt"
                        placeholder="08/29"
                      />
                      {errors.expiry && (
                        <p className="mt-1 text-xs text-red-400">{errors.expiry}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-titanium">CVC</label>
                      <input
                        type="text"
                        value={payment.cvc}
                        onChange={(e) => setPayment({ ...payment, cvc: e.target.value })}
                        className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-obsidian px-4 py-3 font-mono text-sm text-bone outline-none transition-colors focus:border-volt"
                        placeholder="842"
                      />
                      {errors.cvc && <p className="mt-1 text-xs text-red-400">{errors.cvc}</p>}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 rounded-lg border border-zinc-700 py-3.5 text-sm font-medium text-bone transition-colors hover:border-bone"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 rounded-lg bg-volt py-3.5 font-display text-sm font-bold text-obsidian transition hover:brightness-110"
                    >
                      Pay {BRAND_CONFIG.currency}
                      {subtotal.toLocaleString()}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="md:col-span-5">
              <div className="rounded-2xl border border-zinc-800 bg-carbon p-6">
                <h3 className="text-xs font-medium text-titanium">Order Summary</h3>
                <div className="mt-4 space-y-3 border-b border-zinc-800 pb-4">
                  {items.map((item) => (
                    <div key={item.key} className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium text-bone">
                          {item.name} × {item.quantity}
                        </p>
                        <p className="text-xs text-titanium">
                          {item.variantName} · {item.size}
                        </p>
                      </div>
                      <span className="font-mono tabular-nums text-bone">
                        {BRAND_CONFIG.currency}
                        {item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-medium text-titanium">Total</span>
                  <span className="font-display text-2xl font-bold tabular-nums text-volt">
                    {BRAND_CONFIG.currency}
                    {subtotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};
