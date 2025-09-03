const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className={`animate-spin rounded-full border-4 border-gray-300 border-t-primary-600 ${sizeClasses[size]}`}></div>
    </div>
  )
}

export default LoadingSpinner