import express from 'express'
import { body, validationResult } from 'express-validator'
import Banner from '../models/Banner.js'
import Shop from '../models/Shop.js'
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/banners
// @desc    Get all active banners for public display
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const now = new Date()
    
    const banners = await Banner.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    })
      .populate('shop', 'name location floor')
      .sort({ priority: -1, createdAt: -1 })
      .limit(10)

    // Increment impression count for each banner
    const bannerIds = banners.map(banner => banner._id)
    await Banner.updateMany(
      { _id: { $in: bannerIds } },
      { $inc: { impressionCount: 1 } }
    )

    res.json({
      banners,
      total: banners.length
    })
  } catch (error) {
    console.error('Error fetching banners:', error)
    res.status(500).json({ message: 'Server error while fetching banners' })
  }
})

// @route   GET /api/banners/admin
// @desc    Get all banners for admin management
// @access  Private (Admin)
router.get('/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    
    const banners = await Banner.find({})
      .populate('shop', 'name location floor')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Banner.countDocuments({})

    res.json({
      banners,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    })
  } catch (error) {
    console.error('Error fetching admin banners:', error)
    res.status(500).json({ message: 'Server error while fetching banners' })
  }
})

// @route   GET /api/banners/:id
// @desc    Get banner by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id)
      .populate('shop', 'name location floor')
      .populate('createdBy', 'name email')

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' })
    }

    res.json(banner)
  } catch (error) {
    console.error('Error fetching banner:', error)
    res.status(500).json({ message: 'Server error while fetching banner' })
  }
})

// @route   POST /api/banners
// @desc    Create a new banner
// @access  Private (Admin)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Banner title is required'),
  body('imageUrl')
    .trim()
    .notEmpty()
    .withMessage('Banner image URL is required'),
  body('shop')
    .notEmpty()
    .withMessage('Shop is required'),
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('priority')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Priority must be between 0 and 10')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { shop, endDate } = req.body

    // Validate shop exists
    const shopExists = await Shop.findById(shop)
    if (!shopExists) {
      return res.status(400).json({ message: 'Invalid shop ID' })
    }

    // Validate end date is in the future
    if (new Date(endDate) <= new Date()) {
      return res.status(400).json({ message: 'End date must be in the future' })
    }

    const banner = new Banner({
      ...req.body,
      createdBy: req.user._id
    })

    await banner.save()

    const populatedBanner = await Banner.findById(banner._id)
      .populate('shop', 'name location floor')
      .populate('createdBy', 'name email')

    res.status(201).json({
      message: 'Banner created successfully',
      banner: populatedBanner
    })
  } catch (error) {
    console.error('Error creating banner:', error)
    res.status(500).json({ message: 'Server error while creating banner' })
  }
})

// @route   PUT /api/banners/:id
// @desc    Update banner
// @access  Private (Admin)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Banner title cannot be empty'),
  body('imageUrl')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Banner image URL cannot be empty'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('priority')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Priority must be between 0 and 10')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const banner = await Banner.findById(req.params.id)
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' })
    }

    // Validate shop if provided
    if (req.body.shop) {
      const shopExists = await Shop.findById(req.body.shop)
      if (!shopExists) {
        return res.status(400).json({ message: 'Invalid shop ID' })
      }
    }

    // Validate end date if provided
    if (req.body.endDate && new Date(req.body.endDate) <= new Date()) {
      return res.status(400).json({ message: 'End date must be in the future' })
    }

    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    )
      .populate('shop', 'name location floor')
      .populate('createdBy', 'name email')

    res.json({
      message: 'Banner updated successfully',
      banner: updatedBanner
    })
  } catch (error) {
    console.error('Error updating banner:', error)
    res.status(500).json({ message: 'Server error while updating banner' })
  }
})

// @route   DELETE /api/banners/:id
// @desc    Delete banner (soft delete)
// @access  Private (Admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id)
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' })
    }

    // Soft delete - set isActive to false
    banner.isActive = false
    banner.updatedAt = Date.now()
    await banner.save()

    res.json({ message: 'Banner deleted successfully' })
  } catch (error) {
    console.error('Error deleting banner:', error)
    res.status(500).json({ message: 'Server error while deleting banner' })
  }
})

// @route   POST /api/banners/:id/click
// @desc    Track banner click
// @access  Public
router.post('/:id/click', async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id)
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' })
    }

    // Increment click count
    banner.clickCount += 1
    await banner.save()

    res.json({ message: 'Click tracked successfully' })
  } catch (error) {
    console.error('Error tracking banner click:', error)
    res.status(500).json({ message: 'Server error while tracking click' })
  }
})

export default router