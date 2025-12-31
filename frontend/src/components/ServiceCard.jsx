import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './ServiceCard.css';

const ServiceCard = ({ service }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const isQuickService = service.isQuickService || service.duration === 15;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(service, 'one-time');
    showToast(`✅ ${service.name} added to cart!`, 'success');
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

          {/* <button onClick={handleAddToCart} className="service-btn-cart">
             Book Now
          </button> */}
          <Link to={`/services/${service._id}`} className="service-btn">
            View Details
          </Link>
          <button onClick={handleAddToCart} className="service-btn-cart">
            🛒 Add to Cart
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;

