import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './ServiceDetail.css';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const res = await api.get(`/services/${id}`);
      setService(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching service:', error);
      showToast('Failed to load service. Please try again.', 'error');
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!user) {
      navigate('/login', { state: { from: `/services/${id}` } });
    } else {
      navigate(`/booking/${id}`);
    }
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
            <h1>{service.name}</h1>
            <p className="service-description">{service.description}</p>
            
            <div className="service-details">
              <div className="detail-item">
                <span className="detail-label">Price:</span>
                <span className="detail-value">${service.price}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Duration:</span>
                <span className="detail-value">{service.duration} minutes</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Category:</span>
                <span className="detail-value">{service.category}</span>
              </div>
            </div>

            <button onClick={handleBookNow} className="book-now-btn">
              Book This Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;

