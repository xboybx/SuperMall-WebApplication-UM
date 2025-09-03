import { useState, useEffect } from 'react'
import { bannerAPI, shopAPI } from '../../services/api'
import { Plus, Edit, Trash2, Image, Eye, MousePointer, Calendar, Star } from 'lucide-react'
import LoadingSpinner from '../../components/UI/LoadingSpinner'

const BannerManagement = () => {
  const [banners, setBanners] = useState([])
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    shop: '',
    priority: 5,
    endDate: '',
    isActive: true
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [bannersRes, shopsRes] = await Promise.all([
        bannerAPI.getAllAdmin(),
        shopAPI.getAll()
      ])
      setBanners(bannersRes.data.banners || bannersRes.data || [])
      setShops(shopsRes.data.shops || shopsRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingBanner) {
        await bannerAPI.update(editingBanner._id, formData)
      } else {
        await bannerAPI.create(formData)
      }
      fetchData()
      resetForm()
    } catch (error) {
      console.error('Error saving banner:', error)
    }
  }

  const handleEdit = (banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      description: banner.description || '',
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || '',
      shop: banner.shop._id || banner.shop,
      priority: banner.priority,
      endDate: new Date(banner.endDate).toISOString().split('T')[0],
      isActive: banner.isActive
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await bannerAPI.delete(id)
        fetchData()
      } catch (error) {
        console.error('Error deleting banner:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      shop: '',
      priority: 5,
      endDate: '',
      isActive: true
    })
    setEditingBanner(null)
    setShowModal(false)
  }

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date()
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Banner Management</h1>
          <p className="text-gray-600 mt-2">Create and manage advertising banners for the home page</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Banner
        </button>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {banners.map(banner => {
          const expired = isExpired(banner.endDate)
          const daysRemaining = getDaysRemaining(banner.endDate)
          
          return (
            <div key={banner._id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="aspect-w-16 aspect-h-6 mb-4 relative">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=800'
                  }}
                />
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    banner.isActive && !expired
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {banner.isActive && !expired ? 'Active' : expired ? 'Expired' : 'Inactive'}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    Priority: {banner.priority}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{banner.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {banner.description || 'No description provided'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      Expires: {new Date(banner.endDate).toLocaleDateString()}
                      {!expired && daysRemaining <= 7 && (
                        <span className="ml-2 text-orange-600 font-medium">
                          ({daysRemaining} days left)
                        </span>
                      )}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{banner.impressionCount || 0} views</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <MousePointer className="h-4 w-4 mr-1" />
                      <span>{banner.clickCount || 0} clicks</span>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-gray-500">CTR: </span>
                    <span className="font-medium">
                      {banner.impressionCount > 0 
                        ? ((banner.clickCount / banner.impressionCount) * 100).toFixed(2)
                        : 0
                      }%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <div className="flex flex-col">
                    <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                      {banner.shop?.name || 'Unknown Shop'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      Created: {new Date(banner.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {banners.length === 0 && (
        <div className="text-center py-12">
          <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No banners yet</h3>
          <p className="text-gray-600 mb-4">Create your first advertising banner to promote shops</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            Add Banner
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingBanner ? 'Edit Banner' : 'Add New Banner'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banner Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="input"
                    placeholder="Enter banner title"
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
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="input"
                  rows="3"
                  placeholder="Enter banner description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  className="input"
                  placeholder="https://example.com/banner-image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended size: 1200x300px for best results
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({...formData, linkUrl: e.target.value})}
                  className="input"
                  placeholder="https://example.com/landing-page"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority (0-10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                    className="input"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Higher priority banners appear first
                  </p>
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
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active (banner will be visible to users)
                </label>
              </div>
              
              {formData.imageUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <img
                    src={formData.imageUrl}
                    alt="Banner preview"
                    className="w-full h-24 object-cover rounded-lg border"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingBanner ? 'Update' : 'Create'} Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BannerManagement