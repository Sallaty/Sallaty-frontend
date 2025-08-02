import React, { useState, useEffect } from 'react';
import './App.css';
import LoginScreen from './components/LoginScreen';
import MainScreen from './components/MainScreen';
import AddShortageScreen from './components/AddShortageScreen';
import ShortageListScreen from './components/ShortageListScreen';
import NotificationsScreen from './components/NotificationsScreen';

// خدمة API للتواصل مع الخادم الخلفي
class ApiService {
  static baseURL = import.meta.env.REACT_APP_API_BASE_URL || '/api';
  
  static async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // لإرسال الكوكيز
      ...options,
    };
    
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }
    
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'حدث خطأ في الخادم');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
  
  // المصادقة
  static async login(username, password) {
    return this.request('/login', {
      method: 'POST',
      body: { username, password }
    });
  }
  
  static async logout() {
    return this.request('/logout', { method: 'POST' });
  }
  
  static async checkSession() {
    return this.request('/check-session');
  }
  
  static async register(storeData) {
    return this.request('/register', {
      method: 'POST',
      body: storeData
    });
  }
  
  // النواقص
  static async getShortages(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/shortages?${queryString}`);
  }
  
  static async createShortage(shortageData) {
    return this.request('/shortages', {
      method: 'POST',
      body: shortageData
    });
  }
  
  static async respondToShortage(shortageId, responseData) {
    return this.request(`/shortages/${shortageId}/respond`, {
      method: 'POST',
      body: responseData
    });
  }
  
  static async getMyShortages(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/my-shortages?${queryString}`);
  }
  
  // الإشعارات
  static async getNotifications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/notifications?${queryString}`);
  }
  
  static async markNotificationRead(notificationId) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'POST'
    });
  }
  
  static async getUnreadCount() {
    return this.request('/notifications/unread-count');
  }
}

function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // فحص الجلسة عند تحميل التطبيق
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await ApiService.checkSession();
      if (response.logged_in) {
        setUser(response.store);
        setCurrentScreen('main');
      }
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await ApiService.login(username, password);
      if (response.success) {
        setUser(response.store);
        setCurrentScreen('main');
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const handleLogout = async () => {
    try {
      await ApiService.logout();
      setUser(null);
      setCurrentScreen('login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      case 'main':
        return (
          <MainScreen
            user={user}
            onNavigate={setCurrentScreen}
            onLogout={handleLogout}
            apiService={ApiService}
          />
        );
      case 'add-shortage':
        return (
          <AddShortageScreen
            onBack={() => setCurrentScreen('main')}
            apiService={ApiService}
          />
        );
      case 'shortage-list':
        return (
          <ShortageListScreen
            onBack={() => setCurrentScreen('main')}
            apiService={ApiService}
            currentUser={user}
          />
        );
      case 'notifications':
        return (
          <NotificationsScreen
            onBack={() => setCurrentScreen('main')}
            apiService={ApiService}
          />
        );
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="App">
      {renderScreen()}
    </div>
  );
}

export default App;
