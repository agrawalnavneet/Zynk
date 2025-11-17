import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './AddToCartModal.css';

const AddToCartModal = ({ service, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState('one-time');

  // Reset plan when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedPlan('one-time');
    }
  }, [isOpen]);

  if (!isOpen || !service) {
    return null;
  }

  const handleAddToCart = () => {
    addToCart(service, selectedPlan);
    const planName = selectedPlan === 'one-time' ? 'One-Time' : selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1);
    showToast(`✅ ${service.name} (${planName}) added to cart! View cart to proceed.`, 'success');
    onClose();
  };

  const getPrice = (plan) => {
    if (plan === 'one-time') {
      return service.price;
    }
    return service.pricingPlans && service.pricingPlans[plan] 
      ? service.pricingPlans[plan] 
      : service.price;
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="add-to-cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add to Cart</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <div className="service-info-modal">
            <h4>{service.name}</h4>
            <p className="service-description-modal">{service.description}</p>
          </div>

          {service.pricingPlans && Object.keys(service.pricingPlans).some(key => service.pricingPlans[key] !== null) ? (
            <div className="plan-selection">
              <label>Select Plan *</label>
              <div className="plan-options-modal">
                <button
                  type="button"
                  className={`plan-option-modal ${selectedPlan === 'one-time' ? 'active' : ''}`}
                  onClick={() => setSelectedPlan('one-time')}
                >
                  <div className="plan-label-modal">One-Time</div>
                  <div className="plan-price-modal">₹{getPrice('one-time')}</div>
                </button>
                {service.pricingPlans.hourly && (
                  <button
                    type="button"
                    className={`plan-option-modal ${selectedPlan === 'hourly' ? 'active' : ''}`}
                    onClick={() => setSelectedPlan('hourly')}
                  >
                    <div className="plan-label-modal">Hourly</div>
                    <div className="plan-price-modal">₹{getPrice('hourly')}</div>
                  </button>
                )}
                {service.pricingPlans.daily && (
                  <button
                    type="button"
                    className={`plan-option-modal ${selectedPlan === 'daily' ? 'active' : ''}`}
                    onClick={() => setSelectedPlan('daily')}
                  >
                    <div className="plan-label-modal">Daily</div>
                    <div className="plan-price-modal">₹{getPrice('daily')}</div>
                  </button>
                )}
                {service.pricingPlans.weekly && (
                  <button
                    type="button"
                    className={`plan-option-modal ${selectedPlan === 'weekly' ? 'active' : ''}`}
                    onClick={() => setSelectedPlan('weekly')}
                  >
                    <div className="plan-label-modal">Weekly</div>
                    <div className="plan-price-modal">₹{getPrice('weekly')}</div>
                  </button>
                )}
                {service.pricingPlans.monthly && (
                  <button
                    type="button"
                    className={`plan-option-modal ${selectedPlan === 'monthly' ? 'active' : ''}`}
                    onClick={() => setSelectedPlan('monthly')}
                  >
                    <div className="plan-label-modal">Monthly</div>
                    <div className="plan-price-modal">₹{getPrice('monthly')}</div>
                  </button>
                )}
                {service.pricingPlans.yearly && (
                  <button
                    type="button"
                    className={`plan-option-modal ${selectedPlan === 'yearly' ? 'active' : ''}`}
                    onClick={() => setSelectedPlan('yearly')}
                  >
                    <div className="plan-label-modal">Yearly</div>
                    <div className="plan-price-modal">₹{getPrice('yearly')}</div>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="plan-selection">
              <label>Plan</label>
              <div className="plan-info-single">
                <span>One-Time</span>
                <span className="price-single">₹{service.price}</span>
              </div>
            </div>
          )}

          <div className="selected-plan-summary">
            <div className="summary-row">
              <span>Selected Plan:</span>
              <span className="summary-plan-name">
                {selectedPlan === 'one-time' ? 'One-Time' : selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}
              </span>
            </div>
            <div className="summary-row">
              <span>Price:</span>
              <span className="summary-price">₹{getPrice(selectedPlan)}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-cancel">Cancel</button>
          <button onClick={handleAddToCart} className="btn-add-cart">
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
};

export default AddToCartModal;

