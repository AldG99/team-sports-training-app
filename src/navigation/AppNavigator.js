import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import Loading from '../components/common/Loading';
import { AuthProvider } from '../hooks/useAuth';
import authService from '../services/authService';
import { USER_TYPES } from '../utils/constants';

// Navegadores
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import CoachNavigator from './CoachNavigator';
import AdminNavigator from './AdminNavigator';

const Stack = createStackNavigator();

// Componente interno que usa el contexto de auth
const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(
      ({ user, userProfile }) => {
        setUser(user);
        setUserProfile(userProfile);
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <View style={globalStyles.centerContainer}>
        <Loading text="Cargando SportCampus..." />
      </View>
    );
  }

  const getNavigatorByUserType = () => {
    if (!user || !userProfile) {
      return <AuthNavigator />;
    }

    switch (userProfile.userType) {
      case USER_TYPES.ADMIN:
        return <AdminNavigator />;
      case USER_TYPES.COACH:
        return <CoachNavigator />;
      case USER_TYPES.STUDENT:
      default:
        return <MainNavigator />;
    }
  };

  return <NavigationContainer>{getNavigatorByUserType()}</NavigationContainer>;
};

// Componente principal que envuelve todo con AuthProvider
const AppNavigator = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default AppNavigator;
