import { Link } from 'react-router-dom';
import './ServiceCard.css';

const ServiceCard = ({ service }) => {
  return (
    <div className="service-card">
      {service.image && (
        <div className="service-image">
          <img src={service.image} alt={service.name} />
        </div>
      )}
      <div className="service-content">
        <h3>{service.name}</h3>
        <p>{service.description}</p>
        <div className="service-info">
          <span className="service-price">${service.price}</span>
          <span className="service-duration">{service.duration} min</span>
        </div>
        <Link to={`/services/${service._id}`} className="service-btn">
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;

