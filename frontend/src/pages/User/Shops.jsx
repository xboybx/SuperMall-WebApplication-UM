import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { shopAPI, categoryAPI } from '../../services/api'
import { MapPin, Star, Filter, Search, Store, Grid, List, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import LoadingSpinner from '../../components/UI/LoadingSpinner'

const Shops = () => {
  const [shops, setShops] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedFloor, setSelectedFloor] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [shopsResponse, categoriesResponse] = await Promise.all([
        shopAPI.getAll(),
        categoryAPI.getAll()
      ])
      setShops(shopsResponse.data.shops || [])
      setCategories(categoriesResponse.data.categories || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  let filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || shop.categoryId?._id === selectedCategory || shop.categoryId === selectedCategory
    const matchesFloor = !selectedFloor || shop.floor === parseInt(selectedFloor)
    
    return matchesSearch && matchesCategory && matchesFloor
  })

  // Sort shops
  filteredShops = filteredShops.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt)
      default:
        return 0
    }
  })

  const floors = [...new Set(shops.map(shop => shop.floor))].sort((a, b) => a - b)

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Discover Amazing Shops</h1>
          <p className="text-xl text-neutral-600">Explore {shops.length}+ unique shops from merchants worldwide</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                placeholder="Search shops, brands, or products..."
              />
            </div>

            {/* Quick Filters */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="font-medium">Filters</span>
              </button>

              <div className="flex items-center space-x-2">
                <ArrowUpDown className="h-4 w-4 text-neutral-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-neutral-200 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-200"
                >
                  <option value="newest">Newest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <div className="flex bg-neutral-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-primary-600 shadow-sm' 
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-primary-600 shadow-sm' 
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Floor
                  </label>
                  <select
                    value={selectedFloor}
                    onChange={(e) => setSelectedFloor(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                  >
                    <option value="">All Floors</option>
                    {floors.map(floor => (
                      <option key={floor} value={floor}>
                        Floor {floor}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory('')
                      setSelectedFloor('')
                    }}
                    className="w-full px-4 py-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-xl font-medium transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-neutral-600">
            Showing <span className="font-semibold text-neutral-900">{filteredShops.length}</span> shops
          </p>
          
          {/* Category Pills */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`filter-chip ${!selectedCategory ? 'filter-chip-active' : ''}`}
            >
              All
            </button>
            {categories.slice(0, 4).map(category => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category._id)}
                className={`filter-chip ${selectedCategory === category._id ? 'filter-chip-active' : ''}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Shop Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredShops.map(shop => (
              <div key={shop._id} className="product-card group">
                <div className="relative overflow-hidden">
                  <img
                    src={shop.image || 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={shop.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-warning-500 fill-current" />
                        <span className="text-sm font-semibold text-neutral-700">{shop.rating || 4.5}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {shop.name}
                    </h3>
                    <p className="text-neutral-600 text-sm line-clamp-2">
                      {shop.description || 'Discover amazing products at this shop'}
                    </p>
                  </div>
                  
                  <div className="flex items-center text-neutral-500 text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1 text-primary-500" />
                    <span>Floor {shop.floor} • {shop.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {shop.categoryId?.name || 'General'}
                    </span>
                    
                    <Link
                      to={`/shop/${shop._id}`}
                      className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                    >
                      Visit Shop
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredShops.map(shop => (
              <div key={shop._id} className="bg-white rounded-xl shadow-card hover:shadow-card-hover border border-neutral-200 p-6 transition-all duration-300">
                <div className="flex items-center space-x-6">
                  <img
                    src={shop.image || 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={shop.name}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-neutral-900">{shop.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-warning-500 fill-current" />
                        <span className="text-sm font-semibold text-neutral-700">{shop.rating || 4.5}</span>
                      </div>
                    </div>
                    
                    <p className="text-neutral-600 mb-3 line-clamp-2">
                      {shop.description || 'Discover amazing products at this shop'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-neutral-500 text-sm">
                          <MapPin className="h-4 w-4 mr-1 text-primary-500" />
                          <span>Floor {shop.floor} • {shop.location}</span>
                        </div>
                        <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold">
                          {shop.categoryId?.name || 'General'}
                        </span>
                      </div>
                      
                      <Link
                        to={`/shop/${shop._id}`}
                        className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                      >
                        Visit Shop
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredShops.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-neutral-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Store className="h-12 w-12 text-neutral-400" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">No shops found</h3>
            <p className="text-neutral-600 mb-6">Try adjusting your search criteria or check back later for new shops</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('')
                setSelectedFloor('')
              }}
              className="btn btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Shops