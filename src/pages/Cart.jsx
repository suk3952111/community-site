import CartItem from "@/components/Cart/CartItem";
import {
  useAuthContext,
  useLocalCartContext,
  useUserCartContext,
} from "../App";
import styles from "./Cart.module.css"; // CSS 파일 import

const Cart = () => {
  const { user } = useAuthContext();
  const { cart } = useLocalCartContext();
  const { userCart } = useUserCartContext();

  const calculateTotalPrice = (cartItems) => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.number,
      0
    );
  };

  const cartItems = user ? userCart : cart;

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.title}>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p className={styles.emptyCart}>장바구니가 비었습니다</p>
      ) : (
        <ul className={styles.cartList}>
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </ul>
      )}
      <h2 className={styles.totalPrice}>
        총 금액: ${calculateTotalPrice(cartItems).toFixed(2)}
      </h2>
    </div>
  );
};

export default Cart;
