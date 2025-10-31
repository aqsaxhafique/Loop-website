import { Products } from "./Products";
import "./productlist.css";
import "styles/globalbakin.css";
import { Helmet } from "react-helmet";

function ProductList() {
  return (
    <main className="middle-content">
      <Helmet>
        <title>Products — Loop</title>
        <meta name="description" content="Browse Loop's menu of handcrafted pancakes, waffles and savory items. Filter by category and find your favorite treats." />
        <meta name="keywords" content="pancakes, waffles, bakery menu, order online, mini pancakes, desserts, Loop products" />
        <link rel="canonical" href={window.location.origin + "/products"} />
        <meta property="og:title" content="Products — Loop" />
        <meta property="og:description" content="Browse handcrafted pancakes, waffles and savory treats from Loop." />
        <meta name="twitter:card" content="summary" />
      </Helmet>
      <Products />
    </main>
  );
}

export { ProductList };
