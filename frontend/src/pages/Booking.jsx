import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './Booking.css';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingService, setFetchingService] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('one-time');
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

  const fetchService = useCallback(async () => {
    try {
      const res = await api.get(`/services/${id}`);
      setService(res.data);
    } catch (error) {
      console.error('Error fetching service:', error);
      showToast('Failed to load service. Please try again.', 'error');
    } finally {
      setFetchingService(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: `/booking/${id}` } });
      return;
    }
    fetchService();
  }, [id, user, navigate, fetchService]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (bookingType === 'recurring' && !recurringFrequency) {
        showToast('Please select recurring frequency', 'error');
        setLoading(false);
        return;
      }

      if (bookingType === 'scheduled' && (!formData.date || !formData.time)) {
        showToast('Please select date and time for scheduled booking', 'error');
        setLoading(false);
        return;
      }

      const bookingData = {
        serviceId: id,
        date: bookingType === 'instant' ? new Date().toISOString() : formData.date,
        time: bookingType === 'instant' ? new Date().toTimeString().slice(0, 5) : formData.time,
        plan: selectedPlan,
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

      await api.post('/bookings', bookingData);
      showToast('Booking created successfully!', 'success');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating booking:', error);
      const errorMessage = error.response?.data?.message || 'Error creating booking. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingService) {
    return (
      <div className="booking-page">
        <div className="container">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="booking-page">
        <div className="container">
          <div className="error-message">Service not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="container">
        <h1>Book Service</h1>
        
        <div className="booking-content">
          <div className="booking-summary">
            <h2>Service Summary</h2>
            <div className="summary-card">
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="summary-details">
                <div className="summary-item">
                  <span>Plan:</span>
                  <span className="plan-name">{selectedPlan === 'one-time' ? 'One-Time' : selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}</span>
                </div>
                <div className="summary-item">
                  <span>Price:</span>
                  <span className="price">
                    ${selectedPlan === 'one-time' 
                      ? service.price 
                      : (service.pricingPlans && service.pricingPlans[selectedPlan]) 
                        ? service.pricingPlans[selectedPlan] 
                        : service.price}
                  </span>
                </div>
                <div className="summary-item">
                  <span>Duration:</span>
                  <span>{service.duration} minutes</span>
                </div>
              </div>
            </div>
          </div>

          <form className="booking-form" onSubmit={handleSubmit}>
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
            
            {service.pricingPlans && Object.keys(service.pricingPlans).some(key => service.pricingPlans[key] !== null) && (
              <div className="form-group">
                <label>Select Plan *</label>
                <div className="plan-options">
                  <button
                    type="button"
                    className={`plan-option ${selectedPlan === 'one-time' ? 'active' : ''}`}
                    onClick={() => setSelectedPlan('one-time')}
                  >
                    <div className="plan-label">One-Time</div>
                    <div className="plan-price">${service.price}</div>
                  </button>
                  {service.pricingPlans.hourly && (
                    <button
                      type="button"
                      className={`plan-option ${selectedPlan === 'hourly' ? 'active' : ''}`}
                      onClick={() => setSelectedPlan('hourly')}
                    >
                      <div className="plan-label">Hourly</div>
                      <div className="plan-price">${service.pricingPlans.hourly}</div>
                    </button>
                  )}
                  {service.pricingPlans.daily && (
                    <button
                      type="button"
                      className={`plan-option ${selectedPlan === 'daily' ? 'active' : ''}`}
                      onClick={() => setSelectedPlan('daily')}
                    >
                      <div className="plan-label">Daily</div>
                      <div className="plan-price">${service.pricingPlans.daily}</div>
                    </button>
                  )}
                  {service.pricingPlans.weekly && (
                    <button
                      type="button"
                      className={`plan-option ${selectedPlan === 'weekly' ? 'active' : ''}`}
                      onClick={() => setSelectedPlan('weekly')}
                    >
                      <div className="plan-label">Weekly</div>
                      <div className="plan-price">${service.pricingPlans.weekly}</div>
                    </button>
                  )}
                  {service.pricingPlans.monthly && (
                    <button
                      type="button"
                      className={`plan-option ${selectedPlan === 'monthly' ? 'active' : ''}`}
                      onClick={() => setSelectedPlan('monthly')}
                    >
                      <div className="plan-label">Monthly</div>
                      <div className="plan-price">${service.pricingPlans.monthly}</div>
                    </button>
                  )}
                  {service.pricingPlans.yearly && (
                    <button
                      type="button"
                      className={`plan-option ${selectedPlan === 'yearly' ? 'active' : ''}`}
                      onClick={() => setSelectedPlan('yearly')}
                    >
                      <div className="plan-label">Yearly</div>
                      <div className="plan-price">${service.pricingPlans.yearly}</div>
                    </button>
                  )}
                </div>
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

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner size="small" />
                  Booking...
                </>
              ) : (
                `Confirm ${bookingType === 'instant' ? 'Instant' : bookingType === 'scheduled' ? 'Scheduled' : 'Recurring'} Booking`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;

