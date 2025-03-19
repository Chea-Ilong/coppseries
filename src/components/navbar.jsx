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
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link 
                to="/" 
                className="text-xl font-bold text-primary transform transition-transform duration-300 hover:scale-105"
              >
                CoppSeries
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="border-transparent text-primary hover-accent inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300 ease-in-out hover:border-primary"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Search functionality */}
            <div className="flex items-center">
              {/* Desktop search input */}
              <div className="hidden sm:block">
                <div className="search-container relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="search-input transition-all duration-300 focus:ring-2 focus:ring-primary focus:outline-none"
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
              <div className="block sm:hidden">
                {isSearchOpen ? (
                  <div className="flex items-center animate-fadeIn">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="search-input transition-all duration-300 focus:ring-2 focus:ring-primary focus:outline-none"
                      aria-label="Search"
                      autoFocus
                    />
                    <button 
                      onClick={() => setIsSearchOpen(false)}
                      className="ml-2 transition-transform duration-300 hover:rotate-90"
                    >
                      <svg
                        className="h-5 w-5 text-secondary"
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
                ) : (
                  <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="transition-transform duration-300 hover:scale-110"
                  >
                    <svg
                      className="h-5 w-5 text-secondary"
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

            {/* Theme toggle */}
            <div className="transition-transform duration-300 hover:scale-110">
              <ThemeToggle />
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden">
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
          isOpen 
            ? "opacity-100 max-h-96" 
            : "opacity-0 max-h-0 overflow-hidden"
        } sm:hidden`}
        id="mobile-menu"
      >
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              style={{ 
                transitionDelay: `${index * 50}ms`
              }}
              className={`text-primary hover-accent block px-3 py-2 text-base font-medium transform transition-all duration-300 ${
                isOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
              }`}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}