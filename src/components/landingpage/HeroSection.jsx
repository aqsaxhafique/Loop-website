import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useData, useProductsData } from "contexts";
import { CATEGORY_FILTER, CLEAR_FILTERS } from "../../constants";
import "./landingpage.css";
import pan1 from "assets/images/pan1.jpg";
import whyImg from "assets/images/pan1.jpg";
import pan2 from "assets/images/pan2.jpg";
import bg3 from "assets/images/bg3.webp";
import darkbrown from "assets/images/darkbrown.jpg";
import { useEffect, useState } from "react";

function HeroSection() {
  const { productsData, categoriesData } = useProductsData();
  // Show products with best offers as trending, or just first 4 products
  const trendingItems = productsData
    .filter((item) => item.is_best_seller || item.offer_percentage > 0)
    .slice(0, 4);
  
  // If no trending items, just show first 4 products
  const displayTrending = trendingItems.length > 0 ? trendingItems : productsData.slice(0, 4);
  
  const { dispatch } = useData();
  let navigate = useNavigate();

  // Rotating hero background images (use two images only)
  const backgrounds = [bg3, darkbrown];
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 4500); // change every 4.5 seconds

    return () => clearInterval(interval);
  }, []);

  const routeChange = (item) => {
    dispatch({
      type: CLEAR_FILTERS,
    });
    dispatch({
      type: CATEGORY_FILTER,
      payload: { category: item.title, value: true },
    });
    navigate("/products");
  };

  return (
    <div className="middle-content">
      <Helmet>
        <title>Loop, Handcrafted Pancakes &amp; Treats</title>
        <meta
          name="description"
          content="Loop makes handcrafted pancakes, waffles and savory treats — fresh, small-batch, and delivered fast. Order online for pickup or delivery."
        />
        <meta
          name="keywords"
          content="mini pancakes, pancakes, waffles, bakery, handcrafted, breakfast delivery, desserts, Loop, bakery near me"
        />
        <link rel="canonical" href={window.location.origin + "/"} />
        <meta property="og:title" content="Loop — Handcrafted Pancakes & Treats" />
        <meta
          property="og:description"
          content="Fresh small-batch pancakes and treats made with care. Order online for pickup or delivery."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={bg3} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="hero-container">
        {/* background layers for crossfade effect */}
        {backgrounds.map((bg, i) => (
          <div
            key={i}
            className={`hero-bg-layer ${bgIndex === i ? "active" : ""}`}
            style={{ backgroundImage: `url(${bg})` }}
          />
        ))}

        <div className="hero-content">
          <h1 className="heading1 text-center">Welcome to Loop</h1>
          <h2 className="heading2 keyword">We Implement your Delicious dreams...</h2>
          <h2 className="heading4 text-center">Grab your favorite treat now!</h2>
          <button
            className="btn btn-primary hero-btn"
            onClick={() => {
              dispatch({
                type: CLEAR_FILTERS,
              });
              navigate("/products");
            }}
          >
            BUY NOW
          </button>
        </div>
        <div className="hero-img">
          <img src={bgIndex === 0 ? pan1 : pan2} alt="hero-img" />
        </div>
      </div>

      {/* AFTER HERO BACKGROUND (beige) */}
      <div className="after-hero-bg">
        {/* WHY CHOOSE US SECTION */}
        <section className="why-section">
          <div className="why-container">
          <div className="why-text">
            <h3 className="why-heading">Why Choose Us?</h3>
            <p>
              Savor handcrafted pancakes and treats made from premium
              ingredients. We combine time-honored recipes with modern
              techniques to deliver fresh, delicious flavors — fast delivery,
              friendly service, and an unforgettable taste in every bite.
            </p>
          </div>
          <div className="why-img">
            <img src={whyImg} alt="Our specialties" />
          </div>
          </div>
        </section>

      {/* CARDS SECTION         */}
      <div className="container-main">
        <h3 className="align-center heading3">Trending</h3>
        <div className="cards">
          {displayTrending.map((product) => (
            <Link
              to={`/products/${product.id}`}
              key={product.id}
              className="no-link-decoration"
            >
              <div className="card card-default zoom" key={product.id}>
                    <div className="card-img-container">
                      <img
                        src={product.imageUrl}
                        alt="cake"
                        className="card-img"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = pan1;
                        }}
                      />
                    </div>
                <div className="card-header">{product.title}</div>
                <div className="card-title">Rs. {product.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="container-main">
        <h3 className="align-center heading3">Featured Categories</h3>
        <div className="cards">
          {categoriesData?.map((item) => (
            <div
              className="card card-text-overlay zoom"
              key={item._id}
              onClick={() => routeChange(item)}
            >
              <div className="card-img-container">
                <img
                  src={item.imageUrl}
                  alt="cake"
                  className="card-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = pan1;
                  }}
                />
                <div className="card-header-bold">{item.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}

export { HeroSection };
