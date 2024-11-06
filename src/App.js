import "./App.scss";
import { Header, Product, Footer } from "./components";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [specialOfferProduct, setSpecialOfferProduct] = useState(null);

  const addToCart = (product) => {
    const discountedProduct = product.originalPrice
      ? {
          ...product,
          discountedPrice: product.price,
          price: product.originalPrice,
          savings: (product.originalPrice - product.price).toFixed(2),
        }
      : { ...product, savings: 0 };

    setCart([...cart, discountedProduct]);
  };

  const getData = async () => {
    const response = await axios.get("/products.json");
    const data = response.data;
    setProducts(data);
  };

  const getCategories = (products) => {
    const categoriesHelper = [];
    products.forEach((product) =>
      categoriesHelper.includes(product.category)
        ? undefined
        : categoriesHelper.push(product.category)
    );
    setCategories([...categoriesHelper]);
  };

  const selectCategory = (category) => setSelectedCategory(category);
  const showAllProducts = () => setSelectedCategory("");

  const getRandomProduct = () => {
    if (products.length > 0) {
      const randomProduct =
        products[Math.floor(Math.random() * products.length)];
      const discountedProduct = {
        ...randomProduct,
        originalPrice: randomProduct.price,
        price: (randomProduct.price * 0.6).toFixed(2),
      };

      setSpecialOfferProduct(discountedProduct);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getCategories(products);
    getRandomProduct();
  }, [products]);

  return (
    <div className="App">
      <Header cart={cart} setCart={setCart} />
      <div className="main container">
        <div className="menu">
          <div className="categories container">
            <button
              className={selectedCategory === "" ? "active" : ""}
              onClick={showAllProducts}
            >
              Wszystko
              <p>({products.length})</p>
            </button>
            {categories.map((category, index) => (
              <button
                key={index}
                className={selectedCategory === category ? "active" : ""}
                onClick={() => selectCategory(category)}
              >
                {category}
                <p>
                  (
                  {
                    products.filter((product) => product.category === category)
                      .length
                  }
                  )
                </p>
              </button>
            ))}
          </div>

          <div className="specialOffer">
            <div className="specialOfferForYou">
              <p>Specjalna oferta dla ciebie</p>
            </div>
            {specialOfferProduct && (
              <Product product={specialOfferProduct} action={addToCart} />
            )}
          </div>
        </div>

        <div className="products container">
          {products
            .filter((product) =>
              selectedCategory ? product.category === selectedCategory : product
            )
            .map((product) => (
              <Product key={product.id} product={product} action={addToCart} />
            ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;
