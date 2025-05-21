
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { BlogApi } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/dateUtils";

const PublicBlog = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await BlogApi.getBlog(slug);
        setBlog(response.data);
      } catch (err) {
        setError("Failed to load blog. It may have been deleted or is unavailable.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-4">
          <div className="h-12 bg-muted animate-pulse rounded w-3/4"></div>
          <div className="h-64 bg-muted animate-pulse rounded"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-muted animate-pulse rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="p-6 text-center">
          <h1 className="responsive-h2 mb-4">Blog Not Found</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link to="/" className="text-primary hover:underline inline-flex items-center">
            <ArrowLeft size={16} className="mr-2" />
            Return to Home
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-6">
        <Link to="/" className="text-primary hover:underline inline-flex items-center">
          <ArrowLeft size={16} className="mr-2" />
          Back to Blog List
        </Link>
      </div>
      
      <article>
        <header className="mb-8">
          <h1 className="responsive-h1 mb-4">{blog.title}</h1>
          <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-4">
            <span>
              By {blog.author?.name || "Admin"}
            </span>
            <span className="mx-2">•</span>
            <span>
              Created: <time dateTime={blog.createdAt}>
                {formatDate(blog.createdAt)}
              </time>
            </span>
            <span className="mx-2">•</span>
            {blog.publishDate ? (
              <span>
                {new Date(blog.publishDate) <= new Date() ? "Published" : "Scheduled"}: <time dateTime={blog.publishDate}>
                  {formatDate(blog.publishDate)}
                </time>
              </span>
            ) : (
              <span>
                Published: <time dateTime={blog.createdAt}>
                  {formatDate(blog.createdAt)}
                </time>
              </span>
            )}
          </div>
          
          {blog.imageUrl && (
            <div className="mb-8 overflow-hidden rounded-lg">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </header>

        <div 
          className="prose prose-slate max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {blog.metaKeywords && blog.metaKeywords.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <div className="flex flex-wrap gap-2">
              {blog.metaKeywords.map(keyword => (
                <Badge key={keyword} variant="secondary">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default PublicBlog;
