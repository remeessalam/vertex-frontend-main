
/**
 * Creates an image preview from a file
 * @param {File} file - The image file to preview
 * @returns {Promise<string>} - A promise that resolves to the data URL
 */
export const createImagePreview = (file) => {
  return new Promise((resolve) => {
    if (!file) return resolve(null);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Generates a slug from a title string
 * @param {string} title - The title to convert to a slug
 * @returns {string} - The generated slug
 */
export const generateSlugFromTitle = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-");
};
