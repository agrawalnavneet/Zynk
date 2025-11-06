import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Zynkly</h3>
          <p>Professional home cleaning services at your doorstep.</p>
        </div>
        <div className="footer-section">
          <h4>Services</h4>
          <ul>
            <li>Deep Cleaning</li>
            <li>Regular Cleaning</li>
            <li>Move-in/out</li>
            <li>Office Cleaning</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: info@zynkly.com</p>
          <p>Phone: +1 (555) 123-4567</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Zynkly. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

