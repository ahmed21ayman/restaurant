import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../utils/api';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { Trash2, Plus, Minus, CreditCard } from 'lucide-react';

export default function Checkout() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(''); // '', 'processing', 'success'
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online', 'cash'
  
  const [address, setAddress] = useState(user?.lastDeliveryAddress || {
    fullName: user ? user.name : '',
    streetAddress: '',
    city: '',
    zipCode: '',
    phone: ''
  });

  const [payment, setPayment] = useState(user?.lastPaymentDetails || {
    cardNumber: '',
    expiry: '',
    cvc: ''
  });


  const deliveryFee = 3.99;
  const taxes = cartTotal * 0.08;
  const finalTotal = cartTotal + deliveryFee + taxes;

  const handleAddressChange = (e) => setAddress({ ...address, [e.target.id]: e.target.value });
  const handlePaymentChange = (e) => setPayment({ ...payment, [e.target.id]: e.target.value });

  const handlePlaceOrder = async (e) => {
    e.preventDefault(); // If wrapped in a form, prevent default
    if (!user) {
      alert("Please log in to place an order");
      navigate('/login');
      return;
    }

    if (paymentMethod === 'online' && (!payment.cardNumber || !payment.expiry || !payment.cvc)) {
      alert("Please enter your payment details");
      return;
    }

    setLoading(true);
    
    if (paymentMethod === 'online') {
      setPaymentStatus('processing');
      try {
        // Simulate payment processing delay (1.5 seconds)
        await new Promise(resolve => setTimeout(resolve, 1500));
        setPaymentStatus('success');
      } catch (err) {
        alert("Payment failed");
        setLoading(false);
        setPaymentStatus('');
        return;
      }
    }

    try {

      // Create actual order
      const orderItems = cartItems.map(item => ({
        menuItem: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));

      await fetchWithAuth('/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: orderItems,
          totalAmount: finalTotal,
          deliveryAddress: address,
          paymentMethod: paymentMethod,
          paymentDetails: payment
        })
      });

      clearCart();
      navigate('/orders');
    } catch (err) {
      alert(err.message);
      setPaymentStatus('');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-xl) var(--spacing-md)', textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-lg)' }}>Looks like you haven't added any delicious food yet.</p>
        <Button variant="primary" onClick={() => navigate('/')}>Browse Menu</Button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'var(--spacing-xl) var(--spacing-md)' }}>
      <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>Checkout</h1>
      
      <form onSubmit={handlePlaceOrder} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--spacing-xl)' }}>
        {/* Left Column: Delivery & Payment Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          
          <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-level-1)' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Delivery Address</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <InputField label="Full Name" id="fullName" value={address.fullName} onChange={handleAddressChange} required />
              <InputField label="Street Address" id="streetAddress" value={address.streetAddress} onChange={handleAddressChange} required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                <InputField label="City" id="city" value={address.city} onChange={handleAddressChange} required />
                <InputField label="Zip Code" id="zipCode" value={address.zipCode} onChange={handleAddressChange} required />
              </div>
              <InputField label="Phone Number" id="phone" value={address.phone} onChange={handleAddressChange} type="tel" required />
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-level-1)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-md)' }}>
              <CreditCard /> Payment Details
            </h3>
            
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
              <Button 
                type="button" 
                variant={paymentMethod === 'online' ? 'primary' : 'outline'} 
                onClick={() => setPaymentMethod('online')}
                style={{ flex: 1 }}
              >
                Online Payment
              </Button>
              <Button 
                type="button" 
                variant={paymentMethod === 'cash' ? 'primary' : 'outline'} 
                onClick={() => setPaymentMethod('cash')}
                style={{ flex: 1 }}
              >
                Cash on Delivery
              </Button>
            </div>

            {paymentMethod === 'online' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <InputField label="Card Number" id="cardNumber" placeholder="0000 0000 0000 0000" value={payment.cardNumber} onChange={handlePaymentChange} required />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                  <InputField label="Expiry (MM/YY)" id="expiry" placeholder="12/25" value={payment.expiry} onChange={handlePaymentChange} required />
                  <InputField label="CVC" id="cvc" placeholder="123" value={payment.cvc} onChange={handlePaymentChange} required type="password" />
                </div>
                <p className="label-sm" style={{ color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  *This is a mock payment form for demonstration purposes. No real transactions will occur.
                </p>
              </div>
            )}
            
            {paymentMethod === 'cash' && (
              <p style={{ color: 'var(--color-text-muted)', margin: 0, textAlign: 'center', padding: 'var(--spacing-md) 0' }}>
                You will pay with cash when your order is delivered.
              </p>
            )}
          </div>

        </div>

        {/* Right Column: Order Summary */}
        <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-level-1)', height: 'fit-content' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Order Summary</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
            {cartItems.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <img src={item.image} alt={item.title} style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '14px' }}>{item.title}</h4>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>${item.price.toFixed(2)}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '4px', borderRadius: '50%', backgroundColor: 'var(--color-surface-dim)' }}>
                    <Minus size={16} />
                  </button>
                  <span style={{ fontWeight: '500', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '4px', borderRadius: '50%', backgroundColor: 'var(--color-surface-dim)' }}>
                    <Plus size={16} />
                  </button>
                  <button type="button" onClick={() => removeFromCart(item.id)} style={{ padding: '4px', color: 'var(--color-error)', marginLeft: '8px' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
              <span>Taxes</span>
              <span>${taxes.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '20px', marginTop: 'var(--spacing-sm)' }}>
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth style={{ marginTop: 'var(--spacing-lg)' }} disabled={loading}>
            {loading 
              ? (paymentStatus === 'processing' ? 'Processing Payment...' : 'Placing Order...') 
              : paymentStatus === 'success' 
                ? 'Payment Successful!' 
                : paymentMethod === 'cash' 
                  ? 'Place Order (Cash on Delivery)' 
                  : 'Pay & Place Order'
            }
          </Button>
        </div>
      </form>
    </div>
  );
}
