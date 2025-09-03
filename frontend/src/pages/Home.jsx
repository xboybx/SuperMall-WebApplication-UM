import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Store,
  Tag,
  Users,
  TrendingUp,
  Globe,
  Star,
  ArrowRight,
  Zap,
  Shield,
  Truck,
} from "lucide-react";
import BannerCarousel from "../components/Home/BannerCarousel";

const Home = () => {
  const features = [
    {
      icon: Store,
      title: "Discover Amazing Shops",
      description:
        "Browse through thousands of unique shops from merchants worldwide.",
      color: "from-primary-500 to-primary-600",
    },
    {
      icon: Tag,
      title: "Exclusive Deals",
      description:
        "Get access to limited-time offers and incredible discounts.",
      color: "from-secondary-500 to-secondary-600",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Quick search and instant product comparisons for better decisions.",
      color: "from-warning-500 to-warning-600",
    },
    {
      icon: Shield,
      title: "Secure Shopping",
      description:
        "Shop with confidence with our secure payment and data protection.",
      color: "from-success-500 to-success-600",
    },
  ];

  const categories = [
    { name: "Electronics", icon: "📱", count: "2.5k+ products" },
    { name: "Fashion", icon: "👗", count: "5k+ products" },
    { name: "Home & Garden", icon: "🏠", count: "1.8k+ products" },
    { name: "Sports", icon: "⚽", count: "900+ products" },
    { name: "Books", icon: "📚", count: "1.2k+ products" },
    { name: "Beauty", icon: "💄", count: "800+ products" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative z-10">
            <div className="flex justify-center mb-6">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4">
                <ShoppingBag className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Welcome to <span className="text-yellow-300">SuperMall</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white opacity-90 max-w-4xl mx-auto leading-relaxed">
              Your ultimate destination for global shopping. Discover unique
              products from merchants worldwide with unbeatable deals and
              lightning-fast delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/shops"
                className="bg-white text-primary-600 hover:bg-neutral-100 px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
              >
                <Store className="h-5 w-5" />
                <span>Start Shopping</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/offers"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center space-x-2"
              >
                <Tag className="h-5 w-5" />
                <span>Hot Deals</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex justify-center items-center space-x-8 mt-12 text-white opacity-80">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5" />
                <span className="text-sm font-medium">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-medium">Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 fill-current" />
                <span className="text-sm font-medium">4.8/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Carousel Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Featured Promotions
            </h2>
            <p className="text-xl text-neutral-600">
              Discover amazing deals from our partner merchants
            </p>
          </div>
          <BannerCarousel />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-neutral-600">
              Find exactly what you're looking for
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/shops?category=${category.name}`}
                className="category-card p-6 text-center group cursor-pointer"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-neutral-500">{category.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Why Choose SuperMall?
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Experience the future of online shopping with our cutting-edge
              features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div
                  className={`bg-gradient-to-r ${feature.color} w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                10K+
              </div>
              <div className="text-xl text-neutral-600 font-medium">
                Happy Customers
              </div>
            </div>
            <div className="group">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-secondary-500 to-accent-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                500+
              </div>
              <div className="text-xl text-neutral-600 font-medium">
                Active Shops
              </div>
            </div>
            <div className="group">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-accent-500 to-warning-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                25K+
              </div>
              <div className="text-xl text-neutral-600 font-medium">
                Products Listed
              </div>
            </div>
            <div className="group">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-warning-500 to-success-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                50+
              </div>
              <div className="text-xl text-neutral-600 font-medium">
                Countries Reached
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative z-10">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-6 w-24 h-24 mx-auto mb-8 flex items-center justify-center">
              <Globe className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Shopping?
            </h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join millions of satisfied customers and discover amazing products
              from merchants around the world. Your perfect purchase is just a
              click away!
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/register"
                className="bg-white text-primary-600 hover:bg-neutral-100 px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
              >
                <Users className="h-5 w-5" />
                <span>Join Now - It's Free!</span>
              </Link>
              <Link
                to="/shops"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center space-x-2"
              >
                <Store className="h-5 w-5" />
                <span>Browse Shops</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Stay Updated with Latest Deals
          </h3>
          <p className="text-neutral-300 mb-8">
            Subscribe to our newsletter and never miss out on exclusive offers
            and new arrivals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button className="bg-primary-500 hover:bg-primary-600 px-6 py-3 rounded-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
