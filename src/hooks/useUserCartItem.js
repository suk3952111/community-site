import { useState, useEffect } from "react";
import { useUserCartContext } from "../App";

const useUserCartItem = (productDetail, toggleModal) => {
  const [userCartItem, setUserCartItem] = useState({
    item_id: null,
    image: "",
    title: "",
    price: 0,
    number: 0,
  });
  const { updateUserCart } = useUserCartContext();

  useEffect(() => {
    if (productDetail && productDetail.id) {
      setUserCartItem({
        item_id: productDetail.id,
        image: productDetail.image,
        title: productDetail.title,
        price: productDetail.price,
        number: 0,
      });
    }
  }, [productDetail]);

  const incrementUserCartItemNumber = () => {
    setUserCartItem((prevCartItem) => ({
      ...prevCartItem,
      number: prevCartItem.number + 1,
    }));
  };

  const decrementUserCartItemNumber = () => {
    setUserCartItem((prevCartItem) => ({
      ...prevCartItem,
      number: prevCartItem.number > 0 ? prevCartItem.number - 1 : 0,
    }));
  };

  const addUserCartItemToCart = async () => {
    if (userCartItem.number > 0 && userCartItem.item_id) {
      await updateUserCart(userCartItem);
      toggleModal();
    }
  };

  return {
    userCartItem,
    incrementUserCartItemNumber,
    decrementUserCartItemNumber,
    addUserCartItemToCart,
  };
};

export default useUserCartItem;
