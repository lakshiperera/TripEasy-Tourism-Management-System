const Category = require('../models/Category');
const Attraction = require('../models/Attraction');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 }).lean();

  // Add attraction count to each category
  const categoriesWithCount = await Promise.all(
    categories.map(async (cat) => {
      const count = await Attraction.countDocuments({ category: cat._id, isActive: true });
      return { ...cat, attractionCount: count };
    })
  );

  res.status(200).json({
    success: true,
    count: categoriesWithCount.length,
    data: categoriesWithCount,
  });
});

/**
 * @desc    Create category (Admin only)
 * @route   POST /api/categories
 * @access  Private
 */
const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category,
  });
});

/**
 * @desc    Update category (Admin only)
 * @route   PUT /api/categories/:id
 * @access  Private
 */
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: category,
  });
});

/**
 * @desc    Delete category (Admin only)
 * @route   DELETE /api/categories/:id
 * @access  Private
 */
const deleteCategory = asyncHandler(async (req, res) => {
  // Check if category has attractions
  const count = await Attraction.countDocuments({ category: req.params.id });
  if (count > 0) {
    return res.status(400).json({
      success: false,
      message: `Cannot delete category with ${count} attraction(s). Reassign them first.`,
    });
  }

  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  res.status(200).json({ success: true, message: 'Category deleted successfully' });
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
