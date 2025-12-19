import { useState } from "react";
import { toast } from "react-toastify";
import { useData, useAuth } from "contexts";
import { addToOrdersInServer, clearCartInServer } from "services";
import { CART_OPERATION, SET_ORDERS } from "constants/index";
import { useCartSummary } from "hooks/useCartSummary";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "utilities";
import "./cart.css";

function CheckoutModal({ onClose }) {
  const { state, dispatch } = useData();
  const { authToken } = useAuth();
  const { getTotalPrice, getDiscount } = useCartSummary();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [address, setAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    mobile: "",
    country: "Pakistan"
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const validateAddress = () => {
    if (!address.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!address.street.trim()) {
      toast.error("Street address is required");
      return false;
    }
    if (!address.city.trim()) {
      toast.error("City is required");
      return false;
    }
    if (!address.state.trim()) {
      toast.error("State is required");
      return false;
    }
    if (!address.mobile.trim()) {
      toast.error("Mobile number is required");
      return false;
    }
    if (!/^\d{10}$/.test(address.mobile.trim())) {
      toast.error("Please enter a valid 10-digit mobile number");
      return false;
    }
    return true;
  };

  const handleConfirmOrder = async () => {
    if (!validateAddress()) return;
    
    setIsSubmitting(true);

    try {
      // 1. Save address to backend
      const addressResponse = await axios.post(
        `${API_URL}/api/user/addresses`,
        address,
        { headers: { authorization: authToken } }
      );

      if (!addressResponse.data.success) {
        throw new Error("Failed to save address");
      }

      const savedAddress = addressResponse.data.address;

      // 2. Create order with saved address
      const order = {
        items: state.cart,
        paymentId: "DIRECT",
        totalPrice: getTotalPrice(),
        deliveryAddress: `${savedAddress.name}, ${savedAddress.street}, ${savedAddress.city}, ${savedAddress.state} - ${savedAddress.zipCode}, Mobile: ${savedAddress.mobile}`,
        orderDate: new Date(),
      };

      const orderResponse = await addToOrdersInServer(authToken, order);
      
      if (orderResponse && orderResponse.orders) {
        // 3. Update state with new orders
        dispatch({ type: SET_ORDERS, payload: { orders: orderResponse.orders } });
        
        // 4. Clear cart
        const cleared = await clearCartInServer(authToken);
        if (cleared) {
          dispatch({ type: CART_OPERATION, payload: { cart: [] } });
        }

        // 5. Show success message
        toast.success("Order placed successfully! 🎉");
        
        // 6. Close modal and navigate to orders page
        setTimeout(() => {
          onClose();
          navigate('/profile/orders');
        }, 1500);
      }
    } catch (error) {
      console.error('Place order error:', error);
      toast.error(error.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = getTotalPrice();
  const discount = getDiscount();
  const finalPrice = totalPrice - discount;

  return (
    <div className="address-modal-container" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Confirm Your Order</h3>
          <button className="btn-close-modal" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Order Summary */}
          <div className="order-summary-section">
            <h4>Order Summary</h4>
            <div className="order-items-list">
              {state.cart.map((item) => (
                <div key={item.id} className="order-item-row">
                  <img src={item.imageUrl} alt={item.title} className="item-thumbnail" />
                  <div className="item-details">
                    <p className="item-title">{item.title}</p>
                    <p className="item-price">Rs.{item.price} × {item.qty}</p>
                  </div>
                  <p className="item-total">Rs.{item.price * item.qty}</p>
                </div>
              ))}
            </div>
            
            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal:</span>
                <span>Rs.{totalPrice}</span>
              </div>
              {discount > 0 && (
                <div className="price-row discount">
                  <span>Discount:</span>
                  <span>-Rs.{discount}</span>
                </div>
              )}
              <div className="price-row total">
                <strong>Total:</strong>
                <strong>Rs.{finalPrice}</strong>
              </div>
            </div>
          </div>

          {/* Delivery Address Form */}
          <div className="address-form-section">
            <h4>Delivery Address</h4>
            <form className="address-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={address.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  name="mobile"
                  value={address.mobile}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  required
                />
              </div>

              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleChange}
                  placeholder="House No, Building Name, Street"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleChange}
                    placeholder="State"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleChange}
                    placeholder="Zip Code"
                    maxLength="6"
                  />
                </div>

                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={address.country}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="btn btn-secondary" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleConfirmOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Placing Order..." : `Confirm Order (Rs.${finalPrice})`}
          </button>
        </div>
      </div>
    </div>
  );
}

export { CheckoutModal };
