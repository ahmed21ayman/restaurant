import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Users, TrendingUp, Trash2, Plus } from 'lucide-react';
import { fetchWithAuth } from '../utils/api';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ title: '', description: '', price: '', image: '', category: '' });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Basic admin check (in a real app, rely on backend protection primarily)
    if (!user || user.role !== 'admin') {
      alert('Access denied. Admin role required.');
      navigate('/');
      return;
    }

    const loadAdminData = async () => {
      try {
        const [ordersData, menuData] = await Promise.all([
          fetchWithAuth('/orders/admin'),
          fetch('https://unearthly-superblessed-shela.ngrok-free.dev/api/menu', {headers:{ 'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json'
}}).then(res => res.json())
        ]);
        setOrders(ordersData);
        setMenuItems(menuData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAdminData();
  }, [user, navigate]);

  const updateStatus = async (id, newStatus) => {
    try {
      await fetchWithAuth(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      // Update local state
      setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const addedItem = await fetchWithAuth('/menu', {
        method: 'POST',
        body: JSON.stringify({ ...newItem, price: parseFloat(newItem.price) })
      });
      setMenuItems([...menuItems, addedItem]);
      setNewItem({ title: '', description: '', price: '', image: '', category: '' });
      alert("Menu item added successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemoveItem = async (id) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    try {
      await fetchWithAuth(`/menu/${id}`, { method: 'DELETE' });
      setMenuItems(menuItems.filter(item => item._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend }) => (
    <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-level-1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
        <div>
          <p className="label-md" style={{ color: 'var(--color-text-muted)', marginBottom: '4px' }}>{title}</p>
          <h2 style={{ margin: 0 }}>{value}</h2>
        </div>
        <div style={{ padding: '12px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-dark)', borderRadius: 'var(--radius-md)' }}>
          <Icon size={24} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-tertiary)', fontSize: '14px', fontWeight: '500' }}>
        <TrendingUp size={16} />
        <span>{trend} from last week</span>
      </div>
    </div>
  );

  if (loading) return <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>Loading admin data...</div>;

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="container" style={{ padding: 'var(--spacing-xl) var(--spacing-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <h1>Admin Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <span className="label-md" style={{ color: 'var(--color-success)' }}>● Restaurant Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} icon={DollarSign} trend="+12%" />
        <StatCard title="Total Orders" value={orders.length} icon={ShoppingBag} trend="+5%" />
        <StatCard title="Active Customers" value={new Set(orders.map(o => o.user._id)).size} icon={Users} trend="+18%" />
      </div>

      {/* Recent Orders Table */}
      <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-level-1)', overflow: 'hidden' }}>
        <div style={{ padding: 'var(--spacing-lg)', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ margin: 0 }}>Recent Orders</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-dim)', color: 'var(--color-text-muted)' }}>
                <th style={{ padding: 'var(--spacing-md) var(--spacing-lg)', fontWeight: '500' }}>Order ID</th>
                <th style={{ padding: 'var(--spacing-md) var(--spacing-lg)', fontWeight: '500' }}>Customer & Contact</th>
                <th style={{ padding: 'var(--spacing-md) var(--spacing-lg)', fontWeight: '500' }}>Items</th>
                <th style={{ padding: 'var(--spacing-md) var(--spacing-lg)', fontWeight: '500' }}>Total</th>
                <th style={{ padding: 'var(--spacing-md) var(--spacing-lg)', fontWeight: '500' }}>Status</th>
                <th style={{ padding: 'var(--spacing-md) var(--spacing-lg)', fontWeight: '500' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={order._id} style={{ borderBottom: idx !== orders.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                  <td style={{ padding: 'var(--spacing-md) var(--spacing-lg)', fontWeight: '500' }}>{order._id.slice(-6)}</td>
                  <td style={{ padding: 'var(--spacing-md) var(--spacing-lg)' }}>
                    <div style={{ fontWeight: '500' }}>{order.user?.name || 'Unknown'}</div>
                    {order.deliveryAddress && (
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
                        <div>📞 {order.deliveryAddress.phone}</div>
                        <div>📍 {order.deliveryAddress.streetAddress}, {order.deliveryAddress.city}</div>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: 'var(--spacing-md) var(--spacing-lg)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {order.items?.map((item, i) => (
                        <div key={i} style={{ fontSize: '13px' }}>
                          <span style={{ fontWeight: '600' }}>{item.quantity}x</span> {item.title}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: 'var(--spacing-md) var(--spacing-lg)' }}>${order.totalAmount.toFixed(2)}</td>
                  <td style={{ padding: 'var(--spacing-md) var(--spacing-lg)' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: 'var(--radius-full)', 
                      fontSize: '12px', 
                      fontWeight: '600',
                      backgroundColor: order.status === 'Delivered' ? '#e6f4ea' : 'var(--color-primary-light)',
                      color: order.status === 'Delivered' ? 'var(--color-success)' : 'var(--color-primary-dark)'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--spacing-md) var(--spacing-lg)' }}>
                    <select 
                      value={order.status} 
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="On the way">On the way</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Menu Management Section */}
      <div style={{ marginTop: 'var(--spacing-2xl)' }}>
        <h2>Menu Management</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-xl)', marginTop: 'var(--spacing-lg)' }}>
          {/* Add Item Form */}
          <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-level-1)', padding: 'var(--spacing-lg)', height: 'fit-content' }}>
            <h3 style={{ margin: '0 0 var(--spacing-md) 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={20} /> Add Menu Item</h3>
            <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <InputField label="Title" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} required />
              <InputField label="Description" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                <InputField label="Price" type="number" step="0.01" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} required />
                <InputField label="Category" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} required />
              </div>
              <InputField label="Image URL" value={newItem.image} onChange={e => setNewItem({...newItem, image: e.target.value})} required />
              <Button type="submit" variant="primary" style={{ marginTop: '8px' }}>Add Item</Button>
            </form>
          </div>

          {/* Current Menu Items */}
          <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-level-1)', padding: 'var(--spacing-lg)' }}>
            <h3 style={{ margin: '0 0 var(--spacing-md) 0' }}>Current Menu</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', maxHeight: '400px', overflowY: 'auto' }}>
              {menuItems.map(item => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-sm)', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={item.image} alt={item.title} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '14px' }}>{item.title}</div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>${item.price.toFixed(2)} • {item.category}</div>
                    </div>
                  </div>
                  <button onClick={() => handleRemoveItem(item._id)} style={{ color: 'var(--color-error)', padding: '8px' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {menuItems.length === 0 && <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>No menu items found.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
