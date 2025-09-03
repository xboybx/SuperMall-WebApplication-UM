import { useState, useEffect } from 'react'
import { productAPI } from '../../services/api'
import { Search, Plus, X, Star, Check, Minus } from 'lucide-react'
import LoadingSpinner from '../../components/UI/LoadingSpinner'

const ProductComparison = () => {
  const [products, setProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll()
      setProducts(response.data.products || response.data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const addProduct = (product) => {
    if (selectedProducts.length < 4 && !selectedProducts.find(p => p._id === product._id)) {
      setSelectedProducts([...selectedProducts, product])
      setShowSearch(false)
      setSearchTerm('')
    }
  }

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p._id !== productId))
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedProducts.find(p => p._id === product._id)
  )

  const getComparisonFeatures = () => {
    const allFeatures = new Set()
    selectedProducts.forEach(product => {
      if (product.features) {
        product.features.forEach(feature => allFeatures.add(feature.name))
      }
      if (product.specifications) {
        Object.keys(product.specifications).forEach(spec => allFeatures.add(spec))
      }
    })
    return Array.from(allFeatures)
  }

  const getFeatureValue = (product, featureName) => {
    // Check in features array
    if (product.features) {
      const feature = product.features.find(f => f.name === featureName)
      if (feature) return feature.value
    }
    
    // Check in specifications
    if (product.specifications && product.specifications[featureName]) {
      return product.specifications[featureName]
    }
    
    return '-'
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Comparison</h1>
        <p className="text-gray-600">Compare products side by side to make informed decisions</p>
      </div>

      {/* Add Products Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Selected Products ({selectedProducts.length}/4)
          </h2>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="btn btn-primary flex items-center"
            disabled={selectedProducts.length >= 4}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </button>
        </div>

        {showSearch && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input"
                  placeholder="Search products to compare..."
                />
              </div>
              <button
                onClick={() => setShowSearch(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>

            {searchTerm && (
              <div className="max-h-60 overflow-y-auto space-y-2">
                {filteredProducts.map(product => (
                  <div
                    key={product._id}
                    onClick={() => addProduct(product)}
                    className="flex items-center p-3 bg-white rounded-lg border hover:bg-gray-50 cursor-pointer"
                  >
                    <img
                      src={product.images?.[0] || 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg mr-3"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600">${product.price}</p>
                    </div>
                    <Plus className="h-5 w-5 text-primary-600" />
                  </div>
                ))}
                {filteredProducts.length === 0 && searchTerm && (
                  <p className="text-gray-500 text-center py-4">No products found</p>
                )}
              </div>
            )}
          </div>
        )}

        {selectedProducts.length === 0 ? (
          <div className="text-center py-8">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products selected</h3>
            <p className="text-gray-600">Add products to start comparing</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedProducts.map(product => (
              <div key={product._id} className="relative border rounded-lg p-4">
                <button
                  onClick={() => removeProduct(product._id)}
                  className="absolute top-2 right-2 p-1 text-red-600 hover:bg-red-50 rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
                
                <img
                  src={product.images?.[0] || 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-lg font-bold text-primary-600">${product.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comparison Table */}
      {selectedProducts.length > 1 && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Detailed Comparison</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feature
                  </th>
                  {selectedProducts.map(product => (
                    <th key={product._id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {product.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Basic Info */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Price
                  </td>
                  {selectedProducts.map(product => (
                    <td key={product._id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="text-lg font-bold text-green-600">${product.price}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
                
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Rating
                  </td>
                  {selectedProducts.map(product => (
                    <td key={product._id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>{product.rating || 0}</span>
                        <span className="text-gray-500 ml-1">({product.totalRatings || 0})</span>
                      </div>
                    </td>
                  ))}
                </tr>
                
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Stock
                  </td>
                  {selectedProducts.map(product => (
                    <td key={product._id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stock > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 0 ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            {product.stock} in stock
                          </>
                        ) : (
                          <>
                            <Minus className="h-3 w-3 mr-1" />
                            Out of stock
                          </>
                        )}
                      </span>
                    </td>
                  ))}
                </tr>
                
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Shop
                  </td>
                  {selectedProducts.map(product => (
                    <td key={product._id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.shop?.name || 'Unknown Shop'}
                    </td>
                  ))}
                </tr>

                {/* Features and Specifications */}
                {getComparisonFeatures().map((feature, index) => (
                  <tr key={feature} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {feature}
                    </td>
                    {selectedProducts.map(product => (
                      <td key={product._id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getFeatureValue(product, feature)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductComparison