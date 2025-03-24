import React from "react";
import "./App.css";
import "./styles/theme.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./components/navbar";
import Carousel from "./components/carousel";
import ShopCategories from "./components/shopCategories";
import Section from "./components/section";
import Footer from "./components/footer";
import ProductOverview from "./components/productOverview";
import CartPage from "./components/cart-page";
import AccountPage from "./components/account-page";
import AboutUs from "./components/aboutUs"; // Import AboutUs page
import ContactUs from "./components/contactUs"; // Import ContactUs page
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./components/auth/login";
import SignUp from "./components/auth/signup";
import ForgetPassword from "./components/auth/forgetPassword";
import { AuthProvider } from "./components/auth/AuthContext";
import { CartProvider } from "../src/components/context/CartContext";
import CheckoutPage from "./components/checkout-page";
import MyOrders from "./components/my-orders";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <motion.div
              className="min-h-screen flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Navbar />
              </motion.div>
              <main className="flex-grow">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                      >
                        <Carousel />
                        <Section />
                      </motion.div>
                    }
                  />
                  <Route path="/shop" element={<ShopCategories />} />
                  <Route path="/product/:id" element={<ProductOverview />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/forget-password" element={<ForgetPassword />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<ContactUs />} />
                </Routes>
              </main>
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Footer />
              </motion.div>
            </motion.div>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
