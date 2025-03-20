"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../components/context/CartContext";
import { useTheme } from "../context/ThemeContext";

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    clearCart,
  } = useCart();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const cartRef = useRef(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  // Animation when component mounts
  useEffect(() => {
    if (cartRef.current) {
      const elements = cartRef.current.querySelectorAll(".animate-in");
      elements.forEach((el, index) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";

        setTimeout(() => {
          el.style.transition = "all 0.5s ease";
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }, 100 + index * 100);
      });
    }
  }, []);

  const handleCheckout = () => {
    // Navigate to checkout page
    navigate("/checkout");
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.toLowerCase() === "discount10") {
      setPromoApplied(true);
      setDiscount(Number.parseFloat(getTotalPrice()) * 0.1);
    } else {
      setPromoApplied(false);
      setDiscount(0);
    }
  };

  const subtotal = Number.parseFloat(getTotalPrice());
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping - discount;

  // If cart is empty, show empty state
  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-in max-w-xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-primary mb-6">
            Your Cart is Empty
          </h1>
          <p className="text-secondary mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link
            to="/"
            className={`inline-flex items-center px-6 py-3 rounded-md font-medium shadow-sm transition-all duration-300 ${
              theme === "dark"
                ? "bg-white text-black hover:bg-white/90"
                : "bg-black text-white hover:bg-black/90"
            }`}
          >
            Continue Shopping
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary py-8 md:py-16 antialiased" ref={cartRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-in mb-8">
          <h1 className="text-3xl font-bold text-primary">Shopping Cart</h1>
          <p className="text-secondary mt-2">
            Review and manage your items before checkout.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="animate-in border border-primary/10 rounded-lg overflow-hidden mb-6">
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-primary/5 text-sm font-medium text-primary">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {cartItems.map((item, index) => {
                // Calculate item total
                const itemPrice = Number.parseFloat(
                  item.price.replace(/[^0-9.]/g, "")
                );
                const itemTotal = itemPrice * item.quantity;

                return (
                  <div
                    key={index}
                    className="animate-in border-t border-primary/10 first:border-t-0"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
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
                          <h3 className="text-primary font-medium">
                            {item.name}
                          </h3>
                          <p className="text-secondary text-sm mt-1 md:hidden">
                            {item.price}
                          </p>
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
                      <div className="hidden md:block md:col-span-2 text-center text-primary">
                        {item.price}
                      </div>

                      {/* Quantity */}
                      <div className="col-span-1 md:col-span-2 flex justify-center">
                        <div className="flex items-center border border-primary/20 rounded-md">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(item.id, item.quantity - 1);
                              } else {
                                removeFromCart(item.id);
                              }
                            }}
                            className={`px-3 py-1 text-lg text-primary focus:outline-none transition-all duration-150 ${
                              theme === "light"
                                ? "hover:bg-gray-50"
                                : "hover:bg-gray-800"
                            }`}
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-primary border-l border-r border-primary/20">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className={`px-3 py-1 text-lg text-primary focus:outline-none transition-all duration-150 ${
                              theme === "light"
                                ? "hover:bg-gray-50"
                                : "hover:bg-gray-800"
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
                );
              })}
            </div>

            <div className="animate-in flex justify-between items-center mb-8">
              <Link
                to="/"
                className="text-accent hover:underline flex items-center"
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
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
            <div className="animate-in border border-primary/10 rounded-lg overflow-hidden bg-primary/5 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-primary mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-primary">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-primary">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-primary">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
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
                <label
                  htmlFor="promo"
                  className="block text-sm font-medium text-primary mb-2"
                >
                  Promo Code
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="promo"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-primary/20 rounded-l-md bg-transparent text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Enter code"
                  />
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-r-md font-medium transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-white text-black hover:bg-white/90"
                        : "bg-black text-white hover:bg-black/90"
                    }`}
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-green-500 text-sm mt-2">
                    Promo code applied successfully!
                  </p>
                )}
              </form>

              <motion.button
                onClick={handleCheckout}
                className={`w-full py-3 px-4 rounded-md font-medium shadow-sm transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-black text-white hover:bg-black/90"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Proceed to Checkout
              </motion.button>

              <div className="mt-4 text-center text-sm text-secondary">
                <p>Secure checkout powered by Stripe</p>
                <div className="flex justify-center space-x-2 mt-2">
                  <svg
                    className="h-6 w-auto"
                    viewBox="0 0 36 24"
                    aria-hidden="true"
                  >
                    <rect width="36" height="24" rx="4" fill="#1434CB" />
                    <path
                      d="M10.5 16.5H13L14.5 7.5H12L10.5 16.5Z"
                      fill="white"
                    />
                    <path
                      d="M17.25 7.5L15 16.5H17.25L19.5 7.5H17.25Z"
                      fill="white"
                    />
                    <path
                      d="M22.5 7.5L21 12L20.25 7.5H18L20.25 16.5H22.5L25.5 7.5H22.5Z"
                      fill="white"
                    />
                  </svg>
                  <svg
                    className="h-6 w-auto"
                    viewBox="0 0 36 24"
                    aria-hidden="true"
                  >
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
                  <svg
                    className="h-6 w-auto"
                    viewBox="0 0 36 24"
                    aria-hidden="true"
                  >
                    <rect width="36" height="24" rx="4" fill="#5A5A5A" />
                    <path
                      d="M18 6.5V19.5M11.5 13H24.5"
                      stroke="white"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
