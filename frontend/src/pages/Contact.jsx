import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import './Contact.css';

const Contact = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    setSubmitting(true);

    // Simulate sending (replace with actual API call later)
    setTimeout(() => {
      showToast('Your message has been sent! We\'ll get back to you shortly.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 1200);
  };

  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="contact-hero">
        <div className="contact-hero-icon">🎧</div>
        <h1>How can we help?</h1>
        <p>We're here to make your experience better</p>
      </section>

      {/* Contact Content */}
      <div className="contact-content">
        <h2 className="contact-section-title">Contact Us</h2>

        <div className="contact-cards">
          {/* Email */}
          <a href="mailto:support@zynkly.com" className="contact-card" id="contact-email-card">
            <div className="contact-card-icon">📧</div>
            <div className="contact-card-info">
              <div className="contact-card-title">Email Us</div>
              <div className="contact-card-value">support@zynkly.com</div>
              <div className="contact-card-description">We typically respond within 24 hours</div>
            </div>
            <div className="contact-card-arrow">›</div>
          </a>

          {/* Phone */}
          <a href="tel:+917722962773" className="contact-card" id="contact-phone-card">
            <div className="contact-card-icon">📞</div>
            <div className="contact-card-info">
              <div className="contact-card-title">Call Us</div>
              <div className="contact-card-value">+91 77229 62773</div>
              <div className="contact-card-description">Available Mon–Sat, 9 AM – 7 PM</div>
            </div>
            <div className="contact-card-arrow">›</div>
          </a>

          {/* Alternate Number */}
          <a href="tel:+919878161279" className="contact-card" id="contact-alternate-card">
            <div className="contact-card-icon">📱</div>
            <div className="contact-card-info">
              <div className="contact-card-title">Alternate Number</div>
              <div className="contact-card-value">+91 9878161279</div>
              <div className="contact-card-description">Available Mon–Sat, 9 AM – 7 PM</div>
            </div>
            <div className="contact-card-arrow">›</div>
          </a>
        </div>

        {/* Contact Form */}
        <div className="contact-form-section">
          <h2 className="contact-section-title">Send Us a Message</h2>
          <form className="contact-form" onSubmit={handleSubmit} id="contact-form">
            <div className="contact-form-row">
              <div className="contact-form-group">
                <label htmlFor="contact-name">Name *</label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="contact-form-group">
                <label htmlFor="contact-email">Email *</label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="contact-form-group">
              <label htmlFor="contact-subject">Subject</label>
              <select
                id="contact-subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              >
                <option value="">Select a topic</option>
                <option value="booking">Booking Issue</option>
                <option value="payment">Payment Issue</option>
                <option value="service">Service Quality</option>
                <option value="feedback">General Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="contact-form-group">
              <label htmlFor="contact-message">Message *</label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="How can we help you?"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="contact-form-submit"
              disabled={submitting}
              id="contact-submit-btn"
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Office Address */}
        <div className="contact-office">
          <h2 className="contact-section-title">Our Office</h2>
          <div className="office-card">
            <div className="office-icon">📍</div>
            <div className="office-details">
              <h3>Zynkly Headquarters</h3>
              <p>India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
