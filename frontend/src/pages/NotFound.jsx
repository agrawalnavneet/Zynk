import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-message">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link to="/" className="not-found-btn">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

