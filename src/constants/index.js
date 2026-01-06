// Constants for the Blog Application

// User roles
const USER_ROLES = {
  VIEWER: 'viewer',
  USER: 'user',
  ADMIN: 'admin'
};

// Default pagination settings
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// Post status
const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};

// Response messages
const RESPONSE_MESSAGES = {
  SUCCESS: 'Success',
  ERROR: 'An error occurred',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  VALIDATION_FAILED: 'Validation failed'
};

// JWT settings
const JWT_SETTINGS = {
  EXPIRES_IN: '7d' // 7 days
};

module.exports = {
  USER_ROLES,
  PAGINATION,
  POST_STATUS,
  RESPONSE_MESSAGES,
  JWT_SETTINGS
};