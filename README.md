# MiniX – Modern Fashion E-Commerce Platform 🛍️

A full-stack MERN e-commerce application with modern UI, admin dashboard, secure payments, and complete order management.

## ✨ Features

### 🎨 **Frontend (React + Vite + Tailwind)**
- Modern glassmorphism UI with smooth Framer Motion animations
- Fully responsive design for all devices
- Product browsing with search, filters, and pagination
- Shopping cart with variant selection (size, color)
- Wishlist functionality
- User authentication (Login/Register/Forgot Password)
- Order tracking and history
- Payment method and address management
- Stripe payment integration

### 🔐 **Authentication & Security**
- JWT-based authentication with HTTP-only cookies
- Password recovery via email
- Protected routes and role-based access
- Secure password hashing with bcrypt

### 👤 **User Features**
- Profile management
- Multiple shipping addresses
- Saved payment methods
- Order history and tracking
- Wishlist management

### 🛠️ **Admin Dashboard**
- Product management (CRUD operations)
- Order management with status updates
- Analytics and statistics
- Category management
- User overview

### 💳 **Payment & Checkout**
- Stripe payment integration
- Cash on Delivery (COD) option
- Secure payment intent handling
- Order confirmation emails

## 🚀 Deployment Guide

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- Stripe account (for payments)
- Email service credentials (for password recovery)

### Backend Deployment

#### 1. Environment Variables
Create a `.env` file in `/backend` with the following variables:

```bash
# MongoDB Configuration
MONGO_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key

# Email Configuration (for password recovery)
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password

# Deployment Configuration
FRONTEND_URL=https://your-frontend-url.com
PORT=5000
NODE_ENV=production
```

#### 2. Install Dependencies
```bash
cd backend
npm install
```

#### 3. Deploy to Hosting Platform

**Option A: Deploy to Render**
1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set the following:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
  - **Environment Variables**: Add all variables from `.env`

**Option B: Deploy to Railway**
1. Create a new project on [Railway](https://railway.app)
2. Connect your repository
3. Add environment variables
4. Deploy automatically

**Option C: Deploy to Heroku**
```bash
heroku create your-app-name
heroku config:set MONGO_URI=your_mongo_uri
# ... set other environment variables
git push heroku main
```

### Frontend Deployment

#### 1. Environment Variables
Create a `.env` file in `/MiniX` with:

```bash
# Stripe Publishable Key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# API Base URL (Your deployed backend URL)
VITE_API_BASE_URL=https://your-backend-api-url.com
```

#### 2. Install Dependencies
```bash
cd MiniX
npm install
```

#### 3. Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

Or use the [Vercel Dashboard](https://vercel.com):
1. Import your GitHub repository
2. Set environment variables in project settings
3. Deploy

**vercel.json** is already configured for SPA routing.

#### 4. Alternative: Deploy to Netlify
```bash
npm run build
# Upload 'dist' folder to Netlify
```

## 🏃 Local Development

### 1. Clone Repository
```bash
git clone https://github.com/Aman-pixels/MiniX.git
cd MiniX
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Setup Frontend
```bash
cd MiniX
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - API requests
- **React Router** - Navigation
- **Stripe** - Payment processing

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Stripe** - Payment processing

## 📁 Project Structure

```
MiniX/
├── MiniX/                    # Frontend
│   ├── src/
│   │   ├── Components/      # Reusable components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Page components
│   │   │   └── admin/      # Admin dashboard pages
│   │   ├── config.js       # API configuration
│   │   └── App.jsx
│   ├── .env.example
│   ├── vercel.json
│   └── package.json
│
├── backend/                  # Backend
│   ├── Controllers/         # Route controllers
│   ├── Middleware/          # Auth & error handling
│   ├── Models/             # Mongoose models
│   ├── Routes/             # API routes
│   ├── Config/             # Database config
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgotpassword` - Request password reset
- `PUT /api/auth/resetpassword/:token` - Reset password

### Products
- `GET /api/product/all` - Get all products
- `GET /api/product/:slug` - Get single product
- `POST /api/products/create` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders/admin/all` - Get all orders (Admin)
- `PUT /api/orders/admin/:id/status` - Update order status (Admin)

### Cart & Wishlist
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/update` - Update cart item
- `POST /api/cart/remove` - Remove from cart
- `DELETE /api/cart/clear` - Clear cart

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## ⭐ Support

If you find this project helpful, please give it a star on GitHub!

---

**Developed with ❤️ by [Aman](https://github.com/Aman-pixels)**
