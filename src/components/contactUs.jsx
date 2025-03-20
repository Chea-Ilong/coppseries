import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function ContactUs() {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert("Thank you for your message!");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="bg-bg-primary py-8 md:py-16 antialiased" ref={null}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary text-center">Contact Us</h1>
          <p className="text-secondary text-center mt-2">
            We'd love to hear from you! Please fill out the form below to get in touch.
          </p>
        </div>

        <div className="bg-primary/5 p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-primary mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-primary/20 rounded-md bg-transparent text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Your Name"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-primary mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-primary/20 rounded-md bg-transparent text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Your Email"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-primary mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-primary/20 rounded-md bg-transparent text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Your Message"
                rows={4}
              ></textarea>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-black text-white hover:bg-black/90"
                }`}
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}