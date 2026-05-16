import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, UtensilsCrossed, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();

  const headerStyle = {
    backgroundColor: 'var(--color-surface)',
    boxShadow: 'var(--shadow-level-2)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    padding: 'var(--spacing-md) 0',
  };

  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-lg)',
  };

  const linkStyle = (path) => ({
    color: location.pathname === path ? 'var(--color-primary)' : 'var(--color-text-main)',
    fontWeight: location.pathname === path ? '600' : '500',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  });

  const cartBadgeStyle = {
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-on-primary)',
    borderRadius: 'var(--radius-full)',
    padding: '2px 8px',
    fontSize: '12px',
    fontWeight: '600',
    position: 'absolute',
    top: '-8px',
    right: '-12px',
  };

  return (
    <header style={headerStyle}>
      <div className="container flex items-center justify-between">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--color-primary)' }}>
          <UtensilsCrossed size={32} />
          <span style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.02em' }}>CraveDirect</span>
        </Link>
        
        <nav style={navStyle}>
          <Link to="/" style={linkStyle('/')}>Menu</Link>
          {user && user.role !== 'admin' && <Link to="/orders" style={linkStyle('/orders')}>Orders</Link>}
          {user && user.role === 'admin' && <Link to="/admin" style={linkStyle('/admin')}>Admin</Link>}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginLeft: 'var(--spacing-lg)' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <Link to="/profile" className="label-md" style={{ color: 'var(--color-text-main)', textDecoration: 'none' }}>Hi, {user.name.split(' ')[0]}</Link>
                <button onClick={logout} style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" style={{ color: 'var(--color-text-main)' }}>
                <User size={24} />
              </Link>
            )}
            
            {(!user || user.role !== 'admin') && (
              <Link to="/checkout" style={{ position: 'relative', color: 'var(--color-text-main)' }}>
                <ShoppingCart size={24} />
                {cartItems.length > 0 && (
                  <span style={cartBadgeStyle}>{cartItems.length}</span>
                )}
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
