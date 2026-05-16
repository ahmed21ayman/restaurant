import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import InputField from '../components/InputField';

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await signup(formData.name, formData.email, formData.password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 80px)',
    padding: 'var(--spacing-lg)',
  };

  const cardStyle = {
    backgroundColor: 'var(--color-surface)',
    padding: 'var(--spacing-xl)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-level-2)',
    width: '100%',
    maxWidth: '450px',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
          <h2>{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            {isLogin ? 'Enter your details to access your account.' : 'Sign up to start ordering delicious food.'}
          </p>
        </div>

        {error && <div style={{ color: 'var(--color-error)', marginBottom: 'var(--spacing-md)', textAlign: 'center' }}>{error}</div>}

        <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }} onSubmit={handleSubmit}>
          {!isLogin && (
            <InputField label="Full Name" id="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
          )}
          <InputField label="Email Address" id="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
          <InputField label="Password" id="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
          {!isLogin && (
            <InputField label="Confirm Password" id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required />
          )}
          
          <Button type="submit" variant="primary" fullWidth style={{ marginTop: 'var(--spacing-sm)' }}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)', color: 'var(--color-text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ color: 'var(--color-primary)', fontWeight: '600', padding: 0 }}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
}
