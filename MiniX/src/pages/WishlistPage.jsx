import React from "react";
import { useWishlist } from "../context/WishlistContext";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="px-6 lg:px-20 py-14">
        <h1 className="text-2xl font-semibold mb-6">Your Wishlist</h1>

        {wishlist.length === 0 ? (
          <p className="text-gray-400">
            Your wishlist is empty.{" "}
            <Link to="/shop" className="underline text-white">
              Browse products
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 border border-white/10 rounded-xl p-3"
              >
                <Link to={`/product/${item.id}`}>
                  <img src={item.image} alt={item.name} className="rounded-lg h-40 object-cover w-full" />
                </Link>

                <div className="mt-3">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-gray-400 text-xs">${item.price}</p>
                </div>

                <button
                  onClick={() => toggleWishlist(item)}
                  className="mt-3 w-full text-sm py-2 bg-red-400/20 text-red-300 rounded-md"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
