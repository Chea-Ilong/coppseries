"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Package, Settings, LogOut, User, ShoppingBag } from "lucide-react"
import { useAuth } from "./auth/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { useCart } from "../components/context/CartContext"

export default function AccountPage() {
  const { user, updateProfile, isLoggedIn, logout } = useAuth()
  const { theme } = useTheme()
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart()
  const accountRef = useRef(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    email: user?.email || "",
  })
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
          onClick={() => setActiveSection("cart")}
          className={`flex items-center px-4 py-2 rounded-full whitespace-nowrap ${
            activeSection === "cart"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          }`}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Cart
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
      <div className="bg-opacity-50 backdrop-blur-lg rounded-lg p-6 shadow-lg animate-in">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 mb-6">
              <div>
                <label className="block mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full p-2 rounded border ${
                    theme === "dark" ? "bg-gray-800 text-white" : "text-gray-900"
                  }`}
                />
              </div>
              <div>
                <label className="block mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full p-2 rounded border ${
                    theme === "dark" ? "bg-gray-800 text-white" : "text-gray-900"
                  }`}
                />
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-2 rounded border ${
                    theme === "dark" ? "bg-gray-800 text-white" : "text-gray-900"
                  }`}
                />
              </div>
              <div>
                <label className="block mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full p-2 rounded border ${
                    theme === "dark" ? "bg-gray-800 text-white" : "text-gray-900"
                  }`}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-blue-600">
                Edit Profile
              </button>
            </div>
            <div className="grid gap-4">
              <div>
                <p className="font-semibold">Name:</p>
                <p>
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
              <div>
                <p className="font-semibold">Email:</p>
                <p>{user?.email}</p>
              </div>
              <div>
                <p className="font-semibold">Phone:</p>
                <p>{user?.phone || "Not provided"}</p>
              </div>
            </div>
            {isMobile && (
              <button
                onClick={handleSignOut}
                className="mt-6 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  const renderOrdersSection = () => {
    return (
      <div className="bg-opacity-50 backdrop-blur-lg rounded-lg p-6 shadow-lg animate-in">
        <h2 className="text-xl font-semibold mb-6">My Orders</h2>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`border rounded-lg overflow-hidden ${
                  theme === "dark" ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div
                  className={`p-4 flex justify-between items-center ${
                    theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                  }`}
                >
                  <div>
                    <p className="font-bold">#{order.id}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : order.status === "Shipped"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      }`}
                    >
                      {order.status}
                    </span>
                    <p className="font-bold mt-1">${order.total}</p>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-medium mb-2">Items</h3>
                  <ul className="space-y-2">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <Link to={`/product/${item.id}`} className="hover:text-accent hover:underline">
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                        </Link>
                        <span>{item.price}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex justify-end">
                    <Link
                      to={`/product/${order.items[0]?.id}`}
                      className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                    >
                      View Order Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No orders yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">You haven&apos;t placed any orders yet.</p>
            <Link to="/" className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    )
  }

  const renderCartSection = () => {
    // Calculate cart totals
    const subtotal = Number.parseFloat(getTotalPrice())
    const tax = subtotal * 0.1
    const shipping = subtotal > 100 ? 0 : 10 // Free shipping over $100
    const total = subtotal + tax + shipping - discount

    // If cart is empty, show empty state
    if (cartItems.length === 0) {
      return (
        <div className="bg-opacity-50 backdrop-blur-lg rounded-lg p-6 shadow-lg animate-in">
          <h2 className="text-xl font-semibold mb-6">My Cart</h2>
          <div className="text-center py-8">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Your Cart is Empty</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link to="/" className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Continue Shopping
            </Link>
          </div>
        </div>
      )
    }

    return (
      <div className="bg-opacity-50 backdrop-blur-lg rounded-lg p-6 shadow-lg animate-in">
        <h2 className="text-xl font-semibold mb-6">My Cart</h2>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="border border-primary/10 rounded-lg overflow-hidden mb-6">
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-primary/5 text-sm font-medium text-primary">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {cartItems.map((item, index) => {
                // Calculate item total
                const itemPrice = Number.parseFloat(item.price.replace(/[^0-9.]/g, ""))
                const itemTotal = itemPrice * item.quantity

                return (
                  <div key={index} className="border-t border-primary/10 first:border-t-0">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center">
                      {/* Product Info */}
                      <div className="col-span-1 md:col-span-6 flex items-center">
                        <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border border-primary/10">
                          <img
                            src={item.imageSrc || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-primary font-medium">{item.name}</h3>
                          <p className="text-secondary text-sm mt-1 md:hidden">{item.price}</p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-accent hover:text-accent/80 text-sm mt-1 flex items-center transition-colors duration-200"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="hidden md:block md:col-span-2 text-center text-primary">{item.price}</div>

                      {/* Quantity */}
                      <div className="col-span-1 md:col-span-2 flex justify-center">
                        <div className="flex items-center border border-primary/20 rounded-md">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(item.id, item.quantity - 1)
                              } else {
                                removeFromCart(item.id)
                              }
                            }}
                            className={`px-3 py-1 text-lg text-primary focus:outline-none transition-all duration-150 ${
                              theme === "light" ? "hover:bg-gray-50" : "hover:bg-gray-800"
                            }`}
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-primary border-l border-r border-primary/20">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className={`px-3 py-1 text-lg text-primary focus:outline-none transition-all duration-150 ${
                              theme === "light" ? "hover:bg-gray-50" : "hover:bg-gray-800"
                            }`}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="col-span-1 md:col-span-2 text-right font-medium text-primary">
                        ${itemTotal.toFixed(2)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-between items-center mb-8">
              <Link to="/" className="text-accent hover:underline flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Continue Shopping
              </Link>
              <button
                onClick={() => clearCart()}
                className="text-red-500 hover:text-red-700 transition-colors duration-300"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="border border-primary/10 rounded-lg overflow-hidden bg-primary/5 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-primary mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-primary">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-primary">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-primary">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-primary/10 pt-3 mt-3">
                  <div className="flex justify-between font-bold text-primary text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <form onSubmit={handleApplyPromo} className="mb-6">
                <label htmlFor="promo" className="block text-sm font-medium text-primary mb-2">
                  Promo Code
                </label>
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
                  <input
                    type="text"
                    id="promo"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-primary/20 rounded-md bg-transparent text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 md:w-64"
                    placeholder="Enter code"
                  />
                  <div className="flex-none md:ml-auto">
                    <button
                      type="submit"
                      className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                        theme === "dark"
                          ? "bg-white text-black hover:bg-white/90"
                          : "bg-black text-white hover:bg-black/90"
                      }`}
                    >
                      Apply
                    </button>
                  </div>
                </div>
                {promoApplied && (
                  <p className="text-green-500 text-sm mt-2 text-center">Promo code applied successfully!</p>
                )}
              </form>

              <motion.button
                onClick={handleCheckout}
                className={`w-full py-3 px-4 rounded-md font-medium shadow-sm transition-all duration-300 ${
                  theme === "dark" ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Proceed to Checkout
              </motion.button>

              <div className="mt-4 text-center text-sm text-secondary">
                <p>Secure checkout powered by Stripe</p>
                <div className="flex justify-center space-x-2 mt-2">
                  <svg className="h-6 w-auto" viewBox="0 0 36 24" aria-hidden="true">
                    <rect width="36" height="24" rx="4" fill="#1434CB" />
                    <path d="M10.5 16.5H13L14.5 7.5H12L10.5 16.5Z" fill="white" />
                    <path d="M17.25 7.5L15 16.5H17.25L19.5 7.5H17.25Z" fill="white" />
                    <path d="M22.5 7.5L21 12L20.25 7.5H18L20.25 16.5H22.5L25.5 7.5H22.5Z" fill="white" />
                  </svg>
                  <svg className="h-6 w-auto" viewBox="0 0 36 24" aria-hidden="true">
                    <rect width="36" height="24" rx="4" fill="#252525" />
                    <path
                      d="M18 19.5C21.5899 19.5 24.5 16.5899 24.5 13C24.5 9.41015 21.5899 6.5 18 6.5C14.4101 6.5 11.5 9.41015 11.5 13C11.5 16.5899 14.4101 19.5 18 19.5Z"
                      fill="#EB001B"
                    />
                    <path
                      d="M18 19.5C21.5899 19.5 24.5 16.5899 24.5 13C24.5 9.41015 21.5899 6.5 18 6.5"
                      fill="#F79E1B"
                    />
                  </svg>
                  <svg className="h-6 w-auto" viewBox="0 0 36 24" aria-hidden="true">
                    <rect width="36" height="24" rx="4" fill="#5A5A5A" />
                    <path d="M18 6.5V19.5M11.5 13H24.5" stroke="white" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderSettingsSection = () => {
    return (
      <div className="bg-opacity-50 backdrop-blur-lg rounded-lg p-6 shadow-lg animate-in">
        <h2 className="text-xl font-semibold mb-6">Settings</h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Notification Preferences</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                Email notifications for orders
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                Email notifications for promotions
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                SMS notifications
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Password</h3>
            <button className="text-blue-500 hover:text-blue-600">Change Password</button>
          </div>

          <div>
            <h3 className="font-medium mb-2">Payment Methods</h3>
            <button className="text-blue-500 hover:text-blue-600">Manage Payment Methods</button>
          </div>

          <div>
            <h3 className="font-medium mb-2">Shipping Addresses</h3>
            <button className="text-blue-500 hover:text-blue-600">Manage Addresses</button>
          </div>
        </div>
      </div>
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
          <div className="grid grid-cols-4 gap-4 mb-8">
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
              onClick={() => setActiveSection("cart")}
              className={`flex items-center justify-center p-4 rounded-lg ${
                activeSection === "cart"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Cart
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
        {activeSection === "cart" && renderCartSection()}
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

