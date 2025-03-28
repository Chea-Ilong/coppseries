"use client"
import { useState, useEffect, useRef } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { products } from "../MouseSection"
import { gsap } from "gsap"
import { useTheme } from "../context/ThemeContext"
import { useCart } from "../components/context/CartContext"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "./auth/AuthContext"

export default function ProductOverview() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const productRef = useRef(null)
  const { theme } = useTheme()
  const { addToCart } = useCart()
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === Number.parseInt(id))
    setProduct(foundProduct)
  }, [id])

  useEffect(() => {
    if (product && productRef.current) {
      // Initial state - hidden
      gsap.set(productRef.current, { opacity: 0, y: 20 })

      // Animate in
      gsap.to(productRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      })
    }
  }, [product])

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const handleAddToCart = () => {
    // Check if user is logged in
    if (!isLoggedIn) {
      // Show login prompt if user is not logged in
      setShowLoginPrompt(true)
      return
    }

    // Only add to cart if user is logged in
    if (product) {
      addToCart(product, quantity)

      // Show added to cart animation
      setAddedToCart(true)

      // Reset after animation completes
      setTimeout(() => {
        setAddedToCart(false)
      }, 1500)
    }
  }

  const handleLoginRedirect = () => {
    navigate("/login")
  }

  const closeLoginPrompt = () => {
    setShowLoginPrompt(false)
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-primary">Loading...</div>
      </div>
    )
  }

  return (
    <section className="py-8 bg-bg-primary md:py-16 antialiased">
      {/* Enhanced Login Prompt Modal */}
      <AnimatePresence>
        {showLoginPrompt && (
          <motion.div
            className="fixed inset-0 bg-accent/80 backdrop-blur-md z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-card-bg rounded-lg p-6 max-w-md mx-4 shadow-xl border border-border"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex flex-col items-center text-center mb-4">
                <motion.div
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-semibold text-primary">Authentication Required</h3>
                <motion.div
                  className="h-1 w-10 bg-accent mt-2 mb-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: 40 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                />
              </div>

              <p className="text-secondary mb-4 text-center">
                You need to be logged in to add items to your cart.
                <span className="block mt-1 font-medium text-primary">Sign in to continue shopping!</span>
              </p>

              <div className="flex flex-col gap-2 mt-6">
                <motion.button
                  onClick={handleLoginRedirect}
                  className={`w-full px-4 py-2.5 rounded-md bg-accent hover:bg-accent/90 transition-colors flex items-center justify-center ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
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
                  Sign in now
                </motion.button>
                <motion.button
                  onClick={closeLoginPrompt}
                  className="w-full px-4 py-2.5 rounded-md border border-border text-primary hover:bg-bg-primary transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue browsing
                </motion.button>
              </div>

              <div className="mt-4 pt-4 border-t border-border text-center">
                <p className="text-sm text-secondary">
                  Don't have an account?{" "}
                  <motion.a
                    href="/signup"
                    className="text-accent hover:underline font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign up here
                  </motion.a>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
        <div className="mb-6">
          <Link to="/" className="text-accent hover:underline">
            ← Back to Products
          </Link>
        </div>

        <div ref={productRef} className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
          <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
            <img className="w-full rounded-lg" src={product.imageSrc || "/placeholder.svg"} alt={product.imageAlt} />
          </div>

          <div className="mt-6 sm:mt-8 lg:mt-0">
            <h1 className="text-2xl font-semibold text-primary sm:text-3xl">{product.name}</h1>
            <div className="flex items-center justify-between mt-4">
              <p className="text-3xl font-extrabold text-primary sm:text-4xl">{product.price}</p>
              <div className="flex items-center overflow-hidden border border-gray-300 dark:border-gray-700 rounded-md">
                <button
                  onClick={decreaseQuantity}
                  className={`px-3 py-1 text-lg text-primary focus:outline-none transition-all duration-150 ${
                    theme === "light" ? "hover:bg-gray-50" : "hover:bg-gray-800"
                  }`}
                >
                  -
                </button>
                <span className="px-3 py-1 text-primary border-l border-r border-gray-300 dark:border-gray-700">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  className={`px-3 py-1 text-lg text-primary focus:outline-none transition-all duration-150 ${
                    theme === "light" ? "hover:bg-gray-50" : "hover:bg-gray-800"
                  }`}
                >
                  +
                </button>
              </div>
            </div>
            <div className="mt-4 space-y-6">
              <div className="mt-8 relative">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`w-full rounded-md bg-button px-5 py-3 text-base font-medium shadow-sm hover:bg-button-hover focus:outline-none transition-all duration-200 ease-in-out ${
                    theme === "light"
                      ? "text-gray-900 border border-transparent hover:border-gray-300"
                      : "text-white border border-gray-700 hover:border-gray-500"
                  }`}
                >
                  {isLoggedIn && addedToCart ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  ) : (
                    "Add to Cart"
                  )}
                </button>
              </div>
              <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-10">
                <h3 className="text-sm font-medium text-primary mb-4">Description</h3>
                <div className="prose prose-sm text-secondary mb-8">
                  <p>{product.description.overview}</p>
                </div>

                <h3 className="text-sm font-medium text-primary mb-4">Tech Specs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-secondary ">
                  {Object.entries(product.description.specs).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-xs uppercase font-medium">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                      <span className="text-sm">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

