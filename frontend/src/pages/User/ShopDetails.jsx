import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { shopAPI, productAPI, offerAPI } from '../../services/api'
import { MapPin, Clock, Phone, Mail, Star, Tag, Package } from 'lucide-react'
import LoadingSpinner from '../../components/UI/LoadingSpinner'

const ShopDetails = () => {
  const { id } = useParams()
  const [shop, setShop] = useState(null)
  const [products, setProducts] = useState([])
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('products')

  useEffect(() => {
    if (id) {
      fetchShopDetails()
    }
  }, [id])

  const fetchShopDetails = async () => {
    try {
      const [shopRes, productsRes, offersRes] = await Promise.all([
        shopAPI.getById(id),
        productAPI.getByShop(id),
        offerAPI.getByShop(id)
      ])
      
      setShop(shopRes.data)
      setProducts(productsRes.data.products || productsRes.data || [])
      setOffers(offersRes.data.offers || offersRes.data || [])
    } catch (error) {
      console.error('Error fetching shop details:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  if (!shop) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Shop not found</h1>
          <p className="text-gray-600 mt-2">The shop you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Shop Header */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <img
              src={shop.image || 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800'}
              alt={shop.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{shop.name}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span>{shop.rating || 4.5} ({shop.totalRatings || 0} reviews)</span>
                </div>
                <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                  {shop.categoryId?.name || 'General'}
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 leading-relaxed">
              {shop.description || 'Welcome to our shop! We offer quality products and excellent service.'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2 text-primary-600" />
                <span>Floor {shop.floor}, {shop.location}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2 text-primary-600" />
                <span>{shop.operatingHours?.open || '09:00'} - {shop.operatingHours?.close || '21:00'}</span>
              </div>
              
              {shop.contactNumber && (
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-2 text-primary-600" />
                  <span>{shop.contactNumber}</span>
                </div>
              )}
              
              {shop.email && (
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-2 text-primary-600" />
                  <span>{shop.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border mb-8">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Package className="h-4 w-4 inline mr-2" />
              Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'offers'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Tag className="h-4 w-4 inline mr-2" />
              Offers ({offers.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'products' && (
            <div>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => (
                    <div key={product._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="aspect-w-16 aspect-h-9 mb-4">
                        <img
                          src={product.images?.[0] || 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800'}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description || 'Quality product available now'}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {product.originalPrice && product.originalPrice > product.price ? (
                            <>
                              <span className="text-lg font-bold text-green-600">${product.price}</span>
                              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">${product.price}</span>
                          )}
                        </div>
                        
                        {product.isOnOffer && (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                            On Sale
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                        <span>Stock: {product.stock || 0}</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>{product.rating || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                  <p className="text-gray-600">This shop hasn't added any products yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'offers' && (
            <div>
              {offers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {offers.map(offer => (
                    <div key={offer._id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {offer.discountType === 'percentage' 
                            ? `${offer.discountValue}% OFF` 
                            : `$${offer.discountValue} OFF`
                          }
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">
                        {offer.description || 'Special offer available now!'}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg text-gray-500 line-through">
                            ${offer.originalPrice}
                          </span>
                          <span className="text-2xl font-bold text-green-600">
                            ${offer.offerPrice}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-4">
                        Valid: {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
                      </div>
                      
                      <button className="w-full btn btn-primary">
                        Claim Offer
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No offers available</h3>
                  <p className="text-gray-600">This shop doesn't have any active offers at the moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShopDetails