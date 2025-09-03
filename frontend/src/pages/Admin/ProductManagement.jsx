import { useState, useEffect } from 'react'
import { productAPI, shopAPI, categoryAPI } from '../../services/api'
import { Plus, Edit, Trash2, Package, Star, DollarSign } from 'lucide-react'
import LoadingSpinner from '../../components/UI/LoadingSpinner'

const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [shops, setShops] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    originalPrice: '',
    shop: '',
    category: '',
    images: [''],
    stock: 0,
    tags: '',
    features: [{ name: '', value: '' }]
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, shopsRes, categoriesRes] = await Promise.all([
        productAPI.getAll(),
        shopAPI.getAll(),
        categoryAPI.getAll()
      ])
      setProducts(productsRes.data.products || productsRes.data || [])
      setShops(shopsRes.data.shops || shopsRes.data || [])
      setCategories(categoriesRes.data.categories || categoriesRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const productData = {
        ...formData,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        features: formData.features.filter(f => f.name && f.value),
        images: formData.images.filter(img => img.trim())
      }
      
      if (editingProduct) {
        await productAPI.update(editingProduct._id, productData)
      } else {
        await productAPI.create(productData)
      }
      fetchData()
      resetForm()
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      originalPrice: product.originalPrice || '',
      shop: product.shop._id || product.shop,
      category: product.category._id || product.category,
      images: product.images.length > 0 ? product.images : [''],
      stock: product.stock || 0,
      tags: product.tags ? product.tags.join(', ') : '',
      features: product.features && product.features.length > 0 
        ? product.features 
        : [{ name: '', value: '' }]
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id)
        fetchData()
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      originalPrice: '',
      shop: '',
      category: '',
      images: [''],
      stock: 0,
      tags: '',
      features: [{ name: '', value: '' }]
    })
    setEditingProduct(null)
    setShowModal(false)
  }

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { name: '', value: '' }]
    })
  }

  const updateFeature = (index, field, value) => {
    const newFeatures = [...formData.features]
    newFeatures[index][field] = value
    setFormData({ ...formData, features: newFeatures })
  }

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index)
    setFormData({ ...formData, features: newFeatures })
  }

  const addImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, '']
    })
  }

  const updateImage = (index, value) => {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData({ ...formData, images: newImages })
  }

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData({ ...formData, images: newImages })
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-2">Manage all products in the mall</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product._id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <img
                src={product.images?.[0] || 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800'}
                alt={product.name}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <div className="flex items-center text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{product.rating || 0}</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-2">
                {product.description || 'No description available'}
              </p>
              
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-lg font-bold text-green-600">${product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                )}
              </div>
              
              <div className="text-sm text-gray-500">
                <div>Stock: {product.stock || 0}</div>
                <div>Shop: {product.shop?.name || 'Unknown'}</div>
                <div>Category: {product.category?.name || 'Unknown'}</div>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.isActive 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
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

      {products.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first product</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            Add Product
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    className="input"
                  />
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
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price (Optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                    className="input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                    className="input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="input"
                    placeholder="electronics, gadgets"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="input"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images
                </label>
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => updateImage(index, e.target.value)}
                      className="input flex-1"
                      placeholder="Enter image URL"
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImage}
                  className="btn btn-outline text-sm"
                >
                  Add Image
                </button>
              </div>
              
              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Features
                </label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2 mb-2">
                    <input
                      type="text"
                      value={feature.name}
                      onChange={(e) => updateFeature(index, 'name', e.target.value)}
                      className="input"
                      placeholder="Feature name"
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={feature.value}
                        onChange={(e) => updateFeature(index, 'value', e.target.value)}
                        className="input flex-1"
                        placeholder="Feature value"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="btn btn-outline text-sm"
                >
                  Add Feature
                </button>
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
                  {editingProduct ? 'Update' : 'Create'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductManagement