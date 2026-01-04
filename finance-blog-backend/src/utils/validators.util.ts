// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate name (2-50 characters, letters and spaces only)
export const isValidName = (name: string): boolean => {
  if (!name || name.trim().length < 2 || name.trim().length > 50) {
    return false;
  }
  const nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(name.trim());
};

// Validate content (not empty, max 10000 characters)
export const isValidContent = (content: string): boolean => {
  return Boolean(content) && content.trim().length > 0 && content.trim().length <= 10000;
};

// Generate URL-friendly slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .substring(0, 100); // Limit length
};

// Calculate read time based on word count
export const calculateReadTime = (content: string, wordsPerMinute: number = 200): number => {
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, minutes); // Minimum 1 minute
};

// Generate excerpt from content (first 160 characters)
export const generateExcerpt = (content: string): string => {
  const cleaned = content.trim().replace(/\s+/g, ' ');
  return cleaned.length > 160 ? cleaned.substring(0, 157) + '...' : cleaned;
};