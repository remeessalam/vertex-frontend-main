import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import BlogEditor from "@/components/BlogEditor";
import { ArrowLeft } from "lucide-react";
import { useBlogForm } from "@/hooks/useBlogForm";
import BlogTitleSlug from "@/components/admin/BlogTitleSlug";
import BlogImageUpload from "@/components/admin/BlogImageUpload";
import BlogSeoFields from "@/components/admin/BlogSeoFields";
import BlogFormSkeleton from "@/components/admin/BlogFormSkeleton";
import BlogSubmitLoader from "@/components/admin/BlogSubmitLoader";
import BlogPublishDate from "@/components/admin/BlogPublishDate";
import { toast } from "sonner";
import { CategoryApi } from "@/lib/api";
import AuthorDropdown from "../../components/admin/AuthorDropdown";
import { useQuery } from "@tanstack/react-query";

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    errors,
    loading,
    initialLoading,
    isSubmitting,
    imagePreview,
    isEditing,
    content,
    handleSubmit,
    handleEditorChange,
    handleImageChange,
    generateSlug,
    watch,
    control,
    setValue,
  } = useBlogForm(id);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [editCategory, setEditCategory] = useState({
    id: null,
    name: "",
    description: "",
  });

  const isFeatured = watch("isFeatured");

  // Use Tanstack Query to fetch categories
  const { 
    data: categoriesData = [], 
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    refetch: refetchCategories
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await CategoryApi.getAllCategories();
        return response.data.categories;
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
        throw error;
      }
    }
  });
  
  // Use the categories data from the query
  const categories = categoriesData;

  const handleCreateCategory = async () => {
    try {
      if (!newCategory.name.trim()) {
        toast.error("Category name is required");
        return;
      }

      await CategoryApi.createCategory(newCategory);
      toast.success("Category created successfully");
      setNewCategory({ name: "", description: "" });
      setIsCreateOpen(false);
      refetchCategories(); // Use refetch from Tanstack Query
    } catch (error) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "Failed to create category";
      toast.error(errorMessage);
    }
  };

  const handleEditCategory = async () => {
    try {
      if (!editCategory.name.trim()) {
        toast.error("Category name is required");
        return;
      }

      await CategoryApi.updateCategory(editCategory.id, {
        name: editCategory.name,
        description: editCategory.description,
      });
      toast.success("Category updated successfully");
      setIsEditOpen(false);
      refetchCategories(); // Use refetch from Tanstack Query
    } catch (error) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "Failed to update category";
      toast.error(errorMessage);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      setDeleteError(null);
      await CategoryApi.deleteCategory(categoryToDelete);
      toast.success("Category deleted successfully");
      setIsDeleteOpen(false);
      refetchCategories(); // Use refetch from Tanstack Query
    } catch (error) {
      if (error.response?.data?.message?.includes("Cannot delete category")) {
        setDeleteError(error.response.data.message);
      } else {
        toast.error("Failed to delete category");
        setIsDeleteOpen(false);
      }
    }
  };

  const openEditDialog = (category) => {
    setEditCategory({
      id: category._id,
      name: category.name,
      description: category.description || "",
    });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (categoryId) => {
    setCategoryToDelete(categoryId);
    setDeleteError(null);
    setIsDeleteOpen(true);
  };

  return (
    <div className="md:py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/blogs")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="responsive-page-title">
            {isEditing ? "Edit Blog Post" : "Create Blog Post"}
          </h1>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
            ? "Update"
            : "Create"}
        </Button>
      </div>

      {/* Show the submit loader when submitting */}
      {isSubmitting && <BlogSubmitLoader isEditing={isEditing} />}
      
      {/* Show skeleton loader only during initial loading */}
      {initialLoading ? (
        <BlogFormSkeleton />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
        <BlogTitleSlug
          register={register}
          errors={errors}
          generateSlug={generateSlug}
          watch={watch}
        />

        <BlogImageUpload
          imagePreview={imagePreview}
          handleImageChange={handleImageChange}
          isEditing={isEditing}
          error={errors.image}
          register={register}
        />

        <div className="space-y-2">
          <Label htmlFor="imageAlt">
            Image Alt Text <span className="text-red-500">*</span>
          </Label>
          <Input
            id="imageAlt"
            {...register("imageAlt", { required: "Image alt text is required" })}
            placeholder="Image alt text"
          />
          {errors.imageAlt && (
            <p className="text-sm text-red-500">{errors.imageAlt.message}</p>
          )}
        </div>
        <Separator />

        {/* Additional blog options integrated directly here */}
        <div className="space-y-6">
          <h3 className="text-xl font-medium">Additional Information</h3>

          {/* Replace author name with author dropdown */}
          <AuthorDropdown
            register={register}
            watch={watch}
            setValue={setValue}
            errors={errors}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="categoryId">Category <span className="text-red-500">*</span></Label>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Add New
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Category</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label htmlFor="new-category-name">Name</Label>
                      <Input
                        id="new-category-name"
                        value={newCategory.name}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            name: e.target.value,
                          })
                        }
                        placeholder="Category name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-category-description">
                        Description (optional)
                      </Label>
                      <Textarea
                        id="new-category-description"
                        value={newCategory.description}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            description: e.target.value,
                          })
                        }
                        placeholder="Category description"
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateCategory}>Create</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <select
                className="col-span-9 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="categoryId"
                {...register("categoryId", { required: "Category is required" })}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <div className="col-span-3 flex space-x-1">
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={!watch("categoryId")}
                      className="flex-1"
                      onClick={() => {
                        const selectedCategory = categories.find(
                          (c) => c._id === watch("categoryId")
                        );
                        if (selectedCategory) {
                          openEditDialog(selectedCategory);
                        }
                      }}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="edit-category-name">Name</Label>
                        <Input
                          id="edit-category-name"
                          value={editCategory.name}
                          onChange={(e) =>
                            setEditCategory({
                              ...editCategory,
                              name: e.target.value,
                            })
                          }
                          placeholder="Category name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-category-description">
                          Description (optional)
                        </Label>
                        <Textarea
                          id="edit-category-description"
                          value={editCategory.description}
                          onChange={(e) =>
                            setEditCategory({
                              ...editCategory,
                              description: e.target.value,
                            })
                          }
                          placeholder="Category description"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleEditCategory}>Update</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      disabled={!watch("categoryId")}
                      className="flex-1"
                      onClick={() => {
                        openDeleteDialog(watch("categoryId"));
                      }}
                    >
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Category</DialogTitle>
                    </DialogHeader>
                    <div className="py-3">
                      <p>Are you sure you want to delete this category?</p>
                      {deleteError && (
                        <p className="text-red-500 mt-2">{deleteError}</p>
                      )}
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsDeleteOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteCategory}
                        disabled={deleteError}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {errors.categoryId && (
              <p className="text-sm text-red-500">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">
              Tags (comma separated)
            </Label>
            <Input
              id="tags"
              {...register("tags")}
              placeholder="tag1, tag2, tag3"
            />
            <p className="text-sm text-muted-foreground">
              Separate multiple tags with commas
            </p>
            {errors.tags && (
              <p className="text-sm text-red-500">{errors.tags.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">
              Excerpt <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="excerpt"
              {...register("excerpt", { required: "Excerpt is required" })}
              placeholder="Brief excerpt or summary of the blog post"
              rows={3}
            />
            {errors.excerpt && (
              <p className="text-sm text-red-500">{errors.excerpt.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="isFeatured"
              checked={isFeatured}
              onCheckedChange={(checked) => {
                setValue("isFeatured", checked);
              }}
            />
            <Label htmlFor="isFeatured">Feature this blog post</Label>
          </div>

          <BlogPublishDate 
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        </div>

        <Separator />

        <div className="space-y-2 pb-1">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Content <span className="text-red-500">*</span>
          </label>
          <BlogEditor initialValue={content} onChange={handleEditorChange} />
          {!content && (
            <p className="text-sm text-red-500">Content is required</p>
          )}
        </div>

        <Separator />

        <BlogSeoFields register={register} errors={errors} />
      </form>
      )}
    </div>
  );
};

export default BlogForm;
