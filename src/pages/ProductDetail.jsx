import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { fetchProduct } from "@/api/api";
import { FaStar, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import styles from "./ProductDetail.module.css";
import Modal from "@/components/common/Modal";
import useToggle from "@/hooks/useToggle";
import useCartItem from "../hooks/useCartItem";
import { useAuthContext } from "../App";
import CommentList from "@/components/ProductDetail/CommentList";
import AddComment from "@/components/ProductDetail/AddComment";
import useUserCartItem from "../hooks/useUserCartItem";

const ProductDetail = () => {
  const { productSlug } = useParams();
  const { user } = useAuthContext();
  const [isModalOpen, toggleModal] = useToggle(false);
  const [comments, setComments] = useState([]);

  const {
    data: productDetail,
    loading,
    error,
  } = useAsync(() => fetchProduct(productSlug));

  const { cartItem, addCartItemNumber, removeCartItemNumber, handleAddToCart } =
    useCartItem(productDetail, toggleModal);

  const {
    userCartItem,
    incrementUserCartItemNumber,
    decrementUserCartItemNumber,
    addUserCartItemToCart,
  } = useUserCartItem(productDetail, toggleModal);

  if (loading) {
    return <div>상품 상세내용을 불러오고 있습니다...</div>;
  }

  if (error) {
    return <div>에러: {error.message}</div>;
  }

  const {
    number: cartNumber,
    price: cartPrice,
    handleAddToCart: addToCart,
    addCartItemNumber: addNumber,
    removeCartItemNumber: removeNumber,
  } = user
    ? {
        number: userCartItem.number,
        price: userCartItem.price,
        handleAddToCart: addUserCartItemToCart,
        addCartItemNumber: incrementUserCartItemNumber,
        removeCartItemNumber: decrementUserCartItemNumber,
      }
    : {
        number: cartItem.number,
        price: cartItem.price,
        handleAddToCart: handleAddToCart,
        addCartItemNumber: addCartItemNumber,
        removeCartItemNumber: removeCartItemNumber,
      };

  return (
    <div className={styles.body}>
      {productDetail && (
        <div className={styles.detail}>
          <div className={styles.description}>
            <img
              className={styles.image}
              src={productDetail.image}
              alt="상품 사진"
            />
            <div className={styles.descriptionMore}>
              <h2>{productDetail.title}</h2>
              <p>가격: ${productDetail.price}</p>
              <p className={styles.descriptionMoreWord}>
                {productDetail.description}
              </p>
              <p>
                <FaStar /> {productDetail.rating.rate} (리뷰 수:
                {productDetail.rating.count} 명)
              </p>
            </div>
          </div>
          <div className={styles.cart}>
            <div className={styles.cartList}>
              <p>구매수량</p>
              <div className={styles.buttons}>
                <button onClick={removeNumber}>
                  <FaArrowLeft />
                </button>
                <p>{cartNumber}</p>
                <button onClick={addNumber}>
                  <FaArrowRight />
                </button>
              </div>
            </div>
            <div className={styles.cartList}>
              <p>총 상품 금액</p>
              <div>
                <p>${cartPrice * cartNumber}</p>
              </div>
            </div>
            <button onClick={toggleModal}>장바구니에 추가하기</button>
            <Modal isOpen={isModalOpen} onClose={toggleModal}>
              <h2>상품을 장바구니에 추가하시겠습니까?</h2>
              <button onClick={addToCart}>예</button>
              <button onClick={toggleModal}>아니요</button>
            </Modal>
          </div>
          <CommentList
            comments={comments}
            user={user}
            setComments={setComments}
            productDetail={productDetail}
          />
          <AddComment
            productDetail={productDetail}
            user={user}
            setComments={setComments}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
