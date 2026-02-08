import CONFIG from './config.js';
import { login as apiLogin } from './api.js';

const Auth = {
  isAuthenticated() {
    return !!localStorage.getItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
  },

  parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(
        decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        )
      );
    } catch {
      return null;
    }
  },

  async login(username, password) {
    const response = await apiLogin(username, password);

    if (!response.access_token) {
      throw new Error('خطا در ورود');
    }

    localStorage.setItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN, response.access_token);
    localStorage.setItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN, response.refresh_token || '');

    const tokenData = this.parseJwt(response.access_token);

    if (tokenData) {
      localStorage.setItem(CONFIG.STORAGE_KEYS.USER_ID, tokenData.user_id);
      localStorage.setItem(CONFIG.STORAGE_KEYS.ROLE_ID, tokenData.role_id);
      localStorage.setItem(CONFIG.STORAGE_KEYS.FULLNAME, tokenData.fullname || '');
      localStorage.setItem(CONFIG.STORAGE_KEYS.USERNAME, tokenData.sub);
    }

    if (!localStorage.getItem(CONFIG.STORAGE_KEYS.CROP_YEAR_ID)) {
      localStorage.setItem(CONFIG.STORAGE_KEYS.CROP_YEAR_ID, '13');
    }

    return { success: true, user: tokenData };
  },

  logout() {
    Object.values(CONFIG.STORAGE_KEYS).forEach(key =>
      localStorage.removeItem(key)
    );
    window.location.href = '/index.html';
  },
};

export default Auth;
