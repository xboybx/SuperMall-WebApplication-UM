import express from 'express'
import { body, validationResult } from 'express-validator'
import Category from '../models/Category.js'
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    
    const categories = await Category.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Category.countDocuments({ isActive: true })

    res.json({
      categories,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({ message: 'Server error while fetching categories' })
  }
})

// @route   GET /api/categories/:id
// @desc    Get category by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, isActive: true })

    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    res.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    res.status(500).json({ message: 'Server error while fetching category' })
  }
})

// @route   POST /api/categories
// @desc    Create a new category
// @access  Private (Admin)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required'),
  body('description')
    .optional()
    .trim()
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { name, description, image } = req.body

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    })
    
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' })
    }

    const category = new Category({
      name,
      description,
      image
    })

    await category.save()

    res.status(201).json({
      message: 'Category created successfully',
      category
    })
  } catch (error) {
    console.error('Error creating category:', error)
    res.status(500).json({ message: 'Server error while creating category' })
  }
})

// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Private (Admin)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category name cannot be empty'),
  body('description')
    .optional()
    .trim()
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const category = await Category.findById(req.params.id)
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    // Check if new name conflicts with existing category
    if (req.body.name && req.body.name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${req.body.name}$`, 'i') },
        _id: { $ne: req.params.id }
      })
      
      if (existingCategory) {
        return res.status(400).json({ message: 'Category with this name already exists' })
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    )

    res.json({
      message: 'Category updated successfully',
      category: updatedCategory
    })
  } catch (error) {
    console.error('Error updating category:', error)
    res.status(500).json({ message: 'Server error while updating category' })
  }
})

// @route   DELETE /api/categories/:id
// @desc    Delete category (soft delete)
// @access  Private (Admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    // Soft delete - set isActive to false
    category.isActive = false
    category.updatedAt = Date.now()
    await category.save()

    res.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    res.status(500).json({ message: 'Server error while deleting category' })
  }
})

export default router