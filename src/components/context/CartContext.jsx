"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Create the cart context
const CartContext = createContext()

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

// Cart provider component
export const CartProvider = ({ children }) => {
  // Initialize cart state from localStorage if available
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart")
    return savedCart ? JSON.parse(savedCart) : []
  })

  // Save cart state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])

  // Add item to cart
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id)

      if (existingItemIndex >= 0) {
        // If item exists, increase quantity
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + (item.quantity || 1),
        }
        return updatedItems
      } else {
        // If item doesn't exist, add it with quantity 1 (or specified quantity)
        return [...prevItems, { ...item, quantity: item.quantity || 1 }]
      }
    })
  }

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  }

  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)),
    )
  }

  // Clear cart
  const clearCart = () => {
    setCartItems([])
  }

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems
      .reduce((total, item) => {
        // Handle price formats like "$99.99" by removing non-numeric characters
        const price =
          typeof item.price === "string" ? Number.parseFloat(item.price.replace(/[^0-9.]/g, "")) : item.price

        return total + price * item.quantity
      }, 0)
      .toFixed(2)
  }

  // Get cart item count
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  // Value to be provided by the context
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getCartCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

