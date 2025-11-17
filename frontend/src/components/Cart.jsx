import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      onClose();
      return;
    }
    navigate('/checkout');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={onClose}></div>
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button className="cart-close" onClick={onClose}>×</button>
        </div>
        
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
              <button onClick={onClose} className="btn-continue">Continue Shopping</button>
            </div>
          ) : (
            <>
              {cartItems.map((item, index) => (
                <div key={`${item.service._id}-${item.plan}-${index}`} className="cart-item">
                  <div className="cart-item-info">
                    <h4>{item.service.name}</h4>
                    <p className="cart-item-plan">
                      {item.plan === 'one-time' ? 'One-Time' : item.plan.charAt(0).toUpperCase() + item.plan.slice(1)}
                    </p>
                    <p className="cart-item-price">₹{item.price} × {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="cart-item-actions">
                    <button
                      onClick={() => updateQuantity(item.service._id, item.plan, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      −
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.service._id, item.plan, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.service._id, item.plan)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)}):</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="cart-total">
                <span>Total Amount:</span>
                <span className="total-price">₹{getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
            <button onClick={handleCheckout} className="checkout-btn">
              💳 Proceed to Checkout & Payment (₹{getTotalPrice().toFixed(2)})
            </button>
            <button onClick={clearCart} className="clear-cart-btn">
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;

