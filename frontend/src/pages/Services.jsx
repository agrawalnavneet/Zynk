import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './Services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState(searchParams.get('filter') || 'all');

  useEffect(() => {
    fetchServices();
    // Check for filter in URL params
    const urlFilter = searchParams.get('filter');
    if (urlFilter) {
      setFilter(urlFilter);
    }
  }, [searchParams]);

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
            onClick={() => {
              setFilter('all');
              setSearchParams({});
            }}
          >
            All Services
          </button>
          <button 
            className={filter === 'deep-cleaning' ? 'active' : ''} 
            onClick={() => {
              setFilter('deep-cleaning');
              setSearchParams({ filter: 'deep-cleaning' });
            }}
          >
            Deep Cleaning
          </button>
          <button 
            className={filter === 'regular-cleaning' ? 'active' : ''} 
            onClick={() => {
              setFilter('regular-cleaning');
              setSearchParams({ filter: 'regular-cleaning' });
            }}
          >
            Regular Cleaning
          </button>
          <button 
            className={filter === 'move-in-out' ? 'active' : ''} 
            onClick={() => {
              setFilter('move-in-out');
              setSearchParams({ filter: 'move-in-out' });
            }}
          >
            Move-in/out
          </button>
          <button 
            className={filter === 'office-cleaning' ? 'active' : ''} 
            onClick={() => {
              setFilter('office-cleaning');
              setSearchParams({ filter: 'office-cleaning' });
            }}
          >
            Office Cleaning
          </button>
          <button 
            className={filter === 'quick-service' ? 'active' : ''} 
            onClick={() => {
              setFilter('quick-service');
              setSearchParams({ filter: 'quick-service' });
            }}
          >
            Quick Service (15 min)
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

