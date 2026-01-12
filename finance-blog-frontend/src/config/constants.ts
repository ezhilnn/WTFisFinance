// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// App Info
export const APP_NAME = 'WTF is Finance';
export const APP_TAGLINE = 'Educational finance content without the jargon';

// Environment
export const ENV = import.meta.env.VITE_ENV || 'development';
export const IS_DEV = ENV === 'development';
export const IS_PROD = ENV === 'production';

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'finance_blog_auth_token',
  USER_DATA: 'finance_blog_user_data',
  THEME: 'finance_blog_theme',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  ITEMS_PER_PAGE: 10,
} as const;

// Legal Disclaimer
export const LEGAL_DISCLAIMER = `This platform is for educational and informational purposes only. The content does not constitute investment advice. The author is not a SEBI-registered investment advisor.`;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  BLOGS: '/blogs',
  BLOG_DETAIL: '/blogs/:slug',
  CREATE_BLOG: '/admin/create-blog',
  EDIT_BLOG: '/admin/edit-blog/:id',
  LEARN: '/learn',
  LEARN_CATEGORY: '/learn/:categorySlug',
  LEARN_PRODUCT: '/learn/:categorySlug/:productSlug',
  NOT_FOUND: '*',
} as const;

// Form Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  CONTENT_MAX_LENGTH: 10000,
} as const;

// Toast Duration
export const TOAST_DURATION = 3000; // 3 seconds

// View Tracking
export const VIEW_TRACKING = {
  ENGAGED_READ_THRESHOLD: 15000, // 15 seconds in milliseconds
} as const;

// Learning Module - No global anchors
// Anchors are now defined per product in products.json