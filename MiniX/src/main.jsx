// src/main.jsx - Deployment Fix Attempt 2
import React from "react";
// Removed GoogleOAuthProvider import
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import { AnimatePresence } from "framer-motion";
import Orders from "./pages/Orders.jsx";
import Payments from "./pages/Payments.jsx";

import OrderDetails from "./pages/OrderDetails";

import ProfilePage from "./pages/ProfilePage";
import App from "./App.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import Shop from "./pages/Shop.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import NotFound from "./pages/NotFound.jsx";


// Duplicate removed

import Addresses from "./pages/Addresses";   // ✅ ADDED
import Payment from "./pages/Payment"; // ✅ ADDED
import EditProfile from "./pages/EditProfile";

// Admin Imports
import AdminRoute from "./Components/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";

import "./index.css";

import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";

import PageTransition from "./Components/PageTransition.jsx";
import GlobalToast from "./Components/GlobalToast.jsx";
import CartDrawer from "./Components/CartDrawer.jsx";
import Chatbot from "./Components/Chatbot/Chatbot.jsx";
import { Analytics } from "@vercel/analytics/react";

// -------- Protected Route Wrapper --------
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? children : <Navigate to="/auth" replace />;
}

// -------- Prevent visiting /auth when logged in --------
function BlockAuthWhenLoggedIn({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;

  return user ? <Navigate to="/" replace /> : children;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        <Route path="/" element={<PageTransition><App /></PageTransition>} />

        <Route path="/shop" element={<PageTransition><Shop /></PageTransition>} />

        <Route
          path="/product/:id"
          element={<PageTransition><ProductPage /></PageTransition>}
        />

        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />

        <Route path="/about" element={<PageTransition><About /></PageTransition>} />

        <Route
          path="/profile"
          element={<PageTransition><ProfilePage /></PageTransition>}
        />

        <Route path="/edit-profile" element={<EditProfile />} />

        {/* ⭐ NEW ADDRESS ROUTE (Protected) */}
        <Route
          path="/addresses"
          element={
            <ProtectedRoute>
              <PageTransition><Addresses /></PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <PageTransition><Payments /></PageTransition>
            </ProtectedRoute>
          }
        />


        {/* Protected Routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <PageTransition><Cart /></PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <PageTransition><Orders /></PageTransition>
            </ProtectedRoute>
          }
        />


        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <PageTransition><WishlistPage /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:orderId"
          element={
            <ProtectedRoute>
              <PageTransition><OrderDetails /></PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <PageTransition><Checkout /></PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-success"
          element={
            <ProtectedRoute>
              <PageTransition><OrderSuccess /></PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PageTransition><Payment /></PageTransition>
            </ProtectedRoute>
          }
        />

        {/* Block /auth if logged in */}
        <Route
          path="/auth"
          element={
            <BlockAuthWhenLoggedIn>
              <PageTransition><AuthPage /></PageTransition>
            </BlockAuthWhenLoggedIn>
          }
        />

        <Route path="/login" element={<BlockAuthWhenLoggedIn><PageTransition><AuthPage /></PageTransition></BlockAuthWhenLoggedIn>} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />


        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* 404 Catch-All */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />

      </Routes>
    </AnimatePresence>
  );
}

// -------------------------
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <GlobalToast />
              <CartDrawer />
              <Chatbot />
              <AnimatedRoutes />
              <Analytics />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
  </React.StrictMode>
);
