import { createContext, useContext, useState, useEffect } from "react";

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  // Initialize auth state from localStorage if available
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedAuth = localStorage.getItem("auth");
    return savedAuth ? JSON.parse(savedAuth).isLoggedIn : false;
  });
  
  const [user, setUser] = useState(() => {
    const savedAuth = localStorage.getItem("auth");
    return savedAuth ? JSON.parse(savedAuth).user : null;
  });

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify({ isLoggedIn, user }));
  }, [isLoggedIn, user]);

  // Login function
  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  // Register function
  const register = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  // Update user profile
  const updateProfile = (updatedData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedData
    }));
  };

  // Value to be provided by the context
  const value = {
    isLoggedIn,
    user,
    login,
    logout,
    register,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
