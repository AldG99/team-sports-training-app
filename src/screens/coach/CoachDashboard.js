import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../utils/constants';
import { globalStyles } from '../../styles/globalStyles';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import useAuth from '../../hooks/useAuth';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive utilities
const isTablet = screenWidth >= 768;
const isSmallScreen = screenWidth < 375;
const isLargeScreen = screenWidth >= 414;

const responsive = {
  // Spacing
  spacing: {
    xs: isSmallScreen ? 4 : 8,
    sm: isSmallScreen ? 8 : 12,
    md: isSmallScreen ? 12 : 16,
    lg: isSmallScreen ? 16 : 20,
    xl: isSmallScreen ? 20 : 24,
  },
  // Font sizes
  fontSize: {
    xs: isSmallScreen ? 10 : 12,
    sm: isSmallScreen ? 12 : 14,
    md: isSmallScreen ? 14 : 16,
    lg: isSmallScreen ? 16 : 18,
    xl: isSmallScreen ? 18 : 20,
    xxl: isSmallScreen ? 20 : 24,
    xxxl: isSmallScreen ? 24 : 28,
  },
  // Icon sizes
  iconSize: {
    xs: isSmallScreen ? 12 : 14,
    sm: isSmallScreen ? 16 : 18,
    md: isSmallScreen ? 20 : 24,
    lg: isSmallScreen ? 28 : 32,
    xl: isSmallScreen ? 36 : 40,
  },
  // Avatar sizes
  avatar: {
    small: isSmallScreen ? 50 : 60,
    medium: isSmallScreen ? 60 : 70,
    large: isSmallScreen ? 80 : 90,
  },
};

