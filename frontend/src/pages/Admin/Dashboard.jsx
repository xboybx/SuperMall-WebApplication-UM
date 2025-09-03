import { useState, useEffect } from 'react'
import { shopAPI, categoryAPI, offerAPI, productAPI, bannerAPI } from '../../services/api'
import { Store, Tag, Package, Users, TrendingUp, DollarSign, Image } from 'lucide-react'
import LoadingSpinner from '../../components/UI/LoadingSpinner'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalShops: 0,
    totalCategories: 0,
    totalOffers: 0,
    totalProducts: 0,
    totalBanners: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [shopsRes, categoriesRes, offersRes, productsRes, bannersRes] = await Promise.all([
        shopAPI.getAll(),
        categoryAPI.getAll(),
        offerAPI.getAll(),
        productAPI.getAll(),
        bannerAPI.getAllAdmin()
      ])

      setStats({
        totalShops: shopsRes.data.shops?.length || shopsRes.data.length || 0,
        totalCategories: categoriesRes.data.categories?.length || categoriesRes.data.length || 0,
        totalOffers: offersRes.data.offers?.length || offersRes.data.length || 0,
        totalProducts: productsRes.data.products?.length || productsRes.data.length || 0,
        totalBanners: bannersRes.data.banners?.length || bannersRes.data.length || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Shops',
      value: stats.totalShops,
      icon: Store,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: Tag,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Active Offers',
      value: stats.totalOffers,
      icon: DollarSign,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Banners',
      value: stats.totalBanners,
      icon: Image,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    }
  ]

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your SuperMall platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/shops"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Store className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Manage Shops</h3>
              <p className="text-sm text-gray-600">Add, edit, or remove shops</p>
            </div>
          </a>
          
          <a
            href="/admin/categories"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Tag className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Manage Categories</h3>
              <p className="text-sm text-gray-600">Organize shop categories</p>
            </div>
          </a>
          
          <a
            href="/admin/offers"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <DollarSign className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Manage Offers</h3>
              <p className="text-sm text-gray-600">Create and manage offers</p>
            </div>
          </a>
          
          <a
            href="/admin/banners"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Image className="h-8 w-8 text-pink-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Manage Banners</h3>
              <p className="text-sm text-gray-600">Create advertising banners</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Dashboard