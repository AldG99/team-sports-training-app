import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importar screens de autenticación
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Iniciar Sesión',
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: 'Crear Cuenta',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
