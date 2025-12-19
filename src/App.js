import "./App.css";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import {
  Address,
  AdminDashboard,
  AdminLayout,
  Cart,
  Categories,
  Checkout,
  CreateCategory,
  CreateProduct,
  Footer,
  About,
  HeroSection,
  LoginForm,
  ManageOrders,
  Navigation,
  NotFound,
  OrderSummary,
  PrivateRoute,
  Product,
  ProductList,
  ProfileDetails,
  ProfilePage,
  ScrollToTop,
  SignupForm,
  TrafficAnalytics,
  ViewInventory,
  Wishlist,
} from "components";
import { useEffect } from "react";
import { useAuth, useData } from "contexts";
import {
  getAddressFromServer,
  getCart,
  getOrdersFromServer,
  getWishlist,
} from "services";
import {
  CART_OPERATION,
  WISHLIST_OPERATION,
  SET_ADDRESS,
  SET_ORDERS,
} from "constants/index";

function App() {
  const { authToken } = useAuth();
  const { dispatch } = useData();

  useEffect(() => {
    (async () => {
      if (authToken)
        try {
          let response = await getCart(authToken);
          dispatch({ type: CART_OPERATION, payload: { cart: response.cart } });
          response = await getWishlist(authToken);
          dispatch({
            type: WISHLIST_OPERATION,
            payload: { wishlist: response.wishlist },
          });
          response = await getAddressFromServer(authToken);
          dispatch({
            type: SET_ADDRESS,
            payload: { address: response.address },
          });
          response = await getOrdersFromServer(authToken);
          dispatch({ type: SET_ORDERS, payload: { orders: response.orders } });
        } catch (e) {
          console.error(e);
        }
    })();
  }, [authToken]);

  return (
    <div className="App">
      <ScrollToTop />
      <ToastContainer position="bottom-right" autoClose={800} draggable />
      <Routes>
        {/* Login Route without Navbar */}
        <Route path="/" element={
          <div className="pagewrapper">
            <LoginForm />
            <Footer />
          </div>
        } />
        <Route path="/signup" element={
          <div className="pagewrapper">
            <Navigation />
            <SignupForm />
            <Footer />
          </div>
        } />
        <Route path="/login" element={
          <div className="pagewrapper">
            <Navigation />
            <LoginForm />
            <Footer />
          </div>
        } />
        <Route path="/products" element={
          <div className="pagewrapper">
            <Navigation />
            <ProductList />
            <Footer />
          </div>
        } />
        <Route path="/products/:productId" element={
          <div className="pagewrapper">
            <Navigation />
            <Product />
            <Footer />
          </div>
        } />
        <Route path="/about" element={
          <div className="pagewrapper">
            <Navigation />
            <About />
            <Footer />
          </div>
        } />
        <Route path="/home" element={
          <div className="pagewrapper">
            <Navigation />
            <HeroSection />
            <Footer />
          </div>
        } />
        
        {/* Admin Routes with Sidebar (No Navbar) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="inventory" element={<ViewInventory />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/new" element={<CreateCategory />} />
          <Route path="products/new" element={<CreateProduct />} />
          <Route path="analytics" element={<TrafficAnalytics />} />
        </Route>

        {/* Private Routes with Navbar */}
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/wishlist" element={
            <div className="pagewrapper">
              <Navigation />
              <Wishlist />
              <Footer />
            </div>
          } />
          <Route path="/cart" element={
            <div className="pagewrapper">
              <Navigation />
              <Cart />
              <Footer />
            </div>
          } />
          <Route path="/checkout" element={
            <div className="pagewrapper">
              <Navigation />
              <Checkout />
              <Footer />
            </div>
          } />
          <Route path="/profile" element={
            <div className="pagewrapper">
              <Navigation />
              <ProfilePage />
              <Footer />
            </div>
          }>
            <Route path="/profile" element={<ProfileDetails />} />
            <Route path="/profile/address" element={<Address />} />
            <Route path="/profile/orders" element={<OrderSummary />} />
          </Route>
        </Route>

        <Route path="*" element={
          <div className="pagewrapper">
            <Navigation />
            <NotFound />
            <Footer />
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;
