import api from './api';

// ── Attractions ────────────────────────────────────────────────────────────
export const attractionService = {
  /** Get all attractions with optional search and category filter */
  getAll: (params = {}) => api.get('/attractions', { params }),

  /** Get map-optimized attraction list */
  getForMap: () => api.get('/attractions/map'),

  /** Get single attraction by ID or slug */
  getById: (id) => api.get(`/attractions/${id}`),

  /** Create new attraction (admin only) */
  create: (data) => api.post('/attractions', data),

  /** Update attraction (admin only) */
  update: (id, data) => api.put(`/attractions/${id}`, data),

  /** Delete attraction (admin only) */
  delete: (id) => api.delete(`/attractions/${id}`),

  /** Get all attractions for admin (including inactive) */
  getAll_Admin: () => api.get('/attractions', { params: { isActive: 'false' } }),
};

// ── Categories ────────────────────────────────────────────────────────────
export const categoryService = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// ── Auth ──────────────────────────────────────────────────────────────────
export const authService = {
  login: (credentials) => api.post('/admin/auth/login', credentials),
  getMe: () => api.get('/admin/auth/me'),
  logout: () => api.post('/admin/auth/logout'),
};
