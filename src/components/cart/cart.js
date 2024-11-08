import { useEffect, useState } from "react";
import "./cart.scss";

const Cart = (props) => {
  const { cart, setCart, showCart } = props;
  const [localCart, setLocalCart] = useState([]);
  const [total, setTotal] = useState({
    price: 0,
    discount: 0,
    savings: 0,
    promoSavings: 0,
    code: false,
  });
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeValidation, setPromoCodeValidation] = useState("");

  const getTotalPriceAndSavings = (cart) => {
    let totalPrice = 0;
    let totalSavings = 0;

    cart.forEach((product) => {
      const productPrice = product.price || 0;
      const savings = product.savings || 0;

      totalPrice += productPrice * product.count;
      totalSavings += savings * product.count;
    });

    return {
      totalPrice: totalPrice.toFixed(2),
      totalSavings: totalSavings.toFixed(2),
    };
  };

  useEffect(() => {
    const localCartHelper = [];

    cart.forEach((product) => {
      const existingProduct = localCartHelper.find(
        (group) => group.id === product.id
      );

      if (existingProduct) {
        existingProduct.count += 1;
      } else {
        product.count = 1;
        localCartHelper.push({ ...product });
      }
    });

    const { totalPrice, totalSavings } =
      getTotalPriceAndSavings(localCartHelper);

    setLocalCart([...localCartHelper]);
    setTotal({
      price: totalPrice,
      savings: totalSavings,
      promoSavings: 0,
      code: false,
      discount: 0,
    });
  }, [cart]);

  const clearCart = () => {
    setCart([]);
    setPromoCodeValidation(false);
  };

  const promoCodeChecking = (act) => {
    act.preventDefault();

    const actualPromoCode = "20%";

    if (promoCode === "") {
      setPromoCodeValidation("");
      return;
    }

    if (promoCode === actualPromoCode) {
      const discountValue = 0.2;
      setPromoCodeValidation("true");

      const promoSavings = localCart
        .reduce((totalPromoSavings, product) => {
          const priceToDiscount = product.discountedPrice
            ? parseFloat(product.discountedPrice)
            : parseFloat(product.price);
          const discountedPrice = (
            priceToDiscount *
            (1 - discountValue)
          ).toFixed(2);

          totalPromoSavings +=
            (priceToDiscount - discountedPrice) * product.count;

          product.discountedPriceWithPromo = discountedPrice;
          return totalPromoSavings;
        }, 0)
        .toFixed(2);

      const { totalPrice } = getTotalPriceAndSavings(localCart);

      setTotal({
        ...total,
        price: totalPrice,
        promoSavings,
        code: true,
        discount: discountValue,
      });
    } else {
      setPromoCodeValidation("false");
    }
  };

  return (
    <div className="app-cart-container animate__animated animate__fadeInDown">
      <h2>Koszyk</h2>
      <button className="cart-close" onClick={showCart}>
        ✖
      </button>

      {localCart.map((product) => (
        <p className="product" key={product.id}>
          {product.name}{" "}
          <p>
            <b>{product.count}</b> x
            {product.originalPrice ? (
              total.code ? (
                <>
                  <s> {product.originalPrice} PLN </s>
                  <b> {product.discountedPriceWithPromo} PLN </b>
                </>
              ) : (
                <>
                  <s> {product.originalPrice} PLN </s>
                  <b> {product.discountedPrice} PLN </b>
                </>
              )
            ) : total.code ? (
              <>
                <s> {product.price} PLN </s>
                <b> {product.discountedPriceWithPromo} PLN </b>
              </>
            ) : (
              <b> {product.price} PLN </b>
            )}
          </p>
          <hr></hr>
        </p>
      ))}

      <p className="totalPrice">
        Razem:{" "}
        {total.code === true && <s className="oldPrize">{total.price} PLN</s>}
        <b className="promoPrize">
          {" "}
          {(
            total.price -
            (parseFloat(total.savings) + parseFloat(total.promoSavings))
          ).toFixed(2)}{" "}
          PLN
        </b>
      </p>

      <p className="totalSavings">
        Zaoszczędzasz:{" "}
        <b>
          {(parseFloat(total.savings) + parseFloat(total.promoSavings)).toFixed(
            2
          )}{" "}
          PLN
        </b>
      </p>

      <div className="buttons">
        <button className="clearCart" onClick={clearCart}>
          Wyczyść koszyk
        </button>
        <form onSubmit={promoCodeChecking}>
          <input
            type="text"
            name="promoCode"
            placeholder="Kod Promocyjny"
            onChange={(act) => setPromoCode(act.target.value)}
          />
          <button className="promoCodeCheck" type="submit">
            Sprawdź
          </button>
          {promoCodeValidation === "true" && (
            <p>Rabat został poprawnie naliczony</p>
          )}
          {promoCodeValidation === "false" && (
            <p>Kod promocyjny jest niepoprawny lub został już wykorzystany</p>
          )}
        </form>
        <button className="checkout">Przejdź do płatności</button>
      </div>
    </div>
  );
};

export default Cart;
