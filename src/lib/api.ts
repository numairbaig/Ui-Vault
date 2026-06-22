// Unified Axios/Fetch API client for Aura Uiverse Full-stack backend

const API_BASE = '/api';

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('aura_uiverse_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  role: 'user' | 'admin';
  isBanned?: boolean;
  createdAt?: string;
  followers?: string[];
  following?: string[];
  savedComponents?: string[];
  collections?: string[];
}

export interface UIComponent {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail: string;
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  reactCode: string;
  tailwindCode: string;
  author: {
    id: string;
    username: string;
    avatar: string;
  };
  likes: string[];
  views: number;
  downloads: number;
  commentsCount: number;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  user: string;
  components: string[];
  visibility: 'public' | 'private';
  createdAt: string;
}

export interface Comment {
  id: string;
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  component: string;
  text: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  recipient: string;
  sender: {
    id: string;
    username: string;
    avatar: string;
  };
  type: 'like' | 'comment' | 'follow' | 'save';
  componentId?: string;
  componentTitle?: string;
  createdAt: string;
  read: boolean;
}

export interface Report {
  id: string;
  reporter: {
    id: string;
    username: string;
  };
  componentId: string;
  componentTitle: string;
  reason: string;
  createdAt: string;
  status: 'pending' | 'resolved';
}

export interface Analytics {
  totalComponents: number;
  totalUsers: number;
  totalViews: number;
  totalDownloads: number;
  totalLikes: number;
  pendingReports: number;
  siteViews: number;
  categoryStats: Record<string, number>;
}

