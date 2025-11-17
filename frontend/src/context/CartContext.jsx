import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Load cart from localStorage on mount
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('zynkly_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('zynkly_cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = (service, plan = 'one-time') => {
    const existingItem = cartItems.find(
      item => item.service._id === service._id && item.plan === plan
    );

    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.service._id === service._id && item.plan === plan
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const price = plan === 'one-time' 
        ? service.price 
        : (service.pricingPlans && service.pricingPlans[plan]) 
          ? service.pricingPlans[plan] 
          : service.price;
      
      setCartItems([...cartItems, {
        service,
        plan,
        quantity: 1,
        price
      }]);
    }
  };

  const removeFromCart = (serviceId, plan) => {
    setCartItems(cartItems.filter(
      item => !(item.service._id === serviceId && item.plan === plan)
    ));
  };

  const updateQuantity = (serviceId, plan, quantity) => {
    if (quantity <= 0) {
      removeFromCart(serviceId, plan);
      return;
    }
    setCartItems(cartItems.map(item =>
      item.service._id === serviceId && item.plan === plan
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

