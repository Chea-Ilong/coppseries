"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { navItems } from "../Navbar";
import { ThemeToggle } from "../context/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "./auth/AuthContext";
import { useCart } from "./context/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { theme } = useTheme();
  const { isLoggedIn, user, logout } = useAuth();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getCartCount,
  } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Add scroll event listener to detect when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isCartOpen &&
        !event.target.closest("#cartDropdown") &&
        !event.target.closest("#cartButton")
      ) {
        setIsCartOpen(false);
      }
      if (
        isUserMenuOpen &&
        !event.target.closest("#userDropdown") &&
        !event.target.closest("#userButton")
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen, isUserMenuOpen]);

  // Close mobile menu and dropdowns when route changes
  useEffect(() => {
    setIsOpen(false);
    setIsCartOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  // Handle logout with animation
  const handleLogout = () => {
    setIsLoggingOut(true);
    setIsUserMenuOpen(false);

    // Delay the actual logout to allow animation to play
    setTimeout(() => {
      logout();
      navigate("/");
      setIsLoggingOut(false);
    }, 800); // Match this with the animation duration
  };

  // Navigate to checkout
  function handleCheckout() {
    setIsCartOpen(false);
    navigate("/cart");
  }

  // Handle account navigation
  const handleAccountNavigation = () => {
    setIsUserMenuOpen(false);
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/account");
    }
  };

  // Get user's first name or username
  const getUserDisplayName = () => {
    if (!user) return "Account";

    if (user.firstName) {
      return user.firstName;
    } else if (user.name) {
      // If there's a full name, get the first part
      return user.name.split(" ")[0];
    } else if (user.email) {
      // If no name, use the part of email before @
      return user.email.split("@")[0];
    } else {
      return "Account";
    }
  };

  // Debug logging
  console.log("Navbar render - isLoggedIn:", isLoggedIn);
  console.log("Navbar render - user:", user);

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

      <nav
        className={`bg-nav shadow transition-all duration-300 ease-in-out ${isScrolled ? "py-1" : "py-3"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/"
                className="text-xl font-bold text-primary transform transition-transform duration-300 hover:scale-105"
              >
                <img
                  src="src\assets\CS-logo-removebg-preview.png"
                  alt="logo"
                  className="h-12 w-auto transition-all duration-300"
                  style={{ filter: "var(--logo-filter)" }}
                />
              </Link>
            </div>

            {/* Center: Navigation Items - Adjusted for 1024px */}
            <div className="hidden md:flex flex-grow justify-center items-center">
              <div className="flex lg:space-x-8 md:space-x-4">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="border-transparent text-primary hover-accent inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300 ease-in-out hover:border-primary lg:text-base md:text-sm"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center lg:space-x-4 md:space-x-2">
              {/* Search functionality */}
              <div className="flex items-center">
                {/* Desktop search input - adjusted for 1024px */}
                <div className="hidden md:block">
                  <div className="search-container relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="search-input transition-all duration-300 focus:ring-2 focus:ring-primary focus:outline-none lg:w-64 md:w-48"
                      aria-label="Search"
                    />
                    <svg
                      className="h-5 w-5 text-secondary absolute right-2 top-1/2 transform -translate-y-1/2 transition-colors duration-300"
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
                  </div>
                </div>

                {/* Mobile search button and expandable search input */}
                <div className="block md:hidden">
                  {isSearchOpen ? (
                    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm animate-fadeIn">
                      <div className="fixed inset-x-0 top-0">
                        <div className="bg-nav p-4 shadow-lg animate-slideDown">
                          <div className="relative flex items-center max-w-md mx-auto animate-scaleIn">
                            <input
                              type="text"
                              placeholder="Search products..."
                              className="w-full px-4 py-2 text-sm rounded-full 
                                bg-secondary/10 border border-primary/20 
                                text-primary placeholder-primary/50 
                                focus:outline-none focus:ring-2 
                                focus:ring-primary/50 focus:border-transparent
                                transition-all duration-300 ease-in-out"
                              aria-label="Search"
                              autoFocus
                            />
                            <button
                              onClick={() => setIsSearchOpen(false)}
                              className="absolute right-3 p-1.5 rounded-full 
                                hover:bg-primary/10 active:bg-primary/20
                                transition-all duration-300 ease-in-out
                                hover:rotate-90"
                            >
                              <svg
                                className="h-5 w-5 text-primary/70"
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
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsSearchOpen(true)}
                      className="p-2 rounded-full 
                        hover:bg-primary/10 active:bg-primary/20 
                        transition-all duration-300 ease-in-out 
                        hover:scale-110"
                      aria-label="Open search"
                    >
                      <svg
                        className="h-5 w-5 text-primary/70"
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
                    </button>
                  )}
                </div>
              </div>

              {/* Cart dropdown for logged-in users */}
              {isLoggedIn && (
                <div className="relative">
                  <motion.button
                    id="cartButton"
                    onClick={() => {
                      setIsCartOpen(!isCartOpen);
                      setIsUserMenuOpen(false);
                    }}
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
                          className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          key={getCartCount()} // This forces the animation to run when count changes
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
                      {/* Cart dropdown content remains the same */}
                      <div className="px-4 py-2 border-b border-primary/10">
                        <h3 className="text-lg font-medium text-primary">
                          Your Cart
                        </h3>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {cartItems.length > 0 ? (
                          cartItems.map((item, index) => (
                            <div
                              key={index}
                              className="px-4 py-3 border-b border-primary/10"
                            >
                              <div className="flex justify-between mb-1">
                                <Link
                                  to={`/product/${item.id}`}
                                  className="text-sm font-medium text-primary hover:text-accent transition-colors duration-300"
                                >
                                  {item.name}
                                </Link>
                                <span className="text-xs font-medium text-primary/70">
                                  {item.price}
                                </span>
                              </div>
                              <div className="flex justify-between items-center mt-1">
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => {
                                      if (item.quantity > 1) {
                                        updateQuantity(
                                          item.id,
                                          item.quantity - 1
                                        );
                                      } else {
                                        removeFromCart(item.id);
                                      }
                                    }}
                                    className="p-1 rounded-md hover:bg-primary/10 text-primary/70"
                                    aria-label="Decrease quantity"
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
                                        d="M20 12H4"
                                      />
                                    </svg>
                                  </button>
                                  <span className="text-xs font-medium text-primary min-w-[20px] text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity + 1)
                                    }
                                    className="p-1 rounded-md hover:bg-primary/10 text-primary/70"
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
                          <div className="px-4 py-6 text-center text-primary/70">
                            Your cart is empty
                          </div>
                        )}
                      </div>
                      <div className="px-4 py-3 border-t border-primary/10">
                        <div className="flex justify-between mb-3">
                          <span className="font-medium text-primary">
                            Total:
                          </span>
                          <span className="font-bold text-primary">
                            ${getTotalPrice()}
                          </span>
                        </div>
                        <button
                          onClick={handleCheckout}
                          className={`w-full text-center py-2 px-4 rounded-md font-medium transition-all duration-300 ${cartItems.length === 0
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                            } ${theme === "dark"
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

              {/* User account dropdown for logged-in users */}
              {isLoggedIn ? (
                <div className="relative">
                  <motion.button
                    id="userButton"
                    onClick={() => {
                      setIsUserMenuOpen(!isUserMenuOpen);
                      setIsCartOpen(false);
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
                    <span className="hidden md:inline ml-2">
                      {getUserDisplayName()}
                    </span>
                  </motion.button>

                  {/* User menu dropdown content */}
                  {isUserMenuOpen && (
                    <motion.div
                      id="userDropdown"
                      className="absolute right-0 mt-2 w-48 bg-nav shadow-lg rounded-md z-50 border border-primary/10"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ul className="py-2">
                        <li>
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              navigate("/account");
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-primary hover:bg-primary/10 transition-all duration-300"
                          >
                            My Account
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              navigate("/cart");
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-primary hover:bg-primary/10 transition-all duration-300"
                          >
                            My Orders
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              navigate("/settings");
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-primary hover:bg-primary/10 transition-all duration-300"
                          >
                            Settings
                          </button>
                        </li>
                        <li className="border-t border-primary/10">
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-primary hover:bg-primary/10 transition-all duration-300"
                          >
                            Sign Out
                          </button>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </div>
              ) : (
                // Login and Signup buttons when not logged in
                <div className="hidden md:flex items-center lg:space-x-3 md:space-x-2">
                  <Link
                    to="/login"
                    className="lg:px-3 md:px-2 py-1.5 text-sm font-medium text-primary border border-primary/60 rounded-md hover:bg-primary/10 transition-all duration-300 ease-in-out"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className={`lg:px-3 md:px-2 py-1.5 text-sm font-medium rounded-md shadow-sm transition-all duration-300 ease-in-out ${theme === "dark"
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

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-primary hover-accent transition-colors duration-300"
                  aria-controls="mobile-menu"
                  aria-expanded={isOpen}
                  onClick={() => {
                    setIsSearchOpen(false);
                    setIsOpen(!isOpen);
                  }}
                >
                  <span className="sr-only">
                    {isOpen ? "Close menu" : "Open menu"}
                  </span>
                  {isOpen ? (
                    <svg
                      className="h-6 w-6 transition-transform duration-300 rotate-90"
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
                  ) : (
                    <svg
                      className="h-6 w-6 transition-transform duration-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu with animation */}
        <div
          className={`transition-all duration-300 ease-in-out transform ${isOpen
              ? "opacity-100 max-h-96"
              : "opacity-0 max-h-0 overflow-hidden"
            } md:hidden`}
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
                className={`text-primary hover-accent block px-3 py-2 text-base font-medium transform transition-all duration-300 ${isOpen
                    ? "translate-x-0 opacity-100"
                    : "translate-x-8 opacity-0"
                  }`}
              >
                {item.name}
              </a>
            ))}

            {/* Show cart and account links in mobile menu when logged in */}
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/cart");
                  }}
                  style={{
                    transitionDelay: `${navItems.length * 50}ms`,
                  }}
                  className={`text-primary hover-accent flex items-center px-3 py-2 text-base font-medium transform transition-all duration-300 w-full text-left ${isOpen
                      ? "translate-x-0 opacity-100"
                      : "translate-x-8 opacity-0"
                    }`}
                >
                  <svg
                    className="h-5 w-5 mr-2"
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
                  My Cart
                  {getCartCount() > 0 && (
                    <span className="ml-2 bg-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/account");
                  }}
                  style={{
                    transitionDelay: `${(navItems.length + 1) * 50}ms`,
                  }}
                  className={`text-primary hover-accent flex items-center px-3 py-2 text-base font-medium transform transition-all duration-300 w-full text-left ${isOpen
                      ? "translate-x-0 opacity-100"
                      : "translate-x-8 opacity-0"
                    }`}
                >
                  <svg
                    className="h-5 w-5 mr-2"
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
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    transitionDelay: `${(navItems.length + 2) * 50}ms`,
                  }}
                  className={`text-primary hover-accent flex items-center px-3 py-2 text-base font-medium transform transition-all duration-300 w-full text-left ${isOpen
                      ? "translate-x-0 opacity-100"
                      : "translate-x-8 opacity-0"
                    }`}
                >
                  <svg
                    className="h-5 w-5 mr-2"
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
              </>
            ) : (
              /* Login and Signup in mobile menu when not logged in */
              <div className="flex space-x-2 px-3 pt-4 pb-2">
                <Link
                  to="/login"
                  style={{
                    transitionDelay: `${navItems.length * 50}ms`,
                  }}
                  className={`flex-1 text-center px-3 py-2 text-sm font-medium text-primary border border-primary/60 rounded-md hover:bg-primary/10 transition-all duration-300 ${isOpen
                      ? "translate-x-0 opacity-100"
                      : "translate-x-8 opacity-0"
                    }`}
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  style={{
                    transitionDelay: `${(navItems.length + 1) * 50}ms`,
                  }}
                  className={`flex-1 text-center px-3 py-2 text-sm font-medium rounded-md shadow-sm transition-all duration-300 ${isOpen
                      ? "translate-x-0 opacity-100"
                      : "translate-x-8 opacity-0"
                    } ${theme === "dark"
                      ? "bg-white text-black hover:bg-white/90"
                      : "bg-black text-white hover:bg-black/90"
                    }`}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
