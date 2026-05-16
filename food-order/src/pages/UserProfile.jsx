import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../utils/api';
import InputField from '../components/InputField';
import Button from '../components/Button';


export default function UserProfile() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, password: '' });
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const dataToUpdate = { name: formData.name, email: formData.email };
      if (formData.password) dataToUpdate.password = formData.password;

      const updatedUser = await fetchWithAuth('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(dataToUpdate)
      });
      
      updateUser(updatedUser);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setFormData(prev => ({ ...prev, password: '' })); // Clear password field
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };


  if (!user) return <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>Please log in.</div>;

  return (
    <div className="container" style={{ padding: 'var(--spacing-xl) var(--spacing-md)', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>Profile Settings</h1>

      {message.text && (
        <div style={{ 
          padding: 'var(--spacing-md)', 
          marginBottom: 'var(--spacing-lg)', 
          borderRadius: 'var(--radius-md)',
          backgroundColor: message.type === 'error' ? 'var(--color-error)' : 'var(--color-success)',
          color: 'white',
          fontWeight: '500'
        }}>
          {message.text}
        </div>
      )}

      <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-level-1)', marginBottom: 'var(--spacing-xl)' }}>
        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <InputField label="Full Name" id="name" value={formData.name} onChange={handleChange} required />
          <InputField label="Email Address" id="email" type="email" value={formData.email} onChange={handleChange} required />
          <InputField label="New Password (leave blank to keep current)" id="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
          
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>


    </div>
  );
}
