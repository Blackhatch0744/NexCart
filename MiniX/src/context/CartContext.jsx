import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import API_BASE_URL from "../config";

const CartContext = createContext(null);

const API_URL = `${API_BASE_URL}/api/cart`;


export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  // 🔔 Toast state
  const [showToastVisible, setShowToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // 🛒 Cart Drawer state
  const [isCartOpen, setIsCartOpen] = useState(false);

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToastVisible(true);
    setTimeout(() => {
      setShowToastVisible(false);
    }, 1800);
  };

  // Helper to format backend data for frontend
  const processCartData = (apiCartItems) => {
    return apiCartItems.map((item) => ({
      ...item.product, // Spread product details (name, price, images, slug)
      id: item.product?._id || item.product?.id, // Ensure ID matches what frontend expects
      cartItemId: `${item.product?._id || item.product?.id}-${item.selectedSize || ''}-${item.selectedColor?.name || item.selectedColor || ''}`,
      // We might need to keep the original item structure for some logic, but flattening is safer for existing UI
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
      product: item.product, // Keep original nested product if needed
    }));
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await axios.get(API_URL, {
        withCredentials: true,
      });
      if (data.success) {
        setCartItems(processCartData(data.cart));
      }
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  };

  const addToCart = async (product) => {
    if (!user) {
      triggerToast("Please login to add items");
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_URL}/add`,
        {
          productId: product.id || product._id, // Handle both id formats
          quantity: product.quantity || 1,
          selectedSize: product.selectedSize,
          selectedColor: product.selectedColor,
        },
        { withCredentials: true }
      );

      if (data.success) {
        setCartItems(processCartData(data.cart));
        // ✅ Trigger toast & open drawer
        triggerToast("Added to cart");
        setIsCartOpen(true);
      }
    } catch (error) {
      console.error("Add to cart error", error);
      triggerToast("Failed to add to cart");
    }
  };

  const updateQuantity = async (cartItemId, delta) => {
    if (!user) return;

    // Find the item in local state to get its variant details
    const targetItem = cartItems.find((item) => item.cartItemId === cartItemId);

    if (!targetItem) return;

    const newQuantity = Math.max(1, targetItem.quantity + delta);

    try {
      const { data } = await axios.put(
        `${API_URL}/update`,
        {
          productId: targetItem.product._id,
          selectedSize: targetItem.selectedSize,
          selectedColor: targetItem.selectedColor,
          quantity: newQuantity,
        },
        { withCredentials: true }
      );

      if (data.success) {
        setCartItems(processCartData(data.cart));
      }
    } catch (error) {
      console.error("Update quantity error", error);
    }
  };

  // Original UI calls removeFromCart(item.id)
  const removeFromCart = async (cartItemId) => {
    if (!user) return;

    const targetItem = cartItems.find((item) => item.cartItemId === cartItemId);
    if (!targetItem) return;

    try {
      const { data } = await axios.post(
        `${API_URL}/remove`,
        {
          productId: targetItem.product._id,
          selectedSize: targetItem.selectedSize,
          selectedColor: targetItem.selectedColor,
        },
        { withCredentials: true }
      );

      if (data.success) {
        setCartItems(processCartData(data.cart));
        triggerToast("Item removed");
      }
    } catch (error) {
      console.error("Remove from cart error", error);
      triggerToast("Failed to remove item");
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      const { data } = await axios.delete(`${API_URL}/clear`, {
        withCredentials: true,
      });
      if (data.success) {
        setCartItems([]);
        triggerToast("Cart cleared");
      }
    } catch (error) {
      console.error("Clear cart error", error);
      triggerToast("Failed to clear cart");
    }
  };

  const total = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        total,
        showToastVisible,
        toastMessage,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}
