import React, { useState, useEffect } from 'react';
import FoodCard from '../components/FoodCard';
import { useCart } from '../context/CartContext';
import { Search } from 'lucide-react';
import { fetchWithAuth } from '../utils/api';

const CATEGORIES = ["All", "Pizza", "Burgers", "Healthy", "Sushi"];

export default function HomeMenu() {
  const { addToCart } = useCart();
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const data = await fetchWithAuth('/menu');
        setMenuItems(data);
      } catch (error) {
        console.error("Failed to load menu", error);
      } finally {
        setLoading(false);
      }
    };
    loadMenu();
  }, []);

  const filteredItems = activeCategory === "All" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="container" style={{ padding: 'var(--spacing-xl) var(--spacing-md)' }}>
      {/* Hero Section */}
      <div style={{ marginBottom: 'var(--spacing-xl)', textAlign: 'center' }}>
        <h1>Fresh Flavors Delivered</h1>
        <p className="body-lg" style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Discover the best local food and get it delivered right to your doorstep in minutes.
        </p>
      </div>

      {/* Search and Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search for restaurants, cuisines, or dishes..." 
            style={{
              width: '100%',
              padding: '16px 16px 16px 48px',
              borderRadius: 'var(--radius-full)',
              border: '2px solid var(--color-border)',
              fontSize: '16px',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', overflowX: 'auto', paddingBottom: 'var(--spacing-sm)', justifyContent: 'center' }}>
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: activeCategory === category ? 'var(--color-primary)' : 'var(--color-surface)',
                color: activeCategory === category ? 'var(--color-on-primary)' : 'var(--color-text-main)',
                border: `1px solid ${activeCategory === category ? 'var(--color-primary)' : 'var(--color-border)'}`,
                fontWeight: '500',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Food Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>Loading menu...</div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: 'var(--spacing-lg)' 
        }}>
          {filteredItems.map(item => (
            <FoodCard 
              key={item._id}
              image={item.image}
              title={item.title}
              description={item.description}
              price={item.price}
              onAdd={() => addToCart({ id: item._id, ...item })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
