import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./footer.css";

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <div className="footer-col footer-about">
          <h3>About Us</h3>
          <p>
            We make small-batch, handcrafted treats, mini pancakes, waffles,
            and savory items,prepared fresh daily with love and care.
          </p>
        </div>

        <div className="footer-col footer-products">
          <h4>Our Products</h4>
          <ul className="products-list">
            <li>Mini Pancakes</li>
            <li>Waffles</li>
            <li>Savory Items</li>
          </ul>
        </div>

  <div id="footer-contact" className="footer-col footer-contact">
          <h4>Contact Us</h4>
          <div className="contact-icons">
            <a href="tel:0211-23473882" className="phone-row" aria-label="phone">
              <FontAwesomeIcon icon="phone" className="footer-icon-style" />
              <span className="phone-number">0211-23473882</span>
            </a>
          </div>
          <div className="social-icons">
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="instagram">
              <FontAwesomeIcon icon={["fab", "instagram"]} className="footer-icon-style" />
            </a>
            <a href="https://www.linkedin.com/in/romabulani/" target="_blank" rel="noreferrer" aria-label="linkedin">
              <FontAwesomeIcon icon={["fab", "linkedin-in"]} className="footer-icon-style" />
            </a>
            <a href="mailto:info@bakinline.com" aria-label="email">
              <FontAwesomeIcon icon="envelope" className="footer-icon-style" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copywright">© 2025 | Loop</p>
      </div>
    </footer>
  );
}

export { Footer };
