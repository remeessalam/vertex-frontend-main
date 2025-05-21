import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const BlogTitleSlug = ({ register, errors, generateSlug, watch }) => {
  const title = watch("title");

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          {...register("title", {
            required: "Title is required",
          })}
          placeholder="Enter blog title"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="slug">
            Slug <span className="text-red-500">*</span>
          </Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={generateSlug}
            disabled={!title}
            type="button"
          >
            Generate from title
          </Button>
        </div>
        <Input
          id="slug"
          {...register("slug", {
            required: "Slug is required",
            pattern: {
              value: /^[a-z0-9-]+$/,
              message:
                "Slug can only contain lowercase letters, numbers, and hyphens",
            },
          })}
          placeholder="enter-url-slug"
        />
        {errors.slug && (
          <p className="text-sm text-red-500">{errors.slug.message}</p>
        )}
      </div>
    </div>
  );
};

export default BlogTitleSlug;
