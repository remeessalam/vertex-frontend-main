/**
 * Format a date to display in the format "15 May, 2025"
 * @param {Date|string} date - Date object or date string
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const options = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  };
  
  return dateObj.toLocaleDateString('en-US', options);
};