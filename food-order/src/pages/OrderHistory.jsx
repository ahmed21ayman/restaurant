import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle } from 'lucide-react';
import { fetchWithAuth } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadOrders = async () => {
      try {
        const data = await fetchWithAuth('/orders/history');
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [user, navigate]);

  if (loading) return <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>Loading orders...</div>;

  const activeOrder = orders.find(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const pastOrders = orders.filter(o => o.status === 'Delivered' || o.status === 'Cancelled');

  const getProgress = (status) => {
    if (status === 'Pending') return 10;
    if (status === 'Preparing') return 40;
    if (status === 'On the way') return 75;
    return 100;
  };

  return (
    <div className="container" style={{ padding: 'var(--spacing-xl) var(--spacing-md)' }}>
      <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>Orders</h1>

      {/* Active Order Tracking */}
      {activeOrder && (
        <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-level-1)', marginBottom: 'var(--spacing-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
            <div>
              <h3 style={{ color: 'var(--color-primary)' }}>Active Order: {activeOrder._id.slice(-6)}</h3>
              <p className="body-lg">Estimated Arrival: <strong>15-20 min</strong></p>
            </div>
            <div style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-dark)', padding: '8px 16px', borderRadius: 'var(--radius-full)', fontWeight: '600' }}>
              {activeOrder.status}
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ position: 'relative', height: '8px', backgroundColor: 'var(--color-surface-dim)', borderRadius: 'var(--radius-full)', margin: 'var(--spacing-xl) 0' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${getProgress(activeOrder.status)}%`, backgroundColor: 'var(--color-tertiary)', borderRadius: 'var(--radius-full)', transition: 'width 1s ease' }}></div>
          </div>

          {/* Status Icons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: getProgress(activeOrder.status) >= 40 ? 'var(--color-tertiary)' : 'inherit' }}>
              <Package />
              <span className="label-sm">Preparing</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: getProgress(activeOrder.status) >= 75 ? 'var(--color-tertiary)' : 'inherit' }}>
              <Truck />
              <span className="label-sm">On the way</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: getProgress(activeOrder.status) === 100 ? 'var(--color-tertiary)' : 'inherit' }}>
              <CheckCircle />
              <span className="label-sm">Delivered</span>
            </div>
          </div>
        </div>
      )}

      {/* Past Orders */}
      <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Past Orders</h2>
      {pastOrders.length === 0 && <p>No past orders found.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        {pastOrders.map(order => (
          <div key={order._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0' }}>Order #{order._id.slice(-6)}</h4>
              <p className="body-md" style={{ color: 'var(--color-text-muted)', margin: '0 0 8px 0' }}>
                {new Date(order.createdAt).toLocaleDateString()} • ${order.totalAmount.toFixed(2)}
              </p>
              <p className="label-md" style={{ color: 'var(--color-text-main)', margin: 0 }}>
                {order.items.map(item => `${item.quantity}x ${item.title}`).join(', ')}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: order.status === 'Delivered' ? 'var(--color-tertiary)' : 'var(--color-error)', fontWeight: '500' }}>
              <CheckCircle size={18} />
              {order.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
