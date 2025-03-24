"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../components/context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../components/auth/AuthContext";

export default function CheckoutPage() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    paymentMethod: "credit-card",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const subtotal = Number.parseFloat(getTotalPrice());
  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderComplete) {
      navigate("/cart");
    }
  }, [cartItems, navigate, orderComplete]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "Zip code is required";
    
    if (formData.paymentMethod === "credit-card") {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = "Card number is required";
      if (!formData.cardName.trim()) newErrors.cardName = "Name on card is required";
      if (!formData.expiryDate.trim()) newErrors.expiryDate = "Expiry date is required";
      if (!formData.cvv.trim()) newErrors.cvv = "CVV is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstError = document.querySelector(".error-message");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    
    // Process order
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      // Generate a random order ID
      const newOrderId = Math.floor(100000 + Math.random() * 900000).toString();
      setOrderId(newOrderId);
      
      // Save order to local storage for "My Orders" page
      const orderDate = new Date().toISOString();
      const newOrder = {
        id: newOrderId,
        date: orderDate,
        items: cartItems,
        total: total.toFixed(2),
        status: "Processing",
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod === "credit-card" ? "Credit Card" : "PayPal",
      };
      
      // Get existing orders or initialize empty array
      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      localStorage.setItem("orders", JSON.stringify([...existingOrders, newOrder]));
      
      // Clear cart and show success
      clearCart();
      setIsProcessing(false);
      setOrderComplete(true);
    }, 2000);
  };

  if (orderComplete) {
    return (
      <div className="bg-bg-primary py-8 md:py-16 antialiased">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
              <svg 
                className="w-8 h-8 text-green-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-primary mb-4">Order Confirmed!</h1>
            <p className="text-secondary mb-6">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            <div className="bg-primary/5 rounded-lg p-6 mb-8 inline-block">
              <p className="text-primary font-medium">Order Number:</p>
              <p className="text-2xl font-bold text-primary">{orderId}</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/my-orders"
                className={`px-6 py-3 rounded-md font-medium shadow-sm transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-black text-white hover:bg-black/90"
                }`}
              >
                View My Orders
              </Link>
              <Link
                to="/"
                className="px-6 py-3 rounded-md font-medium border border-primary/20 hover:bg-primary/5 transition-all duration-300"
              >
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary py-8 md:py-16 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Checkout</h1>
          <p className="text-secondary mt-2">
            Complete your purchase by providing your shipping and payment details.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="border border-primary/10 rounded-lg overflow-hidden">
                <div className="bg-primary/5 p-4 border-b border-primary/10">
                  <h2 className="text-lg font-medium text-primary">Contact Information</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-primary mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${
                          errors.firstName ? "border-red-500" : "border-primary/20"
                        } rounded-md bg-transparent text-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-500 error-message">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-primary mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${
                          errors.lastName ? "border-red-500" : "border-primary/20"
                        } rounded-md bg-transparent text-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-500 error-message">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        errors.email ? "border-red-500" : "border-primary/20"
                      } rounded-md bg-transparent text-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500 error-message">{errors.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="border border-primary/10 rounded-lg overflow-hidden">
                <div className="bg-primary/5 p-4 border-b border-primary/10">
                  <h2 className="text-lg font-medium text-primary">Shipping Address</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-primary mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        errors.address ? "border-red-500" : "border-primary/20"
                      } rounded-md bg-transparent text-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-500 error-message">{errors.address}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-primary mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${
                          errors.city ? "border-red-500" : "border-primary/20"
                        } rounded-md bg-transparent text-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-500 error-message">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-primary mb-1">
                        State / Province
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${
                          errors.state ? "border-red-500" : "border-primary/20"
                        } rounded-md bg-transparent text-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
                      />
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-500 error-message">{errors.state}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-primary mb-1">
                        ZIP / Postal Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${
                          errors.zipCode ? "border-red-500" : "border-primary/20"
                        } rounded-md bg-transparent text-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
                      />
                      {errors.zipCode && (
                        <p className="mt-1 text-sm text-red-500 error-message">{errors.zipCode}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-primary mb-1">
                        Country
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-primary/20 rounded-md bg-transparent text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Japan">Japan</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="border border-primary/10 rounded-lg overflow-hidden">
                <div className="bg-primary/5 p-4 border-b border-primary/10">
                  <h2 className="text-lg font-medium text-primary">Payment Method</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex flex-col space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit-card"
                        checked={formData.paymentMethod === "credit-card"}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary"
                      />
                      <span className="text-primary">Credit Card</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={formData.paymentMethod === "paypal"}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary"
                      />
                      <span className="text-primary">PayPal</span>
                    </label>
                  </div>

                  {formData.paymentMethod === "credit-card" && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-primary mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          placeholder="1234 5678 9012 3456"
                          className={`w-full px-3 py-2 border ${
                            errors.cardNumber ? "border-red-500" : "border-primary/20"
                          } rounded-md bg-transparent text-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
                        />
                        {errors.cardNumber && (
                          <p className="mt-1 text-sm text-red-500 error-message">{errors.cardNumber}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="cardName" className="block text-sm font-medium text-primary mb-1">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 border ${
                            errors.cardName ? "border-red-500" : "border-primary/20"
                          } rounded-md bg-transparent text-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
                        />
                        {errors.cardName && (
                          <p className="mt-1 text-sm text-red-500 error-message">{errors.cardName}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expiryDate" className="block text-sm font-medium text-primary mb-1">
                            Expiry Date (MM/YY)
                          </label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            placeholder="MM/YY"
                            className={`w-full px-3 py-2 border ${
                              errors.expiryDate ? "border-red-500" : "border-primary/20"
                            } rounded-md bg-transparent text-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
                          />
                          {errors.expiryDate && (
                            <p className="mt-1 text-sm text-red-500 error-message">{errors.expiryDate}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium text-primary mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            placeholder="123"
                            className={`w-full px-3 py-2 border ${
                              errors.cvv ? "border-red-500" : "border-primary/20"
                            } rounded-md bg-transparent text-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
                          />
                          {errors.cvv && (
                            <p className="mt-1 text-sm text-red-500 error-message">{errors.cvv}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === "paypal" && (
                    <div className="mt-4 p-4 bg-primary/5 rounded-md">
                      <p className="text-primary">
                        You will be redirected to PayPal to complete your purchase securely.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:hidden">
                <OrderSummary 
                  cartItems={cartItems}
                  subtotal={subtotal}
                  tax={tax}
                  shipping={shipping}
                  total={total}
                  isProcessing={isProcessing}
                />
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-primary/10">
                <Link
                  to="/cart"
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
                  Return to Cart
                </Link>
                <motion.button
                  type="submit"
                  className={`py-3 px-6 rounded-md font-medium shadow-sm transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-white text-black hover:bg-white/90"
                      : "bg-black text-white hover:bg-black/90"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    "Complete Order"
                  )}
                </motion.button>
              </div>
            </form>
          </div>

          {/* Order Summary - Desktop */}
          <div className="hidden lg:block lg:col-span-4">
            <OrderSummary 
              cartItems={cartItems}
              subtotal={subtotal}
              tax={tax}
              shipping={shipping}
              total={total}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Order Summary Component
function OrderSummary({ cartItems, subtotal, tax, shipping, total, isProcessing }) {
  return (
    <div className="border border-primary/10 rounded-lg overflow-hidden bg-primary/5 p-6 sticky top-24">
      <h2 className="text-xl font-bold text-primary mb-4">Order Summary</h2>
      
      <div className="max-h-60 overflow-y-auto mb-4">
        {cartItems.map((item, index) => (
          <div key={index} className="flex items-center py-3 border-b border-primary/10 last:border-b-0">
            <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden border border-primary/10">
              <img
                src={item.imageSrc || "/placeholder.svg"}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-primary font-medium text-sm">{item.name}</h3>
              <p className="text-secondary text-xs">Qty: {item.quantity}</p>
            </div>
            <div className="text-primary font-medium">
              ${(Number.parseFloat(item.price.replace(/[^0-9.]/g, "")) * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
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
        <div className="border-t border-primary/10 pt-3 mt-3">
          <div className="flex justify-between font-bold text-primary text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="text-center text-sm text-secondary">
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
            <path d="M18 19.5C21.5899 19.5 24.5 16.5899 24.5 13C24.5 9.41015 21.5899 6.5 18 6.5C14.4101 6.5 11.5 9.41015 11.5 13C11.5 16.5899 14.4101 19.5 18 19.5Z" fill="#EB001B" />
            <path d="M18 19.5C21.5899 19.5 24.5 16.5899 24.5 13C24.5 9.41015 21.5899 6.5 18 6.5" fill="#F79E1B" />
          </svg>
          <svg className="h-6 w-auto" viewBox="0 0 36 24" aria-hidden="true">
            <rect width="36" height="24" rx="4" fill="#5A5A5A" />
            <path d="M18 6.5V19.5M11.5 13H24.5" stroke="white" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}
