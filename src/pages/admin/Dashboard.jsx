import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboardQuery } from "@/hooks/useBlogQuery";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  
  // Use Tanstack Query to fetch dashboard data
  const { 
    data: dashboardData,
    isLoading: dashboardLoading,
    isError: dashboardError
  } = useDashboardQuery();

  // If authentication is still loading, show a loading spinner
  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is null after loading is complete, show an error
  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center flex-col p-8">
        <h1 className="text-2xl font-bold text-red-500">
          Authentication Error
        </h1>
        <p className="text-muted-foreground">Please try logging in again</p>
        <Link
          to="/login"
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:py-8">
      <div className="flex justify-center items-center">
        <div className="text-center">
          <h1 className="responsive-page-title">Welcome, {user.name}</h1>
          <p className="text-muted-foreground">
            Here's a summary of your blog management system.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardLoading ? (
              <div className="h-9 w-16 bg-muted animate-pulse rounded"></div>
            ) : (
              <div className="responsive-h2">{dashboardData?.totalBlogs || 0}</div>
            )}
            <p className="text-xs text-muted-foreground pt-1">
              Published articles on your blog
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Blog Posts</CardTitle>
            <CardDescription>Your latest published content</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-14 bg-muted animate-pulse rounded"
                  ></div>
                ))}
              </div>
            ) : dashboardError ? (
              <div className="text-center py-4 text-red-500">Failed to load dashboard data</div>
            ) : !dashboardData?.recentBlogs?.length ? (
              <div className="text-center py-4 text-muted-foreground">
                No blogs found. Create your first blog!
              </div>
            ) : (
              <div className="space-y-2">
                {dashboardData.recentBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium truncate max-w-[250px]">
                        {blog.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div>Created: {blog.createdAt}</div>
                        <div>
                          {blog.hasCustomPublishDate ? (
                            <>
                              {new Date(blog.publishDate) <= new Date() ? (
                                <span className="text-green-600">Published on: </span>
                              ) : (
                                <span className="text-amber-600">Will be published on: </span>
                              )}
                              {blog.publishDate}
                            </>
                          ) : (
                            <span className="text-green-600">Published on: {blog.createdAt}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/admin/blogs/edit/${blog.id}`}
                      className="p-2 hover:bg-muted rounded-full"
                      aria-label={`Edit ${blog.title}`}
                    >
                      <Edit size={16} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
