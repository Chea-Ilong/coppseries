import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ForgetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        // Clear the form
        setFormData({ email: "" });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Password reset request failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <motion.section 
      className="bg-bg-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
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
              Reset your password
            </motion.h1>
            <motion.p
              className="text-sm text-secondary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              Enter your email and we'll send you instructions to reset your password
            </motion.p>
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
            {success && (
              <motion.div 
                className="text-green-600 bg-green-100 p-3 rounded-lg text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Password reset instructions have been sent to your email.
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
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-primary"
                >
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
              <motion.button
                type="submit"
                className="w-full bg-primary hover:bg-primary/80 focus:ring-4 focus:outline-none focus:ring-accent/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-300 border-2 border-border"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                Send reset link
              </motion.button>
              <div className="flex items-center justify-between">
                <motion.a 
                  href="login" 
                  className="text-sm font-medium text-accent hover:underline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back to login
                </motion.a>
                <motion.a 
                  href="signup" 
                  className="text-sm font-medium text-accent hover:underline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign up
                </motion.a>
              </div>
            </motion.form>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default ForgetPassword;