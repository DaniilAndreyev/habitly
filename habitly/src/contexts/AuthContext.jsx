import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('habitly_user');
    if (storedUser) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(storedUser));
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        localStorage.removeItem('habitly_user');
      }
    }
    setLoading(false);
  }, []);

  const register = (username, password) => {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('habitly_users') || '{}');
    
    if (users[username]) {
      return { success: false, error: 'Username already exists' };
    }

    // Store new user
    users[username] = { password, createdAt: new Date().toISOString() };
    localStorage.setItem('habitly_users', JSON.stringify(users));

    // Auto-login after registration
    const userData = { username };
    setUser(userData);
    localStorage.setItem('habitly_user', JSON.stringify(userData));

    return { success: true };
  };

  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem('habitly_users') || '{}');
    
    if (!users[username]) {
      return { success: false, error: 'User not found' };
    }

    if (users[username].password !== password) {
      return { success: false, error: 'Incorrect password' };
    }

    const userData = { username };
    setUser(userData);
    localStorage.setItem('habitly_user', JSON.stringify(userData));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('habitly_user');
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
