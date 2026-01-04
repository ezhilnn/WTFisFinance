import { VALIDATION } from '../config/constants';

/**
 * Form validation utility functions
 */

// Validate email
export const isValidEmail = (email: string): boolean => {
  return VALIDATION.EMAIL_REGEX.test(email);
};

// Validate password
export const isValidPassword = (password: string): boolean => {
  return password.length >= VALIDATION.PASSWORD_MIN_LENGTH;
};

// Validate name
export const isValidName = (name: string): boolean => {
  const trimmedName = name.trim();
  return (
    trimmedName.length >= VALIDATION.NAME_MIN_LENGTH &&
    trimmedName.length <= VALIDATION.NAME_MAX_LENGTH
  );
};

// Validate required field
export const isRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// Validate content length
export const isValidContent = (content: string): boolean => {
  return (
    content.trim().length > 0 &&
    content.trim().length <= VALIDATION.CONTENT_MAX_LENGTH
  );
};

// Get email validation error message
export const getEmailError = (email: string): string | null => {
  if (!isRequired(email)) return 'Email is required';
  if (!isValidEmail(email)) return 'Please enter a valid email address';
  return null;
};

// Get password validation error message
export const getPasswordError = (password: string): string | null => {
  if (!isRequired(password)) return 'Password is required';
  if (!isValidPassword(password)) {
    return `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`;
  }
  return null;
};

// Get name validation error message
export const getNameError = (name: string): string | null => {
  if (!isRequired(name)) return 'Name is required';
  if (!isValidName(name)) {
    return `Name must be between ${VALIDATION.NAME_MIN_LENGTH} and ${VALIDATION.NAME_MAX_LENGTH} characters`;
  }
  return null;
};