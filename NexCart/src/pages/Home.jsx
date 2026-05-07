import React from "react";
import Hero from "../Components/Hero";
// import other homepage components below (FeaturedProduct, Collections, etc.)
import FeaturedProduct from "../Components/FeaturedProduct";

export default function Home() {
  return (
    <main>
      <Hero />
      {/* anchor for hero CTA */}
      <section id="featured">
        <FeaturedProduct />
      </section>

      {/* keep the rest of your homepage components */}
    </main>
  );
}
