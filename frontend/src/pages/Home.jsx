import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../utils/api';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './Home.css';

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get('/services');
      setServices(res.data.slice(0, 6)); // Show first 6 services
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Professional Home Cleaning Services</h1>
          <p>Trusted, reliable, and affordable cleaning solutions for your home</p>
          <div className="hero-buttons">
            <Link to="/services" className="btn btn-primary">Book a Service</Link>
            <Link to="/services" className="btn btn-secondary">View Services</Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">✓</div>
              <h3>Professional Cleaners</h3>
              <p>Experienced and trained professionals</p>
            </div>
            <div className="feature">
              <div className="feature-icon">✓</div>
              <h3>Flexible Scheduling</h3>
              <p>Book at your convenience</p>
            </div>
            <div className="feature">
              <div className="feature-icon">✓</div>
              <h3>Affordable Prices</h3>
              <p>Competitive pricing for quality service</p>
            </div>
            <div className="feature">
              <div className="feature-icon">✓</div>
              <h3>100% Satisfaction</h3>
              <p>Guaranteed quality service</p>
            </div>
          </div>
        </div>
      </section>

      <section className="services-preview">
        <div className="container">
          <h2>Our Services</h2>
          {loading ? (
            <LoadingSpinner size="large" />
          ) : (
            <div className="services-grid">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          )}
          <div className="view-all">
            <Link to="/services" className="btn btn-outline">View All Services</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

