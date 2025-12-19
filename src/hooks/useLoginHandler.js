import { useNavigate } from "react-router-dom";
import { useAuth, useData } from "contexts";
import { toast } from "react-toastify";
import {
  getAddressFromServer,
  getCart,
  getOrdersFromServer,
  getWishlist,
  loginService,
} from "services";
import {
  WISHLIST_OPERATION,
  CART_OPERATION,
  SET_ADDRESS,
  SET_ORDERS,
} from "../constants";

function useLoginHandler() {
  const { setAuthToken, setAuthUser } = useAuth();
  const { dispatch } = useData();
  const navigate = useNavigate();

  const loginHandler = async (
    e,
    setLoginData,
    setErrorData,
    loginData,
    location,
    setDisableLogin
  ) => {
    if (e) e.preventDefault();
    if (setDisableLogin) setDisableLogin(true);
    try {
      let response;
      if (e && e.target.innerText === "Login as Guest") {
        setLoginData({
          email: "johndoe@gmail.com",
          password: "johndoe@123",
        });
        response = await loginService("johndoe@gmail.com", "johndoe@123");
      } else response = await loginService(loginData.email, loginData.password);
      
      // Check if login was successful
      if (!response || !response.success) {
        throw new Error('Login failed');
      }
      
      const tokenResponse = response.token;
      const foundUser = {
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        email: response.user.email,
        role: response.user.role,
      };
      if (response.user) {
        setAuthToken(tokenResponse);
        setAuthUser(foundUser);
        localStorage.setItem("authToken", tokenResponse);
        localStorage.setItem("authUser", JSON.stringify(foundUser));
        
        // Try to load user data, but don't fail if endpoints don't exist
        try {
          response = await getCart(tokenResponse);
          dispatch({
            type: CART_OPERATION,
            payload: { cart: response.cart },
          });
        } catch (err) {
          console.log("Cart endpoint not available yet");
        }
        
        try {
          response = await getWishlist(tokenResponse);
          dispatch({
            type: WISHLIST_OPERATION,
            payload: { wishlist: response.wishlist },
          });
        } catch (err) {
          console.log("Wishlist endpoint not available yet");
        }
        
        try {
          response = await getAddressFromServer(tokenResponse);
          dispatch({
            type: SET_ADDRESS,
            payload: { address: response.address },
          });
        } catch (err) {
          console.log("Address endpoint not available yet");
        }
        
        try {
          response = await getOrdersFromServer(tokenResponse);
          dispatch({
            type: SET_ORDERS,
            payload: { orders: response.orders },
          });
        } catch (err) {
          console.log("Orders endpoint not available yet");
        }
        
        if (e) toast.success("Log In successful");
        
        // Redirect based on user role
        if (foundUser.role === 'admin') {
          navigate("/admin");
        } else if (location.state) {
          navigate(location.state?.from?.pathname);
        } else {
          navigate("/home");
        }
      }
    } catch (e) {
      console.error("loginHandler: Error in Login", e);
      setErrorData(true);
      if (e) toast.error(`Invalid email or password`);
    } finally {
      if (setDisableLogin) setDisableLogin(false);
    }
  };
  return { loginHandler };
}

export { useLoginHandler };
