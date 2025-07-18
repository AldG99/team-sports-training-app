import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TOURNAMENT_STATUS } from '../../utils/constants';
import { globalStyles } from '../../styles/globalStyles';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';

const AdminDashboard = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalTeams: 0,
    activeTournaments: 0,
    totalMatches: 0,
    recentActivity: [],
    systemHealth: {},
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Simular carga de datos del dashboard
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockData = {
        totalUsers: 1247,
        totalTeams: 68,
        activeTournaments: 5,
        totalMatches: 234,
        recentActivity: [
          {
            id: 1,
            type: 'user_registration',
            description: 'Nuevo usuario registrado: Juan Pérez',
            timestamp: '2024-06-01T10:30:00Z',
            icon: 'person-add',
            color: COLORS.success,
          },
          {
            id: 2,
            type: 'tournament_created',
            description: 'Nuevo torneo creado: Copa Inter-facultades 2024',
            timestamp: '2024-06-01T09:15:00Z',
            icon: 'trophy',
            color: COLORS.secondary,
          },
          {
            id: 3,
            type: 'match_completed',
            description: 'Partido completado: Ingeniería FC vs Medicina FC',
            timestamp: '2024-05-31T18:45:00Z',
            icon: 'football',
            color: COLORS.primary,
          },
          {
            id: 4,
            type: 'team_registered',
            description: 'Equipo inscrito al torneo: Psicología Basketball',
            timestamp: '2024-05-31T16:20:00Z',
            icon: 'people',
            color: COLORS.warning,
          },
          {
            id: 5,
            type: 'photos_uploaded',
            description: '15 fotos subidas por Coach Martinez',
            timestamp: '2024-05-31T14:10:00Z',
            icon: 'camera',
            color: COLORS.primary,
          },
        ],
        systemHealth: {
          database: 'operational',
          storage: 'operational',
          authentication: 'operational',
          lastBackup: '2024-06-01T02:00:00Z',
        },
        weeklyStats: {
          newUsers: 23,
          newTeams: 4,
          matchesPlayed: 12,
          photosUploaded: 156,
        },
        popularSports: [
          { sport: 'Fútbol', teams: 28, percentage: 41 },
          { sport: 'Basquetbol', teams: 19, percentage: 28 },
          { sport: 'Voleibol', teams: 15, percentage: 22 },
          { sport: 'Fútbol Americano', teams: 6, percentage: 9 },
        ],
      };

      setDashboardData(mockData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const formatTimestamp = timestamp => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    if (diffInHours < 48) return 'Ayer';
    return date.toLocaleDateString('es-ES');
  };

  const getHealthStatusColor = status => {
    switch (status) {
      case 'operational':
        return COLORS.success;
      case 'degraded':
        return COLORS.warning;
      case 'down':
        return COLORS.error;
      default:
        return COLORS.gray;
    }
  };

  const StatsOverview = () => (
    <Card style={styles.statsCard}>
      <Text style={styles.cardTitle}>Resumen General</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Ionicons name="people" size={32} color={COLORS.secondary} />
          <Text style={styles.statNumber}>{dashboardData.totalUsers}</Text>
          <Text style={styles.statLabel}>Usuarios Totales</Text>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="shield" size={32} color={COLORS.secondary} />
          <Text style={styles.statNumber}>{dashboardData.totalTeams}</Text>
          <Text style={styles.statLabel}>Equipos</Text>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="trophy" size={32} color={COLORS.secondary} />
          <Text style={styles.statNumber}>
            {dashboardData.activeTournaments}
          </Text>
          <Text style={styles.statLabel}>Torneos Activos</Text>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="calendar" size={32} color={COLORS.secondary} />
          <Text style={styles.statNumber}>{dashboardData.totalMatches}</Text>
          <Text style={styles.statLabel}>Partidos Totales</Text>
        </View>
      </View>
    </Card>
  );

  const WeeklyStatsCard = () => (
    <Card style={styles.weeklyCard}>
      <Text style={styles.cardTitle}>Estadísticas de la Semana</Text>
      <View style={styles.weeklyGrid}>
        <View style={styles.weeklyItem}>
          <Text style={styles.weeklyNumber}>
            +{dashboardData.weeklyStats?.newUsers}
          </Text>
          <Text style={styles.weeklyLabel}>Nuevos Usuarios</Text>
        </View>
        <View style={styles.weeklyItem}>
          <Text style={styles.weeklyNumber}>
            +{dashboardData.weeklyStats?.newTeams}
          </Text>
          <Text style={styles.weeklyLabel}>Nuevos Equipos</Text>
        </View>
        <View style={styles.weeklyItem}>
          <Text style={styles.weeklyNumber}>
            {dashboardData.weeklyStats?.matchesPlayed}
          </Text>
          <Text style={styles.weeklyLabel}>Partidos Jugados</Text>
        </View>
        <View style={styles.weeklyItem}>
          <Text style={styles.weeklyNumber}>
            {dashboardData.weeklyStats?.photosUploaded}
          </Text>
          <Text style={styles.weeklyLabel}>Fotos Subidas</Text>
        </View>
      </View>
    </Card>
  );

  const SystemHealthCard = () => (
    <Card style={styles.healthCard}>
      <Text style={styles.cardTitle}>Estado del Sistema</Text>
      <View style={styles.healthGrid}>
        <View style={styles.healthItem}>
          <View style={styles.healthStatus}>
            <View
              style={[
                styles.healthDot,
                {
                  backgroundColor: getHealthStatusColor(
                    dashboardData.systemHealth.database
                  ),
                },
              ]}
            />
            <Text style={styles.healthLabel}>Base de Datos</Text>
          </View>
          <Text style={styles.healthValue}>
            {dashboardData.systemHealth.database}
          </Text>
        </View>

        <View style={styles.healthItem}>
          <View style={styles.healthStatus}>
            <View
              style={[
                styles.healthDot,
                {
                  backgroundColor: getHealthStatusColor(
                    dashboardData.systemHealth.storage
                  ),
                },
              ]}
            />
            <Text style={styles.healthLabel}>Almacenamiento</Text>
          </View>
          <Text style={styles.healthValue}>
            {dashboardData.systemHealth.storage}
          </Text>
        </View>

        <View style={styles.healthItem}>
          <View style={styles.healthStatus}>
            <View
              style={[
                styles.healthDot,
                {
                  backgroundColor: getHealthStatusColor(
                    dashboardData.systemHealth.authentication
                  ),
                },
              ]}
            />
            <Text style={styles.healthLabel}>Autenticación</Text>
          </View>
          <Text style={styles.healthValue}>
            {dashboardData.systemHealth.authentication}
          </Text>
        </View>
      </View>

      <View style={styles.backupInfo}>
        <Ionicons name="cloud-upload" size={16} color={COLORS.gray} />
        <Text style={styles.backupText}>
          Último respaldo:{' '}
          {formatTimestamp(dashboardData.systemHealth.lastBackup)}
        </Text>
      </View>
    </Card>
  );

  const RecentActivityCard = () => (
    <Card style={styles.activityCard}>
      <View style={styles.activityHeader}>
        <Text style={styles.cardTitle}>Actividad Reciente</Text>
        <TouchableOpacity
          onPress={() => {
            /* Ver todas las actividades */
          }}
        >
          <Text style={styles.viewAllText}>Ver todas</Text>
        </TouchableOpacity>
      </View>

      {dashboardData.recentActivity.map(activity => (
        <View key={activity.id} style={styles.activityItem}>
          <View
            style={[styles.activityIcon, { backgroundColor: activity.color }]}
          >
            <Ionicons name={activity.icon} size={16} color={COLORS.white} />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityDescription}>
              {activity.description}
            </Text>
            <Text style={styles.activityTime}>
              {formatTimestamp(activity.timestamp)}
            </Text>
          </View>
        </View>
      ))}
    </Card>
  );

  const QuickActionsCard = () => (
    <Card style={styles.quickActionsCard}>
      <Text style={styles.cardTitle}>Acciones Rápidas</Text>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity
          style={styles.quickAction}
          onPress={() => navigation.navigate('CreateTournament')}
        >
          <Ionicons name="add-circle" size={32} color={COLORS.secondary} />
          <Text style={styles.quickActionText}>Crear Torneo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickAction}
          onPress={() => navigation.navigate('ManageGallery')}
        >
          <Ionicons name="images" size={32} color={COLORS.secondary} />
          <Text style={styles.quickActionText}>Gestionar Galería</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickAction}
          onPress={() => navigation.navigate('Reports')}
        >
          <Ionicons name="bar-chart" size={32} color={COLORS.secondary} />
          <Text style={styles.quickActionText}>Ver Reportes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickAction}
          onPress={() =>
            Alert.alert('Usuarios', 'Gestión de usuarios próximamente')
          }
        >
          <Ionicons name="people" size={32} color={COLORS.secondary} />
          <Text style={styles.quickActionText}>Gestionar Usuarios</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Header title="Dashboard Admin" />
        <Loading />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Header
        title="Dashboard Admin"
        rightIcon="settings-outline"
        onRightPress={() =>
          Alert.alert('Configuración', 'Configuración del sistema próximamente')
        }
      />

      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Estadísticas Generales */}
        <StatsOverview />

        {/* Estadísticas Semanales */}
        <WeeklyStatsCard />

        {/* Estado del Sistema */}
        <SystemHealthCard />

        {/* Acciones Rápidas */}
        <QuickActionsCard />

        {/* Actividad Reciente */}
        <RecentActivityCard />

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsCard: {
    margin: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
    textAlign: 'center',
  },
  weeklyCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  weeklyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weeklyItem: {
    alignItems: 'center',
  },
  weeklyNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  weeklyLabel: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 4,
    textAlign: 'center',
  },
  healthCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  healthGrid: {
    marginBottom: 16,
  },
  healthItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  healthStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  healthLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  healthValue: {
    fontSize: 12,
    color: COLORS.gray,
    textTransform: 'capitalize',
  },
  backupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  backupText: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 6,
  },
  quickActionsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 12,
    color: COLORS.darkGray,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  activityCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.gray,
  },
  bottomPadding: {
    height: 20,
  },
});

export default AdminDashboard;
