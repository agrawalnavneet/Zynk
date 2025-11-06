import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './Services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get('/services');
      setServices(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setLoading(false);
    }
  };

  const filteredServices = filter === 'all' 
    ? services 
    : services.filter(service => service.category === filter);

  return (
    <div className="services-page">
      <div className="container">
        <h1>Our Cleaning Services</h1>
        <p className="page-subtitle">Choose the perfect cleaning service for your needs</p>

        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All Services
          </button>
          <button 
            className={filter === 'deep-cleaning' ? 'active' : ''} 
            onClick={() => setFilter('deep-cleaning')}
          >
            Deep Cleaning
          </button>
          <button 
            className={filter === 'regular-cleaning' ? 'active' : ''} 
            onClick={() => setFilter('regular-cleaning')}
          >
            Regular Cleaning
          </button>
          <button 
            className={filter === 'move-in-out' ? 'active' : ''} 
            onClick={() => setFilter('move-in-out')}
          >
            Move-in/out
          </button>
          <button 
            className={filter === 'office-cleaning' ? 'active' : ''} 
            onClick={() => setFilter('office-cleaning')}
          >
            Office Cleaning
          </button>
        </div>

        {loading ? (
          <LoadingSpinner size="large" />
        ) : (
          <div className="services-grid">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))
            ) : (
              <div className="no-services">No services found in this category.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;

