// Application constants

// Admin configuration
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';

// Firestore collection names
export const COLLECTIONS = {
  BLOGS: 'blogs',
  COMMENTS: 'comments',
  LIKES: 'likes',
  TAGS: 'tags',
  VIEWS: 'views',
  USERS: 'users',
};

// View tracking configuration
export const VIEW_CONFIG = {
  ENGAGED_READ_THRESHOLD: 15, // seconds
  SESSION_COOLDOWN: 300, // 5 minutes cooldown to prevent spam
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
};

// Legal disclaimer
export const LEGAL_DISCLAIMER = `This platform is for educational and informational purposes only. The content does not constitute investment advice. The author is not a SEBI-registered investment advisor.`;

// Read time calculation (words per minute)
export const WORDS_PER_MINUTE = 200;