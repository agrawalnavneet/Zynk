import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <h1>About Zynkly</h1>
        <p className="about-hero-tagline">
          We're building India's fastest and most reliable house help service — so you never have to wait for a clean home again.
        </p>
        <div className="about-hero-badge">⚡ India's 15-Minute House Help Service</div>
      </section>

      {/* Our Story */}
      <section className="about-section about-story">
        <h2 className="about-section-title">Our Story</h2>
        <p className="about-section-subtitle">
          From a simple idea to transforming how India keeps homes clean
        </p>
        <div className="about-story-content">
          <p>
            Zynkly was born out of a simple frustration — the unreliable nature of household help in India. 
            Missed appointments, last-minute cancellations, and inconsistent quality made keeping a clean home 
            stressful rather than effortless.
          </p>
          <p>
            We set out to change that. Zynkly connects homeowners with verified, trained cleaning professionals 
            who arrive at your doorstep in as little as 15 minutes. Whether it's a quick bathroom scrub, 
            a full-home deep clean, or recurring daily help — we've built a platform that puts convenience, 
            quality, and trust at the centre of every booking.
          </p>
          <p>
            Today, Zynkly serves hundreds of happy homes across India and is rapidly growing. Our mission is simple: 
            make professional cleaning accessible, affordable, and on-demand for every Indian household.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="about-section">
        <h2 className="about-section-title">Mission & Vision</h2>
        <p className="about-section-subtitle">What drives us every single day</p>
        <div className="about-mv-grid">
          <div className="about-mv-card">
            <div className="about-mv-icon">🎯</div>
            <h3>Our Mission</h3>
            <p>
              To provide on-demand, affordable, and professional house help to every Indian household — 
              delivered with speed, reliability, and a smile.
            </p>
          </div>
          <div className="about-mv-card">
            <div className="about-mv-icon">🔭</div>
            <h3>Our Vision</h3>
            <p>
              To become India's most trusted household services platform, where booking a cleaner is as easy 
              and fast as ordering food online.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        <div className="about-stats-grid">
          <div className="about-stat-item">
            <h3>99+</h3>
            <p>Homes Cleaned</p>
          </div>
          <div className="about-stat-item">
            <h3>215+</h3>
            <p>Hours Saved</p>
          </div>
          <div className="about-stat-item">
            <h3>50+</h3>
            <p>Professionals</p>
          </div>
          <div className="about-stat-item">
            <h3>15 min</h3>
            <p>Avg. Response</p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="about-section">
        <h2 className="about-section-title">Our Core Values</h2>
        <p className="about-section-subtitle">The principles that guide everything we do at Zynkly</p>
        <div className="about-values-grid">
          <div className="about-value-card">
            <div className="about-value-icon">⚡</div>
            <h3>Speed</h3>
            <p>15-minute service — because your time matters. We deliver fast without cutting corners.</p>
          </div>
          <div className="about-value-card">
            <div className="about-value-icon">🛡️</div>
            <h3>Trust & Safety</h3>
            <p>Every professional is background-verified and trained to meet our quality standards.</p>
          </div>
          <div className="about-value-card">
            <div className="about-value-icon">💰</div>
            <h3>Affordability</h3>
            <p>Premium cleaning at honest prices. No hidden charges, no surprises on your bill.</p>
          </div>
          <div className="about-value-card">
            <div className="about-value-icon">🤝</div>
            <h3>Reliability</h3>
            <p>When we say we'll be there, we'll be there. Consistent quality, every single time.</p>
          </div>
          <div className="about-value-card">
            <div className="about-value-icon">😊</div>
            <h3>Customer First</h3>
            <p>Your satisfaction is our success. We listen, improve, and always put you first.</p>
          </div>
          <div className="about-value-card">
            <div className="about-value-icon">🌱</div>
            <h3>Eco-Friendly</h3>
            <p>We use safe, environmentally responsible cleaning products that protect your home and the planet.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <h2>Ready for a Spotless Home?</h2>
        <p>Experience the Zynkly difference — professional cleaning at lightning speed.</p>
        <div className="about-cta-buttons">
          <Link to="/services" className="about-cta-btn primary" id="about-cta-services">
            Browse Services
          </Link>
          <Link to="/contact" className="about-cta-btn outline" id="about-cta-contact">
            Get In Touch
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
