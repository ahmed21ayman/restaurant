import React, { useState } from 'react';

export default function InputField({ label, id, ...props }) {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-xs)',
    width: '100%',
  };

  const inputStyle = {
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    border: `2px solid ${isFocused ? 'var(--color-primary)' : 'var(--color-border)'}`,
    outline: 'none',
    fontSize: '16px',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s ease',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text-main)',
  };

  return (
    <div style={containerStyle}>
      {label && <label htmlFor={id} className="label-md" style={{ color: 'var(--color-text-muted)' }}>{label}</label>}
      <input
        id={id}
        style={inputStyle}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </div>
  );
}
