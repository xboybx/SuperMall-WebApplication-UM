import { useState, useEffect } from 'react'
import { offerAPI, shopAPI, productAPI } from '../../services/api'
import { Plus, Edit, Trash2, Tag, Calendar, DollarSign } from 'lucide-react'
import LoadingSpinner from '../../components/UI/LoadingSpinner'

const OfferManagement = () => {
  const [offers, setOffers] = useState([])
  const [shops, setShops] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingOffer, setEditingOffer] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shop: '',
    product: '',
    discountType: 'percentage',
    discountValue: 0,
    originalPrice: 0,
    startDate: '',
    endDate: '',
    maxUsage: '',
    terms: '',
    image: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [offersRes, shopsRes, productsRes] = await Promise.all([
        offerAPI.getAll(),
        shopAPI.getAll(),
        productAPI.getAll()
      ])
      setOffers(offersRes.data.offers || offersRes.data || [])
      setShops(shopsRes.data.shops || shopsRes.data || [])
      setProducts(productsRes.data.products || productsRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const offerData = {
        ...formData,
        maxUsage: formData.maxUsage ? parseInt(formData.maxUsage) : null
      }
      
      if (editingOffer) {
        await offerAPI.update(editingOffer._id, offerData)
      } else {
        await offerAPI.create(offerData)
      }
      fetchData()
      resetForm()
    } catch (error) {
      console.error('Error saving offer:', error)
    }
  }

  const handleEdit = (offer) => {
    setEditingOffer(offer)
    setFormData({
      title: offer.title,
      description: offer.description || '',
      shop: offer.shop._id || offer.shop,
      product: offer.product._id || offer.product,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      originalPrice: offer.originalPrice,
      startDate: new Date(offer.startDate).toISOString().split('T')[0],
      endDate: new Date(offer.endDate).toISOString().split('T')[0],
      maxUsage: offer.maxUsage || '',
      terms: offer.terms || '',
      image: offer.image || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await offerAPI.delete(id)
        fetchData()
      } catch (error) {
        console.error('Error deleting offer:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      shop: '',
      product: '',
      discountType: 'percentage',
      discountValue: 0,
      originalPrice: 0,
      startDate: '',
      endDate: '',
      maxUsage: '',
      terms: '',
      image: ''
    })
    setEditingOffer(null)
    setShowModal(false)
  }

  const calculateOfferPrice = (originalPrice, discountType, discountValue) => {
    if (discountType === 'percentage') {
      return originalPrice - (originalPrice * discountValue / 100)
    } else {
      return Math.max(0, originalPrice - discountValue)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Offer Management</h1>
          <p className="text-gray-600 mt-2">Create and manage special offers</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Offer
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map(offer => (
          <div key={offer._id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <img
                src={offer.image || 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=800'}
                alt={offer.title}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  offer.isActive 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {offer.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-2">
                {offer.description || 'No description available'}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-500 text-sm">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span className="line-through">${offer.originalPrice}</span>
                  <span className="ml-2 font-semibold text-green-600">
                    ${offer.offerPrice}
                  </span>
                  <span className="ml-2 bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                    {offer.discountType === 'percentage' 
                      ? `${offer.discountValue}% OFF` 
                      : `$${offer.discountValue} OFF`
                    }
                  </span>
                </div>
                
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                  {offer.shop?.name || 'Unknown Shop'}
                </span>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(offer)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(offer._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {offers.length === 0 && (
        <div className="text-center py-12">
          <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No offers yet</h3>
          <p className="text-gray-600 mb-4">Create your first offer to attract customers</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            Add Offer
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingOffer ? 'Edit Offer' : 'Add New Offer'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Offer Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shop
                  </label>
                  <select
                    required
                    value={formData.shop}
                    onChange={(e) => setFormData({...formData, shop: e.target.value})}
                    className="input"
                  >
                    <option value="">Select Shop</option>
                    {shops.map(shop => (
                      <option key={shop._id} value={shop._id}>
                        {shop.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>
                <select
                  required
                  value={formData.product}
                  onChange={(e) => setFormData({...formData, product: e.target.value})}
                  className="input"
                >
                  <option value="">Select Product</option>
                  {products.map(product => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="input"
                  rows="3"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                    className="input"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({...formData, discountValue: parseFloat(e.target.value)})}
                    className="input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: parseFloat(e.target.value)})}
                    className="input"
                  />
                </div>
              </div>
              
              {formData.originalPrice > 0 && formData.discountValue > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm text-gray-600">Offer Price: </span>
                  <span className="font-semibold text-green-600">
                    ${calculateOfferPrice(formData.originalPrice, formData.discountType, formData.discountValue).toFixed(2)}
                  </span>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="input"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Usage (Optional)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxUsage}
                  onChange={(e) => setFormData({...formData, maxUsage: e.target.value})}
                  className="input"
                  placeholder="Leave empty for unlimited"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Terms & Conditions
                </label>
                <textarea
                  value={formData.terms}
                  onChange={(e) => setFormData({...formData, terms: e.target.value})}
                  className="input"
                  rows="2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="input"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingOffer ? 'Update' : 'Create'} Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default OfferManagement