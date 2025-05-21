import React, { useState, useEffect, useCallback, forwardRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Create a forwarded ref wrapper for ReactQuill to avoid findDOMNode warning
const CustomQuill = forwardRef((props, ref) => (
  <ReactQuill ref={ref} {...props} />
));

const BlogEditor = ({ initialValue = "", onChange }) => {
  const [content, setContent] = useState(initialValue);

  useEffect(() => {
    setContent(initialValue);
  }, [initialValue]);

  const handleChange = useCallback(
    (value) => {
      setContent(value);
      onChange(value);
    },
    [onChange]
  );

  // Quill editor modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "code-block"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "link",
    "code-block",
  ];

  return (
    <div className="blog-editor">
      <CustomQuill
        theme="snow"
        value={content}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        className="h-[300px] mb-12"
      />
    </div>
  );
};

export default BlogEditor;
