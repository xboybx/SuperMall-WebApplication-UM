import express from 'express'
import { body, validationResult } from 'express-validator'
import Product from '../models/Product.js'
import Shop from '../models/Shop.js'
import Category from '../models/Category.js'
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/products
// @desc    Get all products with optional filters
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      shop, 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      onOffer,
      page = 1, 
      limit = 20 
    } = req.query
    
    let query = { isActive: true }
    
    // Add filters
    if (shop) {
      query.shop = shop
    }
    
    if (category) {
      query.category = category
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }
    
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = parseFloat(minPrice)
      if (maxPrice) query.price.$lte = parseFloat(maxPrice)
    }
    
    if (onOffer === 'true') {
      query.isOnOffer = true
    }

    const products = await Product.find(query)
      .populate('shop', 'name location floor')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Product.countDocuments(query)

    res.json({
      products,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ message: 'Server error while fetching products' })
  }
})

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true })
      .populate('shop', 'name location floor contactNumber email')
      .populate('category', 'name description')

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({ message: 'Server error while fetching product' })
  }
})

// @route   GET /api/products/shop/:shopId
// @desc    Get products by shop
// @access  Public
router.get('/shop/:shopId', async (req, res) => {
  try {
    const products = await Product.find({ 
      shop: req.params.shopId, 
      isActive: true 
    })
      .populate('category', 'name')
      .sort({ createdAt: -1 })

    res.json({ products })
  } catch (error) {
    console.error('Error fetching shop products:', error)
    res.status(500).json({ message: 'Server error while fetching shop products' })
  }
})

// @route   GET /api/products/category/:categoryId
// @desc    Get products by category
// @access  Public
router.get('/category/:categoryId', async (req, res) => {
  try {
    const products = await Product.find({ 
      category: req.params.categoryId, 
      isActive: true 
    })
      .populate('shop', 'name location floor')
      .sort({ createdAt: -1 })

    res.json({ products })
  } catch (error) {
    console.error('Error fetching category products:', error)
    res.status(500).json({ message: 'Server error while fetching category products' })
  }
})

// @route   POST /api/products/compare
// @desc    Compare multiple products
// @access  Public
router.post('/compare', async (req, res) => {
  try {
    const { productIds } = req.body
    
    if (!productIds || !Array.isArray(productIds) || productIds.length < 2) {
      return res.status(400).json({ message: 'At least 2 product IDs are required for comparison' })
    }
    
    if (productIds.length > 4) {
      return res.status(400).json({ message: 'Maximum 4 products can be compared at once' })
    }

    const products = await Product.find({ 
      _id: { $in: productIds }, 
      isActive: true 
    })
      .populate('shop', 'name location floor')
      .populate('category', 'name')

    if (products.length !== productIds.length) {
      return res.status(404).json({ message: 'One or more products not found' })
    }

    res.json({ products })
  } catch (error) {
    console.error('Error comparing products:', error)
    res.status(500).json({ message: 'Server error while comparing products' })
  }
})

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Admin)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('shop')
    .notEmpty()
    .withMessage('Shop is required'),
  body('category')
    .notEmpty()
    .withMessage('Category is required'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { shop, category } = req.body

    // Validate shop exists
    const shopExists = await Shop.findById(shop)
    if (!shopExists) {
      return res.status(400).json({ message: 'Invalid shop ID' })
    }

    // Validate category exists
    const categoryExists = await Category.findById(category)
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid category ID' })
    }

    const product = new Product(req.body)
    await product.save()

    const populatedProduct = await Product.findById(product._id)
      .populate('shop', 'name location floor')
      .populate('category', 'name')

    res.status(201).json({
      message: 'Product created successfully',
      product: populatedProduct
    })
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({ message: 'Server error while creating product' })
  }
})

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Admin or Shop Owner)
router.put('/:id', [
  authenticateToken,
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Product name cannot be empty'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const product = await Product.findById(req.params.id).populate('shop')
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Check permissions
    if (req.user.role !== 'admin' && product.shop.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this product' })
    }

    // Validate shop and category if provided
    if (req.body.shop) {
      const shopExists = await Shop.findById(req.body.shop)
      if (!shopExists) {
        return res.status(400).json({ message: 'Invalid shop ID' })
      }
    }

    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category)
      if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid category ID' })
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    )
      .populate('shop', 'name location floor')
      .populate('category', 'name')

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    })
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(500).json({ message: 'Server error while updating product' })
  }
})

// @route   DELETE /api/products/:id
// @desc    Delete product (soft delete)
// @access  Private (Admin or Shop Owner)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('shop')
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Check permissions
    if (req.user.role !== 'admin' && product.shop.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this product' })
    }

    // Soft delete - set isActive to false
    product.isActive = false
    product.updatedAt = Date.now()
    await product.save()

    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({ message: 'Server error while deleting product' })
  }
})

export default router