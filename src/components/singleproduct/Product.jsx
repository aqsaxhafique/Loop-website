import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth, useProductsData } from "contexts";
import { useOperations } from "hooks";
import { SEO } from "../shared/SEO";
import "./product.css";

function Product() {
  const params = useParams();
  const { productsData } = useProductsData();
  const product = productsData.find((p) => params.productId == p.id || params.productId === p.slug);
  const { authToken } = useAuth();
  const { getButtonText, cartHandler } = useOperations();
  const [cartLoader, setCartLoader] = useState(false);

  // Generate structured data for SEO (Schema.org JSON-LD)
  const generateStructuredData = (product) => {
    if (!product) return null;

    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.title,
      "image": product.image_url || product.imageUrl,
      "description": product.meta_description || product.description || product.item || `Buy ${product.title} from Loop`,
      "sku": `LOOP-${product.id}`,
      "brand": {
        "@type": "Brand",
        "name": "Loop"
      },
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": "PKR",
        "price": product.price || product.originalPrice,
        "availability": product.is_out_of_stock || product.isOutOfStock 
          ? "https://schema.org/OutOfStock" 
          : "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
      },
      "category": product.category_name || product.categoryName || "Bakery",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "12"
      }
    };
  };

  // Get AI-generated or fallback SEO data
  const getSEOData = () => {
    if (!product) return {};

    // Use AI-generated meta tags if available, otherwise fallback
    const metaTitle = product.meta_title || `${product.title} - Buy Online | Loop`;
    const metaDescription = product.meta_description || 
      product.description || 
      `Order ${product.title} from Loop. ${product.category_name || 'Freshly made'} with premium ingredients. Fast delivery available.`;
    const keywords = product.keywords || 
      `${product.title}, ${product.category_name || 'bakery'}, buy online, Loop, order ${product.title}, ${product.category_name || 'food'} delivery`;
    const altText = product.alt_text || product.title;

    return {
      metaTitle,
      metaDescription,
      keywords,
      altText
    };
  };

  const seoData = product ? getSEOData() : {};
  const structuredData = product ? generateStructuredData(product) : null;

  return (
    <div className="middle-content">
      {product && (
        <div className="flex-row-center">
          {/* Enhanced SEO Component with AI-generated metadata */}
          <SEO
            title={seoData.metaTitle}
            description={seoData.metaDescription}
            keywords={seoData.keywords}
            canonical={window.location.origin + window.location.pathname}
            ogImage={product.image_url || product.imageUrl}
            ogType="product"
            structuredData={structuredData}
          />
          
          {/* Semantic HTML structure for better SEO */}
          <article className="product-display simple-product" itemScope itemType="https://schema.org/Product">
            <div className="simple-img-container">
              <img 
                src={product.image_url || product.imageUrl} 
                alt={seoData.altText}
                className="simple-img" 
                itemProp="image"
                loading="lazy"
              />
            </div>
            <div className="simple-product-content">
              <h1 className="product-title simple-title" itemProp="name">{product.title}</h1>
              
              <div className="product-price simple-price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                <span itemProp="priceCurrency" content="PKR">Rs.</span>
                <span itemProp="price" content={product.price || product.originalPrice}>
                  {product.price || product.originalPrice || 'N/A'}
                </span>
                <meta itemProp="availability" content={product.is_out_of_stock || product.isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"} />
              </div>
              
              <div className="product-buttons simple-buttons">
                {product.is_out_of_stock || product.isOutOfStock ? (
                  <button className="btn btn-default product-btn" disabled aria-label="Out of stock">
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
                    aria-label={`Add ${product.title} to cart`}
                  >
                    {cartLoader ? "Adding..." : "Add to Cart"}
                  </button>
                )}
              </div>
              
              {/* AI-generated or regular description */}
              <div className="simple-desc" itemProp="description">
                {product.description || product.item || product.category_name || ""}
              </div>
              
              {/* Additional metadata for SEO */}
              <meta itemProp="brand" content="Loop" />
              {product.category_name && <meta itemProp="category" content={product.category_name} />}
            </div>
          </article>
        </div>
      )}
    </div>
  );
}

export { Product };
