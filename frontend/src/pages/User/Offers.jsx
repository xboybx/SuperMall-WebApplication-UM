import { useState, useEffect } from 'react'
import { offerAPI, categoryAPI } from '../../services/api'
import { Calendar, DollarSign, Tag, Filter, Search, Clock } from 'lucide-react'
import LoadingSpinner from '../../components/UI/LoadingSpinner'

const Offers = () => {
  const [offers, setOffers] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [discountFilter, setDiscountFilter] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [offersResponse, categoriesResponse] = await Promise.all([
        offerAPI.getAll(),
        categoryAPI.getAll()
      ])
      setOffers(offersResponse.data.offers || offersResponse.data || [])
      setCategories(categoriesResponse.data.categories || categoriesResponse.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = !selectedCategory || 
                           (offer.shop?.categoryId === selectedCategory || 
                            offer.shop?.categoryId?._id === selectedCategory)
    
    const matchesDiscount = !discountFilter || 
                           (discountFilter === 'high' && offer.discountValue >= 50) ||
                           (discountFilter === 'medium' && offer.discountValue >= 25 && offer.discountValue < 50) ||
                           (discountFilter === 'low' && offer.discountValue < 25)
    
    return matchesSearch && matchesCategory && matchesDiscount
  })

  const isOfferActive = (offer) => {
    const now = new Date()
    const startDate = new Date(offer.startDate)
    const endDate = new Date(offer.endDate)
    return offer.isActive && startDate <= now && endDate >= now
  }

  const getDaysRemaining = (endDate) => {
    const now = new Date()
    const end = new Date(endDate)
    const diffTime = end - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Special Offers</h1>
        <p className="text-gray-600">Discover amazing deals and discounts from our merchants</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="h-4 w-4 inline mr-1" />
              Search Offers
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
              placeholder="Search by title or description..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Range
            </label>
            <select
              value={discountFilter}
              onChange={(e) => setDiscountFilter(e.target.value)}
              className="input"
            >
              <option value="">All Discounts</option>
              <option value="high">50%+ OFF</option>
              <option value="medium">25-49% OFF</option>
              <option value="low">Under 25% OFF</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('')
                setDiscountFilter('')
              }}
              className="btn btn-outline w-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.map(offer => {
          const daysRemaining = getDaysRemaining(offer.endDate)
          const active = isOfferActive(offer)
          
          return (
            <div key={offer._id} className={`bg-white rounded-lg shadow-sm border p-6 ${!active ? 'opacity-75' : ''}`}>
              <div className="aspect-w-16 aspect-h-9 mb-4 relative">
                <img
                  src={offer.image || 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={offer.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    offer.discountType === 'percentage' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-green-500 text-white'
                  }`}>
                    {offer.discountType === 'percentage' 
                      ? `${offer.discountValue}% OFF` 
                      : `$${offer.discountValue} OFF`
                    }
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-900">{offer.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {active ? 'Active' : 'Expired'}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-2">
                  {offer.description || 'Amazing offer available now!'}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg text-gray-500 line-through">
                        ${offer.originalPrice}
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        ${offer.offerPrice}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">You Save</div>
                      <div className="font-semibold text-green-600">
                        ${(offer.originalPrice - offer.offerPrice).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      Valid until {new Date(offer.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {active && daysRemaining <= 7 && (
                    <div className="flex items-center text-orange-600 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="font-medium">
                        {daysRemaining > 0 
                          ? `${daysRemaining} days remaining` 
                          : 'Expires today!'
                        }
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <div className="flex flex-col">
                    <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                      {offer.shop?.name || 'Shop'}
                    </span>
                    {offer.maxUsage && (
                      <span className="text-xs text-gray-500 mt-1">
                        {offer.currentUsage || 0}/{offer.maxUsage} used
                      </span>
                    )}
                  </div>
                  
                  <button 
                    className={`btn text-sm ${
                      active 
                        ? 'btn-primary' 
                        : 'btn-outline opacity-50 cursor-not-allowed'
                    }`}
                    disabled={!active}
                  >
                    {active ? 'Claim Offer' : 'Expired'}
                  </button>
                </div>
                
                {offer.terms && (
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    <strong>Terms:</strong> {offer.terms}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filteredOffers.length === 0 && (
        <div className="text-center py-12">
          <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No offers found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or check back later for new offers</p>
        </div>
      )}
    </div>
  )
}

export default Offers