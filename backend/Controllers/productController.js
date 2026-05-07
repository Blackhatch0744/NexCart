const Product = require("../Models/Product");
const slugify = require("slugify");
const asyncHandler = require("../Middleware/asyncHandler");

/**
 * CREATE PRODUCT
 */
exports.createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    stock,
    images,
    category,
    isFeatured,
  } = req.body;

  if (!name || !price || !images || !category) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  const product = await Product.create({
    name,
    slug: slugify(name, { lower: true }),
    description,
    price,
    stock,
    images,
    category,
    isFeatured: isFeatured || false,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});

/**
 * GET ALL PRODUCTS
 */
exports.getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate("category", "name slug")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: products.length,
    products,
  });
});

/**
 * GET PRODUCT BY SLUG
 */
exports.getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("category", "name slug");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({ success: true, product });
});

/**
 * GET FEATURED PRODUCTS
 */
exports.getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true })
    .populate("category", "name slug");

  res.json({
    success: true,
    count: products.length,
    products,
  });
});

/**
 * ADMIN: UPDATE PRODUCT
 */
exports.updateProduct = asyncHandler(async (req, res) => {
  if (req.body.name) {
    req.body.slug = slugify(req.body.name, { lower: true });
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({ success: true, product });
});

/**
 * ADMIN: DELETE PRODUCT
 */
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({ success: true, message: "Product deleted" });
});

/**
 * SEARCH PRODUCTS
 */
exports.getSearchProducts = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.json({ success: true, products: [] });
  }

  const products = await Product.find({
    name: { $regex: q, $options: "i" },
  })
    .populate("category", "name slug")
    .limit(5);

  res.json({
    success: true,
    count: products.length,
    products,
  });
});

/**
 * ADMIN: GET ALL PRODUCTS
 */
exports.getAllProductsAdmin = asyncHandler(async (req, res) => {
  const products = await Product.find().populate("category");
  res.json({ success: true, count: products.length, products });
});
