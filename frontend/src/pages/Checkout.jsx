import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './Checkout.css';

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bookingType, setBookingType] = useState('scheduled');
  const [recurringFrequency, setRecurringFrequency] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    specialInstructions: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      navigate('/services');
      showToast('Your cart is empty', 'info');
    }
  }, [user, cartItems, navigate, showToast]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      // Check if Razorpay is already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        existingScript.onload = () => resolve(true);
        existingScript.onerror = () => resolve(false);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (bookingIds) => {
    const razorpayLoaded = await loadRazorpay();
    if (!razorpayLoaded) {
      showToast('Razorpay SDK failed to load. Please refresh the page.', 'error');
      setLoading(false);
      return;
    }

    // Check if Razorpay key is configured (LIVE mode only)
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey || razorpayKey === 'your_razorpay_key_id' || razorpayKey.trim() === '') {
      showToast('Payment gateway not configured. Please set VITE_RAZORPAY_KEY_ID (LIVE key) in frontend/.env file.', 'error');
      console.error('❌ Razorpay Key ID not configured. Current value:', razorpayKey);
      setLoading(false);
      return;
    }
    
    // STRICT VALIDATION: Reject test keys - only allow LIVE keys
    if (razorpayKey.startsWith('rzp_test_')) {
      showToast('Test keys detected! This application requires LIVE keys. Please update frontend/.env with LIVE keys starting with "rzp_live_".', 'error');
      console.error('❌ ERROR: Test keys detected! Key ID starts with "rzp_test_"');
      console.error('❌ Please use LIVE keys starting with "rzp_live_"');
      console.error('❌ Get LIVE keys from: https://dashboard.razorpay.com/app/keys');
      setLoading(false);
      return;
    }
    
    if (!razorpayKey.startsWith('rzp_live_')) {
      showToast('Invalid key format. Keys must start with "rzp_live_" for LIVE mode. Please check your frontend/.env file.', 'error');
      console.error('❌ ERROR: Invalid Razorpay Key ID format. Key must start with "rzp_live_" for LIVE mode.');
      console.error('❌ Current Key ID:', razorpayKey.substring(0, 20) + '...');
      setLoading(false);
      return;
    }
    
    console.log('✅ Using Razorpay LIVE mode');
    console.log('⚠️  WARNING: This is LIVE mode - all payments are REAL transactions!');

    try {
      // Create Razorpay order
      const orderRes = await api.post('/payment/create-order', {
        amount: getTotalPrice(),
        currency: 'INR',
      });

      if (!orderRes.data.orderId) {
        showToast(orderRes.data.message || 'Failed to create payment order', 'error');
        setLoading(false);
        return;
      }

      const options = {
        key: razorpayKey,
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: 'Zynkly',
        description: 'Service Booking Payment',
        order_id: orderRes.data.orderId,
        handler: async function (response) {
          try {
            setLoading(true);
            // Verify payment
            const verifyRes = await api.post('/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingIds,
            });

            if (verifyRes.data.success) {
              clearCart();
              showToast('Payment successful! Bookings confirmed.', 'success');
              navigate('/dashboard');
            } else {
              showToast(verifyRes.data.message || 'Payment verification failed', 'error');
              setLoading(false);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            const errorMessage = error.response?.data?.message || 'Payment verification failed. Please contact support.';
            showToast(errorMessage, 'error');
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#10b981',
        },
        modal: {
          ondismiss: function() {
            showToast('Payment cancelled', 'info');
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response);
        showToast(`Payment failed: ${response.error.description || 'Unknown error'}`, 'error');
        setLoading(false);
      });
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error.response?.data?.message || 'Error initiating payment. Please try again.';
      showToast(errorMessage, 'error');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (bookingType === 'recurring' && !recurringFrequency) {
      showToast('Please select recurring frequency', 'error');
      return;
    }

    if (bookingType === 'scheduled' && (!formData.date || !formData.time)) {
      showToast('Please select date and time for scheduled booking', 'error');
      return;
    }

    setLoading(true);

    try {
      // Create bookings for each cart item (with pending payment)
      const bookingPromises = cartItems.map(item => {
        const bookingData = {
          serviceId: item.service._id,
          date: bookingType === 'instant' 
            ? new Date().toISOString() 
            : formData.date,
          time: bookingType === 'instant' 
            ? new Date().toTimeString().slice(0, 5)
            : formData.time,
          plan: item.plan,
          bookingType,
          recurringFrequency: bookingType === 'recurring' ? recurringFrequency : undefined,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
          },
          specialInstructions: formData.specialInstructions,
        };
        return api.post('/bookings', bookingData);
      });

      const bookingResponses = await Promise.all(bookingPromises);
      const bookingIds = bookingResponses.map(res => res.data._id);

      // Proceed to payment
      setLoading(false);
      await handlePayment(bookingIds);
    } catch (error) {
      console.error('Error creating bookings:', error);
      const errorMessage = error.response?.data?.message || 'Error creating bookings. Please try again.';
      showToast(errorMessage, 'error');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Checkout & Payment</h1>
          <p className="checkout-subtitle">Review your order and complete payment</p>
        </div>
        
        <div className="checkout-content">
          <div className="checkout-summary">
            <div className="summary-header">
              <h2>📦 Order Summary</h2>
              <p className="summary-item-count">{cartItems.length} {cartItems.length === 1 ? 'service' : 'services'} in cart</p>
            </div>
            <div className="summary-items">
              {cartItems.map((item, index) => (
                <div key={`${item.service._id}-${item.plan}-${index}`} className="summary-item">
                  <div className="summary-item-info">
                    <h4>{item.service.name}</h4>
                    <p>
                      {item.plan === 'one-time' ? 'One-Time' : item.plan.charAt(0).toUpperCase() + item.plan.slice(1)} 
                      × {item.quantity}
                    </p>
                  </div>
                  <div className="summary-item-price">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <span>Total Amount:</span>
              <span className="total-price">₹{getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="summary-note">
              <p>💳 Payment will be processed securely through Razorpay</p>
            </div>
          </div>

          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2>Booking Details</h2>

            <div className="form-group">
              <label>Booking Type *</label>
              <div className="booking-type-options">
                <button
                  type="button"
                  className={`booking-type-btn ${bookingType === 'instant' ? 'active' : ''}`}
                  onClick={() => setBookingType('instant')}
                >
                  ⚡ Instant
                  <span>Get service now</span>
                </button>
                <button
                  type="button"
                  className={`booking-type-btn ${bookingType === 'scheduled' ? 'active' : ''}`}
                  onClick={() => setBookingType('scheduled')}
                >
                  📅 Scheduled
                  <span>Book for later</span>
                </button>
                <button
                  type="button"
                  className={`booking-type-btn ${bookingType === 'recurring' ? 'active' : ''}`}
                  onClick={() => setBookingType('recurring')}
                >
                  🔄 Recurring
                  <span>Repeat service</span>
                </button>
              </div>
            </div>

            {bookingType === 'recurring' && (
              <div className="form-group">
                <label>Recurring Frequency *</label>
                <select
                  value={recurringFrequency}
                  onChange={(e) => setRecurringFrequency(e.target.value)}
                  required
                  className="form-select"
                >
                  <option value="">Select frequency</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}

            {bookingType === 'scheduled' && (
              <>
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label>Time *</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label>Street Address *</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
                placeholder="123 Main St"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Zip Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Special Instructions</label>
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                rows="4"
                placeholder="Any special requests or instructions..."
              />
            </div>

            <div className="payment-section">
              <div className="payment-total">
                <div className="payment-summary-header">
                  <h3>Payment Summary</h3>
                </div>
                <div className="payment-total-row">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                  <span>₹{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="payment-total-row final-total">
                  <span>Total Amount to Pay:</span>
                  <span className="payment-total-amount">₹{getTotalPrice().toFixed(2)}</span>
                </div>
                <p className="payment-note">💳 Secure payment via Razorpay | All prices in INR</p>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <LoadingSpinner size="small" />
                    Processing...
                  </>
                ) : (
                  <>
                    <span>💳 Pay ₹{getTotalPrice().toFixed(2)}</span>
                    <span className="btn-subtitle">Secure Payment via Razorpay</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

