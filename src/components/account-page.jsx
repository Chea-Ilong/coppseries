import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "./auth/AuthContext"
import { useTheme } from "../context/ThemeContext"

export default function AccountPage() {
  const { user, updateProfile } = useAuth()
  const { theme } = useTheme()
  const accountRef = useRef(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  })

  useEffect(() => {
    if (accountRef.current) {
      const elements = accountRef.current.querySelectorAll(".animate-in")
      elements.forEach((el, index) => {
        el.style.opacity = "0"
        el.style.transform = "translateY(20px)"
        
        setTimeout(() => {
          el.style.transition = "all 0.5s ease"
          el.style.opacity = "1"
          el.style.transform = "translateY(0)"
        }, 100 + (index * 100))
      })
    }
  }, [])

  // Initialize form data with user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || ""
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateProfile(formData)
    setIsEditing(false)
  }

  // If no user is logged in, show a message
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-in max-w-xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-primary mb-6">Account Not Found</h1>
          <p className="text-secondary mb-8">Please log in to view your account details.</p>
          <Link
            to="/login"
            className={`inline-flex items-center px-6 py-3 rounded-md font-medium shadow-sm transition-all duration-300 ${
              theme === "dark" ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"
            }`}
          >
            Log In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bg-primary py-8 md:py-16 antialiased" ref={accountRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-in mb-8">
          <h1 className="text-3xl font-bold text-primary">My Account</h1>
          <p className="text-secondary mt-2">View and manage your account information.</p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Account Sidebar */}
          <div className="lg:col-span-3">
            <div className="animate-in border border-primary/10 rounded-lg overflow-hidden bg-primary/5 p-6 mb-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 mb-4">
                  {user.profileImage ? (
                    <img 
                      src={user.profileImage || "/placeholder.svg"} 
                      alt={user.firstName || user.email} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <svg
                        className="h-12 w-12 text-primary/40"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-primary">
                  {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.email.split('@')[0]}
                </h2>
                <p className="text-secondary text-sm mt-1">{user.email}</p>
              </div>

              <nav className="space-y-1">
                <Link
                  to="/account"
                  className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium"
                >
                  Account Details
                </Link>
                <Link
                  to="/cart"
                  className="block px-3 py-2 rounded-md text-primary hover:bg-primary/10 transition-all duration-300"
                >
                  Order History
                </Link>
                <Link
                  to="/settings"
                  className="block px-3 py-2 rounded-md text-primary hover:bg-primary/10 transition-all duration-300"
                >
                  Settings
                </Link>
              </nav>
            </div>
          </div>

          {/* Account Content */}
          <div className="lg:col-span-9">
            <div className="animate-in border border-primary/10 rounded-lg overflow-hidden bg-primary/5 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-primary">Account Details</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-accent hover:text-accent/80 transition-colors duration-300"
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-primary mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-primary/20 rounded-md bg-transparent text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-primary mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-primary/20 rounded-md bg-transparent text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-primary/20 rounded-md bg-transparent text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-primary mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-primary/20 rounded-md bg-transparent text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <motion.button
                      type="submit"
                      className={`px-4 py-2 rounded-md font-medium shadow-sm transition-all duration-300 ${
                        theme === "dark"
                          ? "bg-white text-black hover:bg-white/90"
                          : "bg-black text-white hover:bg-black/90"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Save Changes
                    </motion.button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-secondary mb-1">First Name</h3>
                      <p className="text-primary">{user.firstName || "Not provided"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-secondary mb-1">Last Name</h3>
                      <p className="text-primary">{user.lastName || "Not provided"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-secondary mb-1">Email</h3>
                      <p className="text-primary">{user.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-secondary mb-1">Phone</h3>
                      <p className="text-primary">{user.phone || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Orders */}
            <div className="animate-in border border-primary/10 rounded-lg overflow-hidden bg-primary/5 p-6 mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-primary">Recent Orders</h2>
                <Link to="/cart" className="text-accent hover:text-accent/80 transition-colors duration-300">
                  View All
                </Link>
              </div>

              {/* If there are no orders */}
              <div className="text-center py-8">
                <svg
                  className="h-12 w-12 text-primary/30 mx-auto mb-4"
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
                <p className="text-primary mb-4">You haven't placed any orders yet.</p>
                <Link
                  to="/"
                  className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-white text-black hover:bg-white/90"
                      : "bg-black text-white hover:bg-black/90"
                  }`}
                >
                  Start Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
