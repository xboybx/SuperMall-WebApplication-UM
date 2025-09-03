import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Shop APIs
export const shopAPI = {
  getAll: (params = {}) => api.get('/shops', { params }),
  getById: (id) => api.get(`/shops/${id}`),
  create: (data) => api.post('/shops', data),
  update: (id, data) => api.put(`/shops/${id}`, data),
  delete: (id) => api.delete(`/shops/${id}`),
  getByCategory: (categoryId) => api.get(`/shops/category/${categoryId}`),
  getByFloor: (floor) => api.get(`/shops/floor/${floor}`),
}

// Category APIs
export const categoryAPI = {
  getAll: (params = {}) => api.get('/categories', { params }),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
}

// Offer APIs
export const offerAPI = {
  getAll: (params = {}) => api.get('/offers', { params }),
  getById: (id) => api.get(`/offers/${id}`),
  create: (data) => api.post('/offers', data),
  update: (id, data) => api.put(`/offers/${id}`, data),
  delete: (id) => api.delete(`/offers/${id}`),
  getByShop: (shopId) => api.get(`/offers/shop/${shopId}`),
}

// Product APIs
export const productAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getByShop: (shopId) => api.get(`/products/shop/${shopId}`),
  getByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
  compare: (productIds) => api.post('/products/compare', { productIds }),
}

// Banner APIs
export const bannerAPI = {
  getAll: () => api.get('/banners'),
  getAllAdmin: (params = {}) => api.get('/banners/admin', { params }),
  getById: (id) => api.get(`/banners/${id}`),
  create: (data) => api.post('/banners', data),
  update: (id, data) => api.put(`/banners/${id}`, data),
  delete: (id) => api.delete(`/banners/${id}`),
  trackClick: (id) => api.post(`/banners/${id}/click`),
}

export default api