import "./product.scss";

const Product = (props) => {
  const { product, action } = props;
  return (
    <div className="app-product-container">
      <div
        className="img"
        style={{
          backgroundImage: "url(" + product.img + ")",
        }}
      ></div>
      <div className="product-name">
        <h4>{product.name}</h4>
      </div>

      <p className="desc" title={product.description}>
        {product.description}
      </p>

      {product.originalPrice && (
        <p className="original-price">{product.originalPrice} PLN</p>
      )}
      <p className="price">{product.price} PLN</p>

      <button onClick={() => action(product)}>Dodaj do koszyka</button>
    </div>
  );
};

export default Product;
