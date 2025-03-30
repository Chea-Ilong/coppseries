"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Package,
  Settings,
  LogOut,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  MapPin,
  Bell,
  CreditCard,
  Shield,
  ChevronRight,
  Edit,
  Save,
  X,
  Camera,
  Upload,
} from "lucide-react"
import { useAuth } from "./auth/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { useCart } from "../components/context/CartContext"

export default function AccountPage() {
  const { user, updateProfile, isLoggedIn, logout } = useAuth()
  const { theme } = useTheme()
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart()
  const accountRef = useRef(null)
  const fileInputRef = useRef(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    email: user?.email || "",
    profilePicture: user?.profilePicture || null,
  })
  const [profilePreview, setProfilePreview] = useState(user?.profilePicture || null)
  const [isMobile, setIsMobile] = useState(false)
  const [activeSection, setActiveSection] = useState("profile")
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [discount, setDiscount] = useState(0)

  // Load orders from localStorage
  useEffect(() => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      // Sort orders by date (newest first)
      savedOrders.sort((a, b) => new Date(b.date) - new Date(a.date))
      setOrders(savedOrders)
    } catch (error) {
      console.error("Error loading orders:", error)
      setOrders([])
    }
  }, [])

  useEffect(() => {
    // Detect mobile viewport
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize() // Initial check
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    // Animate elements on mount
    if (accountRef.current) {
      const elements = accountRef.current.querySelectorAll(".animate-in")
      elements.forEach((el, index) => {
        el.style.opacity = "0"
        el.style.transform = "translateY(20px)"

        setTimeout(() => {
          el.style.transition = "all 0.5s ease"
          el.style.opacity = "1"
          el.style.transform = "translateY(0)"
        }, index * 100)
      })
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePreview(reader.result)
        setFormData((prev) => ({
          ...prev,
          profilePicture: reader.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateProfile(formData)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const handleSignOut = () => {
    logout()
    navigate("/login")
  }

  const handleCheckout = () => {
    // Navigate to checkout page
    navigate("/checkout")
  }

  const handleApplyPromo = (e) => {
    e.preventDefault()
    if (promoCode.toLowerCase() === "discount10") {
      setPromoApplied(true)
      setDiscount(Number.parseFloat(getTotalPrice()) * 0.1)
    } else {
      setPromoApplied(false)
      setDiscount(0)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen p-8 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view your account</h2>
          <Link to="/login" className="text-blue-500 hover:text-blue-600">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  const renderMobileNavigation = () => {
    return (
      <div className="flex overflow-x-auto gap-2 pb-4 mb-6 border-b border-gray-200 dark:border-gray-700 animate-in">
        <button
          onClick={() => setActiveSection("profile")}
          className={`flex items-center px-4 py-2 rounded-full whitespace-nowrap ${
            activeSection === "profile"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          }`}
        >
          <User className="w-4 h-4 mr-2" />
          Profile
        </button>
        <button
          onClick={() => setActiveSection("orders")}
          className={`flex items-center px-4 py-2 rounded-full whitespace-nowrap ${
            activeSection === "orders"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          }`}
        >
          <Package className="w-4 h-4 mr-2" />
          My Orders
        </button>
        <button
          onClick={() => setActiveSection("settings")}
          className={`flex items-center px-4 py-2 rounded-full whitespace-nowrap ${
            activeSection === "settings"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          }`}
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </button>
      </div>
    )
  }

  const renderProfileSection = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-opacity-50 backdrop-blur-lg rounded-lg shadow-lg animate-in overflow-hidden"
      >
        {/* Profile Header */}
        <div
          className={`p-6 ${theme === "dark" ? "bg-gray-800/50" : "bg-blue-50"} border-b border-gray-200 dark:border-gray-700`}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              {profilePreview ? (
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  <img
                    src={profilePreview || "/placeholder.svg"}
                    alt={`${user?.firstName} ${user?.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold ${theme === "dark" ? "bg-blue-600" : "bg-blue-500"} text-white`}
                >
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </div>
              )}

              {isEditing ? (
                <button
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleProfilePictureChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {user?.firstName} {user?.lastName} Member since 2025
              </p>
            </div>
            {!isMobile && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="md:ml-auto flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                      : "border-gray-300 text-gray-900 focus:border-blue-500"
                  } focus:ring-2 focus:ring-blue-500/20 outline-none transition-all`}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                      : "border-gray-300 text-gray-900 focus:border-blue-500"
                  } focus:ring-2 focus:ring-blue-500/20 outline-none transition-all`}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full p-3 pl-10 rounded-lg border ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                        : "border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:ring-2 focus:ring-blue-500/20 outline-none transition-all`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full p-3 pl-10 rounded-lg border ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                        : "border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:ring-2 focus:ring-blue-500/20 outline-none transition-all`}
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium">Profile Picture</label>
                <div
                  className={`p-4 border border-dashed rounded-lg text-center ${theme === "dark" ? "border-gray-700" : "border-gray-300"}`}
                >
                  {profilePreview ? (
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full overflow-hidden mb-3">
                        <img
                          src={profilePreview || "/placeholder.svg"}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
                      >
                        <Upload className="w-4 h-4" />
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="flex flex-col items-center w-full py-4 cursor-pointer"
                    >
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <span className="text-sm text-gray-500">Click to upload profile picture</span>
                      <span className="text-xs text-gray-400 mt-1">JPG, PNG or GIF (max. 2MB)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setProfilePreview(user?.profilePicture || null)
                  setFormData({
                    firstName: user?.firstName || "",
                    lastName: user?.lastName || "",
                    phone: user?.phone || "",
                    email: user?.email || "",
                    profilePicture: user?.profilePicture || null,
                  })
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                    <p className="font-medium">{user?.email || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                    <p className="font-medium">{user?.phone || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Default Shipping Address</p>
                    <p className="font-medium">6A Street, Cambodia Academy of Digital Technology</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phnom Penh, Cambodia</p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Default Payment Method</p>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Expires 12/26</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    )
  }

  const renderOrdersSection = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-opacity-50 backdrop-blur-lg rounded-lg shadow-lg animate-in overflow-hidden"
      >
        <div
          className={`p-6 ${theme === "dark" ? "bg-gray-800/50" : "bg-blue-50"} border-b border-gray-200 dark:border-gray-700`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">My Orders</h2>
              <p className="text-gray-500 dark:text-gray-400">Track and manage your purchases</p>
            </div>
            <div className="hidden md:block">
              <select
                className={`p-2 rounded-lg border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
              >
                <option value="all">All Orders</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -2 }}
                  className={`border rounded-lg overflow-hidden shadow-sm ${
                    theme === "dark" ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div
                    className={`p-4 flex flex-col md:flex-row md:items-center gap-4 ${
                      theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-lg">Order #{order.id}</p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : order.status === "Shipped"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <p>
                          {new Date(order.date).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <span>•</span>
                        <Clock className="w-4 h-4" />
                        <p>{new Date(order.date).toLocaleTimeString(undefined, { timeStyle: "short" })}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${order.total}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{order.items.length} items</p>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-4">
                      <h3 className="font-medium mb-3 flex items-center">
                        <Package className="w-4 h-4 mr-2 text-blue-500" />
                        Order Items
                      </h3>
                      <div className="grid gap-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                {item.imageSrc ? (
                                  <img
                                    src={item.imageSrc || "/placeholder.svg"}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Package className="w-6 h-6 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <Link
                                  to={`/product-overview/${item.id}`}
                                  className="font-medium hover:text-blue-500 hover:underline transition-colors"
                                >
                                  {item.name}
                                </Link>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <span className="font-medium">{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        {order.status === "Delivered" ? (
                          <span className="text-sm text-green-600 dark:text-green-400 flex items-center">
                            <Package className="w-4 h-4 mr-1" />
                            Delivered on {new Date(order.date).toLocaleDateString()}
                          </span>
                        ) : order.status === "Shipped" ? (
                          <span className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center">
                            <Package className="w-4 h-4 mr-1" />
                            Shipped on {new Date(order.date).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-sm text-blue-600 dark:text-blue-400 flex items-center">
                            <Package className="w-4 h-4 mr-1" />
                            Processing
                          </span>
                        )}
                      </div>
                      <Link
                        to="/my-orders"
                        className="flex items-center justify-center gap-1 text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors"
                      >
                        View Order Details
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Package className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">No orders yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                When you place your first order, it will appear here for you to track and manage.
              </p>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  const renderSettingsSection = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-opacity-50 backdrop-blur-lg rounded-lg shadow-lg animate-in overflow-hidden"
      >
        <div
          className={`p-6 ${theme === "dark" ? "bg-gray-800/50" : "bg-blue-50"} border-b border-gray-200 dark:border-gray-700`}
        >
          <h2 className="text-2xl font-bold">Account Settings</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your preferences and account settings</p>
        </div>

        <div className="p-6">
          <div className="space-y-8">
            {/* Notification Preferences */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold">Notification Preferences</h3>
              </div>

              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications for Orders</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates about your orders</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications for Promotions</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive special offers and promotions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive text messages for important updates
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold">Security Settings</h3>
              </div>

              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Password</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Last updated 3 months ago</p>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                      Change Password
                    </button>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
                    </div>
                    <button className="px-4 py-2 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors">
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold">Payment Methods</h3>
              </div>

              <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-blue-500 rounded flex items-center justify-center">
                      <svg className="h-4 w-auto text-white" viewBox="0 0 36 24" aria-hidden="true">
                        <rect width="36" height="24" rx="4" fill="currentColor" />
                        <path d="M10.5 16.5H13L14.5 7.5H12L10.5 16.5Z" fill="white" />
                        <path d="M17.25 7.5L15 16.5H17.25L19.5 7.5H17.25Z" fill="white" />
                        <path d="M22.5 7.5L21 12L20.25 7.5H18L20.25 16.5H22.5L25.5 7.5H22.5Z" fill="white" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Expires 12/25</p>
                    </div>
                  </div>
                  <button className="text-blue-500 hover:text-blue-600 transition-colors">Edit</button>
                </div>
              </div>

              <div className="mt-4">
                <button className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors">
                  <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                    +
                  </span>
                  Add Payment Method
                </button>
              </div>
            </div>

            {/* Shipping Addresses */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold">Shipping Addresses</h3>
              </div>

              <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">Home</p>
                      <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                        Default
                      </span>
                    </div>
                    <p className="mt-1">123 Main Street, Apt 4B</p>
                    <p>New York, NY 10001</p>
                    <p>United States</p>
                  </div>
                  <button className="text-blue-500 hover:text-blue-600 transition-colors">Edit</button>
                </div>
              </div>

              <div className="mt-4">
                <button className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors">
                  <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                    +
                  </span>
                  Add New Address
                </button>
              </div>
            </div>

            {/* Account Actions */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  let content = null

  if (!isLoggedIn) {
    content = (
      <div className={`min-h-screen p-8 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view your account</h2>
          <Link to="/login" className="text-blue-500 hover:text-blue-600">
            Go to Login
          </Link>
        </div>
      </div>
    )
  } else {
    content = (
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 animate-in">My Account</h1>

        {isMobile && renderMobileNavigation()}

        {!isMobile && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setActiveSection("profile")}
              className={`flex items-center justify-center p-4 rounded-lg ${
                activeSection === "profile"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <User className="w-5 h-5 mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveSection("orders")}
              className={`flex items-center justify-center p-4 rounded-lg ${
                activeSection === "orders"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <Package className="w-5 h-5 mr-2" />
              My Orders
            </button>
            <button
              onClick={() => setActiveSection("settings")}
              className={`flex items-center justify-center p-4 rounded-lg ${
                activeSection === "settings"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </button>
          </div>
        )}

        {activeSection === "profile" && renderProfileSection()}
        {activeSection === "orders" && renderOrdersSection()}
        {activeSection === "settings" && renderSettingsSection()}
      </div>
    )
  }

  return (
    <div
      ref={accountRef}
      className={`min-h-screen p-4 md:p-8 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
    >
      {content}
    </div>
  )
}

