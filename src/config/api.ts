// API Configuration
export const API_CONFIG = {
  // Backend server URL - change this to match your backend
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8001',
  
  // API Endpoints
  ENDPOINTS: {
    // OAuth endpoints
    GOOGLE_OAUTH_URL: '/api/oauth/google/url',
    GOOGLE_OAUTH_CALLBACK: '/api/oauth/google/callback',
    
    // Auth endpoints
    SIGN_IN: '/auth/signin',
    SIGN_UP: '/auth/signup',
    REFRESH_TOKEN: '/auth/refresh',
    SIGN_OUT: '/auth/signout',
    VERIFY_TOKEN: '/api/v1/auth/verify/',
    
    // OTP endpoints
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP_REGISTER: '/auth/verify-otp-register',
    
    // Content API endpoints (matching backend documentation)
    CATEGORIES: '/api/v1/content/categories/',
    TAGS: '/api/v1/content/tags/',
    QUERIES_LIST: '/api/v1/content/queries/',
    QUERY_CREATE: '/api/v1/content/queries/create/',
    ARTICLES_LIST: '/api/v1/content/articles/',
    ARTICLE_CREATE: '/api/v1/content/articles/create/',
    DISCUSSIONS: '/api/v1/content/discussions/',
    VOTE: '/api/v1/content/vote/',
    
    // Legacy endpoints (for backward compatibility)
    USER_PROFILE: '/api/v1/users/profile/',
    USER_SETTINGS: '/api/user/settings',
    FORUM_POSTS: '/api/forum/posts',
    FORUM_CREATE_POST: '/api/forum/posts',
    QUERY_LIST: '/api/query',
    QUERY_CREATE_LEGACY: '/api/query/create',
  }
}

// Helper function to build full URLs
export const buildApiUrl = (endpoint: string): string => {
  if (!endpoint) {
    console.error('Endpoint is undefined:', endpoint)
    return 'http://127.0.0.1:8001/auth/undefined'
  }
  const url = `${API_CONFIG.BASE_URL}${endpoint}`
  return url
}

// Export commonly used URLs
export const API_URLS = {
  // OAuth URLs
  GOOGLE_OAUTH_URL: buildApiUrl(API_CONFIG.ENDPOINTS.GOOGLE_OAUTH_URL),
  GOOGLE_OAUTH_CALLBACK: buildApiUrl(API_CONFIG.ENDPOINTS.GOOGLE_OAUTH_CALLBACK),
  
  // Auth URLs
  SIGN_IN: buildApiUrl(API_CONFIG.ENDPOINTS.SIGN_IN),
  SIGN_UP: buildApiUrl(API_CONFIG.ENDPOINTS.SIGN_UP),
  REFRESH_TOKEN: buildApiUrl(API_CONFIG.ENDPOINTS.REFRESH_TOKEN),
  SIGN_OUT: buildApiUrl(API_CONFIG.ENDPOINTS.SIGN_OUT),
  VERIFY_TOKEN: buildApiUrl(API_CONFIG.ENDPOINTS.VERIFY_TOKEN),
  
  // OTP URLs
  SEND_OTP: buildApiUrl(API_CONFIG.ENDPOINTS.SEND_OTP),
  VERIFY_OTP_REGISTER: buildApiUrl(API_CONFIG.ENDPOINTS.VERIFY_OTP_REGISTER),
  
  // Content API URLs (matching backend documentation)
  CATEGORIES: buildApiUrl(API_CONFIG.ENDPOINTS.CATEGORIES),
  TAGS: buildApiUrl(API_CONFIG.ENDPOINTS.TAGS),
  QUERIES_LIST: buildApiUrl(API_CONFIG.ENDPOINTS.QUERIES_LIST),
  QUERY_CREATE: buildApiUrl(API_CONFIG.ENDPOINTS.QUERY_CREATE),
  ARTICLES_LIST: buildApiUrl(API_CONFIG.ENDPOINTS.ARTICLES_LIST),
  ARTICLE_CREATE: buildApiUrl(API_CONFIG.ENDPOINTS.ARTICLE_CREATE),
  DISCUSSIONS: buildApiUrl(API_CONFIG.ENDPOINTS.DISCUSSIONS),
  VOTE: buildApiUrl(API_CONFIG.ENDPOINTS.VOTE),
  
  // Legacy URLs
  USER_PROFILE: buildApiUrl(API_CONFIG.ENDPOINTS.USER_PROFILE),
  USER_SETTINGS: buildApiUrl(API_CONFIG.ENDPOINTS.USER_SETTINGS),
  FORUM_POSTS: buildApiUrl(API_CONFIG.ENDPOINTS.FORUM_POSTS),
  FORUM_CREATE_POST: buildApiUrl(API_CONFIG.ENDPOINTS.FORUM_CREATE_POST),
  QUERY_LIST: buildApiUrl(API_CONFIG.ENDPOINTS.QUERY_LIST),
  QUERY_CREATE_LEGACY: buildApiUrl(API_CONFIG.ENDPOINTS.QUERY_CREATE_LEGACY),
}
