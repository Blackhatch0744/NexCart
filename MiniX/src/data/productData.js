// src/data/productData.js

const productData = [
  {
    id: "tee-001",
    name: "Classic Oversized Tee",
    category: "tees",
    price: 29,
    rating: 4.5,
    reviewCount: 2,
    stock: 6,

    description:
      "Premium oversized tee made from 240 GSM cotton. Slightly dropped shoulders for relaxed streetwear fit.",

    details: {
      material: "100% Cotton, 240 GSM",
      fit: "Oversized, dropped shoulders",
    },

    variants: {
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Olive", hex: "#7c7f6b" },
        { name: "Black", hex: "#111111" },
        { name: "White", hex: "#eaeaea" },
      ],
    },

    images: [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512499617640-c2f999098c01?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=1200&q=80",
    ],

    createdAt: "2025-01-01",
  },

  {
    id: "hoodie-001",
    name: "Minimal Hoodie",
    category: "hoodies",
    price: 49,
    rating: 4.3,
    reviewCount: 0,
    stock: 10,

    description:
      "Soft fleece hoodie with minimal chest print. Designed for everyday comfort.",

    details: {
      material: "Cotton fleece blend",
      fit: "Relaxed fit",
    },

    variants: {
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Gray", hex: "#b5b5b5" },
        { name: "Black", hex: "#111111" },
      ],
    },

    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1539884051663-95fc71c48f93?auto=format&fit=crop&w=1200&q=80",
    ],

    createdAt: "2025-01-02",
  },

  {
    id: "bottom-001",
    name: "Streetwear Denim",
    category: "bottoms",
    price: 59,
    rating: 4.6,
    reviewCount: 0,
    stock: 4,

    description:
      "Relaxed tapered denim with Japanese streetwear influence.",

    details: {
      material: "Denim cotton blend",
      fit: "Relaxed tapered",
    },

    variants: {
      sizes: ["28", "30", "32", "34"],
      colors: [
        { name: "Washed Blue", hex: "#3e4a5c" },
        { name: "Black", hex: "#111111" },
      ],
    },

    images: [
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=1200&q=80",
    ],

    createdAt: "2025-01-03",
  },
];

export default productData;