const CoachDashboard = ({ navigation }) => {
  const { userProfile, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [myTeams, setMyTeams] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [pendingActions, setPendingActions] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockTeams = [
        {
          id: '1',
          name: 'Ingeniería FC',
          sport: 'Fútbol',
          players: 22,
          nextMatch: '2024-06-08',
          record: { wins: 8, draws: 2, losses: 1 },
          season: '2024',
          category: 'Primera División',
        },
        {
          id: '2',
          name: 'Ingeniería BB',
          sport: 'Basquetbol',
          players: 15,
          nextMatch: '2024-06-10',
          record: { wins: 6, draws: 0, losses: 3 },
          season: '2024',
          category: 'Liga Universitaria',
        },
      ];

      const mockMatches = [
        {
          id: '1',
          team: 'Ingeniería FC',
          opponent: 'Medicina FC',
          date: '2024-05-25',
          result: 'W',
          score: '3-1',
          needsStats: true,
        },
        {
          id: '2',
          team: 'Ingeniería BB',
          opponent: 'Derecho BB',
          date: '2024-05-23',
          result: 'L',
          score: '78-82',
          needsStats: false,
        },
      ];

      const mockActions = [
        {
          id: '1',
          type: 'stats',
          title: 'Registrar estadísticas',
          description: 'Partido Ingeniería FC vs Medicina FC',
          priority: 'high',
          icon: 'stats-chart',
        },
        {
          id: '2',
          type: 'photos',
          title: 'Subir fotos del entrenamiento',
          description: 'Sesión del martes 21 de mayo',
          priority: 'medium',
          icon: 'camera',
        },
        {
          id: '3',
          type: 'registration',
          title: 'Inscribir equipo al torneo',
          description: 'Copa Inter-facultades 2024',
          priority: 'high',
          icon: 'trophy',
        },
      ];

      const mockStats = {
        totalPlayers: 37,
        totalMatches: 28,
        winPercentage: 72,
        upcomingMatches: 4,
        totalWins: 20,
        totalLosses: 6,
        totalDraws: 2,
        goalsFor: 65,
        goalsAgainst: 32,
      };

      setMyTeams(mockTeams);
      setRecentMatches(mockMatches);
      setPendingActions(mockActions);
      setStats(mockStats);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return COLORS.error;
      case 'medium':
        return COLORS.warning;
      case 'low':
        return COLORS.success;
      default:
        return COLORS.gray;
    }
  };

  const CoachProfileCard = () => (
    <View style={styles.profileCard}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarSection}>
          <Image
            source={{
              uri:
                userProfile?.avatar ||
                userProfile?.profileImage ||
                `https://via.placeholder.com/${
                  responsive.avatar.medium
                }/${COLORS.secondary.replace('#', '')}/ffffff?text=${
                  userProfile?.firstName?.charAt(0) || 'C'
                }${userProfile?.lastName?.charAt(0) || 'M'}`,
            }}
            style={styles.avatar}
          />
          <View style={styles.onlineIndicator} />
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.coachName}>
            {userProfile?.displayName ||
              `${userProfile?.firstName || ''} ${
                userProfile?.lastName || ''
              }`.trim() ||
              'Entrenador'}
          </Text>
          <View style={styles.roleBadge}>
            <Ionicons
              name="fitness"
              size={responsive.iconSize.xs}
              color={COLORS.white}
            />
            <Text style={styles.roleText}>Entrenador</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons
            name="person-circle-outline"
            size={responsive.iconSize.md}
            color={COLORS.gray}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.profileDetails}>
        <View style={styles.detailItem}>
          <Ionicons
            name="mail-outline"
            size={responsive.iconSize.sm}
            color={COLORS.secondary}
          />
          <Text style={styles.detailText}>
            {user?.email || 'Email no disponible'}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons
            name="school-outline"
            size={responsive.iconSize.sm}
            color={COLORS.secondary}
          />
          <Text style={styles.detailText}>
            {userProfile?.faculty || 'Facultad no especificada'}
          </Text>
        </View>
      </View>
    </View>
  );

  const StatsOverview = () => (
    <View style={styles.statsCard}>
      <Text style={styles.sectionTitle}>Resumen General</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View
            style={[
              styles.statIcon,
              { backgroundColor: COLORS.secondary + '20' },
            ]}
          >
            <Ionicons
              name="people"
              size={responsive.iconSize.md}
              color={COLORS.secondary}
            />
          </View>
          <Text style={styles.statNumber}>{stats.totalPlayers}</Text>
          <Text style={styles.statLabel}>Jugadores</Text>
        </View>

        <View style={styles.statItem}>
          <View
            style={[
              styles.statIcon,
              { backgroundColor: COLORS.primary + '20' },
            ]}
          >
            <Ionicons
              name="calendar"
              size={responsive.iconSize.md}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.statNumber}>{stats.totalMatches}</Text>
          <Text style={styles.statLabel}>Partidos</Text>
        </View>

        <View style={styles.statItem}>
          <View
            style={[
              styles.statIcon,
              { backgroundColor: COLORS.success + '20' },
            ]}
          >
            <Ionicons
              name="trending-up"
              size={responsive.iconSize.md}
              color={COLORS.success}
            />
          </View>
          <Text style={styles.statNumber}>{stats.winPercentage}%</Text>
          <Text style={styles.statLabel}>Efectividad</Text>
        </View>

        <View style={styles.statItem}>
          <View
            style={[
              styles.statIcon,
              { backgroundColor: COLORS.warning + '20' },
            ]}
          >
            <Ionicons
              name="time"
              size={responsive.iconSize.md}
              color={COLORS.warning}
            />
          </View>
          <Text style={styles.statNumber}>{stats.upcomingMatches}</Text>
          <Text style={styles.statLabel}>Próximos</Text>
        </View>
      </View>

      <View style={styles.recordSection}>
        <View style={styles.recordItem}>
          <Text style={styles.recordNumber}>{stats.totalWins}</Text>
          <Text style={styles.recordLabel}>Victorias</Text>
        </View>
        <View style={styles.recordDivider} />
        <View style={styles.recordItem}>
          <Text style={styles.recordNumber}>{stats.totalDraws}</Text>
          <Text style={styles.recordLabel}>Empates</Text>
        </View>
        <View style={styles.recordDivider} />
        <View style={styles.recordItem}>
          <Text style={styles.recordNumber}>{stats.totalLosses}</Text>
          <Text style={styles.recordLabel}>Derrotas</Text>
        </View>
      </View>
    </View>
  );

  const QuickActions = () => {
    const actions = [
      { icon: 'stats-chart', title: 'Estadísticas', color: COLORS.secondary },
      { icon: 'camera', title: 'Fotos', color: COLORS.primary },
      { icon: 'trophy', title: 'Torneos', color: COLORS.warning },
      { icon: 'calendar', title: 'Partidos', color: COLORS.success },
    ];

    return (
      <View style={styles.quickActionsCard}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.actionsGrid}>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionButton}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: action.color + '20' },
                ]}
              >
                <Ionicons
                  name={action.icon}
                  size={responsive.iconSize.md}
                  color={action.color}
                />
              </View>
              <Text style={styles.actionLabel}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const TeamCard = ({ team }) => (
    <TouchableOpacity style={styles.teamCard} activeOpacity={0.7}>
      <View style={styles.teamHeader}>
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>{team.name}</Text>
          <Text style={styles.teamMeta}>
            {team.sport} • {team.category}
          </Text>
        </View>
        <View style={styles.teamRecord}>
          <Text style={styles.recordText}>
            {team.record.wins}G-{team.record.losses}P
            {team.record.draws > 0 && `-${team.record.draws}E`}
          </Text>
        </View>
      </View>

      <View style={styles.teamDetails}>
        <View style={styles.teamDetailItem}>
          <Ionicons
            name="people-outline"
            size={responsive.iconSize.sm}
            color={COLORS.gray}
          />
          <Text style={styles.teamDetailText}>{team.players} jugadores</Text>
        </View>
        <View style={styles.teamDetailItem}>
          <Ionicons
            name="calendar-outline"
            size={responsive.iconSize.sm}
            color={COLORS.gray}
          />
          <Text style={styles.teamDetailText}>
            Próximo:{' '}
            {new Date(team.nextMatch).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
            })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ActionCard = ({ action }) => (
    <TouchableOpacity style={styles.pendingActionCard} activeOpacity={0.7}>
      <View style={styles.actionContent}>
        <View
          style={[
            styles.actionIconContainer,
            { backgroundColor: getPriorityColor(action.priority) + '20' },
          ]}
        >
          <Ionicons
            name={action.icon}
            size={responsive.iconSize.sm}
            color={getPriorityColor(action.priority)}
          />
        </View>
        <View style={styles.actionInfo}>
          <Text style={styles.actionTitle}>{action.title}</Text>
          <Text style={styles.actionDescription}>{action.description}</Text>
        </View>
        <View
          style={[
            styles.priorityIndicator,
            { backgroundColor: getPriorityColor(action.priority) },
          ]}
        />
      </View>
    </TouchableOpacity>
  );

  const MatchCard = ({ match }) => (
    <View style={styles.matchCard}>
      <View style={styles.matchHeader}>
        <Text style={styles.matchTeams}>
          {match.team} vs {match.opponent}
        </Text>
        <View
          style={[
            styles.resultBadge,
            {
              backgroundColor:
                match.result === 'W'
                  ? COLORS.success + '20'
                  : match.result === 'L'
                  ? COLORS.error + '20'
                  : COLORS.warning + '20',
            },
          ]}
        >
          <Text
            style={[
              styles.resultText,
              {
                color:
                  match.result === 'W'
                    ? COLORS.success
                    : match.result === 'L'
                    ? COLORS.error
                    : COLORS.warning,
              },
            ]}
          >
            {match.result === 'W'
              ? 'Victoria'
              : match.result === 'L'
              ? 'Derrota'
              : 'Empate'}
          </Text>
        </View>
      </View>

      <Text style={styles.matchScore}>{match.score}</Text>
      <Text style={styles.matchDate}>
        {new Date(match.date).toLocaleDateString('es-ES', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })}
      </Text>

      {match.needsStats && (
        <View style={styles.needsStatsContainer}>
          <Ionicons
            name="warning"
            size={responsive.iconSize.sm}
            color={COLORS.warning}
          />
          <Text style={styles.needsStatsText}>
            Pendiente registrar estadísticas
          </Text>
        </View>
      )}
    </View>
  );

  if (loading || !userProfile) {
    return (
      <View style={globalStyles.container}>
        <Header title="Dashboard" />
        <Loading text="Cargando dashboard..." />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Header
        title="Dashboard"
        rightIcon="notifications-outline"
        onRightPress={() => {
          /* Notificaciones */
        }}
      />

      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Perfil del Entrenador */}
        <CoachProfileCard />

        {/* Estadísticas Generales */}
        <StatsOverview />

        {/* Acciones Rápidas */}
        <QuickActions />

        {/* Mis Equipos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mis Equipos</Text>
          {myTeams.map(team => (
            <TeamCard key={team.id} team={team} />
          ))}
        </View>

        {/* Acciones Pendientes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Pendientes</Text>
          {pendingActions.map(action => (
            <ActionCard key={action.id} action={action} />
          ))}
        </View>

        {/* Partidos Recientes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Partidos Recientes</Text>
          {recentMatches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: responsive.spacing.md,
  },
  section: {
    marginBottom: responsive.spacing.xl,
  },
  sectionTitle: {
    fontSize: responsive.fontSize.lg,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: responsive.spacing.md,
    paddingHorizontal: responsive.spacing.md,
  },

  // Profile Card
  profileCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: responsive.spacing.md,
    marginBottom: responsive.spacing.lg,
    borderRadius: 16,
    padding: responsive.spacing.lg,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.spacing.md,
  },
  avatarSection: {
    position: 'relative',
    marginRight: responsive.spacing.md,
  },
  avatar: {
    width: responsive.avatar.medium,
    height: responsive.avatar.medium,
    borderRadius: responsive.avatar.medium / 2,
    backgroundColor: COLORS.lightGray,
    borderWidth: 3,
    borderColor: COLORS.secondary,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  profileInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: responsive.fontSize.sm,
    color: COLORS.gray,
    marginBottom: responsive.spacing.xs / 2,
  },
  coachName: {
    fontSize: responsive.fontSize.xl,
    fontWeight: '700',
    color: COLORS.darkGray,
    marginBottom: responsive.spacing.xs,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    paddingVertical: responsive.spacing.xs / 2,
    paddingHorizontal: responsive.spacing.sm,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: responsive.fontSize.xs,
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: responsive.spacing.xs / 2,
  },
  profileButton: {
    padding: responsive.spacing.xs,
  },
  profileDetails: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: responsive.spacing.md,
    gap: responsive.spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: responsive.fontSize.sm,
    color: COLORS.gray,
    marginLeft: responsive.spacing.sm,
    flex: 1,
  },

  // Stats Card
  statsCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: responsive.spacing.md,
    marginBottom: responsive.spacing.lg,
    borderRadius: 16,
    padding: responsive.spacing.lg,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: responsive.spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: isSmallScreen ? 40 : 48,
    height: isSmallScreen ? 40 : 48,
    borderRadius: isSmallScreen ? 20 : 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsive.spacing.sm,
  },
  statNumber: {
    fontSize: responsive.fontSize.xl,
    fontWeight: '700',
    color: COLORS.darkGray,
    marginBottom: responsive.spacing.xs / 2,
  },
  statLabel: {
    fontSize: responsive.fontSize.xs,
    color: COLORS.gray,
    textAlign: 'center',
  },
  recordSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: responsive.spacing.md,
  },
  recordItem: {
    alignItems: 'center',
  },
  recordNumber: {
    fontSize: responsive.fontSize.lg,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: responsive.spacing.xs / 2,
  },
  recordLabel: {
    fontSize: responsive.fontSize.xs,
    color: COLORS.gray,
  },
  recordDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.lightGray,
  },

  // Quick Actions
  quickActionsCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: responsive.spacing.md,
    marginBottom: responsive.spacing.lg,
    borderRadius: 16,
    padding: responsive.spacing.lg,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: responsive.spacing.md,
  },
  actionIcon: {
    width: isSmallScreen ? 40 : 48,
    height: isSmallScreen ? 40 : 48,
    borderRadius: isSmallScreen ? 20 : 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsive.spacing.sm,
  },
  actionLabel: {
    fontSize: responsive.fontSize.xs,
    color: COLORS.darkGray,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Team Cards
  teamCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: responsive.spacing.md,
    marginBottom: responsive.spacing.sm,
    borderRadius: 12,
    padding: responsive.spacing.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: responsive.spacing.sm,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: responsive.fontSize.md,
    fontWeight: '700',
    color: COLORS.darkGray,
    marginBottom: responsive.spacing.xs / 2,
  },
  teamMeta: {
    fontSize: responsive.fontSize.xs,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  teamRecord: {
    backgroundColor: COLORS.secondary + '20',
    borderRadius: 8,
    paddingHorizontal: responsive.spacing.sm,
    paddingVertical: responsive.spacing.xs / 2,
  },
  recordText: {
    fontSize: responsive.fontSize.xs,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  teamDetails: {
    gap: responsive.spacing.xs,
  },
  teamDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamDetailText: {
    fontSize: responsive.fontSize.sm,
    color: COLORS.gray,
    marginLeft: responsive.spacing.xs,
  },

  // Pending Actions
  pendingActionCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: responsive.spacing.md,
    marginBottom: responsive.spacing.sm,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: responsive.spacing.md,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsive.spacing.sm,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: responsive.fontSize.sm,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: responsive.spacing.xs / 2,
  },
  actionDescription: {
    fontSize: responsive.fontSize.xs,
    color: COLORS.gray,
  },
  priorityIndicator: {
    width: 4,
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
  },

  // Match Cards
  matchCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: responsive.spacing.md,
    marginBottom: responsive.spacing.sm,
    borderRadius: 12,
    padding: responsive.spacing.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsive.spacing.sm,
  },
  matchTeams: {
    fontSize: responsive.fontSize.sm,
    fontWeight: '600',
    color: COLORS.darkGray,
    flex: 1,
  },
  resultBadge: {
    borderRadius: 8,
    paddingHorizontal: responsive.spacing.sm,
    paddingVertical: responsive.spacing.xs / 2,
  },
  resultText: {
    fontSize: responsive.fontSize.xs,
    fontWeight: '600',
  },
  matchScore: {
    fontSize: responsive.fontSize.lg,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: responsive.spacing.xs,
  },
  matchDate: {
    fontSize: responsive.fontSize.xs,
    color: COLORS.gray,
    marginBottom: responsive.spacing.xs,
    textTransform: 'capitalize',
  },
  needsStatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning + '20',
    borderRadius: 8,
    paddingHorizontal: responsive.spacing.sm,
    paddingVertical: responsive.spacing.xs,
  },
  needsStatsText: {
    fontSize: responsive.fontSize.xs,
    color: COLORS.warning,
    fontWeight: '600',
    marginLeft: responsive.spacing.xs,
  },

  bottomPadding: {
    height: responsive.spacing.xl,
  },
});

export default CoachDashboard;
