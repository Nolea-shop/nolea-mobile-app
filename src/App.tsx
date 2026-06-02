import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { CategoryProvider } from './context/CategoryContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { Navigation, Footer } from './components/Layout';
import { CookieBanner } from './components/CookieBanner';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Admin } from './pages/Admin';
import { Success } from './pages/Success';
import { MyGuides } from './pages/MyGuides';
import { Favorites } from './pages/Favorites';
import { Account } from './pages/Account';
import { Impressum } from './pages/Impressum';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { ChatAgent } from './components/ChatAgent';
import { testConnection } from './lib/firebase';
import { useUserSync } from './hooks/useUserSync';

function App() {
  useUserSync();
  useEffect(() => {
    testConnection();
  }, []);

  return (
    <BrowserRouter>
      <CartProvider>
        <FavoritesProvider>
          <CategoryProvider>
            <div className="flex flex-col min-h-screen">
              <Navigation />
              <main className="flex-grow pb-24 md:pb-0">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/guides" element={<MyGuides />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/success" element={<Success />} />
                  <Route path="/impressum" element={<Impressum />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  {/* Fallback */}
                  <Route path="*" element={<Home />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <Toaster position="bottom-right" />
            <CookieBanner />
            <ChatAgent />
          </CategoryProvider>
        </FavoritesProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
/* deploy-trigger-cache-buster-20260517-0450 */
