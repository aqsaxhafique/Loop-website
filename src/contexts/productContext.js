import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "utilities";
// Use local pancake images placed in src/assets/images
import pan1 from "assets/images/pan1.jpg";
import pan2 from "assets/images/pan2.jpg";
import cat1 from "assets/images/cat1.jpg";
import cat2 from "assets/images/cat2.jpg";
import cat3 from "assets/images/cat3.jpg";
import cat4 from "assets/images/cat4.jpg";
import cat5 from "assets/images/cat5.jpg";
import cat6 from "assets/images/cat6.jpg";
import cat7 from "assets/images/cat7.jpg";
import cat8 from "assets/images/cat8.jpg";
import cat9 from "assets/images/cat9.jpg";
import cat10 from "assets/images/cat10.jpg";

const ProductsDataContext = createContext();

const ProductsDataProvider = ({ children }) => {
  const [productsData, setProductsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);

  useEffect(
    () =>
      (async () => {
        try {
          let resp = await axios.get(`${API_URL}/api/products`);
          if (resp.status === 200) {
            // Use the local pancake photos the user added and assign them randomly to products
            const localImages = [
              cat1,
              cat2,
              cat3,
              cat4,
              cat5,
              cat6,
              cat7,
              cat8,
              cat9,
              cat10,
            ];

            const products = resp.data.products.map((p) => ({
              ...p,
              imageUrl:
                localImages[Math.floor(Math.random() * localImages.length)],
            }));

            setProductsData(products);
          }
          resp = await axios.get(`${API_URL}/api/categories`);
          if (resp.status === 200) {
            // Map categories to specific local pancake images with titles
            const categoryImages = [cat1, cat2, cat3, cat4];
            const categoryTitles = [
              "Blueberry",
              "Strawberry",
              "Chocolate",
              "Lotus",
            ];

            const categories = resp.data.categories.map((c, i) => ({
              ...c,
              title: categoryTitles[i % categoryTitles.length],
              imageUrl: categoryImages[i % categoryImages.length],
            }));

            setCategoriesData(categories);
          }
        } catch (e) {
          console.error("Error in fetching Products or Categories", e);
        }
      })(),
    []
  );

  return (
    <ProductsDataContext.Provider value={{ productsData, categoriesData }}>
      {children}
    </ProductsDataContext.Provider>
  );
};

const useProductsData = () => useContext(ProductsDataContext);

export { ProductsDataProvider, useProductsData };
