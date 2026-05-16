import React from 'react';

export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  fullWidth = false,
  ...props 
}) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 24px',
    borderRadius: 'var(--radius-md)',
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '24px',
    transition: 'all 0.2s ease',
    width: fullWidth ? '100%' : 'auto',
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-on-primary)',
    },
    secondary: {
      backgroundColor: 'var(--color-secondary)',
      color: 'var(--color-text-main)',
    },
    outline: {
      backgroundColor: 'transparent',
      border: '2px solid var(--color-border)',
      color: 'var(--color-text-main)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-primary-dark)',
      padding: '8px 16px',
    }
  };

  return (
    <button 
      style={{ ...baseStyle, ...variants[variant] }} 
      className={`btn-${variant} ${className}`}
      onMouseOver={(e) => {
        if(variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)';
        if(variant === 'secondary') e.currentTarget.style.backgroundColor = 'var(--color-secondary-dark)';
        if(variant === 'outline') e.currentTarget.style.borderColor = 'var(--color-primary)';
      }}
      onMouseOut={(e) => {
        if(variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--color-primary)';
        if(variant === 'secondary') e.currentTarget.style.backgroundColor = 'var(--color-secondary)';
        if(variant === 'outline') e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
      {...props}
    >
      {children}
    </button>
  );
}
