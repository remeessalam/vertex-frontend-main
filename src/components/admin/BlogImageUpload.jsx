
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const BlogImageUpload = ({ 
  imagePreview, 
  handleImageChange, 
  isEditing 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="image">
        Blog Image {!isEditing && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id="image"
        name="image"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      <p className="text-sm text-muted-foreground">
        Recommended size: 1200x630 pixels (16:9 ratio) | Maximum file size: 2MB
      </p>
      
      {imagePreview && (
        <div className="mt-2 w-fit rounded-md overflow-hidden border">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="h-auto max-h-[300px] rounded-md aspect-[16/9] object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default BlogImageUpload;
