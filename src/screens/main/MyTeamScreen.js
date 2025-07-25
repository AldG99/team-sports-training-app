import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPORTS } from '../../utils/constants';
import { globalStyles } from '../../styles/globalStyles';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';

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
    teamLogo: Math.min(scale(60), screenWidth * 0.15),
    playerAvatar: Math.min(scale(50), screenWidth * 0.12),
    galleryImage: (screenWidth - scale(48)) / 3, // 3 columnas con margen
    quickStatCard: (screenWidth - scale(64)) / 3, // 3 columnas
  };
};

const MyTeamScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const padding = getResponsivePadding();
  const sizes = getElementSizes();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [teamData, setTeamData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [teamStats, setTeamStats] = useState({});
  const [selectedTab, setSelectedTab] = useState('players');

  const tabs = [
    { id: 'players', name: 'Jugadores', icon: 'people' },
    { id: 'matches', name: 'Partidos', icon: 'calendar' },
    { id: 'stats', name: 'Estadísticas', icon: 'bar-chart' },
    { id: 'gallery', name: 'Fotos', icon: 'images' },
  ];

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockTeamData = {
        id: '1',
        name: 'Ingeniería FC',
        sport: SPORTS.FUTBOL,
        faculty: 'Ingeniería',
        founded: '2020',
        coach: 'Carlos Mendoza',
        captain: 'Juan Pérez',
        homeField: 'Campo Principal Universidad',
        wins: 12,
        losses: 3,
        draws: 2,
        goalsFor: 35,
        goalsAgainst: 18,
        position: 2,
        totalTeams: 16,
        logo: 'https://via.placeholder.com/100',
        colors: ['#1e3a8a', '#ffffff'],
      };

      const mockPlayers = [
        {
          id: '1',
          name: 'Juan Pérez',
          position: 'Delantero',
          number: 10,
          age: 22,
          isCaptain: true,
          avatar: 'https://via.placeholder.com/60',
          stats: { goles: 8, asistencias: 5, partidos: 15 },
        },
        {
          id: '2',
          name: 'Carlos López',
          position: 'Portero',
          number: 1,
          age: 23,
          isCaptain: false,
          avatar: 'https://via.placeholder.com/60',
          stats: { goles: 0, asistencias: 0, partidos: 17 },
        },
        {
          id: '3',
          name: 'Ana García',
          position: 'Mediocampista',
          number: 8,
          age: 21,
          isCaptain: false,
          avatar: 'https://via.placeholder.com/60',
          stats: { goles: 3, asistencias: 12, partidos: 16 },
        },
        {
          id: '4',
          name: 'Luis Torres',
          position: 'Defensa',
          number: 4,
          age: 24,
          isCaptain: false,
          avatar: 'https://via.placeholder.com/60',
          stats: { goles: 1, asistencias: 2, partidos: 15 },
        },
        {
          id: '5',
          name: 'María Rodríguez',
          position: 'Delantera',
          number: 11,
          age: 20,
          isCaptain: false,
          avatar: 'https://via.placeholder.com/60',
          stats: { goles: 6, asistencias: 4, partidos: 14 },
        },
      ];

      const mockRecentMatches = [
        {
          id: '1',
          opponent: 'Medicina FC',
          date: '2024-05-25',
          result: 'W',
          scoreHome: 3,
          scoreAway: 1,
          isHome: true,
        },
        {
          id: '2',
          opponent: 'Derecho United',
          date: '2024-05-18',
          result: 'D',
          scoreHome: 2,
          scoreAway: 2,
          isHome: false,
        },
        {
          id: '3',
          opponent: 'Economía FC',
          date: '2024-05-11',
          result: 'W',
          scoreHome: 4,
          scoreAway: 0,
          isHome: true,
        },
      ];

      const mockUpcomingMatches = [
        {
          id: '4',
          opponent: 'Psicología FC',
          date: '2024-06-08',
          time: '15:00',
          location: 'Campo Principal',
          isHome: true,
          tournament: 'Liga Inter-facultades',
        },
        {
          id: '5',
          opponent: 'Arquitectura FC',
          date: '2024-06-15',
          time: '17:30',
          location: 'Campo Auxiliar',
          isHome: false,
          tournament: 'Copa Universitaria',
        },
      ];

      const mockTeamStats = {
        ranking: 2,
        points: 38,
        goalsDifference: 17,
        cleanSheets: 8,
        yellowCards: 12,
        redCards: 1,
        topScorer: 'Juan Pérez (8 goles)',
        topAssist: 'Ana García (12 asistencias)',
      };

      setTeamData(mockTeamData);
      setPlayers(mockPlayers);
      setRecentMatches(mockRecentMatches);
      setUpcomingMatches(mockUpcomingMatches);
      setTeamStats(mockTeamStats);
    } catch (error) {
      console.error('Error loading team data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTeamData();
    setRefreshing(false);
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
    });
  };

  const getResultColor = result => {
    switch (result) {
      case 'W':
        return COLORS.success || '#10B981';
      case 'L':
        return COLORS.error || '#EF4444';
      case 'D':
        return COLORS.warning || '#F59E0B';
      default:
        return COLORS.gray || '#6B7280';
    }
  };

  const getResultText = result => {
    switch (result) {
      case 'W':
        return 'Victoria';
      case 'L':
        return 'Derrota';
      case 'D':
        return 'Empate';
      default:
        return 'Pendiente';
    }
  };

  const PlayerCard = ({ player }) => (
    <Card
      variant="default"
      elevationLevel="low"
      style={[
        styles.playerCard,
        {
          marginHorizontal: padding.horizontal,
          marginVertical: scale(6),
        },
      ]}
    >
      <View style={[styles.playerHeader, { marginBottom: scale(12) }]}>
        <Image
          source={{ uri: player.avatar }}
          style={[
            styles.playerAvatar,
            {
              width: sizes.playerAvatar,
              height: sizes.playerAvatar,
              borderRadius: sizes.playerAvatar / 2,
            },
          ]}
        />
        <View style={[styles.playerInfo, { marginLeft: scale(12) }]}>
          <View style={[styles.playerNameRow, { marginBottom: scale(4) }]}>
            <Text
              style={[
                styles.playerName,
                {
                  fontSize: scale(15),
                  marginRight: scale(8),
                },
              ]}
            >
              {player.name}
            </Text>
            {player.isCaptain && (
              <View
                style={[
                  styles.captainBadge,
                  {
                    backgroundColor: `${COLORS.secondary || '#4CAF50'}20`,
                    borderRadius: scale(10),
                    paddingHorizontal: scale(6),
                    paddingVertical: scale(2),
                  },
                ]}
              >
                <Ionicons
                  name="star"
                  size={scale(12)}
                  color={COLORS.secondary || '#4CAF50'}
                />
                <Text
                  style={[
                    styles.captainText,
                    {
                      fontSize: scale(9),
                      marginLeft: scale(3),
                    },
                  ]}
                >
                  C
                </Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.playerPosition,
              {
                fontSize: scale(13),
                marginBottom: scale(2),
              },
            ]}
          >
            {player.position}
          </Text>
          <Text style={[styles.playerDetails, { fontSize: scale(11) }]}>
            #{player.number} • {player.age} años
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.playerStats,
          {
            paddingTop: scale(12),
            borderTopWidth: scale(1),
          },
        ]}
      >
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { fontSize: scale(16) }]}>
            {player.stats.goles}
          </Text>
          <Text
            style={[
              styles.statLabel,
              {
                fontSize: scale(11),
                marginTop: scale(2),
              },
            ]}
          >
            Goles
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { fontSize: scale(16) }]}>
            {player.stats.asistencias}
          </Text>
          <Text
            style={[
              styles.statLabel,
              {
                fontSize: scale(11),
                marginTop: scale(2),
              },
            ]}
          >
            Asistencias
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { fontSize: scale(16) }]}>
            {player.stats.partidos}
          </Text>
          <Text
            style={[
              styles.statLabel,
              {
                fontSize: scale(11),
                marginTop: scale(2),
              },
            ]}
          >
            Partidos
          </Text>
        </View>
      </View>
    </Card>
  );

  const MatchCard = ({ match, isRecent = true }) => (
    <Card
      variant="compact"
      elevationLevel="low"
      style={[
        styles.matchCard,
        {
          marginHorizontal: padding.horizontal,
          marginVertical: scale(6),
        },
      ]}
    >
      <View style={[styles.matchHeader, { marginBottom: scale(8) }]}>
        <Text style={[styles.matchDate, { fontSize: scale(11) }]}>
          {isRecent
            ? formatDate(match.date)
            : `${formatDate(match.date)} ${match.time}`}
        </Text>
        {isRecent && (
          <View
            style={[
              styles.resultBadge,
              {
                backgroundColor: getResultColor(match.result),
                borderRadius: scale(10),
                paddingVertical: scale(3),
                paddingHorizontal: scale(8),
              },
            ]}
          >
            <Text style={[styles.resultText, { fontSize: scale(10) }]}>
              {match.result}
            </Text>
          </View>
        )}
      </View>

      <View style={[styles.matchDetails, { marginBottom: scale(8) }]}>
        <Text
          style={[
            styles.matchTeams,
            {
              fontSize: scale(14),
              marginBottom: scale(4),
            },
          ]}
        >
          {match.isHome
            ? `${teamData?.name} vs ${match.opponent}`
            : `${match.opponent} vs ${teamData?.name}`}
        </Text>

        {isRecent ? (
          <Text style={[styles.matchScore, { fontSize: scale(16) }]}>
            {match.isHome
              ? `${match.scoreHome} - ${match.scoreAway}`
              : `${match.scoreAway} - ${match.scoreHome}`}
          </Text>
        ) : (
          <View style={[styles.upcomingDetails, { marginTop: scale(4) }]}>
            <Text
              style={[
                styles.matchLocation,
                {
                  fontSize: scale(12),
                  marginBottom: scale(2),
                },
              ]}
            >
              📍 {match.location}
            </Text>
            <Text style={[styles.matchTournament, { fontSize: scale(12) }]}>
              🏆 {match.tournament}
            </Text>
          </View>
        )}
      </View>

      {isRecent && (
        <Text style={[styles.matchResult, { fontSize: scale(12) }]}>
          {getResultText(match.result)}
        </Text>
      )}
    </Card>
  );

  const TeamStatsTab = () => (
    <View style={[styles.tabContent, { paddingBottom: scale(20) }]}>
      <Card
        variant="comfortable"
        elevationLevel="medium"
        style={[
          styles.statsCard,
          {
            marginHorizontal: padding.horizontal,
            marginVertical: scale(8),
          },
        ]}
      >
        <Text
          style={[
            styles.statsTitle,
            {
              fontSize: scale(15),
              marginBottom: scale(12),
            },
          ]}
        >
          Posición en Liga
        </Text>
        <View style={[styles.rankingContainer, { paddingVertical: scale(16) }]}>
          <Text style={[styles.rankingPosition, { fontSize: scale(40) }]}>
            #{teamStats.ranking}
          </Text>
          <Text
            style={[
              styles.rankingTotal,
              {
                fontSize: scale(13),
                marginTop: scale(4),
              },
            ]}
          >
            de {teamData?.totalTeams} equipos
          </Text>
        </View>
      </Card>

      <Card
        variant="default"
        elevationLevel="low"
        style={[
          styles.statsCard,
          {
            marginHorizontal: padding.horizontal,
            marginVertical: scale(8),
          },
        ]}
      >
        <Text
          style={[
            styles.statsTitle,
            {
              fontSize: scale(15),
              marginBottom: scale(12),
            },
          ]}
        >
          Estadísticas Generales
        </Text>
        <View style={[styles.statsGrid, { marginTop: scale(8) }]}>
          {[
            { label: 'Puntos:', value: teamStats.points, color: null },
            {
              label: 'Diferencia de goles:',
              value: `+${teamStats.goalsDifference}`,
              color: COLORS.success,
            },
            {
              label: 'Porterías a cero:',
              value: teamStats.cleanSheets,
              color: null,
            },
            {
              label: 'Tarjetas amarillas:',
              value: teamStats.yellowCards,
              color: null,
            },
            {
              label: 'Tarjetas rojas:',
              value: teamStats.redCards,
              color: null,
            },
          ].map((stat, index) => (
            <View
              key={index}
              style={[
                styles.statRow,
                {
                  paddingVertical: scale(8),
                  borderBottomWidth: scale(1),
                },
              ]}
            >
              <Text style={[styles.statRowLabel, { fontSize: scale(13) }]}>
                {stat.label}
              </Text>
              <Text
                style={[
                  styles.statRowValue,
                  {
                    fontSize: scale(13),
                    color: stat.color || COLORS.darkGray || '#374151',
                  },
                ]}
              >
                {stat.value}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <Card
        variant="default"
        elevationLevel="low"
        style={[
          styles.statsCard,
          {
            marginHorizontal: padding.horizontal,
            marginVertical: scale(8),
          },
        ]}
      >
        <Text
          style={[
            styles.statsTitle,
            {
              fontSize: scale(15),
              marginBottom: scale(12),
            },
          ]}
        >
          Destacados
        </Text>
        <View style={[styles.highlightsContainer, { marginTop: scale(8) }]}>
          <View style={[styles.highlight, { paddingVertical: scale(8) }]}>
            <View
              style={[
                styles.highlightIcon,
                {
                  backgroundColor: `${COLORS.secondary || '#4CAF50'}15`,
                  width: scale(32),
                  height: scale(32),
                  borderRadius: scale(16),
                  marginRight: scale(12),
                },
              ]}
            >
              <Ionicons
                name="football"
                size={scale(16)}
                color={COLORS.secondary || '#4CAF50'}
              />
            </View>
            <Text style={[styles.highlightText, { fontSize: scale(13) }]}>
              Máximo goleador: {teamStats.topScorer}
            </Text>
          </View>
          <View style={[styles.highlight, { paddingVertical: scale(8) }]}>
            <View
              style={[
                styles.highlightIcon,
                {
                  backgroundColor: `${COLORS.secondary || '#4CAF50'}15`,
                  width: scale(32),
                  height: scale(32),
                  borderRadius: scale(16),
                  marginRight: scale(12),
                },
              ]}
            >
              <Ionicons
                name="hand-left"
                size={scale(16)}
                color={COLORS.secondary || '#4CAF50'}
              />
            </View>
            <Text style={[styles.highlightText, { fontSize: scale(13) }]}>
              Más asistencias: {teamStats.topAssist}
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );

  const GalleryTab = () => (
    <View style={[styles.tabContent, { paddingBottom: scale(20) }]}>
      <View
        style={[
          styles.galleryPreview,
          {
            marginHorizontal: padding.horizontal,
            marginVertical: scale(16),
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            {
              fontSize: scale(16),
              marginBottom: scale(16),
            },
          ]}
        >
          Fotos del Equipo
        </Text>
        <View style={[styles.photoGrid, { marginBottom: scale(16) }]}>
          {[1, 2, 3, 4, 5, 6].map(item => (
            <Image
              key={item}
              source={{ uri: `https://picsum.photos/100/100?random=${item}` }}
              style={[
                styles.galleryImage,
                {
                  width: sizes.galleryImage,
                  height: sizes.galleryImage,
                  borderRadius: scale(8),
                  marginBottom: scale(8),
                },
              ]}
            />
          ))}
        </View>
        <Button
          title="Ver todas las fotos"
          type="outline"
          onPress={() => navigation.navigate('Gallery')}
          size={isSmallScreen ? 'medium' : 'large'}
          fullWidth
        />
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'players':
        return (
          <FlatList
            data={players}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <PlayerCard player={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.tabContent,
              {
                paddingBottom: insets.bottom + scale(20),
              },
            ]}
          />
        );
      case 'matches':
        return (
          <ScrollView
            style={styles.tabContent}
            contentContainerStyle={{
              paddingBottom: insets.bottom + scale(20),
            }}
            showsVerticalScrollIndicator={false}
          >
            <Text
              style={[
                styles.sectionTitle,
                {
                  fontSize: scale(16),
                  marginVertical: scale(16),
                  paddingHorizontal: padding.horizontal,
                },
              ]}
            >
              Próximos Partidos
            </Text>
            {upcomingMatches.map(match => (
              <MatchCard key={match.id} match={match} isRecent={false} />
            ))}

            <Text
              style={[
                styles.sectionTitle,
                {
                  fontSize: scale(16),
                  marginVertical: scale(16),
                  paddingHorizontal: padding.horizontal,
                },
              ]}
            >
              Resultados Recientes
            </Text>
            {recentMatches.map(match => (
              <MatchCard key={match.id} match={match} isRecent={true} />
            ))}
          </ScrollView>
        );
      case 'stats':
        return <TeamStatsTab />;
      case 'gallery':
        return <GalleryTab />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Header
          title="Mi Equipo"
          variant={isSmallScreen ? 'compact' : 'default'}
        />
        <Loading variant="default" animation="scale" />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Header
        title="Mi Equipo"
        rightIcon="settings-outline"
        onRightPress={() =>
          Alert.alert('Configuración', 'Funcionalidad próximamente')
        }
        variant={isSmallScreen ? 'compact' : 'default'}
      />

      <ScrollView
        style={styles.container}
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
        {/* Header del Equipo */}
        <Card
          variant="comfortable"
          elevationLevel="medium"
          style={[
            styles.teamHeader,
            {
              marginHorizontal: padding.horizontal,
              marginVertical: scale(16),
            },
          ]}
        >
          <View style={[styles.teamHeaderContent, { marginBottom: scale(16) }]}>
            <Image
              source={{ uri: teamData?.logo }}
              style={[
                styles.teamLogo,
                {
                  width: sizes.teamLogo,
                  height: sizes.teamLogo,
                  borderRadius: sizes.teamLogo / 2,
                },
              ]}
            />
            <View
              style={[
                styles.teamMainInfo,
                {
                  marginLeft: scale(16),
                  flex: 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.teamName,
                  {
                    fontSize: scale(18),
                    marginBottom: scale(4),
                  },
                ]}
              >
                {teamData?.name}
              </Text>
              <Text
                style={[
                  styles.teamFaculty,
                  {
                    fontSize: scale(13),
                    marginBottom: scale(8),
                  },
                ]}
              >
                {teamData?.faculty}
              </Text>
              <View style={styles.teamRecord}>
                <Text
                  style={[
                    styles.recordItem,
                    {
                      fontSize: scale(12),
                      marginRight: scale(16),
                    },
                  ]}
                >
                  G: {teamData?.wins}
                </Text>
                <Text
                  style={[
                    styles.recordItem,
                    {
                      fontSize: scale(12),
                      marginRight: scale(16),
                    },
                  ]}
                >
                  E: {teamData?.draws}
                </Text>
                <Text
                  style={[
                    styles.recordItem,
                    {
                      fontSize: scale(12),
                      marginRight: scale(16),
                    },
                  ]}
                >
                  P: {teamData?.losses}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.teamDetails,
              {
                borderTopWidth: scale(1),
                paddingTop: scale(12),
              },
            ]}
          >
            {[
              { icon: 'person', text: `Entrenador: ${teamData?.coach}` },
              { icon: 'star', text: `Capitán: ${teamData?.captain}` },
              { icon: 'location', text: `Campo: ${teamData?.homeField}` },
              { icon: 'calendar', text: `Fundado: ${teamData?.founded}` },
            ].map((detail, index) => (
              <View
                key={index}
                style={[
                  styles.detailRow,
                  {
                    marginBottom: scale(8),
                  },
                ]}
              >
                <Ionicons
                  name={detail.icon}
                  size={scale(14)}
                  color={COLORS.gray}
                />
                <Text
                  style={[
                    styles.detailText,
                    {
                      fontSize: scale(12),
                      marginLeft: scale(8),
                    },
                  ]}
                >
                  {detail.text}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Quick Stats */}
        <View
          style={[
            styles.quickStats,
            {
              marginHorizontal: padding.horizontal,
              marginBottom: scale(16),
              borderRadius: scale(12),
              paddingVertical: scale(16),
            },
          ]}
        >
          <View style={styles.quickStatItem}>
            <Text style={[styles.quickStatValue, { fontSize: scale(20) }]}>
              {teamData?.goalsFor}
            </Text>
            <Text
              style={[
                styles.quickStatLabel,
                {
                  fontSize: scale(10),
                  marginTop: scale(4),
                },
              ]}
            >
              Goles a favor
            </Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={[styles.quickStatValue, { fontSize: scale(20) }]}>
              {teamData?.goalsAgainst}
            </Text>
            <Text
              style={[
                styles.quickStatLabel,
                {
                  fontSize: scale(10),
                  marginTop: scale(4),
                },
              ]}
            >
              Goles en contra
            </Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={[styles.quickStatValue, { fontSize: scale(20) }]}>
              #{teamData?.position}
            </Text>
            <Text
              style={[
                styles.quickStatLabel,
                {
                  fontSize: scale(10),
                  marginTop: scale(4),
                },
              ]}
            >
              Posición
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={[styles.tabsContainer, { paddingVertical: scale(12) }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.tabsScroll,
              {
                paddingHorizontal: padding.horizontal,
              },
            ]}
          >
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tab,
                  {
                    borderRadius: scale(20),
                    paddingVertical: scale(8),
                    paddingHorizontal: scale(14),
                    marginRight: scale(10),
                  },
                  selectedTab === tab.id && styles.selectedTab,
                ]}
                onPress={() => setSelectedTab(tab.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={tab.icon}
                  size={scale(16)}
                  color={
                    selectedTab === tab.id ? COLORS.white : COLORS.darkGray
                  }
                />
                <Text
                  style={[
                    styles.tabText,
                    {
                      fontSize: scale(12),
                      marginLeft: scale(6),
                    },
                    selectedTab === tab.id && styles.selectedTabText,
                  ]}
                >
                  {tab.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  teamHeader: {
    // margins se manejan dinámicamente
  },
  teamHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamLogo: {
    backgroundColor: COLORS.lightGray || '#F3F4F6',
  },
  teamMainInfo: {
    // margin y flex se manejan dinámicamente
  },
  teamName: {
    fontWeight: '700',
    color: COLORS.darkGray || '#374151',
    letterSpacing: 0.3,
  },
  teamFaculty: {
    color: COLORS.secondary || '#4CAF50',
    fontWeight: '600',
  },
  teamRecord: {
    flexDirection: 'row',
  },
  recordItem: {
    color: COLORS.gray || '#6B7280',
    fontWeight: '500',
  },
  teamDetails: {
    borderTopColor: COLORS.lightGray || '#E5E7EB',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    color: COLORS.gray || '#6B7280',
    fontWeight: '500',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.white || '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  quickStatItem: {
    alignItems: 'center',
  },
  quickStatValue: {
    fontWeight: '700',
    color: COLORS.secondary || '#4CAF50',
    letterSpacing: 0.5,
  },
  quickStatLabel: {
    color: COLORS.gray || '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  tabsContainer: {
    backgroundColor: COLORS.primary,
  },
  tabsScroll: {
    // padding se maneja dinámicamente
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: scale(1),
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedTab: {
    backgroundColor: COLORS.secondary || '#4CAF50',
    borderColor: COLORS.secondary || '#4CAF50',
    shadowColor: COLORS.secondary || '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    fontWeight: '500',
    color: COLORS.white || '#ffffff',
    opacity: 0.8,
  },
  selectedTabText: {
    color: COLORS.white || '#ffffff',
    fontWeight: '600',
    opacity: 1,
  },
  tabContent: {
    // padding se maneja dinámicamente
  },
  sectionTitle: {
    fontWeight: '700',
    color: COLORS.white || '#ffffff',
    letterSpacing: 0.3,
  },
  playerCard: {
    // margins se manejan dinámicamente
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerAvatar: {
    backgroundColor: COLORS.lightGray || '#F3F4F6',
  },
  playerInfo: {
    flex: 1,
  },
  playerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerName: {
    fontWeight: '700',
    color: COLORS.darkGray || '#374151',
    letterSpacing: 0.2,
  },
  captainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  captainText: {
    color: COLORS.secondary || '#4CAF50',
    fontWeight: '600',
  },
  playerPosition: {
    color: COLORS.secondary || '#4CAF50',
    fontWeight: '600',
  },
  playerDetails: {
    color: COLORS.gray || '#6B7280',
    fontWeight: '500',
  },
  playerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopColor: COLORS.lightGray || '#E5E7EB',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: '700',
    color: COLORS.darkGray || '#374151',
    letterSpacing: 0.3,
  },
  statLabel: {
    color: COLORS.gray || '#6B7280',
    fontWeight: '500',
  },
  matchCard: {
    // margins se manejan dinámicamente
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchDate: {
    color: COLORS.gray || '#6B7280',
    fontWeight: '500',
  },
  resultBadge: {
    // styles se manejan dinámicamente
  },
  resultText: {
    color: COLORS.white || '#ffffff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  matchDetails: {
    // marginBottom se maneja dinámicamente
  },
  matchTeams: {
    fontWeight: '700',
    color: COLORS.darkGray || '#374151',
    letterSpacing: 0.2,
  },
  matchScore: {
    fontWeight: '700',
    color: COLORS.secondary || '#4CAF50',
    letterSpacing: 0.5,
  },
  upcomingDetails: {
    // marginTop se maneja dinámicamente
  },
  matchLocation: {
    color: COLORS.gray || '#6B7280',
    fontWeight: '500',
  },
  matchTournament: {
    color: COLORS.gray || '#6B7280',
    fontWeight: '500',
  },
  matchResult: {
    fontWeight: '600',
    color: COLORS.gray || '#6B7280',
  },
  statsCard: {
    // margins se manejan dinámicamente
  },
  statsTitle: {
    fontWeight: '700',
    color: COLORS.darkGray || '#374151',
    letterSpacing: 0.3,
  },
  rankingContainer: {
    alignItems: 'center',
  },
  rankingPosition: {
    fontWeight: '700',
    color: COLORS.secondary || '#4CAF50',
    letterSpacing: 1,
  },
  rankingTotal: {
    color: COLORS.gray || '#6B7280',
    fontWeight: '500',
  },
  statsGrid: {
    // marginTop se maneja dinámicamente
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: COLORS.lightGray || '#E5E7EB',
  },
  statRowLabel: {
    color: COLORS.gray || '#6B7280',
    fontWeight: '500',
  },
  statRowValue: {
    fontWeight: '600',
  },
  highlightsContainer: {
    // marginTop se maneja dinámicamente
  },
  highlight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightText: {
    color: COLORS.darkGray || '#374151',
    fontWeight: '500',
    flex: 1,
  },
  galleryPreview: {
    // margins se manejan dinámicamente
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  galleryImage: {
    backgroundColor: COLORS.lightGray || '#F3F4F6',
  },
});

export default MyTeamScreen;
