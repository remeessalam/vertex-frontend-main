import axios from "axios";
import { getToken } from "./auth";

// Create axios instance with proper base URL detection for Vercel deployment
export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (window.location.hostname === "localhost"
      ? "http://localhost:5001"
      : "https://vertex-backend-main.vercel.app/"),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // Increase timeout to 30 seconds
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors and check success status
api.interceptors.response.use(
  (response) => {
    // Check if the response has a success status field and it's false
    if (response.data && response.data.success === false) {
      // Create an error object with the response data
      const error = new Error(response.data.message || "Operation failed");
      error.response = response;
      return Promise.reject(error);
    }
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    // Enhance error object with more specific message from the response
    if (error.response?.data) {
      // If there's a specific message in the response, use it
      if (error.response.data.message) {
        error.message = error.response.data.message;
      }
      // If there's an error field with more details
      else if (error.response.data.error) {
        error.message = error.response.data.error;
      }
    }

    return Promise.reject(error);
  }
);

// Blog API functions
export const BlogApi = {
  getAllBlogs: (page = 1, limit) => {
    return api.get(`/api/blogs?page=${page}&limit=${limit}`);
  },

  getBlog: (slug) => {
    return api.get(`/api/blogs/slug/${slug}`);
  },

  getBlogById: (id) => {
    return api.get(`/api/blogs/${id}`);
  },

  createBlog: (blogData) => {
    // If blogData is FormData, we need to use different headers
    const headers =
      blogData instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : {};
    return api.post("/api/blogs", blogData, { headers });
  },

  updateBlog: (id, blogData) => {
    // If blogData is FormData, we need to use different headers
    const headers =
      blogData instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : {};
    return api.put(`/api/blogs/${id}`, blogData, { headers });
  },

  deleteBlog: (id) => {
    return api.delete(`/api/blogs/${id}`);
  },

  getFeaturedBlogs: () => {
    return api.get("/api/blogs?isFeatured=true");
  },

  // Get all published blogs (with publish date <= current date)
  getPublishedBlogs: (page = 1, limit = 10) => {
    return api.get(`/api/blogs/published?page=${page}&limit=${limit}`);
  },

  // Get all scheduled blogs (with future publish dates)
  getScheduledBlogs: (page = 1, limit = 10) => {
    return api.get(`/api/blogs/scheduled?page=${page}&limit=${limit}`);
  },
};

// Category API functions
export const CategoryApi = {
  getAllCategories: () => {
    return api.get("/api/categories");
  },

  getCategory: (id) => {
    return api.get(`/api/categories/${id}`);
  },

  createCategory: (categoryData) => {
    return api.post("/api/categories", categoryData);
  },

  updateCategory: (id, categoryData) => {
    return api.put(`/api/categories/${id}`, categoryData);
  },

  deleteCategory: (id) => {
    return api.delete(`/api/categories/${id}`);
  },
};

// Author API functions
export const AuthorApi = {
  getAllAuthors: () => {
    return api.get("/api/authors");
  },

  getAuthor: (id) => {
    return api.get(`/api/authors/${id}`);
  },

  createAuthor: (authorData) => {
    return api.post("/api/authors", authorData);
  },

  updateAuthor: (id, authorData) => {
    return api.put(`/api/authors/${id}`, authorData);
  },

  deleteAuthor: (id) => {
    return api.delete(`/api/authors/${id}`);
  },
};

// Auth API functions
export const AuthApi = {
  login: (email, password) => {
    return api.post("/api/auth/login", { email, password });
  },

  signup: (name, email, password) => {
    return api.post("/api/auth/signup", { name, email, password });
  },

  getProfile: () => {
    return api.get("/api/users/profile");
  },

  updateProfile: (userData) => {
    return api.put("/api/users/profile", userData);
  },
};

// User API functions (admin only)
export const UserApi = {
  getAllUsers: () => {
    return api.get("/api/users");
  },

  deleteUser: (id) => {
    return api.delete(`/api/users/${id}`);
  },
};
