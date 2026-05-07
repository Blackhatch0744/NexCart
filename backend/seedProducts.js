const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./Models/Product");
const Category = require("./Models/Category"); // We'll need to create/ensure categories exist

dotenv.config();

const productData = [
    {
        id: "hoodie-002",
        name: "Y2K Grunge Star Hoodie",
        category: "hoodies",
        price: 89,
        stock: 15,
        description: "Heavy oversized ivory white hoodie with a distressed dark faded star graphic on the chest. Pure Y2K streetwear aesthetic.",
        images: ["/products/y2k_star_hoodie.png"],
    },
    {
        id: "bottom-002",
        name: "Techwear Cargo Pants",
        category: "bottoms",
        price: 120,
        stock: 8,
        description: "Futuristic tactical cargo pants with dynamic utility straps and deep pockets. Engineered for premium cyber-streetwear fits.",
        images: ["/products/techwear_cargo_pants.png"],
    },
    {
        id: "tee-002",
        name: "Washed Vintage Graphic Tee",
        category: "tees",
        price: 45,
        stock: 20,
        description: "Premium washed dark grey graphic tee with a distressed minimalist typography design. The ultimate vintage fit.",
        images: ["/products/vintage_washed_tee.png"],
    },
];


const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");

        // Clear existing products? Maybe better to upsert or just clear for clean slate
        // await Product.deleteMany({});
        // console.log("Cleared existing products");

        for (const p of productData) {
            // 1. Ensure Category Exists
            let category = await Category.findOne({ slug: p.category });
            if (!category) {
                category = await Category.create({
                    name: p.category.charAt(0).toUpperCase() + p.category.slice(1),
                    slug: p.category,
                    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=300&q=80", // Placeholder
                    description: `All ${p.category} products`,
                });
                console.log(`Created category: ${category.name}`);
            }

            // 2. Create/Update Product
            // We use the 'id' from frontend as the 'slug' in backend to match logic
            const existingProduct = await Product.findOne({ slug: p.id });
            if (existingProduct) {
                console.log(`Product already exists: ${p.name}`);
                // Optionally update it
                existingProduct.stock = p.stock;
                existingProduct.price = p.price;
                existingProduct.category = category._id;
                await existingProduct.save();
            } else {
                await Product.create({
                    name: p.name,
                    slug: p.id, // VITAL: Mapping frontend ID to backend slug
                    description: p.description,
                    price: p.price,
                    stock: p.stock,
                    images: p.images,
                    category: category._id,
                    isFeatured: true,
                });
                console.log(`Created product: ${p.name}`);
            }
        }

        console.log("Seeding completed");
        process.exit();
    } catch (error) {
        console.error("Error seeding products:", JSON.stringify(error, null, 2));
        process.exit(1);
    }
};

seedProducts();
