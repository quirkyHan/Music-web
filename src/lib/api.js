/**
 * API Client for interacting with Express Backend
 * All requests include credentials: 'include' for JWT httpOnly cookie authentication.
 */

const BASE_URL = ''; // Proxied via Vite dev server or served directly by Express

async function request(endpoint, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // Crucial for httpOnly JWT cookie
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config);
    let data = null;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = text ? { message: text } : {};
    }

    if (!res.ok) {
      const errorMessage =
        (data && (data.message || data.error)) ||
        `Request failed with status ${res.status}`;
      const error = new Error(errorMessage);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    // If it's already our custom error, rethrow
    if (err.status) throw err;
    // Network or other error
    throw new Error(err.message || 'Tidak dapat terhubung ke server backend');
  }
}

export const api = {
  // Auth endpoints
  async login(credentials) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async signup(userData) {
    return request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async logout() {
    return request('/auth/logout', {
      method: 'POST',
    });
  },

  // Songs endpoints
  async getSongs() {
    return request('/songs', {
      method: 'GET',
    });
  },

  async addSong(songData) {
    return request('/songs', {
      method: 'POST',
      body: JSON.stringify(songData),
    });
  },

  async updateSong(id, songData) {
    return request(`/songs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(songData),
    });
  },

  async deleteSong(id) {
    return request(`/songs/${id}`, {
      method: 'DELETE',
    });
  },
};
