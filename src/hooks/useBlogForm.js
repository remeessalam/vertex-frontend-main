import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateSlugFromTitle, createImagePreview } from "@/lib/imageUtils";
import {
  useBlogQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
} from "./useBlogQuery";
import { toast } from "sonner";

/**
 * @deprecated This hook is deprecated. Use Tanstack Query directly in the component instead.
 * See BlogForm.jsx for the new implementation using useBlogQuery, useCreateBlogMutation, and useUpdateBlogMutation.
 */
export const useBlogForm = (blogId) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    metaDescription: "",
    metaKeywords: "",
    isFeatured: false,
    authorId: "",
    categoryId: "",
    tags: "",
    excerpt: "",
    imageAlt: "",
    publishDate: new Date().toISOString().split('T')[0], // Default to today's date in YYYY-MM-DD format
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const isEditing = !!blogId;

  // Use Tanstack Query to fetch blog data
  const {
    data: blogData,
    isLoading: isFetching,
    isError: fetchError,
  } = useBlogQuery(blogId);

  // Use mutations for create and update operations
  const createBlogMutation = useCreateBlogMutation();
  const updateBlogMutation = useUpdateBlogMutation(blogId);

  // Determine if any mutation is in progress
  const isSubmitting =
    createBlogMutation.isPending || updateBlogMutation.isPending;

  // Initial loading state (only for fetching existing blog data)
  const initialLoading = isFetching;
  
  // Combined loading state for backward compatibility
  const loading = initialLoading || isSubmitting;

  // Set form data when blog data is fetched
  useEffect(() => {
    if (blogData) {

      setFormData({
        title: blogData.title || "",
        slug: blogData.slug || "",
        content: blogData.content || "",
        metaDescription: blogData.metaDescription || "",
        metaKeywords: blogData.metaKeywords || "",
        isFeatured: blogData.isFeatured === true, // Ensure it's a boolean
        categoryId: blogData.categoryId || "",
        authorId: blogData.authorId || "",
        tags: blogData.tags || "",
        excerpt: blogData.excerpt || "",
        imageAlt: blogData.imageAlt || "",
        publishDate: blogData.publishDate 
          ? new Date(blogData.publishDate).toISOString().split('T')[0] 
          : new Date().toISOString().split('T')[0],
      });


      if (blogData.imageUrl) {
        setImagePreview(blogData.imageUrl);
      }
    }
  }, [blogData]);

  // Show error toast if fetch fails
  useEffect(() => {
    if (fetchError) {
      toast.error("Failed to load blog data");
    }
  }, [fetchError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditorChange = (content) => {
    setFormData((prevData) => ({
      ...prevData,
      content,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file size is greater than 2MB (2 * 1024 * 1024 bytes)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        e.target.value = null; // Reset the input
        return;
      }

      setImageFile(file);
      const preview = await createImagePreview(file);
      setImagePreview(preview);
    }
  };

  const generateSlug = () => {
    const slug = generateSlugFromTitle(formData.title);
    setFormData((prevData) => ({
      ...prevData,
      slug,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields
    const requiredFields = {
      title: "Title",
      content: "Content",
      excerpt: "Excerpt",
      imageAlt: "Image alt text",
      categoryId: "Category",
      authorId: "Author"
      // tags removed from required fields
    };

    const missingFields = [];
    
    // Check each required field
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field] || formData[field].trim() === '') {
        missingFields.push(label);
      }
    }

    // Tags are now optional, so no special check needed

    if (missingFields.length > 0) {
      toast.error(`The following fields are required: ${missingFields.join(', ')}`);
      return;
    }

    if (!imageFile && !isEditing) {
      toast.error("Blog image is required");
      return;
    }

    // Create FormData to handle file upload
    const blogFormData = new FormData();
    blogFormData.append("title", formData.title);
    blogFormData.append("slug", formData.slug);
    blogFormData.append("content", formData.content);
    blogFormData.append("metaDescription", formData.metaDescription || "");

    if (formData.metaKeywords) {
      blogFormData.append("metaKeywords", formData.metaKeywords);
    }

    // Add additional fields
    // Convert boolean to string "true" or "false" explicitly
    blogFormData.append(
      "isFeatured",
      formData.isFeatured === true ? "true" : "false"
    );
    
    // Add publishDate
    if (formData.publishDate) {
      blogFormData.append("publishDate", formData.publishDate);
    }

    if (formData.categoryId) {
      // Handle both string and object formats for categoryId
      const categoryIdValue =
        typeof formData.categoryId === "object" && formData.categoryId._id
          ? formData.categoryId._id
          : formData.categoryId;
      blogFormData.append("categoryId", categoryIdValue);
    }

    // Add the additional fields

    if (formData.authorId) {
      blogFormData.append("authorId", formData.authorId);
    }

    if (formData.tags) {
      blogFormData.append("tags", formData.tags);
    }

    if (formData.excerpt) {
      blogFormData.append("excerpt", formData.excerpt);
    }

    if (formData.imageAlt) {
      blogFormData.append("imageAlt", formData.imageAlt);
    }

    // Add image file if there is one
    if (imageFile) {
      blogFormData.append("image", imageFile);
    }
    try {
      if (isEditing) {
        const result = await updateBlogMutation.mutateAsync(blogFormData);
      } else {
        const result = await createBlogMutation.mutateAsync(blogFormData);
      }
      navigate("/admin/blogs");
    } catch (error) {
      // Error handling is done in the mutation hooks
      console.error("Error in form submission:", error);
    }
  };

  // Add watch function to match what's expected in BlogForm
  const watch = (fieldName) => {
    if (fieldName) {
      return formData[fieldName];
    }
    return formData;
  };

  // Add setValue function to match what's expected in BlogForm
  const setValue = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  // Add register function to match what's expected in BlogForm
  const register = (fieldName) => {
    return {
      name: fieldName,
      id: fieldName,
      value: formData[fieldName] !== undefined ? formData[fieldName] : "",
      onChange: (e) => {
        const value =
          e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setValue(fieldName, value);
      },
    };
  };

  return {
    formData,
    loading,
    initialLoading,
    isSubmitting,
    imageFile,
    imagePreview,
    isEditing,
    content: formData.content,
    errors: {}, // Add empty errors object to prevent undefined errors
    register,
    control: {}, // Add empty control object
    handleChange,
    handleEditorChange,
    handleImageChange,
    generateSlug,
    handleSubmit,
    watch,
    setValue,
  };
};
