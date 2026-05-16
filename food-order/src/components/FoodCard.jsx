import React, { useState } from 'react';
import Button from './Button';
import { Plus } from 'lucide-react';

export default function FoodCard({ image, title, description, price, onAdd }) {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    boxShadow: isHovered ? 'var(--shadow-level-2)' : 'var(--shadow-level-1)',
    transition: 'all 0.3s ease',
    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
    height: '100%',
    cursor: 'pointer',
  };

  const imageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  };

  const contentStyle = {
    padding: 'var(--spacing-md)',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 'var(--spacing-sm)',
  };

  const titleStyle = {
    color: 'var(--color-text-main)',
    margin: 0,
  };

  const descStyle = {
    color: 'var(--color-text-muted)',
    marginBottom: 'var(--spacing-md)',
    flex: 1,
  };

  const footerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  };

  const priceStyle = {
    color: 'var(--color-text-main)',
    fontWeight: '600',
    fontSize: '18px',
  };

  return (
    <div 
      style={cardStyle} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={image} alt={title} style={imageStyle} />
      <div style={contentStyle}>
        <div style={headerStyle}>
          <h3 style={titleStyle}>{title}</h3>
        </div>
        <p className="body-md" style={descStyle}>{description}</p>
        <div style={footerStyle}>
          <span style={priceStyle}>${price.toFixed(2)}</span>
          <Button 
            variant="primary" 
            style={{ padding: '8px', borderRadius: '50%' }}
            onClick={(e) => {
              e.stopPropagation();
              if (onAdd) onAdd();
            }}
            aria-label="Add to cart"
          >
            <Plus size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
