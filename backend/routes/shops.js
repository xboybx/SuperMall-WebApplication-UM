import express from 'express'
import { body, validationResult } from 'express-validator'
import Shop from '../models/Shop.js'
import Category from '../models/Category.js'
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/shops
// @desc    Get all shops with optional filters
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, floor, search, page = 1, limit = 20 } = req.query
    
    let query = { isActive: true }
    
    // Add filters
    if (category) {
      query.categoryId = category
    }
    
    if (floor) {
      query.floor = parseInt(floor)
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ]
    }

    const shops = await Shop.find(query)
      .populate('categoryId', 'name')
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Shop.countDocuments(query)

    res.json({
      shops,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    })
  } catch (error) {
    console.error('Error fetching shops:', error)
    res.status(500).json({ message: 'Server error while fetching shops' })
  }
})

// @route   GET /api/shops/:id
// @desc    Get shop by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const shop = await Shop.findOne({ _id: req.params.id, isActive: true })
      .populate('categoryId', 'name description')
      .populate('owner', 'name email')

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' })
    }

    res.json(shop)
  } catch (error) {
    console.error('Error fetching shop:', error)
    res.status(500).json({ message: 'Server error while fetching shop' })
  }
})

// @route   GET /api/shops/category/:categoryId
// @desc    Get shops by category
// @access  Public
router.get('/category/:categoryId', async (req, res) => {
  try {
    const shops = await Shop.find({ 
      categoryId: req.params.categoryId, 
      isActive: true 
    })
      .populate('categoryId', 'name')
      .populate('owner', 'name')
      .sort({ createdAt: -1 })

    res.json(shops)
  } catch (error) {
    console.error('Error fetching shops by category:', error)
    res.status(500).json({ message: 'Server error while fetching shops' })
  }
})

// @route   GET /api/shops/floor/:floor
// @desc    Get shops by floor
// @access  Public
router.get('/floor/:floor', async (req, res) => {
  try {
    const floor = parseInt(req.params.floor)
    const shops = await Shop.find({ floor, isActive: true })
      .populate('categoryId', 'name')
      .populate('owner', 'name')
      .sort({ createdAt: -1 })

    res.json(shops)
  } catch (error) {
    console.error('Error fetching shops by floor:', error)
    res.status(500).json({ message: 'Server error while fetching shops' })
  }
})

// @route   POST /api/shops
// @desc    Create a new shop
// @access  Private (Admin)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Shop name is required'),
  body('categoryId')
    .notEmpty()
    .withMessage('Category is required'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('floor')
    .isInt({ min: 1 })
    .withMessage('Floor must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    // Check if category exists
    const category = await Category.findById(req.body.categoryId)
    if (!category) {
      return res.status(400).json({ message: 'Invalid category ID' })
    }

    const shopData = {
      ...req.body,
      owner: req.user._id
    }

    const shop = new Shop(shopData)
    await shop.save()

    const populatedShop = await Shop.findById(shop._id)
      .populate('categoryId', 'name')
      .populate('owner', 'name email')

    res.status(201).json({
      message: 'Shop created successfully',
      shop: populatedShop
    })
  } catch (error) {
    console.error('Error creating shop:', error)
    res.status(500).json({ message: 'Server error while creating shop' })
  }
})

// @route   PUT /api/shops/:id
// @desc    Update shop
// @access  Private (Admin or Shop Owner)
router.put('/:id', [
  authenticateToken,
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Shop name cannot be empty'),
  body('floor')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Floor must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const shop = await Shop.findById(req.params.id)
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' })
    }

    // Check permissions
    if (req.user.role !== 'admin' && shop.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this shop' })
    }

    // If categoryId is being updated, validate it
    if (req.body.categoryId) {
      const category = await Category.findById(req.body.categoryId)
      if (!category) {
        return res.status(400).json({ message: 'Invalid category ID' })
      }
    }

    const updatedShop = await Shop.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    )
      .populate('categoryId', 'name')
      .populate('owner', 'name email')

    res.json({
      message: 'Shop updated successfully',
      shop: updatedShop
    })
  } catch (error) {
    console.error('Error updating shop:', error)
    res.status(500).json({ message: 'Server error while updating shop' })
  }
})

// @route   DELETE /api/shops/:id
// @desc    Delete shop (soft delete)
// @access  Private (Admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id)
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' })
    }

    // Soft delete - set isActive to false
    shop.isActive = false
    shop.updatedAt = Date.now()
    await shop.save()

    res.json({ message: 'Shop deleted successfully' })
  } catch (error) {
    console.error('Error deleting shop:', error)
    res.status(500).json({ message: 'Server error while deleting shop' })
  }
})

export default router