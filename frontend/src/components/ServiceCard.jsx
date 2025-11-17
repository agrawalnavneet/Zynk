import { useState } from 'react';
import { Link } from 'react-router-dom';
import AddToCartModal from './AddToCartModal';
import './ServiceCard.css';

const ServiceCard = ({ service }) => {
  const [showModal, setShowModal] = useState(false);
  const isQuickService = service.isQuickService || service.duration === 15;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };
  
  return (
    <div className="service-card">
      {isQuickService && (
        <div className="quick-service-badge">⚡ 15 Min Service</div>
      )}
      {service.image && (
        <div className="service-image">
          <img src={service.image} alt={service.name} />
        </div>
      )}
      <div className="service-content">
        <h3>{service.name}</h3>
        <p>{service.description}</p>
        <div className="service-info">
          <span className="service-price">₹{service.price}</span>
          <span className="service-duration">{service.duration} min</span>
        </div>
        <div className="service-actions">
          <Link to={`/services/${service._id}`} className="service-btn">
            View Details
          </Link>
          <button onClick={handleAddToCart} className="service-btn-cart">
            🛒 Add to Cart
          </button>
        </div>
      </div>
      <AddToCartModal 
        service={service} 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </div>
  );
};

export default ServiceCard;

