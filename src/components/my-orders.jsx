"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../components/auth/AuthContext";

export default function MyOrders() {
  const { theme } = useTheme();
  const { isLoggedIn } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn) {
      return;
    }

    // Load orders from localStorage
    const loadOrders = () => {
      setIsLoading(true);
      try {
        const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        // Sort orders by date (newest first)
        savedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(savedOrders);
      } catch (error) {
        console.error("Error loading orders:", error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [isLoggedIn]);

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === "all") return true;
    return order.status.toLowerCase() === activeTab.toLowerCase();
  });

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-bg-primary py-8 md:py-16 antialiased">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-6">My Orders</h1>
            <p className="text-secondary mb-8">Please log in to view your orders.</p>
            <Link
              to="/login"
              className={`px-6 py-3 rounded-md font-medium shadow-sm transition-all duration-300 ${
                theme === "dark"
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-black text-white hover:bg-black/90"
              }`}
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary py-8 md:py-16 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">My Orders</h1>
          <p className="text-secondary mt-2">
            View and track all your orders in one place.
          </p>
        </div>

        {/* Order Tabs */}
        <div className="mb-8 border-b border-primary/10">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-4 px-1 font-medium transition-all duration-300 ${
                activeTab === "all"
                  ? "text-primary border-b-2 border-primary"
                  : "text-secondary hover:text-primary"
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setActiveTab("processing")}
              className={`pb-4 px-1 font-medium transition-all duration-300 ${
                activeTab === "processing"
                  ? "text-primary border-b-2 border-primary"
                  : "text-secondary hover:text-primary"
              }`}
            >
              Processing
            </button>
            <button
              onClick={() => setActiveTab("shipped")}
              className={`pb-4 px-1 font-medium transition-all duration-300 ${
                activeTab === "shipped"
                  ? "text-primary border-b-2 border-primary"
                  : "text-secondary hover:text-primary"
              }`}
            >
              Shipped
            </button>
            <button
              onClick={() => setActiveTab("delivered")}
              className={`pb-4 px-1 font-medium transition-all duration-300 ${
                activeTab === "delivered"
                  ? "text-primary border-b-2 border-primary"
                  : "text-secondary hover:text-primary"
              }`}
            >
              Delivered
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 border border-primary/10 rounded-lg">
            <svg
              className="mx-auto h-12 w-12 text-secondary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-primary">No orders found</h3>
            <p className="mt-2 text-secondary">
              {activeTab === "all"
                ? "You haven't placed any orders yet."
                : `You don't have any ${activeTab} orders.`}
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className={`px-6 py-3 rounded-md font-medium shadow-sm transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-black text-white hover:bg-black/90"
                }`}
              >
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                className="border border-primary/10 rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="bg-primary/5 p-4 border-b border-primary/10 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-primary">Order #{order.id}</h3>
                      <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                        order.status === "Processing" 
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" 
                          : order.status === "Shipped" 
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-secondary text-sm mt-1">Placed on {formatDate(order.date)}</p>
                  </div>
                  <div className="mt-2 md:mt-0 flex space-x-4">
                    <button className="text-accent hover:underline text-sm">Track Order</button>
                    <button className="text-accent hover:underline text-sm">View Invoice</button>
                  </div>
                </div>
                
                <div className="p-4 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Order Items */}
                    <div className="md:col-span-2">
                      <h4 className="font-medium text-primary mb-3">Items</h4>
                      <div className="space-y-4">
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-start">
                            <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden border border-primary/10">
                              <img
                                src={item.imageSrc || "/placeholder.svg"}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-4 flex-1">
                              <h5 className="text-primary font-medium">{item.name}</h5>
                              <p className="text-secondary text-sm">Quantity: {item.quantity}</p>
                              <p className="text-primary font-medium mt-1">{item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Order Details */}
                    <div>
                      <div className="mb-4">
                        <h4 className="font-medium text-primary mb-2">Shipping Address</h4>
                        <address className="text-secondary text-sm not-italic">
                          {order.shippingAddress.name}<br />
                          {order.shippingAddress.address}<br />
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                          {order.shippingAddress.country}
                        </address>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium text-primary mb-2">Payment Method</h4>
                        <p className="text-secondary text-sm">{order.paymentMethod}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-primary mb-2">Order Summary</h4>
                        <div className="text-secondary text-sm">
                          <div className="flex justify-between py-1">
                            <span>Total</span>
                            <span className="font-medium text-primary">${order.total}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary/5 p-4 border-t border-primary/10 flex justify-end">
                  <Link
                    to="/"
                    className="px-4 py-2 rounded-md text-sm font-medium border border-primary/20 hover:bg-primary/10 transition-all duration-300"
                  >
                    Buy Again
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
