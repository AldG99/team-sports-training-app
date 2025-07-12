import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, USER_TYPES } from '../../utils/constants';
import { globalStyles } from '../../styles/globalStyles';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import authService from '../../services/authService';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Breakpoints responsivos
const isSmallScreen = screenWidth < 360;
const isMediumScreen = screenWidth >= 360 && screenWidth < 414;
const isLargeScreen = screenWidth >= 414;

// Función para escalar dimensiones
const scale = size => {
  if (isSmallScreen) return size * 0.85;
  if (isMediumScreen) return size * 0.95;
  return size;
};

// Función para obtener padding responsivo
const getResponsivePadding = () => {
  return {
    horizontal: Math.max(scale(16), screenWidth * 0.04), // 4% del ancho
    vertical: Math.max(scale(12), screenHeight * 0.015), // 1.5% del alto
    section: Math.max(scale(16), screenHeight * 0.02), // 2% del alto
  };
};

// Función para obtener tamaños de elementos
const getElementSizes = () => {
  return {
    profileImage: Math.min(scale(60), screenWidth * 0.15),
    photoImage: Math.min(scale(80), screenWidth * 0.2),
    statCardWidth: Math.max(scale(180), screenWidth * 0.45),
    quickActionSize: Math.max(scale(70), screenWidth * 0.18),
  };
};

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const padding = getResponsivePadding();
  const sizes = getElementSizes();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [featuredStats, setFeaturedStats] = useState([]);
  const [recentPhotos, setRecentPhotos] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    loadHomeData();
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const { userProfile: currentProfile } = authService.getCurrentUser();
      setUserProfile(currentProfile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const getUserRoleText = userType => {
    switch (userType) {
      case USER_TYPES.STUDENT:
        return 'Estudiante';
      case USER_TYPES.COACH:
        return 'Entrenador';
      case USER_TYPES.ADMIN:
        return 'Administrador';
      default:
        return 'Usuario';
    }
  };

  const loadHomeData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      setFeaturedStats([
        {
          id: 1,
          title: 'Goles esta temporada',
          value: '12',
          sport: 'Fútbol',
          icon: 'football',
        },
        {
          id: 2,
          title: 'Puntos promedio',
          value: '18.5',
          sport: 'Basquetbol',
          icon: 'basketball',
        },
        {
          id: 3,
          title: 'Partidos ganados',
          value: '8/10',
          sport: 'General',
          icon: 'trophy',
        },
      ]);

      setRecentPhotos([
        {
          id: 1,
          uri: 'https://picsum.photos/100/100?random=1',
          team: 'Ingeniería FC',
        },
        {
          id: 2,
          uri: 'https://picsum.photos/100/100?random=2',
          team: 'Medicina BB',
        },
        {
          id: 3,
          uri: 'https://picsum.photos/100/100?random=3',
          team: 'Derecho VB',
        },
      ]);

      setUpcomingMatches([
        {
          id: 1,
          homeTeam: 'Mi Equipo',
          awayTeam: 'Rival FC',
          date: '2024-06-15',
          time: '15:00',
          sport: 'Fútbol',
        },
        {
          id: 2,
          homeTeam: 'Basquet Pro',
          awayTeam: 'Mi Equipo',
          date: '2024-06-18',
          time: '18:00',
          sport: 'Basquetbol',
        },
      ]);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    await loadUserProfile();
    setRefreshing(false);
  };

  const UserWelcomeCard = () => (
    <Card
      variant="comfortable"
      elevationLevel="medium"
      style={[
        styles.welcomeCard,
        {
          marginHorizontal: padding.horizontal,
          marginBottom: padding.section,
        },
      ]}
    >
      <View style={styles.userWelcomeContent}>
        <TouchableOpacity
          style={styles.profileImageContainer}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.8}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            source={{
              uri:
                userProfile?.profileImage ||
                'https://via.placeholder.com/80/06597d/ffffff?text=Usuario',
            }}
            style={[
              styles.profileImage,
              {
                width: sizes.profileImage,
                height: sizes.profileImage,
                borderRadius: sizes.profileImage / 2,
              },
            ]}
          />
          <View
            style={[
              styles.onlineIndicator,
              {
                width: scale(14),
                height: scale(14),
                borderRadius: scale(7),
                borderWidth: scale(2),
                bottom: scale(2),
                right: scale(2),
              },
            ]}
          />
        </TouchableOpacity>

        <View style={[styles.userInfo, { marginLeft: scale(12) }]}>
          <Text style={[styles.welcomeText, { fontSize: scale(13) }]}>
            ¡Hola!
          </Text>
          <Text
            style={[
              styles.userName,
              {
                fontSize: scale(16),
                marginBottom: scale(4),
              },
            ]}
          >
            {userProfile?.displayName ||
              `${userProfile?.firstName} ${userProfile?.lastName}` ||
              'Usuario'}
          </Text>
          <View
            style={[
              styles.userRoleBadge,
              {
                borderRadius: scale(10),
                paddingVertical: scale(3),
                paddingHorizontal: scale(8),
                marginBottom: scale(3),
              },
            ]}
          >
            <Ionicons
              name={
                userProfile?.userType === USER_TYPES.COACH
                  ? 'fitness'
                  : 'school'
              }
              size={scale(11)}
              color={COLORS.white}
            />
            <Text
              style={[
                styles.userRoleText,
                {
                  fontSize: scale(10),
                  marginLeft: scale(3),
                },
              ]}
            >
              {getUserRoleText(userProfile?.userType)}
            </Text>
          </View>
          {userProfile?.faculty && (
            <Text style={[styles.userFaculty, { fontSize: scale(12) }]}>
              📚 {userProfile.faculty}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.notificationButton, { padding: scale(8) }]}
          onPress={() => {
            /* Handle notifications */
          }}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="notifications-outline"
            size={scale(22)}
            color={COLORS.secondary}
          />
          <View
            style={[
              styles.notificationBadge,
              {
                width: scale(14),
                height: scale(14),
                borderRadius: scale(7),
                top: scale(4),
                right: scale(4),
              },
            ]}
          >
            <Text style={[styles.notificationCount, { fontSize: scale(9) }]}>
              3
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const StatCard = ({ stat }) => (
    <Card
      variant="default"
      elevationLevel="low"
      style={[
        styles.statCard,
        {
          width: sizes.statCardWidth,
          marginRight: scale(12),
        },
      ]}
    >
      <View style={styles.statContent}>
        <View
          style={[
            styles.statIconContainer,
            {
              width: scale(40),
              height: scale(40),
              borderRadius: scale(20),
              marginRight: scale(12),
            },
          ]}
        >
          <Ionicons
            name={stat.icon}
            size={scale(22)}
            color={COLORS.secondary}
          />
        </View>
        <View style={styles.statText}>
          <Text style={[styles.statValue, { fontSize: scale(20) }]}>
            {stat.value}
          </Text>
          <Text
            style={[
              styles.statTitle,
              {
                fontSize: scale(12),
                marginTop: scale(2),
              },
            ]}
          >
            {stat.title}
          </Text>
          <Text
            style={[
              styles.statSport,
              {
                fontSize: scale(10),
                marginTop: scale(1),
              },
            ]}
          >
            {stat.sport}
          </Text>
        </View>
      </View>
    </Card>
  );

  const PhotoCard = ({ photo }) => (
    <TouchableOpacity
      style={[styles.photoCard, { marginRight: scale(12) }]}
      onPress={() => navigation.navigate('Gallery')}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: photo.uri }}
        style={[
          styles.photoImage,
          {
            width: sizes.photoImage,
            height: sizes.photoImage,
            borderRadius: sizes.photoImage / 2,
          },
        ]}
      />
      <Text
        style={[
          styles.photoTeam,
          {
            fontSize: scale(11),
            marginTop: scale(6),
            maxWidth: sizes.photoImage,
          },
        ]}
      >
        {photo.team}
      </Text>
    </TouchableOpacity>
  );

  const MatchCard = ({ match }) => (
    <Card
      variant="compact"
      elevationLevel="low"
      style={[
        styles.matchCard,
        {
          marginHorizontal: padding.horizontal,
          marginVertical: scale(4),
        },
      ]}
    >
      <View style={[styles.matchHeader, { marginBottom: scale(8) }]}>
        <Text style={[styles.matchSport, { fontSize: scale(11) }]}>
          {match.sport}
        </Text>
        <Text style={[styles.matchDate, { fontSize: scale(11) }]}>
          {match.date} - {match.time}
        </Text>
      </View>
      <View style={styles.matchTeams}>
        <Text
          style={[
            styles.matchTeam,
            {
              fontSize: scale(14),
              flex: 1,
            },
          ]}
        >
          {match.homeTeam}
        </Text>
        <Text
          style={[
            styles.matchVs,
            {
              fontSize: scale(12),
              marginHorizontal: scale(12),
            },
          ]}
        >
          VS
        </Text>
        <Text
          style={[
            styles.matchTeam,
            {
              fontSize: scale(14),
              flex: 1,
              textAlign: 'right',
            },
          ]}
        >
          {match.awayTeam}
        </Text>
      </View>
    </Card>
  );

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Header
          title="SportCampus"
          variant={isSmallScreen ? 'compact' : 'default'}
        />
        <Loading variant="default" animation="scale" />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Header
        title="SportCampus"
        variant={isSmallScreen ? 'compact' : 'default'}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingBottom: insets.bottom + scale(20),
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.secondary}
            colors={[COLORS.secondary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Bienvenida */}
        <UserWelcomeCard />

        {/* Estadísticas Destacadas */}
        <View style={[styles.section, { marginVertical: padding.section }]}>
          <View
            style={[
              styles.sectionHeader,
              {
                paddingHorizontal: padding.horizontal,
                marginBottom: scale(12),
              },
            ]}
          >
            <Text style={[styles.sectionTitle, { fontSize: scale(16) }]}>
              Estadísticas Destacadas
            </Text>
          </View>
          <FlatList
            data={featuredStats}
            renderItem={({ item }) => <StatCard stat={item} />}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingLeft: padding.horizontal,
              paddingRight: scale(4),
            }}
          />
        </View>

        {/* Próximos Partidos */}
        <View style={[styles.section, { marginVertical: padding.section }]}>
          <View
            style={[
              styles.sectionHeader,
              {
                paddingHorizontal: padding.horizontal,
                marginBottom: scale(12),
              },
            ]}
          >
            <Text style={[styles.sectionTitle, { fontSize: scale(16) }]}>
              Próximos Partidos
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Tournaments')}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.seeAllText, { fontSize: scale(13) }]}>
                Ver todos
              </Text>
            </TouchableOpacity>
          </View>
          {upcomingMatches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </View>

        {/* Fotos Recientes */}
        <View style={[styles.section, { marginVertical: padding.section }]}>
          <View
            style={[
              styles.sectionHeader,
              {
                paddingHorizontal: padding.horizontal,
                marginBottom: scale(12),
              },
            ]}
          >
            <Text style={[styles.sectionTitle, { fontSize: scale(16) }]}>
              Fotos Recientes
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Gallery')}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.seeAllText, { fontSize: scale(13) }]}>
                Ver galería
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recentPhotos}
            renderItem={({ item }) => <PhotoCard photo={item} />}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingLeft: padding.horizontal,
              paddingRight: scale(4),
            }}
          />
        </View>

        {/* Accesos Rápidos */}
        <View style={[styles.section, { marginVertical: padding.section }]}>
          <View
            style={[
              styles.sectionHeader,
              {
                paddingHorizontal: padding.horizontal,
                marginBottom: scale(12),
              },
            ]}
          >
            <Text style={[styles.sectionTitle, { fontSize: scale(16) }]}>
              Accesos Rápidos
            </Text>
          </View>
          <View
            style={[
              styles.quickActions,
              {
                paddingHorizontal: padding.horizontal,
                gap: scale(12),
              },
            ]}
          >
            {[
              {
                icon: 'bar-chart',
                text: 'Mis Stats',
                screen: 'Stats',
                color: '#3B82F6',
              },
              {
                icon: 'shield',
                text: 'Mi Equipo',
                screen: 'MyTeam',
                color: '#10B981',
              },
              {
                icon: 'trophy',
                text: 'Torneos',
                screen: 'Tournaments',
                color: '#F59E0B',
              },
              {
                icon: 'images',
                text: 'Galería',
                screen: 'Gallery',
                color: '#8B5CF6',
              },
            ].map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.quickAction,
                  {
                    width: sizes.quickActionSize,
                    height: sizes.quickActionSize,
                    borderRadius: scale(16),
                    padding: scale(12),
                  },
                ]}
                onPress={() => navigation.navigate(action.screen)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.quickActionIconContainer,
                    {
                      backgroundColor: `${action.color}20`,
                      width: scale(32),
                      height: scale(32),
                      borderRadius: scale(16),
                      marginBottom: scale(6),
                    },
                  ]}
                >
                  <Ionicons
                    name={action.icon}
                    size={scale(18)}
                    color={action.color}
                  />
                </View>
                <Text
                  style={[
                    styles.quickActionText,
                    {
                      fontSize: scale(10),
                    },
                  ]}
                >
                  {action.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  welcomeCard: {
    // margins se manejan dinámicamente
  },
  userWelcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    backgroundColor: COLORS.lightGray || '#F3F4F6',
  },
  onlineIndicator: {
    position: 'absolute',
    backgroundColor: COLORS.success || '#10B981',
    borderColor: COLORS.white || '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    color: COLORS.gray || '#6B7280',
    fontWeight: '500',
    marginBottom: scale(2),
  },
  userName: {
    fontWeight: '700',
    color: COLORS.darkGray || '#374151',
    letterSpacing: 0.3,
  },
  userRoleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary || '#4CAF50',
    alignSelf: 'flex-start',
  },
  userRoleText: {
    color: COLORS.white || '#ffffff',
    fontWeight: '600',
  },
  userFaculty: {
    color: COLORS.gray || '#6B7280',
    fontWeight: '500',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    backgroundColor: COLORS.error || '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: COLORS.white || '#ffffff',
    fontWeight: '700',
  },
  section: {
    // margins se manejan dinámicamente
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: '700',
    color: COLORS.white || '#ffffff',
    letterSpacing: 0.3,
  },
  seeAllText: {
    color: COLORS.secondary || '#4CAF50',
    fontWeight: '600',
  },
  statCard: {
    // width y margin se manejan dinámicamente
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    backgroundColor: `${COLORS.secondary || '#4CAF50'}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statText: {
    flex: 1,
  },
  statValue: {
    fontWeight: '700',
    color: COLORS.darkGray || '#374151',
    letterSpacing: 0.5,
  },
  statTitle: {
    color: COLORS.gray || '#6B7280',
    fontWeight: '500',
  },
  statSport: {
    color: COLORS.secondary || '#4CAF50',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  matchCard: {
    // margins se manejan dinámicamente
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchSport: {
    color: COLORS.secondary || '#4CAF50',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  matchDate: {
    color: COLORS.gray || '#6B7280',
    fontWeight: '500',
  },
  matchTeams: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchTeam: {
    fontWeight: '600',
    color: COLORS.darkGray || '#374151',
  },
  matchVs: {
    color: COLORS.gray || '#6B7280',
    fontWeight: '700',
    letterSpacing: 1,
  },
  photoCard: {
    alignItems: 'center',
  },
  photoImage: {
    backgroundColor: COLORS.lightGray || '#F3F4F6',
  },
  photoTeam: {
    color: COLORS.white || '#ffffff',
    textAlign: 'center',
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    backgroundColor: COLORS.white || '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionText: {
    color: COLORS.darkGray || '#374151',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});

export default HomeScreen;
