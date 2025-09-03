import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import shopRoutes from './routes/shops.js'
import categoryRoutes from './routes/categories.js'
import offerRoutes from './routes/offers.js'
import productRoutes from './routes/products.js'
import bannerRoutes from './routes/banners.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/shops', shopRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/offers', offerRoutes)
app.use('/api/products', productRoutes)
app.use('/api/banners', bannerRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'SuperMall API is running',
    timestamp: new Date().toISOString()
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
      console.log(`API Health Check: http://localhost:${PORT}/api/health`)
    })
  })
  .catch((error) => {
    console.error('Database connection error:', error)
    process.exit(1)
  })

export default app