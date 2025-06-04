import { useState, useEffect, useContext, createContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar si Firebase está disponible
    if (!authService.isFirebaseAvailable()) {
      console.warn('Firebase no está disponible, usando modo desarrollo');
    }

    const unsubscribe = authService.onAuthStateChange(
      ({ user, userProfile }) => {
        setUser(user);
        setUserProfile(userProfile);
        setLoading(false);
        setError(null);
      }
    );

    // Mostrar usuarios de prueba disponibles en desarrollo
    if (__DEV__) {
      authService.createTestUsers();
    }

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const result = await authService.login(email, password);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const register = async (email, password, userData) => {
    try {
      setError(null);
      const result = await authService.register(email, password, userData);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await authService.logout();
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const updateProfile = async updates => {
    try {
      setError(null);
      if (user) {
        const result = await authService.updateUserProfile(user.uid, updates);
        setUserProfile(prev => ({ ...prev, ...result }));
        return result;
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    isAuthenticated: !!user,
    isStudent: userProfile?.userType === 'student',
    isCoach: userProfile?.userType === 'coach',
    isAdmin: userProfile?.userType === 'admin',
    // Información adicional útil
    displayName:
      userProfile?.displayName ||
      userProfile?.firstName + ' ' + userProfile?.lastName ||
      'Usuario',
    isTemporary: userProfile?.isTemporary || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
