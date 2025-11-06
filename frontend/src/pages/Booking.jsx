import { useEffect, useState } from 'react';
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
      navigate('/login', { state: { from: `/booking/${id}` } });
      return;
    }
    fetchService();
  }, [id, user, navigate]);

  const fetchService = async () => {
    try {
      const res = await api.get(`/services/${id}`);
      setService(res.data);
    } catch (error) {
      console.error('Error fetching service:', error);
      showToast('Failed to load service. Please try again.', 'error');
    } finally {
      setFetchingService(false);
    }
  };

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
      const bookingData = {
        serviceId: id,
        date: formData.date,
        time: formData.time,
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
                  <span>Price:</span>
                  <span className="price">${service.price}</span>
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
                'Confirm Booking'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;

