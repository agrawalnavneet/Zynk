import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../utils/api';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AddToCartModal from '../components/AddToCartModal';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const [services, setServices] = useState([]);
  const [quickServices, setQuickServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get('/services');
      setServices(res.data.slice(0, 6)); // Show first 6 services
      
      // Fetch quick services by name (try both with and without isQuickService check)
      const quickServiceNames = ['Bathroom Cleaning', 'Room Cleaning', 'Kitchen Cleaning', 'Laundry Services'];
      let quick = res.data.filter(service => 
        quickServiceNames.includes(service.name) && service.isQuickService
      );
      
      // If no services found with isQuickService, try without that filter
      if (quick.length === 0) {
        quick = res.data.filter(service => quickServiceNames.includes(service.name));
      }
      
      console.log('Quick services found:', quick);
      setQuickServices(quick);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setLoading(false);
    }
  };

  const handleAddToCart = (serviceName) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Find the service by name
    const service = quickServices.find(s => s.name === serviceName);
    
    if (service) {
      setSelectedService(service);
      setShowModal(true);
    } else {
      // If service not found, navigate to services page
      showToast('Service loading... Please try again in a moment.', 'info');
      navigate('/services?filter=quick-service');
    }
  };

  const getQuickService = (name) => {
    return quickServices.find(s => s.name === name);
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>India's 15 Minute House Help Service</h1>
          <p className="hero-subtitle">Your home, professionally cleaned — exactly when you need it</p>
          <div className="hero-badge">
            ⚡ On-demand professional cleaners available 24x7
          </div>
          <p className="hero-description">No more planning around your house help. Our team of verified professionals are always on time.</p>
          <div className="hero-buttons">
            <Link to="/services" className="btn btn-primary">Book a Service</Link>
            <Link to="/services" className="btn btn-secondary">View Services</Link>
          </div>
        </div>
      </section>

      <section className="statistics">
        <div className="container">
          <div className="stat-item">
            <div className="stat-number">99,950+</div>
            <div className="stat-label">Homes cleaned</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">84,950+</div>
            <div className="stat-label">Hours saved</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">955+</div>
            <div className="stat-label">Zynkly professionals</div>
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

      <section className="quick-services-section">
        <div className="container">
          <div className="section-header">
            <h2>Quick Services - 15 Minutes</h2>
            <p className="section-subtitle">Get professional cleaning in just 15 minutes!</p>
          </div>
          <div className="quick-services-grid">
            {(() => {
              const bathroomService = getQuickService('Bathroom Cleaning');
              return (
                <div className="quick-service-item">
                  <div className="quick-service-icon">🚿</div>
                  <h3>Bathroom Cleaning</h3>
                  <p>Sanitization, scrubbing, and mirror cleaning</p>
                  <div className="quick-service-price">Starting at ₹{bathroomService?.price || 35}</div>
                  <div className="quick-service-time">⚡ 15 Minutes</div>
                  <div className="quick-service-actions">
                    <button 
                      onClick={() => handleAddToCart('Bathroom Cleaning')} 
                      className="quick-service-add-cart"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })()}
            
            {(() => {
              const roomService = getQuickService('Room Cleaning');
              return (
                <div className="quick-service-item">
                  <div className="quick-service-icon">🛏️</div>
                  <h3>Room Cleaning</h3>
                  <p>Dusting, vacuuming, bed making, and organizing</p>
                  <div className="quick-service-price">Starting at ₹{roomService?.price || 40}</div>
                  <div className="quick-service-time">⚡ 15 Minutes</div>
                  <div className="quick-service-actions">
                    <button 
                      onClick={() => handleAddToCart('Room Cleaning')} 
                      className="quick-service-add-cart"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })()}
            
            {(() => {
              const kitchenService = getQuickService('Kitchen Cleaning');
              return (
                <div className="quick-service-item">
                  <div className="quick-service-icon">🍳</div>
                  <h3>Kitchen Cleaning</h3>
                  <p>Counter cleaning, appliance wiping, and sanitization</p>
                  <div className="quick-service-price">Starting at ₹{kitchenService?.price || 45}</div>
                  <div className="quick-service-time">⚡ 15 Minutes</div>
                  <div className="quick-service-actions">
                    <button 
                      onClick={() => handleAddToCart('Kitchen Cleaning')} 
                      className="quick-service-add-cart"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })()}
            
            {(() => {
              const laundryService = getQuickService('Laundry Services');
              return (
                <div className="quick-service-item">
                  <div className="quick-service-icon">👔</div>
                  <h3>Laundry Services</h3>
                  <p>Wash, dry, and fold - all in 15 minutes!</p>
                  <div className="quick-service-price">Starting at ₹{laundryService?.price || 30}</div>
                  <div className="quick-service-time">⚡ 15 Minutes</div>
                  <div className="quick-service-actions">
                    <button 
                      onClick={() => handleAddToCart('Laundry Services')} 
                      className="quick-service-add-cart"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
          
          {selectedService && (
            <AddToCartModal 
              service={selectedService} 
              isOpen={showModal} 
              onClose={() => {
                setShowModal(false);
                setSelectedService(null);
              }} 
            />
          )}
        </div>
      </section>

      <section className="services-preview">
        <div className="container">
          <h2>All Our Services</h2>
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

      <section className="how-it-works">
        <div className="container">
          <h2>Simple Steps to a Cleaner Home</h2>
          <p className="section-subtitle">Follow these simple steps to get lightning-fast household help</p>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">STEP 1</div>
              <h3>Pick from a range of househelp services</h3>
              <p>Choose from our wide selection of cleaning services</p>
            </div>
            <div className="step">
              <div className="step-number">STEP 2</div>
              <h3>Add the service into your cart</h3>
              <p>Add multiple services to your cart and proceed to checkout</p>
            </div>
            <div className="step">
              <div className="step-number">STEP 3</div>
              <h3>Choose instant, scheduled, or recurring. Pay & done!</h3>
              <p>Select your preferred booking type and complete payment</p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <h2>User Reviews and Feedback</h2>
          <p className="section-subtitle">See how Zynkly has transformed users' experiences through their own words</p>
          <div className="testimonials-grid">
            <div className="testimonial">
              <div className="testimonial-content">
                <p>"I'd say it was great value for money. The urgency was handled well, without compromising quality. Really satisfied with the experience."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">K</div>
                <div className="author-info">
                  <div className="author-name">Kirti</div>
                  <div className="author-location">Sector 56</div>
                </div>
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonial-content">
                <p>"The service was simple and effective. It met my expectations without any hassle. Good overall experience."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">N</div>
                <div className="author-info">
                  <div className="author-name">Neha</div>
                  <div className="author-location">Sector 57</div>
                </div>
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonial-content">
                <p>"Great work, my home was left spotless and fresh. The cleaning was thorough, and I appreciated the attention to detail. I'll recommend it. 👍🏼"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">P</div>
                <div className="author-info">
                  <div className="author-name">Pradnyesh</div>
                  <div className="author-location">Suncity</div>
                </div>
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonial-content">
                <p>"Seamless experience from booking to completion. The staff was courteous, punctual, and did a fantastic job."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">R</div>
                <div className="author-info">
                  <div className="author-name">Ritika</div>
                  <div className="author-location">Sector 57</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>What is Zynkly?</h3>
              <p>Zynkly is India's 15-minute house help service app. We provide professional cleaning services on-demand, scheduled, or recurring basis.</p>
            </div>
            <div className="faq-item">
              <h3>How do I book services?</h3>
              <p>Simply browse our services, add them to your cart, and proceed to checkout. You can choose instant, scheduled, or recurring bookings.</p>
            </div>
            <div className="faq-item">
              <h3>Can I book a recurring service?</h3>
              <p>Yes! You can set up daily, weekly, or monthly recurring services for your convenience.</p>
            </div>
            <div className="faq-item">
              <h3>How can I trust your service?</h3>
              <p>All our professionals are verified and trained. We maintain high quality standards and have thousands of satisfied customers.</p>
            </div>
            <div className="faq-item">
              <h3>How are your services priced?</h3>
              <p>We offer flexible pricing with one-time, hourly, daily, weekly, monthly, and yearly plans. Prices vary by service type.</p>
            </div>
            <div className="faq-item">
              <h3>Where can I use Zynkly?</h3>
              <p>We are currently available in major cities. Check our services page for availability in your area.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

