// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// API Endpoints
export const API_ENDPOINTS = {
  // User endpoints
  REGISTER: '/api/users/register',
  LOGIN: '/api/users/login',
  LOGOUT: '/api/users/logout',
  REFRESH_TOKEN: '/api/users/refresh-token',
  GET_PROFILE: '/api/users/profile',
  GET_ALL_USERS: '/api/users/all',
  UPDATE_USER: '/api/users/update',
  DELETE_USER: '/api/users/delete',

  // Video endpoints
  GET_ALL_VIDEOS: '/api/videos',
  GET_VIDEO_BY_ID: '/api/videos/',
  UPLOAD_VIDEO: '/api/videos/upload',
  GET_MY_UPLOADS: '/api/videos/my-uploads',
  DELETE_VIDEO: '/api/videos',
  EDIT_VIDEO: '/api/videos',
  PUBLISH_VIDEO: '/api/videos/publish',
  LIKE_VIDEO: '/api/videos/like',

  // Comment endpoints
  GET_COMMENTS: '/api/comment',
  ADD_COMMENT: '/api/comment',
  LIKE_COMMENT: '/api/comment/like',
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};
