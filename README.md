# SuperMall - Global Commerce Platform

SuperMall is a comprehensive e-commerce platform that connects rural merchants with global customers, providing tools for shop management, product listings, and promotional offers.

[*Preview the Project*](https://supermall-webapplication-um.onrender.com)
## Features

### For Customers
- **Shop Discovery**: Browse shops by category, floor, and location
- **Product Search**: Advanced filtering and search capabilities
- **Product Comparison**: Compare up to 4 products side by side
- **Special Offers**: View and claim promotional offers
- **Responsive Design**: Optimized for all devices

### For Merchants/Admins
- **Shop Management**: Create and manage shop profiles
- **Product Management**: Add, edit, and organize products
- **Category Management**: Organize shops and products by categories
- **Offer Management**: Create time-limited promotional offers
- **Analytics Dashboard**: Track performance and statistics

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Lucide React** for icons

## Project Structure

```
supermall/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   └── server.js        # Express server setup
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   └── services/    # API services
│   └── public/          # Static assets
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd supermall
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/supermall
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
   NODE_ENV=development
   ```

   Create `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=SuperMall
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on http://localhost:5000

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/auth/profile` - Get user profile

### Shops
- `GET /api/shops` - Get all shops
- `POST /api/shops` - Create new shop (Admin)
- `PUT /api/shops/:id` - Update shop (Admin/Owner)
- `DELETE /api/shops/:id` - Delete shop (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin/Owner)
- `DELETE /api/products/:id` - Delete product (Admin/Owner)
- `POST /api/products/compare` - Compare products

### Offers
- `GET /api/offers` - Get all offers
- `POST /api/offers` - Create offer (Admin)
- `PUT /api/offers/:id` - Update offer (Admin)
- `DELETE /api/offers/:id` - Delete offer (Admin)

## User Roles

### Customer (user)
- Browse shops and products
- View offers
- Compare products
- Basic account management

### Merchant/Admin (admin)
- All customer features
- Manage shops, products, categories, and offers
- Access to admin dashboard
- View analytics and statistics

## Key Features Implemented

1. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control
   - Protected routes

2. **Shop Management**
   - CRUD operations for shops
   - Category-based organization
   - Floor-based location system

3. **Product Management**
   - Comprehensive product information
   - Image galleries
   - Feature specifications
   - Stock management

4. **Offer System**
   - Time-limited offers
   - Percentage and fixed discounts
   - Usage tracking
   - Terms and conditions

5. **Search & Filtering**
   - Text-based search
   - Category filtering
   - Price range filtering
   - Floor-based filtering

6. **Product Comparison**
   - Side-by-side comparison
   - Feature comparison
   - Price comparison

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.