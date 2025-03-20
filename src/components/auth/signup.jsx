"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "./AuthContext"

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      // First try to connect to the mock server
      try {
        const response = await fetch("http://localhost:3002/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
          }),
          // Set a timeout to avoid waiting too long if server is down
          signal: AbortSignal.timeout(5000), // Increased timeout to 5 seconds
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || "Signup failed")
        }

        const data = await response.json()
        console.log("User created successfully:", data)

        // Show success animation
        setIsSuccess(true)

        // Wait for animation to complete
        setTimeout(() => {
          // Auto login after successful signup
          login(data.token)

          // Navigate to home page
          navigate("/")
        }, 1500)

        return
      } catch (serverError) {
        console.log("Server error, falling back to client-side solution:", serverError)
        // If server connection fails, fall back to client-side solution
      }

      // Client-side fallback solution
      // Simulate a delay for the loading state
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Log signup attempt
      console.log("Signup attempt with:", formData)

      // Create a mock token
      const mockToken = "test-token-" + Date.now()

      // Show success animation
      setIsSuccess(true)

      // Wait for animation to complete
      setTimeout(() => {
        // Use the login function from AuthContext
        login(mockToken)

        // Navigate to home page
        navigate("/")
      }, 1500)
    } catch (err) {
      setError(err.message || "An error occurred during signup")
      setIsSuccess(false)
    } finally {
      if (!isSuccess) {
        setIsLoading(false)
      }
    }
  }

  return (
    <motion.section
      className="bg-bg-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Success Animation Overlay */}
      <AnimatePresence>
        {isSuccess && (
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
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mb-4 text-green-500"
              >
                <svg
                  className="w-16 h-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </motion.div>
              <motion.h2
                className="text-xl font-bold text-primary mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Account Created!
              </motion.h2>
              <motion.p
                className="text-secondary text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Welcome aboard! You're being logged in...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="flex flex-col items-center justify-center px-6 py-4 mx-auto min-h-[calc(100vh-80px)] lg:py-0"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <motion.a
          href="#"
          className="flex items-center mb-4 text-2xl font-semibold text-primary"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <img
            src="src\assets\CS-logo-removebg-preview.png"
            alt="logo"
            className="h-24 w-auto transition-all duration-300"
            style={{ filter: "var(--logo-filter)" }}
          />
        </motion.a>
        <motion.div
          className="w-full bg-card-bg rounded-lg shadow border border-border md:mt-0 sm:max-w-md xl:p-0"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <motion.h1
              className="text-xl font-bold leading-tight tracking-tight text-primary md:text-2xl"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              Create an account
            </motion.h1>
            {error && (
              <motion.div
                className="text-red-600 bg-red-100 p-3 rounded-lg text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.div>
            )}
            <motion.form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <div>
                <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-primary">
                  Your full name
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="bg-input-bg border border-input-border text-primary rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  placeholder="Tep Piseth"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-primary">
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-input-bg border border-input-border text-primary rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-primary">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="bg-input-bg border border-input-border text-primary rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-primary">
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="bg-input-bg border border-input-border text-primary rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  required
                />
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5 relative">
                  <motion.input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={formData.terms}
                    onChange={handleChange}
                    className="appearance-none peer w-4 h-4 border-2 border-input-border rounded bg-input-bg 
                    focus:ring-2 focus:ring-accent cursor-pointer
                    transition-all duration-300 ease-in-out
                    checked:border-accent hover:border-accent
                    relative z-10"
                    whileTap={{ scale: 0.9 }}
                    required
                  />
                  <motion.div
                    className="absolute inset-0 z-20 pointer-events-none"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: formData.terms ? 1 : 0,
                      opacity: formData.terms ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg className="w-4 h-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z" />
                    </svg>
                  </motion.div>
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="terms"
                    className="text-secondary hover:text-primary cursor-pointer 
                    transition-all duration-300 ease-in-out
                    select-none"
                  >
                    I accept the{" "}
                    <a href="#" className="text-accent hover:underline">
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              <motion.button
                type="submit"
                disabled={isLoading || isSuccess}
                className={`w-full bg-primary hover:bg-primary/80 focus:ring-4 focus:outline-none focus:ring-accent/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-300 border-2 border-border ${
                  isLoading || isSuccess ? "opacity-70 cursor-not-allowed" : ""
                }`}
                whileHover={{ scale: isLoading || isSuccess ? 1 : 1.01 }}
                whileTap={{ scale: isLoading || isSuccess ? 1 : 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating account...
                  </div>
                ) : (
                  "Create account"
                )}
              </motion.button>
              <p className="text-sm font-light text-primary">
                Already have an account?{" "}
                <motion.a
                  href="login"
                  className="font-medium text-accent hover:underline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign in
                </motion.a>
              </p>
            </motion.form>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

export default SignUp

