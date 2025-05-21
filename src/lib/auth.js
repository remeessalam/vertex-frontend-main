// Use the same token key across the application
const TOKEN_KEY = "auth_token";

// Helper function to check if a string is base64 encoded
export const isBase64 = (str) => {
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
};

// Helper function to check if a string is a JWT token
export const isJWT = (str) => {
  return /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/.test(str);
};

// Helper function to decode a token payload
export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    if (isBase64(token)) {
      // Handle base64 encoded tokens
      return JSON.parse(atob(token));
    } else if (isJWT(token)) {
      // Handle JWT tokens
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      // Add padding if needed
      const padding = '='.repeat((4 - base64.length % 4) % 4);
      const jsonPayload = window.atob(base64 + padding);
      return JSON.parse(jsonPayload);
    }
    
    // Try one more approach for JWT tokens
    try {
      // Some JWT implementations might need special handling
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = parts[1];
        // Add padding
        const paddedPayload = payload + '==='.slice(0, (4 - payload.length % 4) % 4);
        const decoded = window.atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
      }
    } catch (e) {
      console.warn("Secondary JWT parsing failed:", e);
    }
    
    return null;
  } catch (error) {
    console.error("Token decoding error:", error);
    return null;
  }
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  clearUserInfo(); // Also clear user info
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = decodeToken(token);
    
    if (payload) {
      if (!payload.exp) return true; // If no expiry, assume valid
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < expiry;
    }

    // For other token formats, assume valid but log a warning
    console.warn("Unknown token format, assuming valid");
    return true;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};

export const isAdmin = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = decodeToken(token);
    
    if (payload) {
      return payload.role === "admin";
    }

    return false; // Default to false for unknown token formats
  } catch (error) {
    console.error("Error validating admin status:", error);
    return false;
  }
};

// Debug function to help troubleshoot token issues
export const debugToken = () => {
  const token = getToken();
  if (!token) {
    console.log("No token found");
    return null;
  }

  console.log("Token:", token);
  
  try {
    const payload = decodeToken(token);
    console.log("Decoded payload:", payload);
    return payload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Store user info in localStorage for persistence across refreshes
export const setUserInfo = (userInfo) => {
  if (!userInfo) return;
  localStorage.setItem('user_info', JSON.stringify(userInfo));
};

// Clear user info from localStorage
export const clearUserInfo = () => {
  localStorage.removeItem('user_info');
};

export const getUserInfo = () => {
  // First try to get user info from localStorage
  const storedUserInfo = localStorage.getItem('user_info');
  if (storedUserInfo) {
    try {
      return JSON.parse(storedUserInfo);
    } catch (e) {
      console.error("Error parsing stored user info:", e);
    }
  }

  // If no stored user info, try to get from token
  const token = getToken();
  if (!token) return null;

  try {
    const payload = decodeToken(token);
    
    if (!payload) {
      console.warn("Could not decode token payload");
      return null; // Unknown token format
    }

    // Log the payload to help with debugging
    console.log("Token payload for user info:", payload);

    // For our specific backend, the token only contains the user ID
    // We can't extract other user details from it
    if (payload.id) {
      return {
        id: payload.id,
        // We don't have these values in the token
        name: null,
        email: null,
        role: null
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
};
