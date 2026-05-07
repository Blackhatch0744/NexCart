const Category = require("../Models/Category");
const slugify = require("slugify");
const asyncHandler = require("../Middleware/asyncHandler");

/**
 * CREATE CATEGORY
 * POST /api/category/create
 */
exports.createCategory = asyncHandler(async (req, res) => {
  const { name, image } = req.body;

  if (!name || !image) {
    res.status(400);
    throw new Error("Name and image are required");
  }

  const existing = await Category.findOne({ name });

  if (existing) {
    res.status(400);
    throw new Error("Category already exists");
  }

  const category = await Category.create({
    name,
    slug: slugify(name, { lower: true }),
    image,
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    category,
  });
});

/**
 * GET ALL CATEGORIES
 * GET /api/category/all
 */
exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: categories.length,
    categories,
  });
});
