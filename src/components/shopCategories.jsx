"use client"

import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
import { searchCategories } from "./searchCategories"
import gsap from "gsap" // Import gsap

export default function ShopCategories() {
  const { theme } = useTheme()
  const pageRef = useRef(null)

  useEffect(() => {
    if (pageRef.current) {
      // Initial state - hidden
      gsap.set(pageRef.current, { opacity: 0, y: 20 })

      // Animate in
      gsap.to(pageRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      })
    }
  }, [])

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  return (
    <section className="py-8 bg-bg-primary md:py-16 antialiased" ref={pageRef}>
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
        <div className="mb-8 md:mb-12 text-center">
          <motion.h1
            className="text-3xl font-bold text-primary md:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Shop by Category
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-secondary max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Browse our wide selection of tech products across all categories
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {searchCategories.map((category, index) => (
            <motion.div
              key={category.name}
              className={`rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
              variants={itemVariants}
            >
              <div className="relative overflow-hidden group">
                <div
                  className={`h-48 bg-gradient-to-r ${
                    index % 3 === 0
                      ? "from-purple-500 to-indigo-600"
                      : index % 3 === 1
                        ? "from-blue-500 to-teal-400"
                        : "from-red-500 to-orange-500"
                  } flex items-center justify-center`}
                >
                  {/* Category icon or image would go here */}
                  <svg
                    className="w-24 h-24 text-white opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {index % 5 === 0 && (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    )}
                    {index % 5 === 1 && (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    )}
                    {index % 5 === 2 && (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    )}
                    {index % 5 === 3 && (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    )}
                    {index % 5 === 4 && (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    )}
                  </svg>
                </div>
                <motion.div
                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                      className={`px-6 py-2 rounded-full font-medium shadow-lg ${
                        theme === "dark"
                          ? "bg-white text-black hover:bg-white/90"
                          : "bg-black text-white hover:bg-black/90"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View All
                    </motion.button>
                  </div>
                </motion.div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-4">{category.name}</h3>
                <ul className="space-y-2">
                  {category.subcategories.slice(0, 5).map((subcategory, subIndex) => (
                    <motion.li
                      key={subcategory.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 + subIndex * 0.05 }}
                    >
                      <Link
                        to={subcategory.href}
                        className="text-primary/80 hover:text-primary transition-colors duration-300 hover:underline flex items-center"
                      >
                        <span className="text-primary/40 mr-2">•</span>
                        {subcategory.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                {category.subcategories.length > 5 && (
                  <div className="mt-4 text-right">
                    <Link
                      to={`/shop/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-sm text-accent hover:underline"
                    >
                      View all {category.subcategories.length} subcategories →
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-primary mb-6">Popular Collections</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Gaming Essentials",
              "Work From Home",
              "Student Tech",
              "Smart Home",
              "Budget Builds",
              "Premium Picks",
            ].map((collection, index) => (
              <motion.a
                key={collection}
                href={`/collections/${collection.toLowerCase().replace(/\s+/g, "-")}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {collection}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

