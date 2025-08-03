import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';

// Importar screens principales (reutilizamos algunas)
import HomeScreen from '../screens/main/HomeScreen';
import TeamsScreen from '../screens/main/TeamsScreen';
import TournamentsScreen from '../screens/main/TournamentsScreen';
import GalleryScreen from '../screens/main/GalleryScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

// Importar screens específicas de entrenador
import CoachDashboard from '../screens/coach/CoachDashboard';
import ManageStats from '../screens/coach/ManageStats';

const Tab = createBottomTabNavigator();

const CoachNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'speedometer' : 'speedometer-outline';
              break;
            case 'Teams':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'ManageStats':
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
              break;
            case 'Tournaments':
              iconName = focused ? 'trophy' : 'trophy-outline';
              break;
            case 'Gallery':
              iconName = focused ? 'images' : 'images-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.secondary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.lightGray,
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={CoachDashboard}
        options={{
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tab.Screen
        name="Teams"
        component={TeamsScreen}
        options={{
          tabBarLabel: 'Equipos',
        }}
      />
      <Tab.Screen
        name="ManageStats"
        component={ManageStats}
        options={{
          tabBarLabel: 'Estadísticas',
        }}
      />
      <Tab.Screen
        name="Tournaments"
        component={TournamentsScreen}
        options={{
          tabBarLabel: 'Torneos',
        }}
      />
      <Tab.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{
          tabBarLabel: 'Galería',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
};

export default CoachNavigator;
