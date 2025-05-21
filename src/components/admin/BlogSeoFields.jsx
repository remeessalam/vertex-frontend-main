
// import React from "react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// const BlogSeoFields = ({ formData, register, errors, handleChange }) => {
//   return (
//     <div className="space-y-4">
//       <h3 className="text-xl font-medium">SEO Information</h3>
//       <div className="space-y-2">
//         <Label htmlFor="metaDescription">Meta Description</Label>
//         <Input
//           id="metaDescription"
//           {...register("metaDescription", { 
//             maxLength: {
//               value: 160,
//               message: "Meta description should be less than 160 characters"
//             }
//           })}
//           onChange={handleChange}
//           placeholder="Brief description for search engines"
//         />
//         {errors.metaDescription && (
//           <p className="text-sm text-red-500 mt-1">{errors.metaDescription.message}</p>
//         )}
//         <p className="text-xs text-muted-foreground">
//           {formData.metaDescription?.length || 0}/160 characters
//         </p>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="metaKeywords">Keywords (comma separated)</Label>
//         <Input
//           id="metaKeywords"
//           {...register("metaKeywords")}
//           onChange={handleChange}
//           placeholder="react, javascript, web development"
//         />
//       </div>
//     </div>
//   );
// };

// export default BlogSeoFields;



import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BlogSeoFields = ({ register, errors }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium">SEO Information</h3>
      <div className="space-y-2">
        <Label htmlFor="metaDescription">Meta Description</Label>
        <Input
          id="metaDescription"
          {...register("metaDescription")}
          placeholder="Brief description for search engines"
        />
        {errors.metaDescription && (
          <p className="text-sm text-red-500">{errors.metaDescription.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="metaKeywords">Keywords (comma separated)</Label>
        <Input
          id="metaKeywords"
          {...register("metaKeywords")}
          placeholder="react, javascript, web development"
        />
        {errors.metaKeywords && (
          <p className="text-sm text-red-500">{errors.metaKeywords.message}</p>
        )}
      </div>
    </div>
  );
};

export default BlogSeoFields;
