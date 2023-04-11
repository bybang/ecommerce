import React, { createContext, useState } from "react";

const Context = createContext();

// children ===> whenever we call the StateContext, it is going to be considered children, and we can render it out
export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
};
