import React, { useRef } from "react";
import {
  AiOutlineLeft,
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineShopping,
} from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import { useStateContext } from "../context/StateContext";
import Link from "next/link";
import { urlFor } from "../lib/client";
import getStripe from "../lib/getStripe";
import { toast } from "react-hot-toast";

const Cart = () => {
  const cartRef = useRef();

  const {
    cartItems,
    totalPrice,
    totalQuantities,
    setShowCart,
    toggleCartItemQuantity,
    onRemove,
  } = useStateContext();

  const handleCheckout = async () => {
    const stripe = await getStripe();

    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartItems),
    });

    if (response.statusCode === 500) return;

    const data = await response.json();

    toast.loading("Redirecting...");

    // console.log("data: ", data);
    // console.log("stripe: ", stripe);
    // console.log("data.id: ", data.id);

    stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button
          onClick={() => setShowCart(false)}
          type="button"
          className="cart-heading"
        >
          <AiOutlineLeft />
          <span className="heading">Your Cart</span>
          <span className="cart-num-items">({totalQuantities} items)</span>
        </button>

        {/* Cart Items */}
        {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3 className="">Your Cart is empty</h3>
            <Link href="/">
              <button
                onClick={() => setShowCart(false)}
                type="button"
                className="btn"
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        )}

        {/* Product */}
        <div className="product-container">
          {cartItems.length >= 1 &&
            cartItems.map((item, index) => (
              <div key={item._id} className="product">
                <img
                  src={urlFor(item?.image[0])}
                  alt="cart-product-image"
                  className="cart-product-image"
                />
                <div className="item-desc">
                  <div className="flex top">
                    <h5>{item.name}</h5>
                    <h4>${item.price}</h4>
                  </div>

                  <div className="flex bottom">
                    <div>
                      <p className="quantity-desc">
                        <span
                          onClick={() =>
                            toggleCartItemQuantity(item._id, "dec")
                          }
                          className="minus"
                        >
                          <AiOutlineMinus />
                        </span>
                        <span onClick={() => {}} className="num">
                          {item.quantity}
                        </span>
                        <span
                          onClick={() =>
                            toggleCartItemQuantity(item._id, "inc")
                          }
                          className="plus"
                        >
                          <AiOutlinePlus />
                        </span>
                      </p>
                    </div>

                    {/* delete button */}
                    <button
                      onClick={() => onRemove(item)}
                      type="button"
                      className="remove-item"
                    >
                      <TiDeleteOutline />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {/* Subtotal */}
        {cartItems.length >= 1 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>Subtotal:</h3>
              <h3>${totalPrice}</h3>
            </div>
            <div className="btn-container">
              <button onClick={handleCheckout} type="button" className="btn">
                Pay with Stripe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
