"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { navItems } from "../Navbar"
import { ThemeToggle } from "../context/ThemeToggle"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../components/auth/AuthContext"
import { useCart } from "./context/CartContext"
import { searchCategories } from "./searchCategories"
import { ChevronDown, ChevronRight } from "lucide-react"

// Sample recent searches - in a real app, these would come from localStorage or a database
const recentSearches = ["Gaming Laptops", "RTX 4090", "Mechanical Keyboards", "Ultrawide Monitors", "SSD 2TB"]

// Add CSS variables for animations
const mobileSearchStyles = {
  ".mobile-search-input": {
    "-webkit-appearance": "none",
    appearance: "none",
  },
  ".no-scrollbar": {
    "-ms-overflow-style": "none",
    "scrollbar-width": "none",
  },
  ".no-scrollbar::-webkit-scrollbar": {
    display: "none",
  },
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { theme } = useTheme()
  const { isLoggedIn, user, logout } = useAuth()
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, getCartCount } = useCart()
  const navigate = useNavigate()
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const searchInputRef = useRef(null)
  const desktopSearchContainerRef = useRef(null)
  const mobileSearchContainerRef = useRef(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isFullScreenSearchActive, setIsFullScreenSearchActive] = useState(false)
  const [searchCategory, setSearchCategory] = useState("all")
  const fullScreenSearchRef = useRef(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [expandedMobileCategories, setExpandedMobileCategories] = useState({})
  const [isMobile, setIsMobile] = useState(false)

  const cssVariables = {
    "--primary-rgb": theme === "dark" ? "255, 255, 255" : "0, 0, 0",
    "--accent-color": theme === "dark" ? "#a78bfa" : "#6366f1",
    "--search-shadow": theme === "dark" ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "0 4px 12px rgba(0, 0, 0, 0.1)",
    "--search-focus-shadow": theme === "dark" ? "0 6px 16px rgba(0, 0, 0, 0.4)" : "0 6px 16px rgba(0, 0, 0, 0.15)",
    ...mobileSearchStyles,
  }

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Toggle mobile category expansion
  const toggleMobileCategory = (categoryName) => {
    setExpandedMobileCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }))
  }

  // Filter suggestions based on search term
  const filteredSuggestions = recentSearches.filter((item) => item.toLowerCase().includes(searchTerm.toLowerCase()))

  // Handle search submission
  const handleSearch = () => {
    if (searchTerm.trim()) {
      const searchUrl =
        searchCategory === "all"
          ? `/search?q=${encodeURIComponent(searchTerm.trim())}`
          : `/search?q=${encodeURIComponent(searchTerm.trim())}&category=${searchCategory}`

      navigate(searchUrl)
      setShowSuggestions(false)
    }
  }

  // Add this function to handle opening the full-screen search
  const openFullScreenSearch = () => {
    setIsFullScreenSearchActive(true)
    setTimeout(() => {
      if (fullScreenSearchRef.current) {
        fullScreenSearchRef.current.focus()
      }
    }, 100)
  }

  // Add this function to handle closing the full-screen search
  const closeFullScreenSearch = () => {
    setIsFullScreenSearchActive(false)
    setShowSuggestions(false)
  }

  // Add this function to handle search category selection
  const handleCategoryChange = (category) => {
    setSearchCategory(category)
  }

  // Add scroll event listener to detect when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCartOpen && !event.target.closest("#cartDropdown") && !event.target.closest("#cartButton")) {
        setIsCartOpen(false)
      }
      if (isUserMenuOpen && !event.target.closest("#userDropdown") && !event.target.closest("#userButton")) {
        setIsUserMenuOpen(false)
      }
      if (
        showSuggestions &&
        !event.target.closest("#desktopSearchContainer") &&
        !event.target.closest("#mobileSearchContainer")
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isCartOpen, isUserMenuOpen, showSuggestions])

  // Handle body scroll lock when categories menu is open
  useEffect(() => {
    if (isCategoriesOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isCategoriesOpen])

  // Add this effect to handle body scroll lock when full-screen search is active
  useEffect(() => {
    if (isFullScreenSearchActive) {
      document.body.style.overflow = "hidden"
    } else if (!isCategoriesOpen) {
      document.body.style.overflow = ""
    }

    return () => {
      if (!isCategoriesOpen) {
        document.body.style.overflow = ""
      }
    }
  }, [isFullScreenSearchActive, isCategoriesOpen])

  // Add this to handle ESC key to close the full-screen search
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && isFullScreenSearchActive) {
        closeFullScreenSearch()
      }
    }

    document.addEventListener("keydown", handleEscKey)
    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isFullScreenSearchActive])

  // Handle logout with animation
  const handleLogout = () => {
    setIsLoggingOut(true)
    setIsUserMenuOpen(false)

    setTimeout(() => {
      logout()
      navigate("/login")
      setIsLoggingOut(false)
    }, 800)
  }

  // Navigate to cart page
  const handleCartClick = () => {
    if (window.innerWidth < 768) {
      navigate("/cart")
    } else {
      setIsCartOpen(!isCartOpen)
    }
  }

  // Get user's first name or username
  const getUserDisplayName = () => {
    if (!user) return "Account"

    if (user.firstName) {
      return user.firstName
    } else if (user.name) {
      return user.name.split(" ")[0]
    } else if (user.email) {
      return user.email.split("@")[0]
    } else {
      return "Account"
    }
  }

  // Toggle categories menu
  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen)
    if (!isCategoriesOpen) {
      setIsOpen(false)
      setIsSearchOpen(false)
      setIsCartOpen(false)
      setIsUserMenuOpen(false)

      if (isMobile) {
        setExpandedMobileCategories({})
      } else {
        setSelectedCategory(searchCategories[0]?.name || null)
      }
    }
  }

  return (
    <>
      {/* Logout Animation Overlay */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-card-bg rounded-lg p-8 flex flex-col items-center max-w-md mx-4"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="mb-4"
              >
                <svg
                  className="w-16 h-16 text-accent"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </motion.div>
              <motion.h2
                className="text-xl font-bold text-primary mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Signing Out
              </motion.h2>
              <motion.p
                className="text-secondary text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Thank you for visiting. See you soon!
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories Full Screen Menu */}
      <AnimatePresence>
        {isCategoriesOpen && (
          <motion.div
            className="fixed inset-0 bg-nav z-40 overflow-y-auto categories-menu-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary">Categories</h2>
                <button
                  onClick={toggleCategories}
                  className="p-2 rounded-full hover:bg-primary/10 active:bg-primary/20 transition-all duration-300"
                  aria-label="Close categories menu"
                >
                  <svg
                    className="h-6 w-6 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Desktop Categories Layout */}
              <div className="hidden md:grid md:grid-cols-5 gap-8">
                {/* Categories Navigation - Left Side */}
                <div className="md:col-span-1 border-r border-primary/10 pr-4">
                  <ul className="space-y-2">
                    {searchCategories.map((category, index) => (
                      <motion.li
                        key={category.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="mb-2"
                      >
                        <div
                          onClick={() => setSelectedCategory(category.name)}
                          className={`text-lg font-semibold text-primary py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedCategory === category.name ? "bg-primary/10" : "hover:bg-primary/5"
                          }`}
                        >
                          {category.name}
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Subcategories - Right Side */}
                <div className="md:col-span-4">
                  {searchCategories.map((category) => (
                    <motion.div
                      key={`subcategories-${category.name}`}
                      className={`${selectedCategory === category.name ? "block" : "hidden"}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl font-semibold text-primary mb-4 border-b border-primary/10 pb-2">
                        {category.name}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {category.subcategories.map((subcategory, subIndex) => (
                          <motion.div
                            key={subcategory.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: subIndex * 0.05,
                            }}
                          >
                            <Link
                              to={subcategory.href}
                              className="text-primary/80 hover:text-primary transition-colors duration-300 hover:underline flex items-center group"
                              onClick={toggleCategories}
                            >
                              <span className="text-primary/40 mr-2 group-hover:text-accent transition-colors duration-300">
                                •
                              </span>
                              {subcategory.name}
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}

                  {/* Default view when no category is selected */}
                  {!selectedCategory && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-center py-12"
                    >
                      <p className="text-primary/70 text-lg">Select a category to see subcategories</p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Mobile Categories Layout - Accordion Style */}
              <div className="md:hidden">
                <div className="space-y-4">
                  {searchCategories.map((category, index) => (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border border-primary/10 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleMobileCategory(category.name)}
                        className={`w-full flex justify-between items-center p-4 text-left text-lg font-medium text-primary ${
                          expandedMobileCategories[category.name] ? "bg-primary/10" : "bg-primary/5"
                        }`}
                      >
                        <span>{category.name}</span>
                        <motion.div
                          animate={{
                            rotate: expandedMobileCategories[category.name] ? 180 : 0,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-5 w-5 text-primary/70" />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {expandedMobileCategories[category.name] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 bg-primary/5 space-y-3">
                              {category.subcategories.map((subcategory) => (
                                <Link
                                  key={subcategory.name}
                                  to={subcategory.href}
                                  className="block py-2 px-3 rounded-md text-primary/80 hover:text-primary hover:bg-primary/10 transition-all duration-200"
                                  onClick={toggleCategories}
                                >
                                  <div className="flex items-center">
                                    <ChevronRight className="h-4 w-4 mr-2 text-primary/50" />
                                    {subcategory.name}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Popular Searches Section - Both Mobile and Desktop */}
              <div className="mt-8 pt-6 border-t border-primary/10">
                <h3 className="text-lg font-semibold text-primary mb-4">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Gaming Laptops",
                    "Mechanical Keyboards",
                    "Wireless Mice",
                    "4K Monitors",
                    "RTX Graphics Cards",
                    "SSD Storage",
                    "Bluetooth Headphones",
                    "Ergonomic Chairs",
                  ].map((tag, index) => (
                    <motion.a
                      key={tag}
                      href={`/search?q=${encodeURIComponent(tag)}`}
                      className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-sm transition-colors duration-300"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                      onClick={toggleCategories}
                    >
                      {tag}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav
        className={`bg-nav shadow transition-all duration-300 ease-in-out ${isScrolled ? "py-1" : "py-3"}`}
        style={cssVariables}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main navbar with logo, search, and user controls */}
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/"
                className="text-xl font-bold text-primary transform transition-transform duration-300 hover:scale-105"
              >
                <img
                  src="CS-logo-removebg-preview.png"
                  alt="logo"
                  className="h-12 w-auto transition-all duration-300"
                  style={{ filter: "var(--logo-filter)" }}
                />
              </Link>
            </div>

            {/* Center: Search bar - only on desktop */}
            <div className="hidden md:flex flex-grow mx-4 max-w-xl">
              <div id="desktopSearchContainer" ref={desktopSearchContainerRef} className="relative w-full">
                <motion.div
                  className={`relative flex items-center transition-all duration-300 ${
                    isSearchFocused ? "scale-[1.02]" : "scale-100"
                  }`}
                  animate={{
                    boxShadow: isSearchFocused ? "var(--search-focus-shadow)" : "none",
                    transition: { type: "spring", stiffness: 300, damping: 20 },
                  }}
                >
                  <div className="relative flex-grow">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search for products, brands, categories..."
                      className={`w-full h-12 pl-12 pr-4 rounded-l-full border border-r-0 border-primary/20 
                        bg-nav/80 text-primary transition-all duration-300
                        ${isSearchFocused ? "border-primary/40 ring-1 ring-primary/10" : ""}
                        focus:outline-none`}
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        if (e.target.value) {
                          setShowSuggestions(true)
                        }
                      }}
                      onFocus={() => {
                        setIsSearchFocused(true)
                        if (searchTerm) {
                          setShowSuggestions(true)
                        }
                      }}
                      onBlur={() => {
                        setIsSearchFocused(false)
                        setTimeout(() => {
                          if (!desktopSearchContainerRef.current?.contains(document.activeElement)) {
                            setShowSuggestions(false)
                          }
                        }, 200)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && searchTerm.trim()) {
                          handleSearch()
                        }
                      }}
                    />
                    <motion.div
                      className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                      animate={{
                        x: isSearchFocused ? 2 : 0,
                        scale: isSearchFocused ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg
                        className={`h-5 w-5 ${isSearchFocused ? "text-primary" : "text-primary/60"}`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </motion.div>
                    <AnimatePresence>
                      {searchTerm && (
                        <motion.button
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                          onClick={() => {
                            setSearchTerm("")
                            searchInputRef.current?.focus()
                          }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.15 }}
                        >
                          <svg
                            className="h-5 w-5 text-primary/60 hover:text-primary transition-colors duration-300"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.button
                    className={`h-12 px-6 rounded-r-full flex items-center justify-center font-medium
      transition-all duration-300 ${
        theme === "dark" ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"
      }`}
                    onClick={handleSearch}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={!searchTerm.trim()}
                    initial={{ opacity: 0.9 }}
                    animate={{
                      opacity: 1,
                      transition: { duration: 0.3 },
                    }}
                  >
                    <span className="inline mr-2">Search</span>
                  </motion.button>
                </motion.div>

                {/* Search Suggestions Dropdown */}
                <AnimatePresence>
                  {showSuggestions && (searchTerm || recentSearches.length > 0) && (
                    <motion.div
                      className="absolute left-0 right-0 mt-2 bg-nav rounded-lg shadow-lg border border-primary/10 z-50 overflow-hidden"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-3 border-b border-primary/10">
                        <h3 className="text-sm font-medium text-primary/70">
                          {searchTerm ? "Suggestions" : "Recent Searches"}
                        </h3>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {searchTerm && filteredSuggestions.length > 0 ? (
                          filteredSuggestions.map((suggestion, index) => (
                            <motion.div
                              key={index}
                              className="px-4 py-2 hover:bg-primary/5 cursor-pointer transition-colors duration-200"
                              onClick={() => {
                                setSearchTerm(suggestion)
                                handleSearch()
                              }}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ x: 3 }}
                            >
                              <div className="flex items-center">
                                <svg
                                  className="h-4 w-4 text-primary/40 mr-2"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span className="text-primary">{suggestion}</span>
                              </div>
                            </motion.div>
                          ))
                        ) : searchTerm ? (
                          <div className="px-4 py-6 text-center text-primary/60">No matching results</div>
                        ) : (
                          recentSearches.map((search, index) => (
                            <motion.div
                              key={index}
                              className="px-4 py-2 hover:bg-primary/5 cursor-pointer transition-colors duration-200"
                              onClick={() => {
                                setSearchTerm(search)
                                handleSearch()
                              }}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ x: 3 }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <svg
                                    className="h-4 w-4 text-primary/40 mr-2"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <span className="text-primary">{search}</span>
                                </div>
                                <button
                                  className="p-1 rounded-full hover:bg-primary/10 text-primary/40 hover:text-primary/70"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // Would remove from recent searches in a real app
                                  }}
                                >
                                  <svg
                                    className="h-3 w-3"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                      {!searchTerm && (
                        <div className="p-3 border-t border-primary/10 flex justify-between">
                          <span className="text-xs text-primary/60">Based on your recent searches</span>
                          <button
                            className="text-xs text-primary/60 hover:text-primary transition-colors duration-200"
                            onClick={() => {
                              // Would clear recent searches in a real app
                              setShowSuggestions(false)
                            }}
                          >
                            Clear All
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right side controls - hidden on mobile */}
            <div className="hidden md:flex items-center lg:space-x-4 md:space-x-2">
              {/* Cart dropdown for logged-in users */}
              {isLoggedIn && (
                <div className="relative">
                  <motion.button
                    id="cartButton"
                    onClick={handleCartClick}
                    className="p-2 rounded-full hover:bg-primary/10 active:bg-primary/20 
                transition-all duration-300 ease-in-out
                flex items-center text-primary"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Open cart"
                  >
                    <div className="relative">
                      <svg
                        className="h-5 w-5"
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
                      {getCartCount() > 0 && (
                        <motion.span
                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          key={getCartCount()}
                        >
                          {getCartCount()}
                        </motion.span>
                      )}
                    </div>
                    <span className="hidden md:inline ml-2">Cart</span>
                  </motion.button>

                  {/* Cart dropdown content */}
                  {isCartOpen && (
                    <motion.div
                      id="cartDropdown"
                      className="absolute right-0 mt-2 w-72 bg-nav shadow-lg rounded-md py-2 z-50 border border-primary/10"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 py-2 border-b border-primary/10">
                        <h3 className="text-lg font-medium text-primary">Your Cart</h3>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {cartItems.length > 0 ? (
                          cartItems.map((item, index) => (
                            <div key={index} className="px-4 py-3 border-b border-primary/10">
                              <div className="flex justify-between mb-1">
                                <Link
                                  to={`/product/${item.id}`}
                                  className="text-sm font-medium text-primary hover:text-accent transition-colors duration-300"
                                >
                                  {item.name}
                                </Link>
                                <span className="text-xs font-medium text-primary/70">{item.price}</span>
                              </div>
                              <div className="flex justify-between items-center mt-1">
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => {
                                      if (item.quantity > 1) {
                                        updateQuantity(item.id, item.quantity - 1)
                                      } else {
                                        removeFromCart(item.id)
                                      }
                                    }}
                                    className={`p-1 rounded-md hover:bg-primary/10 text-primary/70`}
                                    aria-label="Decrease quantity"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                  </button>
                                  <span className="text-xs font-medium text-primary min-w-[20px] text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className={`p-1 rounded-md hover:bg-primary/10 text-primary/70`}
                                    aria-label="Increase quantity"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                      />
                                    </svg>
                                  </button>
                                </div>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-red-500 hover:text-red-700 transition-colors duration-300 p-1 rounded-md hover:bg-primary/10"
                                  aria-label="Remove item"
                                >
                                  <svg
                                    className="h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center text-primary/70">Your cart is empty</div>
                        )}
                      </div>
                      <div className="px-4 py-3 border-t border-primary/10">
                        <div className="flex justify-between mb-3">
                          <span className="font-medium text-primary">Total:</span>
                          <span className="font-bold text-primary">${getTotalPrice()}</span>
                        </div>
                        <button
                          onClick={() => navigate("/cart")}
                          className={`w-full text-center py-2 px-4 rounded-md font-medium transition-all duration-300 ${
                            cartItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                          } ${
                            theme === "dark"
                              ? "bg-white text-black hover:bg-white/90"
                              : "bg-black text-white hover:bg-black/90"
                          }`}
                          disabled={cartItems.length === 0}
                        >
                          View Cart
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {isLoggedIn ? (
                <div className="relative">
                  <motion.button
                    id="userButton"
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        navigate("/account") // Directly navigate to account page on small screens
                      } else {
                        setIsUserMenuOpen(!isUserMenuOpen) // Toggle dropdown on larger screens
                        setIsCartOpen(false)
                      }
                    }}
                    className="p-2 rounded-full hover:bg-primary/10 active:bg-primary/20 
  transition-all duration-300 ease-in-out
  flex items-center text-primary"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="User menu"
                  >
                    {user && user.profileImage ? (
                      <div className="h-6 w-6 rounded-full overflow-hidden border border-primary/20">
                        <img
                          src={user.profileImage || "/placeholder.svg"}
                          alt={getUserDisplayName()}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <svg
                        className="h-5 w-5"
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
                    )}
                    <span className="hidden md:inline ml-2">{getUserDisplayName()}</span>
                  </motion.button>

                  {/* Enhanced User Profile Popup for Desktop */}
                  {isUserMenuOpen && (
                    <motion.div
                      id="userDropdown"
                      className="absolute right-0 mt-2 w-72 bg-nav shadow-lg rounded-xl z-50 border border-primary/10 overflow-hidden"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Profile Header with Banner */}
                      <div className="bg-accent/80 h-16 relative">
                        {user?.bannerImage ? (
                          <img
                            src={user.bannerImage || "/placeholder.svg"}
                            alt="Profile banner"
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                        <div className="absolute -bottom-8 left-4">
                          <div className="relative">
                            <div className="w-16 h-16 rounded-full border-4 border-nav overflow-hidden bg-primary/10 flex items-center justify-center">
                              {user?.profileImage ? (
                                <img
                                  src={user.profileImage || "/placeholder.svg"}
                                  alt={getUserDisplayName()}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-2xl font-bold text-primary">
                                  {getUserDisplayName().charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-nav"></div>
                          </div>
                        </div>
                      </div>

                      {/* Profile Content */}
                      <div className="pt-10 pb-2 px-4">
                        <div className="mb-3">
                          <h3 className="font-bold text-primary text-lg">{getUserDisplayName()}</h3>
                          <p className="text-primary/60 text-sm">{user?.email || ""}</p>
                        </div>


                        {/* Profile Connections */}
                        {user?.connections && (
                          <div className="mb-3">
                            <h4 className="text-xs font-semibold text-primary/60 uppercase mb-1">Connections</h4>
                            <div className="flex items-center gap-1">
                              {user.connections.map((connection, index) => (
                                <div key={index} className="w-6 h-6 rounded-full bg-primary/10 overflow-hidden">
                                  {connection.image ? (
                                    <img
                                      src={connection.image || "/placeholder.svg"}
                                      alt={connection.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-primary">
                                      {connection.name.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                </div>
                              ))}
                              {!user.connections.length && (
                                <span className="text-xs text-primary/60">No connections yet</span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Menu Options */}
                        <div className="border-t border-primary/10 mt-2 pt-2">
                          <Link
                            to="/account"
                            className="flex items-center gap-2 px-2 py-2 text-sm text-primary hover:bg-primary/10 rounded-md transition-all duration-300"
                          >
                            <svg
                              className="h-4 w-4 text-primary/70"
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
                            My Account
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-2 py-2 text-sm text-primary hover:bg-primary/10 rounded-md transition-all duration-300"
                          >
                            <svg
                              className="h-4 w-4 text-primary/70"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                // Login and Signup buttons when not logged in
                <div className="flex items-center lg:space-x-3 md:space-x-2">
                  <Link
                    to="/login"
                    className="lg:px-3 md:px-2 py-1.5 text-sm font-medium text-primary border border-primary/60 rounded-md hover:bg-primary/10 transition-all duration-300 ease-in-out"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className={`lg:px-3 md:px-2 py-1.5 text-sm font-medium rounded-md shadow-sm transition-all duration-300 ease-in-out ${
                      theme === "dark"
                        ? "bg-white text-black hover:bg-white/90"
                        : "bg-black text-white hover:bg-black/90"
                    }`}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              {/* Theme toggle */}
              <div className="transition-transform duration-300 hover:scale-110">
                <ThemeToggle />
              </div>
            </div>

            {/* Mobile: Theme toggle and menu button */}
            <div className="flex md:hidden items-center space-x-2">
              <div className="transition-transform duration-300 hover:scale-110">
                <ThemeToggle />
              </div>

              {isLoggedIn && (
                <Link
                  to="/cart"
                  className="p-2 rounded-full hover:bg-primary/10 active:bg-primary/20 transition-all duration-300"
                >
                  <div className="relative">
                    <svg
                      className="h-5 w-5 text-primary"
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
                    {getCartCount() > 0 && (
                      <motion.span
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={getCartCount()}
                      >
                        {getCartCount()}
                      </motion.span>
                    )}
                  </div>
                </Link>
              )}
              {isLoggedIn ? (
                <Link
                  to="/account"
                  className="p-2 rounded-full hover:bg-primary/10 active:bg-primary/20 transition-all duration-300"
                >
                  {user && (user.profilePicture || user.profileImage) ? (
                    <div className="h-5 w-5 rounded-full overflow-hidden border border-primary/20">
                      <img
                        src={user.profilePicture || user.profileImage || "/placeholder.svg"}
                        alt={getUserDisplayName()}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-5 w-5 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                      {getUserDisplayName().charAt(0)}
                    </div>
                  )}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="p-2 rounded-full hover:bg-primary/10 active:bg-primary/20 transition-all duration-300"
                >
                  <svg
                    className="h-5 w-5 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                </Link>
              )}
            </div>
          </div>
          {/* Mobile: Categories and Search bar on second line */}
          <div className="md:hidden flex items-center space-x-2 py-2 border-t border-primary/10">
            {/* Categories Button for Mobile */}
            <motion.button
              onClick={toggleCategories}
              className="flex-shrink-0 flex items-center text-primary hover:text-accent transition-colors duration-300 focus:outline-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="h-5 w-5 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="text-sm font-medium">Categories</span>
            </motion.button>

            {/* Mobile Search Trigger */}
            <div className="relative flex-grow">
              <motion.div className="flex items-center" whileTap={{ scale: 0.98 }} onClick={openFullScreenSearch}>
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full h-10 pl-4 pr-10 rounded-l-full 
        border border-r-0 border-primary/20 
        bg-nav/80 text-primary transition-all duration-300
        focus:outline-none mobile-search-input cursor-pointer"
                    readOnly
                  />
                </div>

                <motion.button
                  className={`h-10 px-3 rounded-r-full flex items-center justify-center
      transition-all duration-300 ${
        theme === "dark" ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"
      }`}
                  whileHover={{
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 400, damping: 10 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    whileHover={{ rotate: 15, transition: { duration: 0.2 } }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </motion.svg>
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Full Screen Mobile Search Overlay */}
          <AnimatePresence>
            {isFullScreenSearchActive && (
              <motion.div
                className="fixed inset-0 z-50 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Blurred Background */}
                <motion.div
                  className="absolute inset-0 bg-black/30 backdrop-blur-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={closeFullScreenSearch}
                />

                {/* Search Container */}
                <motion.div
                  className="absolute inset-x-0 top-0 bg-nav border-b border-primary/10 shadow-lg"
                  initial={{ y: "-100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                  <div className="p-4 space-y-4">
                    {/* Header with close button */}
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-primary">Search</h2>
                      <motion.button
                        onClick={closeFullScreenSearch}
                        className="p-2 rounded-full hover:bg-primary/10 text-primary"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </motion.button>
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                      <input
                        ref={fullScreenSearchRef}
                        type="text"
                        placeholder="Search products, brands, categories..."
                        className="w-full h-12 pl-4 pr-12 rounded-full border border-primary/20 
            bg-nav/80 text-primary transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value)
                          if (e.target.value) {
                            setShowSuggestions(true)
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && searchTerm.trim()) {
                            handleSearch()
                            closeFullScreenSearch()
                          }
                        }}
                      />
                      <AnimatePresence>
                        {searchTerm && (
                          <motion.button
                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                            onClick={() => {
                              setSearchTerm("")
                              fullScreenSearchRef.current?.focus()
                            }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                          >
                            <svg
                              className="h-5 w-5 text-primary/60 hover:text-primary transition-colors duration-300"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Search Categories */}
                    <div className="flex overflow-x-auto pb-2 space-x-2 no-scrollbar">
                      {["all", "products", "brands", "categories", "deals"].map((category) => (
                        <motion.button
                          key={category}
                          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors duration-200 ${
                            searchCategory === category
                              ? "bg-primary text-primary-foreground"
                              : "bg-primary/10 text-primary hover:bg-primary/20"
                          }`}
                          onClick={() => handleCategoryChange(category)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </motion.button>
                      ))}
                    </div>

                    {/* Search Button */}
                    <motion.button
                      className={`w-full h-12 rounded-full flex items-center justify-center font-medium
          transition-all duration-300 ${
            theme === "dark" ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"
          }`}
                      onClick={() => {
                        handleSearch()
                        closeFullScreenSearch()
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={!searchTerm.trim()}
                    >
                      <span className="mr-2">Search</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </motion.button>

                    {/* Recent Searches */}
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-primary/70 mb-2">Recent Searches</h3>
                      <div className="space-y-2">
                        {recentSearches.map((search, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center justify-between p-2 hover:bg-primary/5 rounded-lg cursor-pointer transition-colors duration-200"
                            onClick={() => {
                              setSearchTerm(search)
                              handleSearch()
                              closeFullScreenSearch()
                            }}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ x: 3 }}
                          >
                            <div className="flex items-center">
                              <svg
                                className="h-4 w-4 text-primary/40 mr-2"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span className="text-primary">{search}</span>
                            </div>
                            <button
                              className="p-1 rounded-full hover:bg-primary/10 text-primary/40 hover:text-primary/70"
                              onClick={(e) => {
                                e.stopPropagation()
                                // Would remove from recent searches in a real app
                              }}
                            >
                              <svg
                                className="h-3 w-3"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Popular Searches */}
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-primary/70 mb-2">Popular Searches</h3>
                      <div className="flex flex-wrap gap-2">
                        {["Gaming Laptops", "RTX 4090", "Mechanical Keyboards", "SSD", "Monitors"].map((tag, index) => (
                          <motion.button
                            key={tag}
                            className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-sm transition-colors duration-300"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.3,
                              delay: 0.2 + index * 0.05,
                            }}
                            onClick={() => {
                              setSearchTerm(tag)
                              handleSearch()
                              closeFullScreenSearch()
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {tag}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation links row underneath the search bar - only on desktop */}
          <div className="hidden md:flex justify-start py-2 border-t border-primary/10">
            <div className="flex space-x-8">
              {/* Categories Button for Desktop - on the same line as nav links */}
              <motion.button
                onClick={() => {
                  toggleCategories()
                  if (!isCategoriesOpen) {
                    // Set the first category as default selected when opening
                    setSelectedCategory(searchCategories[0]?.name || null)
                  }
                }}
                className="flex items-center text-primary hover:text-accent transition-colors duration-300 focus:outline-none border-transparent border-b-2 hover:border-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  className="h-5 w-5 mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="font-medium">Categories</span>
              </motion.button>

              {/* Navigation Links */}
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="border-transparent text-primary hover-accent inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300 ease-in-out hover:border-primary"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile menu with animation - only for tablet */}
        <div
          className={`transition-all duration-300 ease-in-out transform ${
            isOpen ? "opacity-100 max-h-96" : "opacity-0 max-h-0 overflow-hidden"
          } hidden md:block lg:hidden`}
          id="mobile-menu"
        >
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
                className={`text-primary hover-accent block px-3 py-2 text-base font-medium transform transition-all duration-300 ${
                  isOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </>
  )
}

