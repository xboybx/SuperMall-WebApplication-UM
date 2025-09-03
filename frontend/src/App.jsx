import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Navbar from './components/Layout/Navbar'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Home from './pages/Home'
import AdminDashboard from './pages/Admin/Dashboard'
import ShopManagement from './pages/Admin/ShopManagement'
import CategoryManagement from './pages/Admin/CategoryManagement'
import OfferManagement from './pages/Admin/OfferManagement'
import ProductManagement from './pages/Admin/ProductManagement'
import BannerManagement from './pages/Admin/BannerManagement'
import UserShops from './pages/User/Shops'
import UserOffers from './pages/User/Offers'
import ShopDetails from './pages/User/ShopDetails'
import ProductComparison from './pages/User/ProductComparison'
import LoadingSpinner from './components/UI/LoadingSpinner'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        
        {/* User Routes */}
        <Route path="/shops" element={<UserShops />} />
        <Route path="/offers" element={<UserOffers />} />
        <Route path="/shop/:id" element={<ShopDetails />} />
        <Route path="/compare" element={<ProductComparison />} />
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
        />
        <Route 
          path="/admin/shops" 
          element={user?.role === 'admin' ? <ShopManagement /> : <Navigate to="/" />} 
        />
        <Route 
          path="/admin/categories" 
          element={user?.role === 'admin' ? <CategoryManagement /> : <Navigate to="/" />} 
        />
        <Route 
          path="/admin/offers" 
          element={user?.role === 'admin' ? <OfferManagement /> : <Navigate to="/" />} 
        />
        <Route 
          path="/admin/products" 
          element={user?.role === 'admin' ? <ProductManagement /> : <Navigate to="/" />} 
        />
        <Route 
          path="/admin/banners" 
          element={user?.role === 'admin' ? <BannerManagement /> : <Navigate to="/" />} 
        />
      </Routes>
    </div>
  )
}

export default App