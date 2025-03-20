import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function AboutUs() {
  const { theme } = useTheme();

  return (
    <div className="bg-bg-primary py-8 md:py-16 antialiased" ref={null}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary text-center">About Us</h1>
          <p className="text-secondary text-center mt-2">
            Learn more about our mission and values.
          </p>
        </div>

        <div className="bg-primary/5 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-primary mb-4">Our Mission</h2>
          <p className="text-secondary mb-6">
            At our company, we strive to provide the best possible products and services to our customers. We believe in innovation, quality, and customer satisfaction. Our mission is to make your life easier and more enjoyable by offering top-notch solutions tailored to your needs.
          </p>

          <h2 className="text-xl font-bold text-primary mb-4">Our Values</h2>
          <ul className="list-disc list-inside text-secondary mb-6">
            <li>Innovation: We constantly seek new ways to improve and innovate.</li>
            <li>Quality: We never compromise on the quality of our products and services.</li>
            <li>Customer Satisfaction: We prioritize your needs and aim to exceed your expectations.</li>
            <li>Integrity: We operate with honesty and transparency in all our dealings.</li>
          </ul>

          <h2 className="text-xl font-bold text-primary mb-4">Our Team</h2>
          <p className="text-secondary mb-6">
            Our team is made up of dedicated professionals who are passionate about what they do. We work together to achieve our goals and make a positive impact on our customers' lives.
          </p>

          <div className="text-center">
            <Link
              to="/"
              className={`inline-flex items-center px-6 py-3 rounded-md font-medium shadow-sm transition-all duration-300 ${
                theme === "dark"
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-black text-white hover:bg-black/90"
              }`}
            >
              Back to Home
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
      </div>
    </div>
  );
}