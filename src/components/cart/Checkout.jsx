import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { AddAddressModal } from "components";
import { useData, useEditAddress, useAuth } from "contexts";
import { CartPriceTable } from "./CartPriceTable";
import { usePaymentIntegration } from "hooks";
import { addToOrdersInServer, clearCartInServer } from "services";
import { CART_OPERATION, SET_ORDERS } from "constants/index";
import { useCartSummary } from "hooks/useCartSummary";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const { state, setDeliveryAddress, deliveryAddress, dispatch } = useData();
  const { setShowAddressModal, showAddressModal } = useEditAddress();
  const [disable, setDisable] = useState(false);
  const { displayRazorpay } = usePaymentIntegration();
  const { getTotalPrice } = useCartSummary();
  const { authToken } = useAuth();
  const navigate = useNavigate();
  const [showPlacedModal, setShowPlacedModal] = useState(false);

  useEffect(() => {
    if (state.address.length > 0) setDeliveryAddress(state.address[0]);
    else setDeliveryAddress(null);
  }, [state.address]);

  const directPlaceOrder = async () => {
    if (!authToken) {
      navigate('/login');
      return;
    }

    try {
      const order = {
        items: state.cart,
        paymentId: "DIRECT",
        totalPrice: getTotalPrice(),
        deliveryAddress: deliveryAddress || null,
        orderDate: new Date(),
      };

      const response = await addToOrdersInServer(authToken, order);
      if (response && response.orders) {
        dispatch({ type: SET_ORDERS, payload: { orders: response.orders } });
        const cleared = await clearCartInServer(authToken);
        if (cleared) dispatch({ type: CART_OPERATION, payload: { cart: cleared.cart } });
        setShowPlacedModal(true);
        setTimeout(() => navigate('/profile/orders'), 1200);
      }
    } catch (e) {
      console.error('Place order error', e);
      toast.error('Something went wrong while placing order');
    }
  };

  const placeOrderHandler = async () => {
    setDisable(true);
    if (!deliveryAddress?._id) {
      toast.error('Please Add Address to deliver');
      setDisable(false);
      return;
    }

    // Try Razorpay first; if it fails or isn't configured, fall back to direct order
    try {
      const res = await displayRazorpay();
      // displayRazorpay opens the Razorpay modal but doesn't return a value on success,
      // so if it's not available it returns early (and already showed toast).
      // If Razorpay couldn't be loaded, fallback to direct placement.
      if (!res) {
        await directPlaceOrder();
      }
    } catch (e) {
      // If any error occurs, fallback to direct order placement
      await directPlaceOrder();
    }

    setDisable(false);
  };

  return (
    <div
      className="cart-container 
    flex-row-wrap middle-content"
    >
      <div className="gray-text flex-column-start">
        {state.address.length === 0 && (
          <div className="padding-10 margin-10">
            <button
              className="add-address-btn margin-10 padding-10"
              to="/checkout"
              onClick={() => setShowAddressModal(true)}
            >
              + ADD ADDRESS
            </button>
          </div>
        )}
        {showAddressModal && <AddAddressModal />}
        {state.address.length > 0 && (
          <h4 className="margin-10">SELECT ADDRESS</h4>
        )}
        {state.address.length > 0 &&
          state.address.map((address) => (
            <div className="border-card" key={address._id}>
              <input
                type="radio"
                id={address._id}
                name="delivery-address"
                className="cursor-pointer"
                checked={address._id === deliveryAddress?._id}
                onChange={() => setDeliveryAddress(address)}
              />
              <label htmlFor={address._id}>
                <div className="padding-left-5 cursor-pointer">
                  <p>{address.name}</p>
                  <p>{address.street}</p>
                  <p>
                    {address.city} - {address.zipCode}
                  </p>
                  <p>{address.state}</p>
                  <p> Mobile : {address.mobile}</p>
                </div>
              </label>
            </div>
          ))}
        {state.address.length > 0 && (
          <button
            className="add-address-btn"
            to="/checkout"
            onClick={() => setShowAddressModal(true)}
          >
            + ADD NEW ADDRESS
          </button>
        )}
      </div>
      <div className="flex-column-start">
        <div className="cart-price gray-text">
          <h5 className="heading5">ITEMS PURCHASED</h5>
          <div className="price-row">
            <div className="display-left-large">ITEM</div>
            <div className="display-right">PRICE</div>
          </div>
          {[...state.cart].reverse().map((cartItem) => (
            <div key={cartItem._id}>
              <div className="price-row" key={cartItem._id}>
                <div className="display-left-large">
                  {cartItem.title}
                  <div>{`${cartItem.qty} X Rs. ${cartItem.price}`}</div>
                </div>
                <div className="display-right">
                  Rs. {cartItem.qty * Number(cartItem.price)}
                </div>
              </div>
              {cartItem !== state.cart[0] && <hr className="section-line" />}
            </div>
          ))}
        </div>

        <CartPriceTable />
        <div className="cart-price">
          <h5 className="heading5 gray-text">DELIVER TO</h5>
          <div className="gray-text">
            <p>{deliveryAddress?.name}</p>
            <p>{deliveryAddress?.street}</p>
            <p>
              {deliveryAddress?.city} - {deliveryAddress?.zipCode}
            </p>
            <p>{deliveryAddress?.state}</p>
            <p>{deliveryAddress?.mobile}</p>
          </div>
        </div>
        <button
          className={`btn btn-primary order-button ${disable && "diabled"}`}
          to="/checkout"
          onClick={placeOrderHandler}
          disabled={disable}
        >
          PLACE ORDER
        </button>
        {showPlacedModal && (
          <div className="address-modal-container">
            <div className="coupon-modal flex-column-center">
              <h4>Order Placed</h4>
              <p>Your order is placed successfully.</p>
              <button
                className="btn-no-decoration btn-close btn-close-coupon cursor-pointer"
                onClick={() => setShowPlacedModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { Checkout };
