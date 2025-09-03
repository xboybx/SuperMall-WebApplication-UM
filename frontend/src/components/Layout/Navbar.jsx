import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Menu, 
  X, 
  ShoppingBag, 
  User, 
  LogOut,
  Store,
  Tag,
  BarChart3,
  Package,
  Image,
  Search,
  Heart,
  ShoppingCart,
  Bell
} from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setUserMenuOpen(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shops?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                SuperMall
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, shops, brands and more..."
                className="search-bar pr-12"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-primary-500"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/shops" className="flex items-center space-x-1 text-neutral-600 hover:text-primary-500 transition-colors font-medium">
              <Store className="h-4 w-4" />
              <span>Shops</span>
            </Link>
            <Link to="/offers" className="flex items-center space-x-1 text-neutral-600 hover:text-primary-500 transition-colors font-medium">
              <Tag className="h-4 w-4" />
              <span>Offers</span>
            </Link>
            <Link to="/compare" className="flex items-center space-x-1 text-neutral-600 hover:text-primary-500 transition-colors font-medium">
              <Package className="h-4 w-4" />
              <span>Compare</span>
            </Link>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-neutral-600 hover:text-primary-500 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-2 text-neutral-600 hover:text-primary-500 transition-colors relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  0
                </span>
              </button>
              {user && (
                <button className="p-2 text-neutral-600 hover:text-primary-500 transition-colors">
                  <Bell className="h-5 w-5" />
                </button>
              )}
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 bg-primary-50 hover:bg-primary-100 px-3 py-2 rounded-lg transition-colors"
                >
                  <div className="bg-primary-500 text-white rounded-full p-1">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-neutral-700 font-medium">{user.name}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50">
                    {user.role === 'admin' && (
                      <>
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-3 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                        <Link
                          to="/admin/shops"
                          className="flex items-center px-4 py-3 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Store className="h-4 w-4 mr-2" />
                          Manage Shops
                        </Link>
                        <Link
                          to="/admin/categories"
                          className="flex items-center px-4 py-3 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Tag className="h-4 w-4 mr-2" />
                          Manage Categories
                        </Link>
                        <Link
                          to="/admin/products"
                          className="flex items-center px-4 py-3 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Package className="h-4 w-4 mr-2" />
                          Manage Products
                        </Link>
                        <Link
                          to="/admin/offers"
                          className="flex items-center px-4 py-3 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Tag className="h-4 w-4 mr-2" />
                          Manage Offers
                        </Link>
                        <Link
                          to="/admin/banners"
                          className="flex items-center px-4 py-3 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Image className="h-4 w-4 mr-2" />
                          Manage Banners
                        </Link>
                        <hr className="my-2 border-neutral-200" />
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm text-error-600 hover:bg-error-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-neutral-600 hover:text-primary-500 transition-colors font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-neutral-600 hover:text-primary-500 p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-4 pb-6 space-y-3 bg-white border-t border-neutral-200">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, shops..."
                className="search-bar pr-12"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>

            <Link
              to="/shops"
              className="flex items-center space-x-3 px-3 py-3 text-neutral-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Store className="h-5 w-5" />
              <span className="font-medium">Shops</span>
              Shops
            </Link>
            <Link
              to="/offers"
              className="flex items-center space-x-3 px-3 py-3 text-neutral-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Tag className="h-5 w-5" />
              <span className="font-medium">Offers</span>
              Offers
            </Link>
            <Link
              to="/compare"
              className="flex items-center space-x-3 px-3 py-3 text-neutral-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Package className="h-5 w-5" />
              <span className="font-medium">Compare</span>
              Compare
            </Link>
            
            {user ? (
              <>
                {user.role === 'admin' && (
                  <>
                    <Link
                      to="/admin"
                      className="flex items-center space-x-3 px-3 py-3 text-neutral-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <BarChart3 className="h-5 w-5" />
                      <span className="font-medium">Admin Dashboard</span>
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/admin/shops"
                      className="flex items-center space-x-3 px-3 py-3 text-neutral-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Store className="h-5 w-5" />
                      <span className="font-medium">Manage Shops</span>
                      Manage Shops
                    </Link>
                    <Link
                      to="/admin/products"
                      className="flex items-center space-x-3 px-3 py-3 text-neutral-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Package className="h-5 w-5" />
                      <span className="font-medium">Manage Products</span>
                      Manage Products
                    </Link>
                    <Link
                      to="/admin/banners"
                      className="flex items-center space-x-3 px-3 py-3 text-neutral-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Image className="h-5 w-5" />
                      <span className="font-medium">Manage Banners</span>
                      Manage Banners
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-3 py-3 text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-3 px-3 py-3 text-neutral-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">Login</span>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-3 px-3 py-3 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Register</span>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar