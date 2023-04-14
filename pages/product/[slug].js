import React, { useState } from "react";
import { client, urlFor } from "../../lib/client";
import {
  AiFillStar,
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineStar,
} from "react-icons/ai";
import { Product } from "../../components";
import { useStateContext } from "../../context/StateContext";

const ProductDetails = ({ product, products }) => {
  const { image, name, details, price } = product;
  const [index, setIndex] = useState(0);

  const { qty, incQty, decQty, onAdd, setShowCart } = useStateContext();

  const handleBuyNow = () => {
    onAdd(product, qty);

    setShowCart(true);
  };

  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            <img
              src={urlFor(image && image[index])}
              alt="product-detail-image"
              className="product-detail-image"
            />
          </div>

          {/* Image carousel */}
          <div className="small-images-container">
            {image.map((item, i) => (
              <img
                onMouseEnter={() => setIndex(i)}
                key={i}
                src={urlFor(item)}
                alt="item-preview"
                className={
                  i === index ? "small-image selected-image" : "small-image"
                }
              />
            ))}
          </div>
        </div>
        {/* product detail description */}
        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className="reviews">
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            {/* review count */}
            <p>(20)</p>
          </div>
          <h4>Details: </h4>
          <p>{details}</p>
          <p className="price">${price}</p>

          {/* Quantity part */}
          <div className="quantity">
            <h3>Quantity: </h3>
            <p className="quantity-desc">
              <span onClick={decQty} className="minus">
                <AiOutlineMinus />
              </span>
              <span className="num">{qty}</span>
              <span onClick={incQty} className="plus">
                <AiOutlinePlus />
              </span>
            </p>
          </div>

          {/* Add to Cart / Buy now */}
          <div className="buttons">
            <button
              onClick={() => onAdd(product, qty)}
              type="button"
              className="add-to-cart"
            >
              Add to Cart
            </button>
            <button onClick={handleBuyNow} type="button" className="buy-now">
              Buy Now
            </button>
          </div>
        </div>
      </div>
      {/* You may like part */}
      <div className="maylike-products-wrapper">
        <h2>You may also like</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {products.map((item) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Nextjs needs to know products can be clickable at home, to immediate rendering. Inside of the product detail page, we have multiple other links(you might like), we need to repeat the process for them. So Nextjs can prepare all the data and deliver it as quick as possible
export const getStaticPaths = async () => {
  const query = `*[_type == "product"] {
    slug {
      current
    }
  }
  `;

  const products = await client.fetch(query);

  const paths = products.map((product) => ({
    params: {
      slug: product.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

// If user clicks a product, the site should have the data already stored. That is the reason for getStaticProps
export const getStaticProps = async ({ params: { slug } }) => {
  const query = `*[_type == "product" && slug.current == "${slug}"][0]`;
  const product = await client.fetch(query);

  const productsQuery = await `*[_type == "product"]`;
  const products = await client.fetch(productsQuery);

  return {
    props: { product, products },
  };
};

export default ProductDetails;
