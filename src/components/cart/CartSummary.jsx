import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useData, useAuth } from "contexts";
import { useCartSummary } from "hooks";
import "./cart.css";
import { CartPriceTable } from "./CartPriceTable";
import { addToOrdersInServer, clearCartInServer } from "services";
import { CART_OPERATION, SET_ORDERS } from "constants/index";
import { useNavigate } from "react-router-dom";

function CartSummary() {
  const { coupon, setCoupon, state, dispatch, deliveryAddress } = useData();
  const [showCouponModal, setShowCouponModal] = useState(false);
  const { getTotalPrice } = useCartSummary();
  const [showPlacedModal, setShowPlacedModal] = useState(false);
  const { authToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (showPlacedModal) {
      timer = setTimeout(() => setShowPlacedModal(false), 2500);
    }
    return () => clearTimeout(timer);
  }, [showPlacedModal]);

  const coupons = [
    {
      id: 1,
      title: "SEASONAL OFFER",
      description: "Save Rs.100 on orders above Rs.1000",
      discount: 100,
      minimumPrice: 1000,
    },
    {
      id: 2,
      title: "FESITVE OFFER",
      description: "Save Rs.200 on orders above Rs.1500",
      discount: 200,
      minimumPrice: 1500,
    },
  ];

  const couponDisabled = (eachCoupon) =>
    getTotalPrice() <= eachCoupon.minimumPrice;

  return (
    <div className="cart-price gray-text">
      <h5 className="heading5">COUPONS</h5>
      <div>
        <button
          className="btn btn-outline-default coupon-button"
          onClick={() => setShowCouponModal(true)}
        >
          <FontAwesomeIcon icon="tag" /> APPLY COUPON
        </button>
      </div>
      <CartPriceTable />
      <button
        className="btn btn-primary order-button no-decoration inline-flex"
        onClick={async () => {
          // If not authenticated, redirect to login
          if (!authToken) {
            navigate("/login", { replace: false });
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
              // update orders in client state
              dispatch({ type: SET_ORDERS, payload: { orders: response.orders } });
              // clear cart on server and update client
              const cleared = await clearCartInServer(authToken);
              if (cleared) {
                dispatch({ type: CART_OPERATION, payload: { cart: cleared.cart } });
              }
              setShowPlacedModal(true);
              // optionally navigate to orders after brief delay
              setTimeout(() => navigate("/profile/orders"), 1200);
            }
          } catch (e) {
            console.error("Checkout error", e);
          }
        }}
      >
        CHECKOUT
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
      {showCouponModal && (
        <div className="address-modal-container">
          <div className="coupon-modal flex-column-center">
            <h4>ADD COUPON</h4>
            {getTotalPrice() <= 1000 && (
              <p>No coupons available for the current cart price.</p>
            )}
            <button
              className="btn-no-decoration btn-close btn-close-coupon cursor-pointer"
              onClick={() => setShowCouponModal(false)}
            >
              <FontAwesomeIcon icon="close" />
            </button>
            {coupons.map((eachCoupon) => (
              <div className="coupon-container" key={eachCoupon.id}>
                <input
                  type="checkbox"
                  id={eachCoupon.id}
                  name="coupon"
                  className={
                    couponDisabled(eachCoupon) ? "diabled" : "cursor-pointer"
                  }
                  checked={coupon && coupon.id === eachCoupon.id}
                  disabled={couponDisabled(eachCoupon)}
                  onChange={() =>
                    coupon && coupon.id === eachCoupon.id
                      ? setCoupon({})
                      : setCoupon(eachCoupon)
                  }
                />
                <label
                  htmlFor={eachCoupon.id}
                  className={
                    couponDisabled(eachCoupon) ? "disabled" : "cursor-pointer"
                  }
                >
                  <span className="padding-left-5">{eachCoupon.title}</span>
                  <p>{eachCoupon.description}</p>
                </label>
              </div>
            ))}
            <button
              className="btn btn-primary btn-auth btn-coupon"
              onClick={() => setShowCouponModal(false)}
            >
              APPLY
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { CartSummary };
