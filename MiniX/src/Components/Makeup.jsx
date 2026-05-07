export default function Makeup() {
  const products = [
    {
      id: 1,
      name: "Liquid Matte Lipstick",
      price: "₹499",
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa",
    },
    {
      id: 2,
      name: "HD Foundation",
      price: "₹799",
      image: "https://images.unsplash.com/photo-1601043017238-5f17d1fdea0c",
    },
    {
      id: 3,
      name: "Long Lash Mascara",
      price: "₹399",
      image: "https://images.unsplash.com/photo-1596469949212-5419f8fa289a",
    },
    {
      id: 4,
      name: "Blush Palette",
      price: "₹999",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-pink-400 text-white text-center py-16">
        <h1 className="text-4xl font-bold">Makeup Collection</h1>
        <p className="mt-2 text-lg">Discover the best beauty essentials</p>
      </section>

      {/* Categories */}
      <section className="py-10 px-6">
        <h2 className="text-2xl font-semibold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {["Face", "Eyes", "Lips", "Nails", "Tools", "Accessories"].map(
            (item) => (
              <div
                key={item}
                className="py-4 px-6 bg-white shadow rounded-lg flex justify-center items-center font-medium hover:bg-gray-200 cursor-pointer transition"
              >
                {item}
              </div>
            )
          )}
        </div>
      </section>

      {/* Products */}
      <section className="px-6 pb-20">
        <h2 className="text-2xl font-semibold mb-6">Popular Products</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow rounded-lg overflow-hidden hover:scale-105 transition"
            >
              <img
                src={product.image}
                className="w-full h-48 object-cover"
                alt={product.name}
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-pink-500 font-bold">{product.price}</p>
                <button className="mt-3 w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
