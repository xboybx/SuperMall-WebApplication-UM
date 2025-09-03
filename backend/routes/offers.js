import express from 'express'
import { body, validationResult } from 'express-validator'
import Offer from '../models/Offer.js'
import Shop from '../models/Shop.js'
import Product from '../models/Product.js'
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/offers
// @desc    Get all offers with optional filters
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { shop, active, page = 1, limit = 20 } = req.query
    
    let query = {}
    
    // Add filters
    if (shop) {
      query.shop = shop
    }
    
    if (active === 'true') {
      const now = new Date()
      query.isActive = true
      query.startDate = { $lte: now }
      query.endDate = { $gte: now }
    }

    const offers = await Offer.find(query)
      .populate('shop', 'name location floor')
      .populate('product', 'name images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Offer.countDocuments(query)

    res.json({
      offers,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    })
  } catch (error) {
    console.error('Error fetching offers:', error)
    res.status(500).json({ message: 'Server error while fetching offers' })
  }
})

// @route   GET /api/offers/:id
// @desc    Get offer by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate('shop', 'name location floor')
      .populate('product', 'name images description')

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' })
    }

    res.json(offer)
  } catch (error) {
    console.error('Error fetching offer:', error)
    res.status(500).json({ message: 'Server error while fetching offer' })
  }
})

// @route   GET /api/offers/shop/:shopId
// @desc    Get offers by shop
// @access  Public
router.get('/shop/:shopId', async (req, res) => {
  try {
    const offers = await Offer.find({ 
      shop: req.params.shopId,
      isActive: true 
    })
      .populate('product', 'name images')
      .sort({ createdAt: -1 })

    res.json({ offers })
  } catch (error) {
    console.error('Error fetching shop offers:', error)
    res.status(500).json({ message: 'Server error while fetching shop offers' })
  }
})

// @route   POST /api/offers
// @desc    Create a new offer
// @access  Private (Admin)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Offer title is required'),
  body('shop')
    .notEmpty()
    .withMessage('Shop is required'),
  body('product')
    .notEmpty()
    .withMessage('Product is required'),
  body('discountType')
    .isIn(['percentage', 'fixed'])
    .withMessage('Discount type must be percentage or fixed'),
  body('discountValue')
    .isFloat({ min: 0 })
    .withMessage('Discount value must be a positive number'),
  body('originalPrice')
    .isFloat({ min: 0 })
    .withMessage('Original price must be a positive number'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid date')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { shop, product, startDate, endDate } = req.body

    // Validate shop exists
    const shopExists = await Shop.findById(shop)
    if (!shopExists) {
      return res.status(400).json({ message: 'Invalid shop ID' })
    }

    // Validate product exists
    const productExists = await Product.findById(product)
    if (!productExists) {
      return res.status(400).json({ message: 'Invalid product ID' })
    }

    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be after start date' })
    }

    const offer = new Offer(req.body)
    await offer.save()

    const populatedOffer = await Offer.findById(offer._id)
      .populate('shop', 'name location floor')
      .populate('product', 'name images')

    res.status(201).json({
      message: 'Offer created successfully',
      offer: populatedOffer
    })
  } catch (error) {
    console.error('Error creating offer:', error)
    res.status(500).json({ message: 'Server error while creating offer' })
  }
})

// @route   PUT /api/offers/:id
// @desc    Update offer
// @access  Private (Admin)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Offer title cannot be empty'),
  body('discountType')
    .optional()
    .isIn(['percentage', 'fixed'])
    .withMessage('Discount type must be percentage or fixed'),
  body('discountValue')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discount value must be a positive number'),
  body('originalPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Original price must be a positive number'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const offer = await Offer.findById(req.params.id)
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' })
    }

    // Validate dates if provided
    const startDate = req.body.startDate || offer.startDate
    const endDate = req.body.endDate || offer.endDate
    
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be after start date' })
    }

    // Validate shop and product if provided
    if (req.body.shop) {
      const shopExists = await Shop.findById(req.body.shop)
      if (!shopExists) {
        return res.status(400).json({ message: 'Invalid shop ID' })
      }
    }

    if (req.body.product) {
      const productExists = await Product.findById(req.body.product)
      if (!productExists) {
        return res.status(400).json({ message: 'Invalid product ID' })
      }
    }

    const updatedOffer = await Offer.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    )
      .populate('shop', 'name location floor')
      .populate('product', 'name images')

    res.json({
      message: 'Offer updated successfully',
      offer: updatedOffer
    })
  } catch (error) {
    console.error('Error updating offer:', error)
    res.status(500).json({ message: 'Server error while updating offer' })
  }
})

// @route   DELETE /api/offers/:id
// @desc    Delete offer (soft delete)
// @access  Private (Admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id)
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' })
    }

    // Soft delete - set isActive to false
    offer.isActive = false
    offer.updatedAt = Date.now()
    await offer.save()

    res.json({ message: 'Offer deleted successfully' })
  } catch (error) {
    console.error('Error deleting offer:', error)
    res.status(500).json({ message: 'Server error while deleting offer' })
  }
})

export default router