export const api = {
  // --- Auth APIs ---
  async login(email: string, passcode: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password: passcode }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    localStorage.setItem('aura_uiverse_token', data.token);
    return data;
  },

  async register(username: string, email: string, passcode: string, bio?: string, avatar?: string) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, email, password: passcode, bio, avatar }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    localStorage.setItem('aura_uiverse_token', data.token);
    return data;
  },

  async googleAuth(payload: { googleId: string; name: string; email: string; imageUrl: string }) {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Google authentication failed');
    localStorage.setItem('aura_uiverse_token', data.token);
    return data;
  },

  async getCurrentUser(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      localStorage.removeItem('aura_uiverse_token');
      throw new Error('Session expired');
    }
    return res.json();
  },

  async updateProfile(bio: string, avatar: string) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ bio, avatar }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update profile');
    return data;
  },

  async requestPasswordReset(email: string) {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Reset failed');
    return data;
  },

  async verifyCreatorEmail() {
    const res = await fetch(`${API_BASE}/auth/verify-email`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return res.json();
  },

  logout() {
    localStorage.removeItem('aura_uiverse_token');
  },

  // --- Components APIs ---
  async getComponents(params?: { search?: string; category?: string; tag?: string; author?: string; sort?: string }): Promise<UIComponent[]> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v) query.append(k, v);
      });
    }
    const res = await fetch(`${API_BASE}/components?${query.toString()}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch components');
    return res.json();
  },

  async getComponentDetail(id: string): Promise<{ component: UIComponent; similar: UIComponent[] }> {
    const res = await fetch(`${API_BASE}/components/${id}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load component details');
    return res.json();
  },

  async uploadComponent(payload: Omit<UIComponent, 'id' | 'likes' | 'views' | 'downloads' | 'commentsCount' | 'createdAt' | 'author'>): Promise<{ message: string; component: UIComponent }> {
    const res = await fetch(`${API_BASE}/components`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data;
  },

  async editComponent(id: string, payload: Partial<UIComponent>): Promise<{ message: string; component: UIComponent }> {
    const res = await fetch(`${API_BASE}/components/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Edit failed');
    return data;
  },

  async deleteComponent(id: string) {
    const res = await fetch(`${API_BASE}/components/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Delete failed');
    return data;
  },

  async triggerDownloadCounter(id: string) {
    await fetch(`${API_BASE}/components/${id}/download`, { method: 'POST', headers: getHeaders() });
  },

  async toggleFavorite(id: string): Promise<{ saved: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/components/${id}/favorite`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return res.json();
  },

  async toggleLike(id: string): Promise<{ liked: boolean; likesCount: number }> {
    const res = await fetch(`${API_BASE}/components/${id}/like`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return res.json();
  },

  // --- Collections APIs ---
  async getCollections(): Promise<Collection[]> {
    const res = await fetch(`${API_BASE}/collections`, { headers: getHeaders() });
    return res.json();
  },

  async createCollection(name: string, visibility: 'public' | 'private' = 'public'): Promise<{ message: string; collection: Collection }> {
    const res = await fetch(`${API_BASE}/collections`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, visibility }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create collection');
    return data;
  },

  async toggleComponentInCollection(collectionId: string, componentId: string): Promise<{ message: string; collection: Collection }> {
    const res = await fetch(`${API_BASE}/collections/${collectionId}/toggle`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ componentId }),
    });
    return res.json();
  },

  async deleteCollection(collectionId: string) {
    const res = await fetch(`${API_BASE}/collections/${collectionId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },

  // --- Comment System ---
  async getComments(componentId: string): Promise<Comment[]> {
    const res = await fetch(`${API_BASE}/comments/component/${componentId}`);
    return res.json();
  },

  async addComment(componentId: string, text: string): Promise<Comment> {
    const res = await fetch(`${API_BASE}/comments/component/${componentId}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add comment');
    return data;
  },

  async deleteComment(commentId: string) {
    const res = await fetch(`${API_BASE}/comments/${commentId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },

  // --- Follows & Socials ---
  async toggleFollowUser(userId: string): Promise<{ message: string; isFollowing: boolean; followersCount: number }> {
    const res = await fetch(`${API_BASE}/social/follow/${userId}`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return res.json();
  },

  async getNotifications(): Promise<Notification[]> {
    const res = await fetch(`${API_BASE}/social/notifications`, { headers: getHeaders() });
    return res.json();
  },

  async markNotificationsAsRead() {
    await fetch(`${API_BASE}/social/notifications/read`, { method: 'POST', headers: getHeaders() });
  },

  async reportComponent(componentId: string, reason: string) {
    const res = await fetch(`${API_BASE}/components/${componentId}/report`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ reason }),
    });
    return res.json();
  },

  // --- Admin APIs ---
  async getAdminAnalytics(): Promise<Analytics> {
    const res = await fetch(`${API_BASE}/admin/analytics`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Unauthorised admin query');
    return res.json();
  },

  async getAdminUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/admin/users`, { headers: getHeaders() });
    return res.json();
  },

  async toggleBanUser(userId: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/ban`, { method: 'POST', headers: getHeaders() });
    return res.json();
  },

  async getAdminReports(): Promise<Report[]> {
    const res = await fetch(`${API_BASE}/admin/reports`, { headers: getHeaders() });
    return res.json();
  },

  async getAdminPendingComponents(): Promise<UIComponent[]> {
    const res = await fetch(`${API_BASE}/admin/pending`, { headers: getHeaders() });
    return res.json();
  },

  async approveComponent(componentId: string): Promise<{ message: string; component: UIComponent }> {
    const res = await fetch(`${API_BASE}/admin/components/${componentId}/approve`, { method: 'POST', headers: getHeaders() });
    return res.json();
  },

  async resolveReport(reportId: string) {
    const res = await fetch(`${API_BASE}/admin/reports/${reportId}/resolve`, { method: 'POST', headers: getHeaders() });
    return res.json();
  },

  async getMernStatus(): Promise<{
    stack: string;
    expressUsed: boolean;
    nodeUsed: boolean;
    mongoConfigured: boolean;
    mongoStatus: string;
    mongoUriMasked: string;
  }> {
    const res = await fetch(`${API_BASE}/db-config`, { headers: getHeaders() });
    return res.json();
  }
};
