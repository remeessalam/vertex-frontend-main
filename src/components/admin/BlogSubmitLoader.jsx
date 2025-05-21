import React from "react";
import { Loader2 } from "lucide-react";

const BlogSubmitLoader = ({ isEditing }) => {
  const action = isEditing ? "Updating" : "Creating";
  
  return (
    <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card rounded-lg p-5 shadow-lg flex items-center gap-4 border border-border">
        <Loader2 className="h-5 w-5 text-primary animate-spin" />
        <p className="text-base font-medium">
          {action} blog post...
        </p>
      </div>
    </div>
  );
};


export default BlogSubmitLoader;