import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { useAllBlogsQuery, useDeleteBlogMutation } from "@/hooks/useBlogQuery";
import { toast } from "sonner";
import { formatDate } from "@/lib/dateUtils";

const Blogs = () => {
  // Use Tanstack Query to fetch all blogs
  const {
    data: blogs = [],
    isLoading: loading,
    isError,
    error: queryError,
  } = useAllBlogsQuery();

  // Use mutation for delete operation
  const deleteBlogMutation = useDeleteBlogMutation();

  // Error message for display
  const error = isError ? queryError?.message || "Failed to load blogs" : null;

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const response = await deleteBlogMutation.mutateAsync(id);

        // Check for success status
        if (response && response.data && response.data.success === false) {
          throw new Error(response.data.message || "Failed to delete blog");
        }
      } catch (err) {
        // Error handling is done in the mutation hook
        const errorMessage = 
          err.response?.data?.message || 
          err.message || 
          "Failed to delete blog";
        toast.error(errorMessage);
        console.error("Error in delete operation:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 md:py-8">
        <div className="flex justify-between items-center">
          <h1 className="responsive-page-title">Blog Posts</h1>
          <div className="w-32 h-10 bg-muted animate-pulse rounded"></div>
        </div>

        {/* Desktop loading skeleton */}
        <div className="hidden md:block border rounded-md">
          <div className="h-12 border-b bg-muted/10"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 border-b bg-muted animate-pulse"></div>
          ))}
        </div>

        {/* Mobile loading skeleton */}
        <div className="md:hidden space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-md p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="h-5 w-3/4 bg-muted animate-pulse rounded"></div>
                <div className="h-5 w-16 bg-muted animate-pulse rounded"></div>
              </div>
              <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
              <div className="flex space-x-2 pt-2 border-t">
                <div className="h-9 flex-1 bg-muted animate-pulse rounded"></div>
                <div className="h-9 flex-1 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 md:py-8">
        <div className="flex justify-between items-center">
          <h1 className="responsive-page-title">Blog Posts</h1>
          <Link to="/admin/blogs/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> New Blog
            </Button>
          </Link>
        </div>

        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:py-8">
      <div className="flex justify-between items-center">
        <h1 className="responsive-page-title">Blog Posts</h1>
        <Link to="/admin/blogs/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> New Blog
          </Button>
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="p-6 border">
          <div className="text-center py-12 rounded-md">
            <h3 className="font-medium text-lg mb-2">No blogs found</h3>
            <p className="text-muted-foreground mb-6">
              Create your first blog post to get started
            </p>
            <Link to="/admin/blogs/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Create Blog
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop view - Table */}
          <div className="hidden md:block border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created On</TableHead>
                  {/* <TableHead>Publish Date</TableHead> */}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog) => (
                  <TableRow key={blog._id}>
                    <TableCell className="font-medium">
                      {blog.title.length > 30
                        ? blog.title.substring(0, 30) + "..."
                        : blog.title.substring(0, 30)}
                    </TableCell>
                    <TableCell>
                      {blog.publishDate ? (
                        <div>
                          {new Date(blog.publishDate) <= new Date() ? (
                            <span className="text-green-600">
                              Published on:{" "}
                            </span>
                          ) : (
                            <span className="text-amber-600">
                              Will be published on:{" "}
                            </span>
                          )}
                          {formatDate(blog.publishDate)}
                        </div>
                      ) : (
                        <span className="text-green-600">
                          Published on:{" "}
                          {formatDate(blog.createdAt)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {formatDate(blog.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link to={`/admin/blogs/edit/${blog._id}`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(blog._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile view - Card list */}
          <div className="md:hidden space-y-4">
            {blogs.map((blog) => (
              <div key={blog._id} className="border rounded-md p-4 space-y-3">
                <img
                  src={blog.imageUrl}
                  className="rounded-md object-cover aspect-video"
                  alt={blog.title}
                />
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{blog.title}</h3>
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  <div>
                    Created on: {formatDate(blog.createdAt)}
                  </div>
                  <div>
                    {blog.publishDate ? (
                      <>
                        {new Date(blog.publishDate) <= new Date() ? (
                          <span className="text-green-600">Published on: </span>
                        ) : (
                          <span className="text-amber-600">
                            Will be published on:{" "}
                          </span>
                        )}
                        {formatDate(blog.publishDate)}
                      </>
                    ) : (
                      <span className="text-green-600">
                        Published on:{" "}
                        {formatDate(blog.createdAt)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2 pt-2 border-t">
                  <Link to={`/admin/blogs/edit/${blog._id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Pencil className="h-4 w-4 mr-2" /> Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="flex-1 text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => handleDelete(blog._id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Blogs;
