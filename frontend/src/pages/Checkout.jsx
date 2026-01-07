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
  const [plan, setPlan] = useState('one-time');
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    PgName: '',
    RoomNo: '',
    Landmark: '',
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

    // Set the plan based on cart items (assuming all items have same plan)
    if (cartItems.length > 0) {
      setPlan(cartItems[0].plan);
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
      if (window.Razorpay) {
        resolve(true);
        return;
      }

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

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey || razorpayKey === 'your_razorpay_key_id' || razorpayKey.trim() === '') {
      showToast('Payment gateway not configured. Please set VITE_RAZORPAY_KEY_ID in frontend/.env file.', 'error');
      console.error('❌ Razorpay Key ID not configured. Current value:', razorpayKey);
      setLoading(false);
      return;
    }

    // CHECK: Validate key format but ALLOW test keys (with warning)
    if (razorpayKey.startsWith('rzp_test_')) {
      console.warn('⚠️  WARNING: Test keys detected! Transactions will be simulated.');
      // We do NOT return here, allowing the process to continue
    } else if (!razorpayKey.startsWith('rzp_live_')) {
      showToast('Invalid key format. Keys should start with "rzp_live_" or "rzp_test_".', 'error');
      console.error('❌ ERROR: Invalid Razorpay Key ID format.');
      setLoading(false);
      return;
    }

    console.log(`✅ Using Razorpay Key: ${razorpayKey.substring(0, 10)}...`);

    console.log('✅ Using Razorpay LIVE mode');

    console.log('🔄 Initiating Payment Flow...');

    try {
      console.log('⏳ Creating Order on Backend...');
      const orderRes = await api.post('/payment/create-order', {
        amount: getTotalPrice(),
        currency: 'INR',
      });

      console.log('✅ Order Created:', orderRes.data);

      if (!orderRes.data.orderId) {
        console.error('❌ Failed to get orderId from backend');
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
          console.log('✅ Payment Handler Triggered. Response:', response);
          try {
            setLoading(true);
            console.log('⏳ Verifying Payment on Backend...');
            const verifyRes = await api.post('/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingIds,
            });

            console.log('✅ Verification Response:', verifyRes.data);

            if (verifyRes.data.success) {
              clearCart();
              showToast('Payment successful! Bookings confirmed.', 'success');
              navigate('/thank-you');
            } else {
              console.error('❌ Verification Failed:', verifyRes.data);
              showToast(verifyRes.data.message || 'Payment verification failed', 'error');
              setLoading(false);
            }
          } catch (error) {
            console.error('❌ Payment verification error:', error);
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
          ondismiss: function () {
            console.log('⚠️ Payment Modal Dismissed by User');
            showToast('Payment cancelled', 'info');
            setLoading(false);
          },
        },
      };

      console.log('🔄 Opening Razorpay Modal with options:', { ...options, key: '***' });
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        console.error('❌ Razorpay Event: payment.failed', response);
        showToast(`Payment failed: ${response.error.description || 'Unknown error'}`, 'error');
        setLoading(false);
      });
      razorpay.open();
    } catch (error) {
      console.error('❌ Exception in handlePayment:', error);
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

    if (!formData.PgName || !formData.RoomNo || !formData.Landmark) {
      showToast('Please fill all address fields', 'error');
      return;
    }

    setLoading(true);

    try {
      // Create bookings for each cart item
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
          PgName: formData.PgName,
          RoomNo: formData.RoomNo,
          Landmark: formData.Landmark,
          specialInstructions: formData.specialInstructions,
          totalPrice: getTotalPrice(),
        };
        return api.post('/bookings', bookingData);
      });

      const bookingResponses = await Promise.all(bookingPromises);
      const bookingIds = bookingResponses.map(res => res.data._id);

      // Proceed to payment
      setLoading(false);
      await handlePayment(bookingIds);
    } catch (error) {
      console.error('❌ Error creating bookings:', error);

      // Smart Error Handling for Stale Cart Items
      if (error.response?.status === 404 && error.response?.data?.message === 'Service not found') {
        showToast('⚠️ Some items in your cart are no longer available. Please clear your cart and try again.', 'error');
        // Optional: We could auto-clear here, but better to let user know
      } else {
        const errorMessage = error.response?.data?.message || 'Error creating bookings. Please try again.';
        showToast(errorMessage, 'error');
      }

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
                      {item.plan === 'one-time' ? 'One-Time' :
                        item.plan === 'hourly' ? 'Hourly' :
                          item.plan === 'daily' ? 'Daily' :
                            item.plan === 'weekly' ? 'Weekly' :
                              item.plan === 'monthly' ? 'Monthly' :
                                item.plan === 'yearly' ? 'Yearly' :
                                  item.plan.charAt(0).toUpperCase() + item.plan.slice(1)}
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
              <p>📋 Plan: {plan === 'one-time' ? 'One-Time' : plan.charAt(0).toUpperCase() + plan.slice(1)}</p>
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
              <label>PG Name *</label>
              <input
                type="text"
                name="PgName"
                value={formData.PgName}
                onChange={handleChange}
                required
                placeholder="e.g., Crown Villa"
              />
            </div>

            <div className="form-group">
              <label>Room No. *</label>
              <input
                type="text"
                name="RoomNo"
                value={formData.RoomNo}
                onChange={handleChange}
                required
                placeholder="e.g., 202"
              />
            </div>

            <div className="form-group">
              <label>Landmark *</label>
              <input
                type="text"
                name="Landmark"
                value={formData.Landmark}
                onChange={handleChange}
                required
                placeholder="e.g., Near 24 Hrs Restaurant"
              />
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