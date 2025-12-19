import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth, useProductsData } from "contexts";
import { useOperations } from "hooks";
import "./product.css";

function Product() {
  const params = useParams();
  const { productsData } = useProductsData();
  const product = productsData.find((p) => params.productId == p.id || params.productId === p.slug);
  const { authToken } = useAuth();
  const { getButtonText, cartHandler } = useOperations();
  const [cartLoader, setCartLoader] = useState(false);

  // Debug: Check what product data looks like
  React.useEffect(() => {
    if (product) {
      console.log('Product data:', product);
    }
  }, [product]);

  return (
    <div className="middle-content">
      {product && (
        <div className="flex-row-center">
          <Helmet>
            <title>{`${product.title} | Loop`}</title>
            <meta name="description" content={product.description || product.item || `Buy ${product.title} from Loop`} />
            <meta name="keywords" content={`${product.title}${product.categoryName ? ', ' + product.categoryName : ''}, buy online, order online, Loop, pancakes, waffles`} />
            <link rel="canonical" href={window.location.origin + window.location.pathname} />
            <meta property="og:title" content={product.title} />
            <meta property="og:description" content={product.description || `Buy ${product.title} from Loop`} />
            <meta property="og:image" content={product.imageUrl} />
            <meta name="twitter:card" content="summary_large_image" />
          </Helmet>
          <div className="product-display simple-product">
            <div className="simple-img-container">
              <img src={product.imageUrl} alt={product.title} className="simple-img" />
            </div>
            <div className="simple-product-content">
              <div className="product-title simple-title">{product.title}</div>
              <div className="product-price simple-price">
                Rs. {product.price || product.originalPrice || 'N/A'}
              </div>
              <div className="product-buttons simple-buttons">
                {product.isOutOfStock ? (
                  <button className="btn btn-default product-btn" disabled>
                    OUT OF STOCK
                  </button>
                ) : (
                  <button
                    className="btn btn-primary product-btn"
                    onClick={(e) =>
                      authToken
                        ? cartHandler(e, product, setCartLoader)
                        : toast.info("Please login to continue!")
                    }
                    disabled={cartLoader}
                  >
                    {cartLoader ? "Adding..." : "Add to Cart"}
                  </button>
                )}
              </div>
              {/* short description placed at bottom to avoid empty space */}
              <div className="simple-desc">{product.description || product.item || product.categoryName || ""}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { Product };
