import { useState, useEffect } from "react";
import { useLocalCartContext } from "@/App";

const useCartItem = (productDetail, toggleModal) => {
  const { cart, updateCart } = useLocalCartContext();
  const [cartItem, setCartItem] = useState({ price: 0, number: 0 });

  useEffect(() => {
    if (productDetail) {
      setCartItem({ ...productDetail, number: 0 });
    }
  }, [productDetail]);

  const addCartItemNumber = () => {
    setCartItem((prevCartItem) => ({
      ...prevCartItem,
      number: prevCartItem.number + 1,
    }));
  };

  const removeCartItemNumber = () => {
    setCartItem((prevCartItem) => ({
      ...prevCartItem,
      number: prevCartItem.number > 0 ? prevCartItem.number - 1 : 0,
    }));
  };

  const handleAddToCart = () => {
    const cartItemToAdd = { ...cartItem, id: productDetail.id };
    const updatedCart = [...cart];
    const existingCartItem = updatedCart.find(
      (item) => item.id === cartItemToAdd.id
    );

    if (existingCartItem) {
      existingCartItem.number = cartItemToAdd.number;
    } else {
      updatedCart.push(cartItemToAdd);
    }

    updateCart(updatedCart);
    toggleModal();
  };

  return { cartItem, addCartItemNumber, removeCartItemNumber, handleAddToCart };
};

export default useCartItem;
