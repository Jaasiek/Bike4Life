import { useState } from "react";
import "./header.scss";
import CartIcon from "./cart.icon";
import { Cart } from "./../";

const Header = (props) => {
  const { cart, setCart } = props;
  const [cartState, setCartState] = useState(false);
  const title = "Bike4Life";

  const showCart = () => setCartState(!cartState);

  return (
    <div className="app-header-container">
      <header>
        <div className="header container">
          <h1>{title}</h1>
          <div className="cartIcon">
            <p onClick={showCart}>{cart.length}</p>
            <CartIcon onClick={showCart} width={45} />
          </div>
        </div>
      </header>
      {cartState && <Cart cart={cart} setCart={setCart} />}
    </div>
  );
};

export default Header;
