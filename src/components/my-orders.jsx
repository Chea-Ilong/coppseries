"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../components/auth/AuthContext";
import { Package, Truck, CheckCircle, Clock, Search, ChevronDown, ChevronRight, ShoppingBag, Calendar, CreditCard, MapPin, Filter, X, ArrowLeft, RefreshCw } from 'lucide-react';

export default function MyOrders() {
  const { theme } = useTheme();
  const { isLoggedIn } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [isFiltering, setIsFiltering] = useState(false);
  const filterTimeoutRef = useRef(null);

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
        setTimeout(() => {
          setIsLoading(false);
        }, 600); // Simulate loading for better UX
      }
    };

    loadOrders();
  }, [isLoggedIn]);

  // Apply filters with debounce for smoother experience
  useEffect(() => {
    setIsFiltering(true);
    
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }
    
    filterTimeoutRef.current = setTimeout(() => {
      setIsFiltering(false);
    }, 400);
    
    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, [activeTab, searchQuery, dateFilter, priceFilter]);

  // Filter orders based on active tab, search query, and date filter
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (activeTab !== "all" && order.status.toLowerCase() !== activeTab.toLowerCase()) {
      return false;
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const orderIdMatch = order.id.toString().includes(query);
      const itemsMatch = order.items.some(item => 
        item.name.toLowerCase().includes(query)
      );
      
      if (!orderIdMatch && !itemsMatch) {
        return false;
      }
    }
    
    // Date filter
    if (dateFilter !== "all") {
      const orderDate = new Date(order.date);
      const today = new Date();
      
      if (dateFilter === "last30days") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        if (orderDate < thirtyDaysAgo) {
          return false;
        }
      } else if (dateFilter === "last3months") {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        if (orderDate < threeMonthsAgo) {
          return false;
        }
      } else if (dateFilter === "last6months") {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 6);
        if (orderDate < sixMonthsAgo) {
          return false;
        }
      }
    }
    
    // Price filter
    if (priceFilter !== "all") {
      const total = parseFloat(order.total);
      
      if (priceFilter === "under50" && total >= 50) {
        return false;
      } else if (priceFilter === "50to100" && (total < 50 || total > 100)) {
        return false;
      } else if (priceFilter === "100to200" && (total < 100 || total > 200)) {
        return false;
      } else if (priceFilter === "over200" && total <= 200) {
        return false;
      }
    }
    
    return true;
  });

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-yellow-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'processing':
        return theme === "dark" 
          ? "bg-blue-900/30 text-blue-300" 
          : "bg-blue-100 text-blue-800";
      case 'shipped':
        return theme === "dark" 
          ? "bg-yellow-900/30 text-yellow-300" 
          : "bg-yellow-100 text-yellow-800";
      case 'delivered':
        return theme === "dark" 
          ? "bg-green-900/30 text-green-300" 
          : "bg-green-100 text-green-800";
      default:
        return theme === "dark" 
          ? "bg-gray-800 text-gray-300" 
          : "bg-gray-100 text-gray-800";
    }
  };

  const toggleOrderExpansion = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const resetFilters = () => {
    setActiveTab("all");
    setSearchQuery("");
    setDateFilter("all");
    setPriceFilter("all");
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeTab !== "all") count++;
    if (searchQuery) count++;
    if (dateFilter !== "all") count++;
    if (priceFilter !== "all") count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  if (!isLoggedIn) {
    return (
      <div className="bg-bg-primary min-h-screen py-12 px-4 sm:px-6 lg:px-8 antialiased">
        <div className="max-w-3xl mx-auto">
          <div className={`text-center py-16 px-4 sm:px-6 lg:px-8 rounded-xl shadow-sm border ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
            <ShoppingBag className="mx-auto h-16 w-16 text-accent mb-4" />
            <h1 className="text-3xl font-bold text-primary mb-4">My Orders</h1>
            <p className="text-secondary mb-8 max-w-md mx-auto">
              Please log in to view your order history and track your purchases.
            </p>
            <Link
              to="/login"
              className={`px-6 py-3 rounded-lg font-medium shadow-sm transition-all duration-300 inline-flex items-center ${
                theme === "dark"
                  ? "bg-accent text-white hover:bg-accent/90"
                  : "bg-accent text-white hover:bg-accent/90"
              }`}
            >
              Log In to Your Account
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary min-h-screen py-8 md:py-12 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">My Orders</h1>
            <p className="text-secondary mt-2">
              Track and manage your purchase history
            </p>
          </div>
          <Link 
            to="/"
            className="inline-flex items-center text-accent hover:text-accent/80 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        {/* Search and Filter Bar */}
        <div className={`mb-8 rounded-xl p-4 border shadow-sm ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search orders by ID or product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                  theme === "dark" 
                    ? "bg-gray-900 border-gray-700 text-white" 
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg border inline-flex items-center ${
                  showFilters || activeFilterCount > 0
                    ? theme === "dark"
                      ? "bg-accent/20 text-accent border-accent/30"
                      : "bg-accent/10 text-accent border-accent/20"
                    : theme === "dark"
                      ? "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-2 w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className={`px-4 py-2 rounded-lg border inline-flex items-center ${
                    theme === "dark"
                      ? "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className={`pt-4 mt-4 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">Date Range</label>
                      <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className={`w-full p-2 rounded-lg border ${
                          theme === "dark" 
                            ? "bg-gray-900 border-gray-700 text-white" 
                            : "bg-gray-50 border-gray-300 text-gray-900"
                        }`}
                      >
                        <option value="all">All Time</option>
                        <option value="last30days">Last 30 Days</option>
                        <option value="last3months">Last 3 Months</option>
                        <option value="last6months">Last 6 Months</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">Price Range</label>
                      <select
                        value={priceFilter}
                        onChange={(e) => setPriceFilter(e.target.value)}
                        className={`w-full p-2 rounded-lg border ${
                          theme === "dark" 
                            ? "bg-gray-900 border-gray-700 text-white" 
                            : "bg-gray-50 border-gray-300 text-gray-900"
                        }`}
                      >
                        <option value="all">All Prices</option>
                        <option value="under50">Under $50</option>
                        <option value="50to100">$50 - $100</option>
                        <option value="100to200">$100 - $200</option>
                        <option value="over200">Over $200</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Tabs */}
        <div className={`mb-8 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-4 px-1 font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === "all"
                  ? `text-primary border-b-2 ${theme === "dark" ? "border-accent" : "border-accent"}`
                  : "text-secondary hover:text-primary"
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setActiveTab("processing")}
              className={`pb-4 px-1 font-medium transition-all duration-300 whitespace-nowrap flex items-center ${
                activeTab === "processing"
                  ? `text-primary border-b-2 ${theme === "dark" ? "border-accent" : "border-accent"}`
                  : "text-secondary hover:text-primary"
              }`}
            >
              <Clock className="w-4 h-4 mr-2" />
              Processing
            </button>
            <button
              onClick={() => setActiveTab("shipped")}
              className={`pb-4 px-1 font-medium transition-all duration-300 whitespace-nowrap flex items-center ${
                activeTab === "shipped"
                  ? `text-primary border-b-2 ${theme === "dark" ? "border-accent" : "border-accent"}`
                  : "text-secondary hover:text-primary"
              }`}
            >
              <Truck className="w-4 h-4 mr-2" />
              Shipped
            </button>
            <button
              onClick={() => setActiveTab("delivered")}
              className={`pb-4 px-1 font-medium transition-all duration-300 whitespace-nowrap flex items-center ${
                activeTab === "delivered"
                  ? `text-primary border-b-2 ${theme === "dark" ? "border-accent" : "border-accent"}`
                  : "text-secondary hover:text-primary"
              }`}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Delivered
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mb-4"></div>
            <p className="text-secondary">Loading your orders...</p>
          </div>
        ) : isFiltering ? (
          <div className="flex flex-col justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent mb-2"></div>
            <p className="text-secondary text-sm">Filtering orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center py-16 rounded-xl border ${
              theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
              theme === "dark" ? "bg-gray-700" : "bg-accent/10"
            }`}>
              <Package className={`h-10 w-10 ${theme === "dark" ? "text-gray-300" : "text-accent"}`} />
            </div>
            <h3 className="text-xl font-medium text-primary mb-2">No orders found</h3>
            <p className="text-secondary max-w-md mx-auto mb-8">
              {searchQuery || activeFilterCount > 0
                ? "No orders match your filter criteria. Try adjusting your filters."
                : activeTab === "all"
                  ? "You haven't placed any orders yet."
                  : `You don't have any ${activeTab} orders.`}
            </p>
            {(searchQuery || activeFilterCount > 0) ? (
              <button
                onClick={resetFilters}
                className={`px-6 py-3 rounded-lg font-medium shadow-sm transition-all duration-300 inline-flex items-center ${
                  theme === "dark"
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Filters
              </button>
            ) : (
              <Link
                to="/"
                className={`px-6 py-3 rounded-lg font-medium shadow-sm transition-all duration-300 inline-flex items-center ${
                  theme === "dark"
                    ? "bg-accent text-white hover:bg-accent/90"
                    : "bg-accent text-white hover:bg-accent/90"
                }`}
              >
                Browse Products
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${dateFilter}-${priceFilter}-${searchQuery}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {filteredOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    className={`border rounded-xl overflow-hidden shadow-sm ${
                      theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div 
                      className="p-4 md:p-6 cursor-pointer"
                      onClick={() => toggleOrderExpansion(order.id)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${getStatusClass(order.status)} flex-shrink-0`}>
                            {getStatusIcon(order.status)}
                          </div>
                          <div>
                            <div className="flex items-center flex-wrap gap-2">
                              <h3 className="text-lg font-medium text-primary">Order #{order.id}</h3>
                              <span className={`px-3 py-1 text-xs rounded-full ${getStatusClass(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-secondary text-sm mt-1 flex items-center">
                              <Calendar className="w-4 h-4 mr-1 inline" />
                              {formatDate(order.date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-6">
                          <div className="text-right">
                            <p className="text-secondary text-sm">Total Amount</p>
                            <p className="text-primary font-bold text-lg">${order.total}</p>
                          </div>
                          <ChevronDown className={`w-5 h-5 text-secondary transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedOrder === order.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`overflow-hidden border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
                        >
                          <div className="p-4 md:p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Order Items */}
                              <div className="md:col-span-2">
                                <h4 className="font-medium text-primary mb-4 flex items-center">
                                  <ShoppingBag className="w-4 h-4 mr-2 text-accent" />
                                  Items ({order.items.length})
                                </h4>
                                <div className="space-y-4">
                                  {order.items.map((item, itemIndex) => (
                                    <div 
                                      key={itemIndex} 
                                      className={`flex items-start p-3 rounded-lg border ${
                                        theme === "dark" 
                                          ? "bg-gray-900/50 border-gray-700" 
                                          : "bg-gray-50 border-gray-200"
                                      }`}
                                    >
                                      <div className={`h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border ${
                                        theme === "dark" ? "border-gray-700" : "border-gray-200"
                                      }`}>
                                        <img
                                          src={item.imageSrc || "/placeholder.svg"}
                                          alt={item.name}
                                          className="h-full w-full object-cover"
                                        />
                                      </div>
                                      <div className="ml-4 flex-1">
                                        <div className="flex justify-between">
                                          <h5 className="text-primary font-medium">{item.name}</h5>
                                          <p className="text-primary font-medium">{item.price}</p>
                                        </div>
                                        <p className="text-secondary text-sm mt-1">Quantity: {item.quantity}</p>
                                        <Link 
                                          to={`/product-overview/${item.id}`}
                                          className="text-accent hover:underline text-sm mt-2 inline-block"
                                        >
                                          View Product
                                        </Link>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Order Details */}
                              <div className="space-y-6">
                                <div className={`p-4 rounded-lg border ${
                                  theme === "dark" 
                                    ? "bg-gray-900/50 border-gray-700" 
                                    : "bg-gray-50 border-gray-200"
                                }`}>
                                  <h4 className="font-medium text-primary mb-3 flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 text-accent" />
                                    Shipping Address
                                  </h4>
                                  <address className="text-secondary text-sm not-italic">
                                    {order.shippingAddress.name}<br />
                                    {order.shippingAddress.address}<br />
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                                    {order.shippingAddress.country}
                                  </address>
                                </div>
                                
                                <div className={`p-4 rounded-lg border ${
                                  theme === "dark" 
                                    ? "bg-gray-900/50 border-gray-700" 
                                    : "bg-gray-50 border-gray-200"
                                }`}>
                                  <h4 className="font-medium text-primary mb-3 flex items-center">
                                    <CreditCard className="w-4 h-4 mr-2 text-accent" />
                                    Payment Method
                                  </h4>
                                  <p className="text-secondary text-sm">{order.paymentMethod}</p>
                                </div>
                                
                                <div className={`p-4 rounded-lg border ${
                                  theme === "dark" 
                                    ? "bg-gray-900/50 border-gray-700" 
                                    : "bg-gray-50 border-gray-200"
                                }`}>
                                  <h4 className="font-medium text-primary mb-3">Order Summary</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between py-1">
                                      <span className="text-secondary">Subtotal</span>
                                      <span className="text-primary">${(parseFloat(order.total) * 0.9).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                      <span className="text-secondary">Shipping</span>
                                      <span className="text-primary">$5.00</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                      <span className="text-secondary">Tax</span>
                                      <span className="text-primary">${(parseFloat(order.total) * 0.1 - 5).toFixed(2)}</span>
                                    </div>
                                    <div className={`border-t my-2 pt-2 flex justify-between font-medium ${
                                      theme === "dark" ? "border-gray-700" : "border-gray-200"
                                    }`}>
                                      <span className="text-primary">Total</span>
                                      <span className="text-primary">${order.total}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className={`p-4 md:p-6 border-t flex flex-wrap gap-3 justify-end ${
                            theme === "dark" 
                              ? "bg-gray-900/30 border-gray-700" 
                              : "bg-gray-50 border-gray-200"
                          }`}>
                            <button className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                              theme === "dark"
                                ? "border-gray-700 hover:bg-gray-700 text-gray-300"
                                : "border-gray-300 hover:bg-gray-100 text-gray-700"
                            } transition-all duration-300`}>
                              Download Invoice
                            </button>
                            {order.status === "shipped" && (
                              <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                theme === "dark"
                                  ? "border border-accent/30 text-accent bg-accent/10 hover:bg-accent/20"
                                  : "border border-accent/30 text-accent bg-accent/10 hover:bg-accent/20"
                              } transition-all duration-300`}>
                                Track Package
                              </button>
                            )}
                            <Link
                              to="/"
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                theme === "dark"
                                  ? "bg-accent text-white hover:bg-accent/90"
                                  : "bg-accent text-white hover:bg-accent/90"
                              }`}
                            >
                              Buy Again
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
