import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import API_BASE_URL from "../config";

import { toast } from "react-toastify";

const WishlistContext = createContext(null);
const API_URL = `${API_BASE_URL}/api/wishlist`;


export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get(API_URL, { withCredentials: true });
      if (data.success) {
        setWishlist(transformWishlist(data.wishlist));
      }
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    }
  };

  // Transform to match frontend expectations (flat objects mostly)
  const transformWishlist = (items) => {
    return items.map((item) => ({
      ...item,
      id: item._id, // Ensure ID is consistent
    }));
  };

  const toggleWishlist = async (product) => {
    if (!user) {
      toast.error("Please login to use wishlist");
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_URL}/toggle`,
        { productId: product.id },
        { withCredentials: true }
      );

      if (data.success) {
        setWishlist(transformWishlist(data.wishlist));
        // Check if the item is in the new wishlist to determine message
        const isAdded = data.wishlist.some(item => item._id === product.id);
        toast.success(isAdded ? "Added to wishlist" : "Removed from wishlist");
      }
    } catch (error) {
      console.error("Toggle wishlist error", error);
      toast.error("Failed to update wishlist");
    }
  };

  const isWishlisted = (id) => {
    return wishlist.some((item) => item.id === id);
  };

  const removeFromWishlist = async (id) => {
    // Re-use toggle logic since it handles remove if exists
    // But we need the product object or at least ID.
    // Toggle expects `product.id`.
    await toggleWishlist({ id });
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isWishlisted,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }
  return ctx;
}
