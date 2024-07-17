import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa6";
import { useAsync } from "@/hooks/useAsync";
import { fetchProducts, fetchCategories } from "@/api/api";
import { sortProducts } from "@/utils/util";
import styles from "./ProductsList.module.css";
import { Link } from "react-router-dom";

const SORT_OPTIONS = {
  PRICE_LOW_TO_HIGH: "price-lowtohigh",
  PRICE_HIGH_TO_LOW: "price-hightolow",
  RATING: "rating",
  REVIEW: "review",
};

const CATEGORY_ALL = "all";
const SORT_OPTION_DEFAULT = "price";

const ProductsList = () => {
  const {
    data: products,
    loading: productsLoading,
    error: productsError,
  } = useAsync(() => fetchProducts());

  const {
    data: allCategories = [],
    loading: categoriesLoading,
    error: categoriesError,
  } = useAsync(() => fetchCategories());

  const [filters, setFilters] = useState({
    category: CATEGORY_ALL,
    sortOption: SORT_OPTION_DEFAULT,
  });

  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (products) {
      let sortedProducts = [...products];

      if (filters.category !== CATEGORY_ALL) {
        sortedProducts = sortedProducts.filter(
          (product) => product.category === filters.category
        );
      }

      sortedProducts = sortProducts(sortedProducts, filters.sortOption);

      setFilteredProducts(sortedProducts);
    }
  }, [products, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  if (productsLoading || categoriesLoading) {
    return <div>상품들을 불러오고 있습니다...</div>;
  }

  if (productsError) {
    return <div>에러: {productsError.message}</div>;
  }

  if (categoriesError) {
    return <div>에러: {categoriesError.message}</div>;
  }

  const categories = [CATEGORY_ALL, ...allCategories];
  return (
    <div className={styles.body}>
      <div className={styles.category}>
        <div>
          <p>인터넷쇼핑몰입니다!</p>
        </div>
        <div>
          <label>
            카테고리 선택:
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
          <label>
            정렬 기준:
            <select
              name="sortOption"
              value={filters.sortOption}
              onChange={handleFilterChange}
            >
              <option value={SORT_OPTIONS.PRICE_LOW_TO_HIGH}>
                가격 낮은순
              </option>
              <option value={SORT_OPTIONS.PRICE_HIGH_TO_LOW}>
                가격 높은순
              </option>
              <option value={SORT_OPTIONS.RATING}>평점 높은순</option>
              <option value={SORT_OPTIONS.REVIEW}>리뷰 많은순</option>
            </select>
          </label>
        </div>
      </div>
      <div>
        <p className={styles.itemListTitle}>상품 리스트</p>
        <ul className={styles.itemList}>
          {filteredProducts.map((product) => (
            <li key={`key-${product.id}`} className={styles.items}>
              <Link
                to={`/products/${product.id}`}
                style={{ textDecoration: "none" }}
                className={styles.LinkArea}
              >
                <div className={styles.imageContainer}>
                  <img
                    src={product.image}
                    alt={product.title}
                    className={styles.responsiveImage}
                  />
                </div>
                <div className={styles.discription}>
                  <p className={styles.title}>{product.title}</p>
                  <p className={styles.price}>{product.price}</p>
                  <p className={styles.rating}>
                    <FaStar /> {product.rating.rate} (리뷰 수:
                    {product.rating.count}
                    명)
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductsList;
