import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BlogApi } from "@/lib/api";
import { formatDate } from "@/lib/dateUtils";

// Query key factory
const blogKeys = {
  all: ["blogs"],
  detail: (id) => [...blogKeys.all, id],
  dashboard: () => [...blogKeys.all, "dashboard"],
};

// Get all blogs
export const useAllBlogsQuery = () => {
  return useQuery({
    queryKey: blogKeys.all,
    queryFn: () => BlogApi.getAllBlogs(),
    select: (response) => {
      // Check for success status
      if (response.data.success === false) {
        throw new Error(response.data.message || "Failed to fetch blogs");
      }
      return response.data.blogs || [];
    },
  });
};

// Get dashboard data (recent blogs and stats)
export const useDashboardQuery = () => {
  return useQuery({
    queryKey: blogKeys.dashboard(),
    queryFn: async () => {
      // Fetch recent blogs
      const recentBlogsResponse = await BlogApi.getAllBlogs(1, 5);

      // Check for success status
      if (recentBlogsResponse.data.success === false) {
        throw new Error(
          recentBlogsResponse.data.message || "Failed to fetch recent blogs"
        );
      }

      const { blogs, totalCount } = recentBlogsResponse.data;

      return {
        totalBlogs: totalCount,
        recentBlogs: blogs.map((blog) => ({
          id: blog._id,
          title: blog.title,
          createdAt: formatDate(blog.createdAt),
          publishDate: blog.publishDate
            ? formatDate(blog.publishDate)
            : formatDate(blog.createdAt),
          // Flag to check if dates are different
          hasCustomPublishDate:
            blog.publishDate &&
            new Date(blog.publishDate).toDateString() !==
              new Date(blog.createdAt).toDateString(),
          slug: blog.slug,
        })),
      };
    },
  });
};

// Get a single blog by ID
export const useBlogQuery = (blogId) => {
  return useQuery({
    queryKey: blogKeys.detail(blogId),
    queryFn: () => BlogApi.getBlogById(blogId),
    enabled: !!blogId, // Only run the query if blogId exists
    select: (response) => {
      // Check for success status
      if (response.data.success === false) {
        throw new Error(response.data.message || "Failed to fetch blog");
      }

      // Extract the blog data, handling the case where it might be in a nested property
      const blog = response.data.blog || response.data;

      // Create the transformed data object
      const transformedData = {
        title: blog.title || "",
        slug: blog.slug || "",
        content: blog.content || "",
        metaDescription: blog.metaDescription || "",
        metaKeywords: Array.isArray(blog.metaKeywords)
          ? blog.metaKeywords.join(", ")
          : blog.metaKeywords || "",
        imageUrl: blog.imageUrl || null,
        imageAlt: blog.imageAlt || "",
        // Add missing fields
        isFeatured: blog.isFeatured === true, // Ensure it's a boolean
        categoryId: blog.categoryId?._id || blog.categoryId || "",
        authorId: blog.authorId?._id || "", // Also store the author ID
        tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "",
        excerpt: blog.excerpt || "",
        publishDate: blog.publishDate || new Date().toISOString(),
      };

      return transformedData;
    },
  });
};

// Create a new blog
export const useCreateBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogData) => {
      const response = await BlogApi.createBlog(blogData);
      // Check for success status
      if (response.data && response.data.success === false) {
        throw new Error(response.data.message || "Failed to create blog");
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      toast.success("Blog created successfully");
    },
    onError: (error) => {
      // Get the most specific error message available
      const errorMessage = 
        error.response?.data?.message || // First try to get message from response data
        error.message || // Then try the error object's message
        "Failed to create blog"; // Fallback message
      
      toast.error(errorMessage);
      console.error("Create blog error:", error);
    },
  });
};

// Update an existing blog
export const useUpdateBlogMutation = (blogId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogData) => {
      const response = await BlogApi.updateBlog(blogId, blogData);
      // Check for success status
      if (response.data && response.data.success === false) {
        throw new Error(response.data.message || "Failed to update blog");
      }
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(blogId) });
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      toast.success("Blog updated successfully");
    },
    onError: (error) => {
      // Get the most specific error message available
      const errorMessage = 
        error.response?.data?.message || // First try to get message from response data
        error.message || // Then try the error object's message
        "Failed to update blog"; // Fallback message
      
      toast.error(errorMessage);
      console.error("Update blog error:", error);
    },
  });
};

// Delete a blog
export const useDeleteBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogId) => {
      const response = await BlogApi.deleteBlog(blogId);
      // Check for success status
      if (response.data && response.data.success === false) {
        throw new Error(response.data.message || "Failed to delete blog");
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      toast.success("Blog deleted successfully");
    },
    onError: (error) => {
      // Get the most specific error message available
      const errorMessage = 
        error.response?.data?.message || // First try to get message from response data
        error.message || // Then try the error object's message
        "Failed to delete blog"; // Fallback message
      
      toast.error(errorMessage);
      console.error("Delete blog error:", error);
    },
  });
};
