import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const BlogFormSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title and Slug */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-[200px] w-full rounded-md" />
      </div>

      <Separator />

      {/* Content Editor */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-[300px] w-full rounded-md" />
      </div>

      <Separator />

      {/* SEO Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
};

export default BlogFormSkeleton;