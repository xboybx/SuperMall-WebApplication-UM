import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { bannerAPI } from '../../services/api'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'

const BannerCarousel = () => {
  const [banners, setBanners] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBanners()
  }, [])

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        )
      }, 5000) // Auto-slide every 5 seconds

      return () => clearInterval(interval)
    }
  }, [banners.length])

  const fetchBanners = async () => {
    try {
      const response = await bannerAPI.getAll()
      setBanners(response.data.banners || [])
    } catch (error) {
      console.error('Error fetching banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBannerClick = async (banner) => {
    try {
      await bannerAPI.trackClick(banner._id)
    } catch (error) {
      console.error('Error tracking banner click:', error)
    }
  }

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? banners.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === banners.length - 1 ? 0 : currentIndex + 1)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  if (loading || banners.length === 0) {
    return (
      <div className="relative w-full h-64 md:h-80 bg-gray-200 rounded-lg overflow-hidden mb-8">
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">
            {loading ? 'Loading banners...' : 'No banners available'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-8 shadow-lg">
      {/* Banner Images */}
      <div className="relative h-full">
        {banners.map((banner, index) => (
          <div
            key={banner._id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {banner.linkUrl ? (
              <a
                href={banner.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleBannerClick(banner)}
                className="block w-full h-full relative group"
              >
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=1200&h=300'
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{banner.title}</h3>
                  {banner.description && (
                    <p className="text-sm md:text-base opacity-90 line-clamp-2">
                      {banner.description}
                    </p>
                  )}
                  <div className="flex items-center mt-2 text-sm">
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full mr-2">
                      {banner.shop?.name}
                    </span>
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </div>
              </a>
            ) : (
              <Link
                to={`/shop/${banner.shop?._id}`}
                onClick={() => handleBannerClick(banner)}
                className="block w-full h-full relative group"
              >
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=1200&h=300'
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{banner.title}</h3>
                  {banner.description && (
                    <p className="text-sm md:text-base opacity-90 line-clamp-2">
                      {banner.description}
                    </p>
                  )}
                  <div className="flex items-center mt-2 text-sm">
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full">
                      Visit {banner.shop?.name}
                    </span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default BannerCarousel