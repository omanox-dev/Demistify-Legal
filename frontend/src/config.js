// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  base: API_BASE_URL,
  login: `${API_BASE_URL}/login`,
  register: `${API_BASE_URL}/register`,
  userInfo: `${API_BASE_URL}/user-info`,
  upload: `${API_BASE_URL}/upload`,
  simplify: `${API_BASE_URL}/simplify`,
  segmentClauses: `${API_BASE_URL}/segment_clauses`
};

export default API_ENDPOINTS;