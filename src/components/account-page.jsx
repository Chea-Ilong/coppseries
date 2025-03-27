"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Settings, LogOut, User, ShoppingBag } from "lucide-react";
import { useAuth } from "./auth/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function AccountPage() {
  const { user, updateProfile, isLoggedIn, logout } = useAuth();
  const { theme } = useTheme();
  const accountRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  // Load orders from localStorage
  useEffect(() => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      // Sort orders by date (newest first)
      savedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(savedOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    // Detect mobile viewport
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Animate elements on mount
    if (accountRef.current) {
      const elements = accountRef.current.querySelectorAll(".animate-in");
      elements.forEach((el, index) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";

        setTimeout(() => {
          el.style.transition = "all 0.5s ease";
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }, index * 100);
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  if (!isLoggedIn) {
    return (
      <div
        className={`min-h-screen p-8 ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">
            Please log in to view your account
          </h2>
          <Link href="/login" className="text-blue-500 hover:text-blue-600">
            Go to Login
          </Link>
        </div>
      </div>
    );
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
          onClick={() => navigate("/cart")}
          className="flex items-center px-4 py-2 rounded-full whitespace-nowrap bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
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
    );
  };

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
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "text-gray-900"
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
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "text-gray-900"
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
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "text-gray-900"
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
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "text-gray-900"
                  }`}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
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
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-500 hover:text-blue-600"
              >
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
    );
  };

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
                        <Link
                          to={`/product/${item.id}`}
                          className="hover:text-accent hover:underline"
                        >
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
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You haven&apos;t placed any orders yet.
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    );
  };

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
            <button className="text-blue-500 hover:text-blue-600">
              Change Password
            </button>
          </div>

          <div>
            <h3 className="font-medium mb-2">Payment Methods</h3>
            <button className="text-blue-500 hover:text-blue-600">
              Manage Payment Methods
            </button>
          </div>

          <div>
            <h3 className="font-medium mb-2">Shipping Addresses</h3>
            <button className="text-blue-500 hover:text-blue-600">
              Manage Addresses
            </button>
          </div>
        </div>
      </div>
    );
  };

  let content = null;

  if (!isLoggedIn) {
    content = (
      <div
        className={`min-h-screen p-8 ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">
            Please log in to view your account
          </h2>
          <Link href="/login" className="text-blue-500 hover:text-blue-600">
            Go to Login
          </Link>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 animate-in">
          My Account
        </h1>

        {isMobile && renderMobileNavigation()}

        {activeSection === "profile" && renderProfileSection()}
        {activeSection === "orders" && renderOrdersSection()}
        {activeSection === "settings" && renderSettingsSection()}
      </div>
    );
  }

  return (
    <div
      ref={accountRef}
      className={`min-h-screen p-4 md:p-8 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {content}
    </div>
  );
}
