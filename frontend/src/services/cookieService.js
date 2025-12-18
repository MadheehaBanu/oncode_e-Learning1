import Cookies from 'js-cookie';

class CookieService {
  // Set cookie with options
  set(name, value, options = {}) {
    const defaultOptions = {
      expires: 1, // 1 day
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };
    
    return Cookies.set(name, value, { ...defaultOptions, ...options });
  }

  // Get cookie value
  get(name) {
    return Cookies.get(name);
  }

  // Remove cookie
  remove(name) {
    return Cookies.remove(name);
  }

  // Check if cookie exists
  exists(name) {
    return Cookies.get(name) !== undefined;
  }

  // Set authentication token
  setAuthToken(token) {
    return this.set('authToken', token, { expires: 1 });
  }

  // Get authentication token
  getAuthToken() {
    return this.get('authToken');
  }

  // Remove authentication token
  removeAuthToken() {
    return this.remove('authToken');
  }

  // Set user session data
  setUserSession(user) {
    return this.set('userSession', JSON.stringify(user), { expires: 1 });
  }

  // Get user session data
  getUserSession() {
    const session = this.get('userSession');
    return session ? JSON.parse(session) : null;
  }

  // Remove user session
  removeUserSession() {
    return this.remove('userSession');
  }

  // Set form validation data
  setFormData(formName, data) {
    return this.set(`form_${formName}`, JSON.stringify(data), { expires: 0.5 }); // 12 hours
  }

  // Get form validation data
  getFormData(formName) {
    const data = this.get(`form_${formName}`);
    return data ? JSON.parse(data) : null;
  }

  // Remove form data
  removeFormData(formName) {
    return this.remove(`form_${formName}`);
  }

  // Clear all auth-related cookies
  clearAuth() {
    this.removeAuthToken();
    this.removeUserSession();
  }
}

export default new CookieService();