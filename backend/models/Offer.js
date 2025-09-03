import mongoose from 'mongoose'

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Offer title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value cannot be negative']
  },
  originalPrice: {
    type: Number,
    required: [true, 'Original price is required'],
    min: [0, 'Original price cannot be negative']
  },
  offerPrice: {
    type: Number,
    required: [true, 'Offer price is required'],
    min: [0, 'Offer price cannot be negative']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  maxUsage: {
    type: Number,
    default: null // null means unlimited
  },
  currentUsage: {
    type: Number,
    default: 0
  },
  terms: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

offerSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  
  // Calculate offer price based on discount type
  if (this.discountType === 'percentage') {
    this.offerPrice = this.originalPrice - (this.originalPrice * this.discountValue / 100)
  } else if (this.discountType === 'fixed') {
    this.offerPrice = Math.max(0, this.originalPrice - this.discountValue)
  }
  
  next()
})

// Virtual for checking if offer is currently active
offerSchema.virtual('isCurrentlyActive').get(function() {
  const now = new Date()
  return this.isActive && 
         this.startDate <= now && 
         this.endDate >= now &&
         (this.maxUsage === null || this.currentUsage < this.maxUsage)
})

const Offer = mongoose.model('Offer', offerSchema)

export default Offer