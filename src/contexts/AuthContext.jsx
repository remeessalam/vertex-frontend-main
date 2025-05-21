import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  setToken,
  getToken,
  clearToken,
  isAuthenticated as authCheck,
  setUserInfo,
  clearUserInfo,
} from "../lib/auth";
import { AuthApi } from "../lib/api";
import { useProfileQuery } from "../hooks/useAuthQuery";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Use Tanstack Query to fetch user profile
  const { 
    data: profileData,
    isLoading: profileLoading,
    isError: profileError,
    error
  } = useProfileQuery();
  
  // Set user state based on profile data
  useEffect(() => {
    if (profileData) {
      setUser(profileData);
    } else if (profileError) {
      console.error("Profile error:", error);
      // Handle 401 errors
      if (error?.response?.status === 401) {
        clearToken();
        setUser(null);
      }
    }
  }, [profileData, profileError, error]);
  
  // Combined loading state
  const loading = profileLoading;

  const login = async (email, password) => {
    try {
      const response = await AuthApi.login(email, password);
      
      // Check for success status
      if (response.data.success === false) {
        throw new Error(response.data.message || "Login failed");
      }
      
      const { token, user: userData } = response.data;

      // Create user object
      const userObj = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      };

      // Save token and user info
      setToken(token);
      setUserInfo(userObj); // Store user info in localStorage
      setUser(userObj);
      
      // Invalidate and refetch profile query
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });

      toast.success("Login successful");

      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Invalid credentials. Please try again.");
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await AuthApi.signup(name, email, password);
      
      // Check for success status
      if (response.data.success === false) {
        throw new Error(response.data.message || "Signup failed");
      }
      
      toast.success("Account created successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || error.response?.data?.message || "Signup failed");
      throw error;
    }
  };

  const logout = () => {
    clearToken(); // This also clears user info
    setUser(null);
    
    // Reset auth queries
    queryClient.invalidateQueries({ queryKey: ['auth'] });
    
    // Also reset blog queries to ensure fresh data on next login
    queryClient.invalidateQueries({ queryKey: ['blogs'] });
    
    toast.info("You have been logged out");
    navigate("/login");
  };

  // Calculate authentication status based on user state
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        login,
        signup,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
