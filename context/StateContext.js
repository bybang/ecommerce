import React, { createContext, useContext, useState } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

// children ===> whenever we call the StateContext, it is going to be considered children, and we can render it out
export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState(Object.freeze([]));
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  // product in the cart that we want to update
  let foundProduct;
  // let index;

  // Increase or decrease cart quantity
  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };
  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;

      return prevQty - 1;
    });
  };

  // What is going to happen when use add to cart?
  const onAdd = (product, quantity) => {
    // Is it in the cart?
    const checkProductInCart = cartItems.find(
      (item) => item._id === product._id
    );

    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + product.price * quantity
    );
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

    // Then update the existing items quantity
    if (checkProductInCart) {
      // finish updating the states, actually update cart
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id)
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
          };
      });

      setCartItems(updatedCartItems);
    } else {
      product.quantity = quantity;

      setCartItems([...cartItems, { ...product }]);
    }

    // Reset the quantity state to its initial value
    setQty(1);

    toast.success(`${qty} ${product.name} added to the cart!`);
  };

  const onRemove = (product) => {
    // which product are we currently updating
    foundProduct = cartItems.find((item) => item._id === product._id);
    // create a new version of items without the cart item that currently updating
    const newCartItems = cartItems.filter((item) => item._id !== product._id);

    setTotalPrice(
      (prevTotalPrice) =>
        prevTotalPrice - foundProduct.price * foundProduct.quantity
    );
    setTotalQuantities(
      (prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
    );

    setCartItems(newCartItems);
  };

  // updating item quantity in the cart
  const toggleCartItemQuantity = (id, value) => {
    // Create a copy of the original array
    const newCartItems = [...cartItems];

    // Find the index of the item with the given id in the new array
    const index = newCartItems.findIndex((item) => item._id === id);

    // Update the quantity of the item at that index
    if (value === "inc") {
      newCartItems[index].quantity += 1;
      setTotalPrice(
        (prevTotalPrice) => prevTotalPrice + newCartItems[index].price
      );
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
    } else if (value === "dec") {
      if (newCartItems[index].quantity > 1) {
        newCartItems[index].quantity -= 1;
        setTotalPrice(
          (prevTotalPrice) => prevTotalPrice - newCartItems[index].price
        );
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
      }
    }

    // Update the state of cartItems with the new array
    setCartItems(newCartItems);
  };

  return (
    <Context.Provider
      value={{
        showCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        setShowCart,
        toggleCartItemQuantity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities,
      }}
    >
      {children}
    </Context.Provider>
  );
};

// allow us grab the state more easily
export const useStateContext = () => useContext(Context);

// Previous logic for foundProduct keeping this for the memo
// foundProduct = cartItems.find((item) => item._id === id);
// index = cartItems.findIndex((product) => product._id === id);

// // filter the items, and don't include the item that has same index
// // Keep all the items, besides one that user is trying to update.
// const newCartItems = cartItems.filter((item) => item._id !== id);

// if (value === "inc") {
//   // foundProduct.quantity += 1
//   // cartItems[index] = foundProduct; never update the state directly
//   // let newCartItems = [...cartItems, { ...product, quantity: product.quantity + 1 }];
//   setCartItems([
//     ...newCartItems,
//     { ...foundProduct, quantity: foundProduct.quantity + 1 },
//   ]);
//   setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
//   setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
// } else if (value === "dec") {
//   if (foundProduct.quantity > 1) {
//     setCartItems([
//       ...newCartItems,
//       { ...foundProduct, quantity: foundProduct.quantity - 1 },
//     ]);
//     setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
//     setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
//   }
// }
