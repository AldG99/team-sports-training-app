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

// Importar screens específicas de administrador
import AdminDashboard from '../screens/admin/AdminDashboard';
import CreateTournament from '../screens/admin/CreateTournament';

const Tab = createBottomTabNavigator();

const AdminNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            case 'Teams':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'CreateTournament':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
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
        component={AdminDashboard}
        options={{
          tabBarLabel: 'Admin',
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
        name="CreateTournament"
        component={CreateTournament}
        options={{
          tabBarLabel: 'Crear Torneo',
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

export default AdminNavigator;
