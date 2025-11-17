import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AddToCartModal from '../components/AddToCartModal';
import './ServiceDetail.css';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCartModal, setShowCartModal] = useState(false);

  const fetchService = useCallback(async () => {
    try {
      const res = await api.get(`/services/${id}`);
      setService(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching service:', error);
      showToast('Failed to load service. Please try again.', 'error');
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  const handleBookNow = () => {
    if (!user) {
      navigate('/login', { state: { from: `/services/${id}` } });
      return;
    }
    // Show cart modal to select plan
    setShowCartModal(true);
  };

  if (loading) {
    return (
      <div className="service-detail">
        <div className="container">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="service-detail">
        <div className="container">
          <div className="error">Service not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="service-detail">
      <div className="container">
        <Link to="/services" className="back-link">← Back to Services</Link>
        
        <div className="service-detail-content">
          {service.image && (
            <div className="service-detail-image">
              <img src={service.image} alt={service.name} />
            </div>
          )}
          
          <div className="service-detail-info">
            <div className="service-header">
              <h1>{service.name}</h1>
              {(service.isQuickService || service.duration === 15) && (
                <div className="quick-service-badge-large">⚡ 15 Min Service</div>
              )}
            </div>
            <p className="service-description">{service.description}</p>
            
            <div className="service-details">
              <div className="detail-item">
                <span className="detail-label">One-Time Price:</span>
                <span className="detail-value">${service.price}</span>
              </div>
              {service.pricingPlans && Object.keys(service.pricingPlans).some(key => service.pricingPlans[key] !== null) && (
                <div className="detail-item plans-section">
                  <span className="detail-label">Available Plans:</span>
                  <div className="plans-preview">
                    {service.pricingPlans.hourly && (
                      <span className="plan-badge">Hourly: ${service.pricingPlans.hourly}</span>
                    )}
                    {service.pricingPlans.daily && (
                      <span className="plan-badge">Daily: ${service.pricingPlans.daily}</span>
                    )}
                    {service.pricingPlans.weekly && (
                      <span className="plan-badge">Weekly: ${service.pricingPlans.weekly}</span>
                    )}
                    {service.pricingPlans.monthly && (
                      <span className="plan-badge">Monthly: ${service.pricingPlans.monthly}</span>
                    )}
                    {service.pricingPlans.yearly && (
                      <span className="plan-badge">Yearly: ${service.pricingPlans.yearly}</span>
                    )}
                  </div>
                </div>
              )}
              <div className="detail-item">
                <span className="detail-label">Duration:</span>
                <span className="detail-value">{service.duration} minutes</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Category:</span>
                <span className="detail-value">{service.category}</span>
              </div>
            </div>

            <div className="service-actions-detail">
              <button onClick={handleBookNow} className="book-now-btn">
                🛒 Add to Cart & Book
              </button>
            </div>
          </div>
        </div>
      </div>
      <AddToCartModal 
        service={service} 
        isOpen={showCartModal} 
        onClose={() => setShowCartModal(false)} 
      />
    </div>
  );
};

export default ServiceDetail;

