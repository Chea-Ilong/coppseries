"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "./auth/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { useNavigate } from "react-router-dom";

export default function AccountPage() {
  const { user, updateProfile, isLoggedIn, logout } = useAuth()
  const { theme } = useTheme()
  const accountRef = useRef(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    email: user?.email || "",
  })
  const [isMobile, setIsMobile] = useState(false)
  const navigate = useNavigate();

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

        setTimeout(
          () => {
            el.style.transition = "all 0.5s ease"
            el.style.opacity = "1"
            el.style.transform = "translateY(0)"
          },
          index * 100
        )
      })
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateProfile(formData)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleSignOut = () => {
    logout()
    navigate("/login")
  }

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen p-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view your account</h2>
          <Link to="/login" className="text-blue-500 hover:text-blue-600">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div ref={accountRef} className={`min-h-screen p-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 animate-in">My Account</h1>
        
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
                    className="w-full p-2 rounded border text-gray-900"
                  />
                </div>
                <div>
                  <label className="block mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded border text-gray-900"
                  />
                </div>
                <div>
                  <label className="block mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded border text-gray-900"
                  />
                </div>
                <div>
                  <label className="block mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded border text-gray-900"
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
                  <p>{user?.firstName} {user?.lastName}</p>
                </div>
                <div>
                  <p className="font-semibold">Email:</p>
                  <p>{user?.email}</p>
                </div>
                <div>
                  <p className="font-semibold">Phone:</p>
                  <p>{user?.phone || 'Not provided'}</p>
                </div>
              </div>
              {isMobile && (
                <button
                  onClick={handleSignOut}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Sign Out
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}