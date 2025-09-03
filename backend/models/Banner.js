import mongoose from 'mongoose'

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Banner title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Banner image is required']
  },
  linkUrl: {
    type: String,
    trim: true
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  clickCount: {
    type: Number,
    default: 0
  },
  impressionCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

bannerSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

// Virtual for checking if banner is currently active
bannerSchema.virtual('isCurrentlyActive').get(function() {
  const now = new Date()
  return this.isActive && 
         this.startDate <= now && 
         this.endDate >= now
})

// Index for better query performance
bannerSchema.index({ isActive: 1, startDate: 1, endDate: 1, priority: -1 })

const Banner = mongoose.model('Banner', bannerSchema)

export default Banner