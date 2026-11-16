import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { SmoothScrollProvider } from './hooks/useLenisScroll';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { CustomCursor } from './components/layout/CustomCursor';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { Preloader } from './components/layout/Preloader';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </AnimatePresence>
  );
};

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <SmoothScrollProvider>
          <Preloader />
          <CustomCursor />
          <ScrollProgress />
          <Navbar />
          <CartDrawer />
          <main className="min-h-screen bg-obsidian">
            <AnimatedRoutes />
          </main>
          <Footer />
        </SmoothScrollProvider>
      </BrowserRouter>
    </MotionConfig>
  );
}

export default App;
