import { useState, useEffect } from "react";
import styles from "./CartItem.module.css";
import {
  useAuthContext,
  useLocalCartContext,
  useUserCartContext,
} from "../../App";
import { supabase } from "@/main";
const CartItem = ({ item }) => {
  const { user } = useAuthContext();
  const { cart, updateCart } = useLocalCartContext();
  const { updateUserCart, fetchUserCart } = useUserCartContext();

  const [quantity, setQuantity] = useState(item.number);

  useEffect(() => {
    if (quantity === 0) {
      handleRemoveItem(item.id);
    } else {
      handleUpdateCart(item.id, quantity);
    }
  }, [quantity]);

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };
  const handleUpdateCart = (id, newQuantity) => {
    if (user) {
      const itemWithoutId = { ...item, number: newQuantity };
      delete itemWithoutId.id;
      delete itemWithoutId.created_at;
      updateUserCart(itemWithoutId);
    } else {
      const updatedCart = cart.map((item) =>
        item.id === id ? { ...item, number: newQuantity } : item
      );
      updateCart(updatedCart);
    }
  };

  const handleRemoveItem = async (id) => {
    if (user) {
      try {
        const { error } = await supabase
          .from("cart")
          .delete()
          .eq("user_id", user.email)
          .eq("item_id", item.item_id);

        if (error) {
          console.error(
            "장바구니 항목을 삭제하는 중 오류가 발생했습니다:",
            error
          );
        } else {
          fetchUserCart();
        }
      } catch (error) {
        console.error(
          "장바구니 항목을 삭제하는 중 오류가 발생했습니다:",
          error
        );
      }
    } else {
      const updatedCart = cart.filter((item) => item.id !== id);
      updateCart(updatedCart);
    }
  };

  return (
    <li className={styles.body}>
      <div>
        <h2>{item.title}</h2>
        <p>가격: ${item.price}</p>
        <p>수량: {quantity}</p>
        <button onClick={increaseQuantity}>+</button>
        <button onClick={decreaseQuantity}>-</button>
        <button onClick={() => handleRemoveItem(item.id)}>삭제</button>
      </div>
      <img className={styles.image} src={item.image} alt="itemImage" />
    </li>
  );
};

export default CartItem;
