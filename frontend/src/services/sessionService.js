import cookieService from './cookieService';

class SessionService {
  // Set session data
  setSession(key, value, expireHours = 24) {
    const sessionData = {
      value,
      timestamp: Date.now(),
      expireTime: Date.now() + (expireHours * 60 * 60 * 1000)
    };
    
    sessionStorage.setItem(key, JSON.stringify(sessionData));
    
    // Also store in cookie for persistence
    cookieService.set(key, JSON.stringify(sessionData), { 
      expires: expireHours / 24 
    });
  }

  // Get session data
  getSession(key) {
    // Try sessionStorage first
    let data = sessionStorage.getItem(key);
    
    // Fallback to cookie
    if (!data) {
      data = cookieService.get(key);
    }
    
    if (!data) return null;
    
    try {
      const sessionData = JSON.parse(data);
      
      // Check if expired
      if (Date.now() > sessionData.expireTime) {
        this.removeSession(key);
        return null;
      }
      
      return sessionData.value;
    } catch (error) {
      console.error('Error parsing session data:', error);
      this.removeSession(key);
      return null;
    }
  }

  // Remove session data
  removeSession(key) {
    sessionStorage.removeItem(key);
    cookieService.remove(key);
  }

  // Check if session exists and is valid
  hasValidSession(key) {
    return this.getSession(key) !== null;
  }

  // Set form validation state
  setFormValidation(formName, validationData) {
    this.setSession(`form_validation_${formName}`, validationData, 12); // 12 hours
  }

  // Get form validation state
  getFormValidation(formName) {
    return this.getSession(`form_validation_${formName}`);
  }

  // Remove form validation state
  removeFormValidation(formName) {
    this.removeSession(`form_validation_${formName}`);
  }

  // Set user authentication session
  setAuthSession(user, token) {
    this.setSession('auth_user', user, 24);
    this.setSession('auth_token', token, 24);
    cookieService.setAuthToken(token);
    cookieService.setUserSession(user);
  }

  // Get authentication session
  getAuthSession() {
    const user = this.getSession('auth_user');
    const token = this.getSession('auth_token');
    
    return user && token ? { user, token } : null;
  }

  // Clear authentication session
  clearAuthSession() {
    this.removeSession('auth_user');
    this.removeSession('auth_token');
    cookieService.clearAuth();
  }

  // Refresh session timestamp
  refreshSession(key) {
    const data = this.getSession(key);
    if (data) {
      this.setSession(key, data);
    }
  }

  // Clear all sessions
  clearAll() {
    sessionStorage.clear();
    // Clear specific cookies
    ['auth_user', 'auth_token', 'authToken', 'userSession'].forEach(key => {
      cookieService.remove(key);
    });
  }
}

export default new SessionService();