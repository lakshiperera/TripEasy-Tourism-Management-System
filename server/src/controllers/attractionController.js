const Attraction = require('../models/Attraction');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @desc    Get all attractions (with search and filter)
 * @route   GET /api/attractions
 * @access  Public
 */
const getAttractions = asyncHandler(async (req, res) => {
  const { search, category, isActive } = req.query;
  const query = {};

  // Filter by active status (tourist-facing only shows active)
  if (isActive !== 'false') {
    query.isActive = true;
  }

  // Category filter
  if (category && category !== 'all') {
    query.category = category;
  }

  // Search by name (case-insensitive)
  if (search && search.trim()) {
    query.name = { $regex: search.trim(), $options: 'i' };
  }

  const attractions = await Attraction.find(query)
    .populate('category', 'name slug icon color')
    .sort({ 'travelInfo.distanceFromRagama': 1 })
    .lean();

  res.status(200).json({
    success: true,
    count: attractions.length,
    data: attractions,
  });
});

/**
 * @desc    Get single attraction by ID or slug
 * @route   GET /api/attractions/:id
 * @access  Public
 */
const getAttraction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let attraction;

  // Try by ObjectId first, then slug
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    attraction = await Attraction.findById(id).populate('category');
  } else {
    attraction = await Attraction.findOne({ slug: id }).populate('category');
  }

  if (!attraction) {
    return res.status(404).json({
      success: false,
      message: 'Attraction not found',
    });
  }

  res.status(200).json({
    success: true,
    data: attraction,
  });
});

/**
 * @desc    Create new attraction (Admin only)
 * @route   POST /api/attractions
 * @access  Private
 */
const createAttraction = asyncHandler(async (req, res) => {
  const attraction = await Attraction.create(req.body);
  const populated = await attraction.populate('category', 'name slug icon color');

  res.status(201).json({
    success: true,
    message: 'Attraction created successfully',
    data: populated,
  });
});

/**
 * @desc    Update attraction (Admin only)
 * @route   PUT /api/attractions/:id
 * @access  Private
 */
const updateAttraction = asyncHandler(async (req, res) => {
  const attraction = await Attraction.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('category', 'name slug icon color');

  if (!attraction) {
    return res.status(404).json({
      success: false,
      message: 'Attraction not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Attraction updated successfully',
    data: attraction,
  });
});

/**
 * @desc    Delete attraction (Admin only)
 * @route   DELETE /api/attractions/:id
 * @access  Private
 */
const deleteAttraction = asyncHandler(async (req, res) => {
  const attraction = await Attraction.findByIdAndDelete(req.params.id);

  if (!attraction) {
    return res.status(404).json({
      success: false,
      message: 'Attraction not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Attraction deleted successfully',
  });
});

/**
 * @desc    Get attractions for map view (returns only location data)
 * @route   GET /api/attractions/map
 * @access  Public
 */
const getAttractionsForMap = asyncHandler(async (req, res) => {
  const attractions = await Attraction.find({ isActive: true })
    .populate('category', 'name icon color')
    .select('name location category travelInfo images slug')
    .lean();

  res.status(200).json({
    success: true,
    data: attractions,
  });
});

module.exports = {
  getAttractions,
  getAttraction,
  createAttraction,
  updateAttraction,
  deleteAttraction,
  getAttractionsForMap,
};
