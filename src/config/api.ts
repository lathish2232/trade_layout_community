// API Configuration
export const API_CONFIG = {
  // Backend server URL - change this to match your backend
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001',
  
  // API Endpoints
  ENDPOINTS: {
    // OAuth endpoints
    GOOGLE_OAUTH_URL: '/api/oauth/google/url',
    GOOGLE_OAUTH_CALLBACK: '/api/oauth/google/callback',
    
    // Auth endpoints (for future use)
    SIGN_IN: '/api/auth/signin',
    SIGN_UP: '/api/auth/signup',
    REFRESH_TOKEN: '/api/auth/refresh',
    SIGN_OUT: '/api/auth/signout',
    
    // OTP endpoints
    SEND_OTP: '/api/auth/send-otp',
    VERIFY_OTP_REGISTER: '/api/auth/verify-otp-register',
    
    // User endpoints (for future use)
    USER_PROFILE: '/api/v1/users/profile',
    USER_SETTINGS: '/api/user/settings',
    
    // Forum endpoints (for future use)
    FORUM_POSTS: '/api/forum/posts',
    FORUM_CREATE_POST: '/api/forum/posts',
    
    // Query endpoints (for future use)
    QUERY_LIST: '/api/query',
    QUERY_CREATE: '/api/query/create',
  }
}

// Helper function to build full URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
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
  
  // OTP URLs
  SEND_OTP: buildApiUrl(API_CONFIG.ENDPOINTS.SEND_OTP),
  VERIFY_OTP_REGISTER: buildApiUrl(API_CONFIG.ENDPOINTS.VERIFY_OTP_REGISTER),
  
  // User URLs
  USER_PROFILE: buildApiUrl(API_CONFIG.ENDPOINTS.USER_PROFILE),
  USER_SETTINGS: buildApiUrl(API_CONFIG.ENDPOINTS.USER_SETTINGS),
  
  // Forum URLs
  FORUM_POSTS: buildApiUrl(API_CONFIG.ENDPOINTS.FORUM_POSTS),
  FORUM_CREATE_POST: buildApiUrl(API_CONFIG.ENDPOINTS.FORUM_CREATE_POST),
  
  // Query URLs
  QUERY_LIST: buildApiUrl(API_CONFIG.ENDPOINTS.QUERY_LIST),
  QUERY_CREATE: buildApiUrl(API_CONFIG.ENDPOINTS.QUERY_CREATE),
}
