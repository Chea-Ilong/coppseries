import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { navItems } from "../Navbar";
import { ThemeToggle } from "../context/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useTheme();

  // Add scroll event listener to detect when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`bg-nav shadow transition-all duration-300 ease-in-out ${
        isScrolled ? "py-1" : "py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-primary transform transition-transform duration-300 hover:scale-105"
            >
              <img
                src="src\assets\CS-logo-removebg-preview.png"
                alt="logo"
                className="h-12 w-auto transition-all duration-300"
                style={{ filter: "var(--logo-filter)" }}
              />
            </Link>
          </div>

          {/* Center: Navigation Items - Adjusted for 1024px */}
          <div className="hidden md:flex flex-grow justify-center items-center">
            <div className="flex lg:space-x-8 md:space-x-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="border-transparent text-primary hover-accent inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300 ease-in-out hover:border-primary lg:text-base md:text-sm"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center lg:space-x-4 md:space-x-2">
            {/* Search functionality */}
            <div className="flex items-center">
              {/* Desktop search input - adjusted for 1024px */}
              <div className="hidden md:block">
                <div className="search-container relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="search-input transition-all duration-300 focus:ring-2 focus:ring-primary focus:outline-none lg:w-64 md:w-48"
                    aria-label="Search"
                  />
                  <svg
                    className="h-5 w-5 text-secondary absolute right-2 top-1/2 transform -translate-y-1/2 transition-colors duration-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Mobile search button and expandable search input */}
              <div className="block md:hidden">
                {isSearchOpen ? (
                  <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm animate-fadeIn">
                    <div className="fixed inset-x-0 top-0">
                      <div className="bg-nav p-4 shadow-lg animate-slideDown">
                        <div className="relative flex items-center max-w-md mx-auto animate-scaleIn">
                          <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full px-4 py-2 text-sm rounded-full 
                bg-secondary/10 border border-primary/20 
                text-primary placeholder-primary/50 
                focus:outline-none focus:ring-2 
                focus:ring-primary/50 focus:border-transparent
                transition-all duration-300 ease-in-out"
                            aria-label="Search"
                            autoFocus
                          />
                          <button
                            onClick={() => setIsSearchOpen(false)}
                            className="absolute right-3 p-1.5 rounded-full 
                hover:bg-primary/10 active:bg-primary/20
                transition-all duration-300 ease-in-out
                hover:rotate-90"
                          >
                            <svg
                              className="h-5 w-5 text-primary/70"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 rounded-full 
        hover:bg-primary/10 active:bg-primary/20 
        transition-all duration-300 ease-in-out 
        hover:scale-110"
                    aria-label="Open search"
                  >
                    <svg
                      className="h-5 w-5 text-primary/70"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Login and Signup buttons - adjusted for 1024px */}
            <div className="hidden md:flex items-center lg:space-x-3 md:space-x-2">
              <Link
                to="/login"
                className="lg:px-3 md:px-2 py-1.5 text-sm font-medium text-primary border border-primary/60 rounded-md hover:bg-primary/10 transition-all duration-300 ease-in-out"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className={`lg:px-3 md:px-2 py-1.5 text-sm font-medium rounded-md shadow-sm transition-all duration-300 ease-in-out ${
                  theme === 'dark' 
                    ? 'bg-white text-black hover:bg-white/90' 
                    : 'bg-black text-white hover:bg-black/90'
                }`}
              >
                Sign Up
              </Link>
            </div>

            {/* Theme toggle */}
            <div className="transition-transform duration-300 hover:scale-110">
              <ThemeToggle />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-primary hover-accent transition-colors duration-300"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
                onClick={() => {
                  setIsSearchOpen(false);
                  setIsOpen(!isOpen);
                }}
              >
                <span className="sr-only">
                  {isOpen ? "Close menu" : "Open menu"}
                </span>
                {isOpen ? (
                  <svg
                    className="h-6 w-6 transition-transform duration-300 rotate-90"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 transition-transform duration-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu with animation */}
      <div
        className={`transition-all duration-300 ease-in-out transform ${
          isOpen ? "opacity-100 max-h-96" : "opacity-0 max-h-0 overflow-hidden"
        } md:hidden`}
        id="mobile-menu"
      >
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              style={{
                transitionDelay: `${index * 50}ms`,
              }}
              className={`text-primary hover-accent block px-3 py-2 text-base font-medium transform transition-all duration-300 ${
                isOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
              }`}
            >
              {item.name}
            </a>
          ))}
          {/* Login and Signup in mobile menu */}
          <div className="flex space-x-2 px-3 pt-4 pb-2">
            <Link
              to="/login"
              style={{
                transitionDelay: `${navItems.length * 50}ms`,
              }}
              className={`flex-1 text-center px-3 py-2 text-sm font-medium text-primary border border-primary/60 rounded-md hover:bg-primary/10 transition-all duration-300 ${
                isOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
              }`}
            >
              Log In
            </Link>
            <Link
              to="/signup"
              style={{
                transitionDelay: `${(navItems.length + 1) * 50}ms`,
              }}
              className={`flex-1 text-center px-3 py-2 text-sm font-medium rounded-md shadow-sm transition-all duration-300 ${
                isOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
              } ${
                theme === 'dark' 
                  ? 'bg-white text-black hover:bg-white/90' 
                  : 'bg-black text-white hover:bg-black/90'
              }`}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}