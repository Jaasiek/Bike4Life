import { useEffect, useState } from "react";
import "./cart.scss";

const Cart = (props) => {
  const { cart, setCart } = props;
  const [localCart, setLocalCart] = useState([]);
  const [total, setTotal] = useState({
    price: 0,
    discount: 0,
    specialSavings: 0,
    promoSavings: 0,
    code: false,
  });
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeValidation, setPromoCodeValidation] = useState("");

  const getTotalPriceAndSavings = (cart) => {
    let totalPrice = 0;
    let specialSavings = 0;

    cart.forEach((product) => {
      const productPrice = product.discountedPrice || product.price || 0;
      const savings = product.savings || 0;

      totalPrice += productPrice * product.count;
      specialSavings += savings * product.count;
    });

    return {
      totalPrice: totalPrice.toFixed(2),
      specialSavings: specialSavings.toFixed(2),
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

    const { totalPrice, specialSavings } =
      getTotalPriceAndSavings(localCartHelper);

    setLocalCart([...localCartHelper]);
    setTotal({
      price: totalPrice,
      specialSavings: specialSavings,
      promoSavings: 0,
      discount: 0,
      code: false,
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

      const promoSavings = (total.price * discountValue).toFixed(2);

      const discountedTotal = localCart.map((product) => {
        const discountedPrice = (product.price * (1 - discountValue)).toFixed(
          2
        );
        return {
          ...product,
          discountedPrice,
        };
      });

      const { totalPrice } = getTotalPriceAndSavings(discountedTotal);

      setLocalCart(discountedTotal);
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

      {localCart.map((product) => (
        <p className="product" key={product.id}>
          {product.name}{" "}
          <p>
            <b>{product.count}</b> x
            {product.originalPrice ? (
              <>
                <s> {product.originalPrice} PLN </s>
                <b> {product.discountedPrice} PLN </b>
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
          {(total.price - total.promoSavings).toFixed(2)} PLN
        </b>
      </p>

      <p className="totalSavings">
        Zaoszczędzasz:{" "}
        <b>
          {(
            parseFloat(total.specialSavings) + parseFloat(total.promoSavings)
          ).toFixed(2)}{" "}
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
