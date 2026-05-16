import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import HomeMenu from './pages/HomeMenu';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import LoginSignup from './pages/LoginSignup';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Header />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<HomeMenu />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/login" element={<LoginSignup />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/profile" element={<UserProfile />} />
            </Routes>
          </main>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
