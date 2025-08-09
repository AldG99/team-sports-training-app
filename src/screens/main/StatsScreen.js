import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPORTS, SPORT_STATS } from '../../utils/constants';
import { globalStyles } from '../../styles/globalStyles';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';

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
    horizontal: Math.max(scale(16), screenWidth * 0.04),
    vertical: Math.max(scale(12), screenHeight * 0.015),
    section: Math.max(scale(12), screenHeight * 0.015),
  };
};

// Función para obtener tamaños de elementos
const getElementSizes = () => {
  return {
    chartWidth: screenWidth - scale(64),
    chartHeight: Math.min(scale(220), screenHeight * 0.25),
    statCardWidth: isSmallScreen ? '100%' : '48%',
    iconSize: scale(24),
    actionButtonHeight: scale(80),
  };
};

const StatsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const padding = getResponsivePadding();
  const sizes = getElementSizes();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSport, setSelectedSport] = useState(SPORTS.FUTBOL);
  const [playerStats, setPlayerStats] = useState({});
  const [progressData, setProgressData] = useState({});
  const [seasonStats, setSeasonStats] = useState({});

  const sports = [
    { id: SPORTS.FUTBOL, name: 'Fútbol', icon: 'football' },
    { id: SPORTS.BASQUETBOL, name: 'Basquetbol', icon: 'basketball' },
    {
      id: SPORTS.FUTBOL_AMERICANO,
      name: 'Fútbol Americano',
      icon: 'american-football',
    },
    { id: SPORTS.VOLEIBOL, name: 'Voleibol', icon: 'ellipse' },
  ];

  useEffect(() => {
    loadPlayerStats();
  }, [selectedSport]);

  const loadPlayerStats = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockStats = {
        [SPORTS.FUTBOL]: {
          current: {
            goles: 12,
            asistencias: 8,
            partidos_jugados: 15,
            tarjetas_amarillas: 3,
            tarjetas_rojas: 0,
          },
          progress: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [
              {
                data: [2, 3, 1, 4, 2, 0],
                color: () => COLORS.secondary,
              },
            ],
          },
          season: {
            2024: { goles: 12, asistencias: 8, partidos: 15 },
            2023: { goles: 18, asistencias: 12, partidos: 20 },
            2022: { goles: 8, asistencias: 5, partidos: 12 },
          },
        },
        [SPORTS.BASQUETBOL]: {
          current: {
            puntos: 18.5,
            rebotes: 7.2,
            asistencias: 4.8,
            robos: 2.1,
            partidos_jugados: 12,
          },
          progress: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [
              {
                data: [15, 18, 20, 16, 22, 19],
                color: () => COLORS.secondary,
              },
            ],
          },
          season: {
            2024: { puntos: 18.5, rebotes: 7.2, partidos: 12 },
            2023: { puntos: 16.8, rebotes: 6.5, partidos: 18 },
            2022: { puntos: 14.2, rebotes: 5.8, partidos: 15 },
          },
        },
        [SPORTS.FUTBOL_AMERICANO]: {
          current: {
            touchdowns: 6,
            yardas: 1250,
            tackles: 45,
            intercepciones: 3,
            partidos_jugados: 8,
          },
          progress: {
            labels: ['Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [
              {
                data: [1, 2, 1, 2, 0],
                color: () => COLORS.secondary,
              },
            ],
          },
          season: {
            2024: { touchdowns: 6, yardas: 1250, partidos: 8 },
            2023: { touchdowns: 8, yardas: 1580, partidos: 10 },
          },
        },
        [SPORTS.VOLEIBOL]: {
          current: {
            puntos: 125,
            aces: 18,
            bloqueos: 24,
            recepciones: 89,
            sets_jugados: 42,
          },
          progress: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [
              {
                data: [20, 25, 18, 30, 22, 10],
                color: () => COLORS.secondary,
              },
            ],
          },
          season: {
            2024: { puntos: 125, aces: 18, sets: 42 },
            2023: { puntos: 168, aces: 24, sets: 56 },
          },
        },
      };

      setPlayerStats(mockStats[selectedSport].current);
      setProgressData(mockStats[selectedSport].progress);
      setSeasonStats(mockStats[selectedSport].season);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPlayerStats();
    setRefreshing(false);
  };

  const StatCard = ({ label, value, icon, color = COLORS.secondary }) => (
    <Card
      variant="compact"
      elevationLevel="low"
      style={[
        styles.statCard,
        {
          width: sizes.statCardWidth,
          marginVertical: scale(6),
          marginHorizontal: isSmallScreen ? padding.horizontal : 0,
        },
      ]}
    >
      <View style={styles.statContent}>
        <View
          style={[
            styles.statIconContainer,
            {
              backgroundColor: `${color}15`,
              width: scale(40),
              height: scale(40),
              borderRadius: scale(20),
              marginRight: scale(12),
            },
          ]}
        >
          <Ionicons name={icon} size={scale(20)} color={color} />
        </View>
        <View style={styles.statInfo}>
          <Text style={[styles.statValue, { fontSize: scale(18) }]}>
            {value}
          </Text>
          <Text style={[styles.statLabel, { fontSize: scale(11) }]}>
            {label}
          </Text>
        </View>
      </View>
    </Card>
  );

  const SportSelector = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        styles.sportSelector,
        {
          paddingHorizontal: padding.horizontal,
          paddingVertical: scale(12),
        },
      ]}
    >
      {sports.map(sport => (
        <TouchableOpacity
          key={sport.id}
          style={[
            styles.sportOption,
            {
              borderRadius: scale(12),
              padding: scale(12),
              marginRight: scale(12),
              minWidth: scale(80),
              borderWidth: scale(2),
            },
            selectedSport === sport.id && styles.selectedSport,
          ]}
          onPress={() => setSelectedSport(sport.id)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={sport.icon}
            size={sizes.iconSize}
            color={selectedSport === sport.id ? COLORS.white : COLORS.darkGray}
          />
          <Text
            style={[
              styles.sportText,
              {
                fontSize: scale(11),
                marginTop: scale(4),
              },
              selectedSport === sport.id && styles.selectedSportText,
            ]}
          >
            {sport.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderStats = () => {
    const stats = SPORT_STATS[selectedSport];
    const statIcons = {
      goles: 'football',
      asistencias: 'hand-left',
      partidos_jugados: 'calendar',
      tarjetas_amarillas: 'warning',
      tarjetas_rojas: 'alert-circle',
      puntos: 'trophy',
      rebotes: 'refresh',
      robos: 'hand-right',
      touchdowns: 'flag',
      yardas: 'speedometer',
      tackles: 'shield',
      intercepciones: 'eye',
      aces: 'flash',
      bloqueos: 'hand-left',
      recepciones: 'checkmark-circle',
      sets_jugados: 'layers',
    };

    return stats.map(stat => (
      <StatCard
        key={stat}
        label={stat.replace('_', ' ').toUpperCase()}
        value={playerStats[stat] || 0}
        icon={statIcons[stat] || 'stats-chart'}
      />
    ));
  };

  const chartConfig = {
    backgroundGradientFrom: COLORS.white,
    backgroundGradientTo: COLORS.white,
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    strokeWidth: scale(2),
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    propsForLabels: {
      fontSize: scale(10),
    },
    propsForVerticalLabels: {
      fontSize: scale(9),
    },
  };

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Header
          title="Mis Estadísticas"
          variant={isSmallScreen ? 'compact' : 'default'}
        />
        <Loading variant="default" animation="scale" />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Header
        title="Mis Estadísticas"
        rightIcon="share-outline"
        onRightPress={() => {
          /* Compartir estadísticas */
        }}
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
        {/* Selector de Deporte */}
        <SportSelector />

        {/* Estadísticas Actuales */}
        <View style={[styles.section, { marginVertical: padding.section }]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: scale(16),
                marginBottom: scale(12),
                paddingHorizontal: padding.horizontal,
              },
            ]}
          >
            Estadísticas de la Temporada
          </Text>
          <View
            style={[
              styles.statsGrid,
              {
                paddingHorizontal: isSmallScreen ? 0 : padding.horizontal,
              },
            ]}
          >
            {renderStats()}
          </View>
        </View>

        {/* Gráfico de Progreso */}
        <View style={[styles.section, { marginVertical: padding.section }]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: scale(16),
                marginBottom: scale(12),
                paddingHorizontal: padding.horizontal,
              },
            ]}
          >
            Progreso Mensual
          </Text>
          <Card
            variant="default"
            elevationLevel="medium"
            style={[
              styles.chartCard,
              {
                marginHorizontal: padding.horizontal,
                padding: scale(16),
              },
            ]}
          >
            <Text
              style={[
                styles.chartTitle,
                {
                  fontSize: scale(14),
                  marginBottom: scale(16),
                },
              ]}
            >
              {selectedSport === SPORTS.FUTBOL
                ? 'Goles por Mes'
                : selectedSport === SPORTS.BASQUETBOL
                ? 'Puntos Promedio por Mes'
                : selectedSport === SPORTS.FUTBOL_AMERICANO
                ? 'Touchdowns por Mes'
                : 'Puntos por Mes'}
            </Text>
            <LineChart
              data={progressData}
              width={sizes.chartWidth}
              height={sizes.chartHeight}
              chartConfig={chartConfig}
              bezier
              style={[styles.chart, { borderRadius: scale(8) }]}
            />
          </Card>
        </View>

        {/* Comparación por Temporadas */}
        <View style={[styles.section, { marginVertical: padding.section }]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: scale(16),
                marginBottom: scale(12),
                paddingHorizontal: padding.horizontal,
              },
            ]}
          >
            Comparación por Temporadas
          </Text>
          <Card
            variant="default"
            elevationLevel="low"
            style={[
              styles.seasonCard,
              {
                marginHorizontal: padding.horizontal,
              },
            ]}
          >
            {Object.entries(seasonStats).map(([year, stats], index, array) => (
              <View
                key={year}
                style={[
                  styles.seasonRow,
                  {
                    paddingVertical: scale(12),
                    borderBottomWidth: index < array.length - 1 ? scale(1) : 0,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.seasonYear,
                    {
                      fontSize: scale(15),
                      width: scale(60),
                    },
                  ]}
                >
                  {year}
                </Text>
                <View style={styles.seasonStats}>
                  {Object.entries(stats).map(([key, value]) => (
                    <View key={key} style={styles.seasonStat}>
                      <Text
                        style={[
                          styles.seasonStatValue,
                          { fontSize: scale(14) },
                        ]}
                      >
                        {value}
                      </Text>
                      <Text
                        style={[
                          styles.seasonStatLabel,
                          {
                            fontSize: scale(10),
                            marginTop: scale(2),
                          },
                        ]}
                      >
                        {key}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </Card>
        </View>

        {/* Logros y Récords */}
        <View style={[styles.section, { marginVertical: padding.section }]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: scale(16),
                marginBottom: scale(12),
                paddingHorizontal: padding.horizontal,
              },
            ]}
          >
            Logros y Récords
          </Text>
          <Card
            variant="default"
            elevationLevel="low"
            style={[
              styles.achievementCard,
              {
                marginHorizontal: padding.horizontal,
              },
            ]}
          >
            {[
              {
                icon: 'trophy',
                title: 'Mejor Racha de Goles',
                description: '5 partidos consecutivos anotando',
              },
              {
                icon: 'star',
                title: 'Jugador del Mes',
                description: 'Marzo 2024',
              },
              {
                icon: 'medal',
                title: 'Máximo Goleador',
                description: 'Torneo Inter-facultades 2023',
              },
            ].map((achievement, index, array) => (
              <View
                key={index}
                style={[
                  styles.achievementItem,
                  {
                    paddingVertical: scale(12),
                    borderBottomWidth: index < array.length - 1 ? scale(1) : 0,
                  },
                ]}
              >
                <View
                  style={[
                    styles.achievementIcon,
                    {
                      backgroundColor: `${COLORS.secondary}15`,
                      width: scale(48),
                      height: scale(48),
                      borderRadius: scale(24),
                      marginRight: scale(16),
                    },
                  ]}
                >
                  <Ionicons
                    name={achievement.icon}
                    size={scale(24)}
                    color={COLORS.secondary}
                  />
                </View>
                <View style={styles.achievementInfo}>
                  <Text
                    style={[styles.achievementTitle, { fontSize: scale(14) }]}
                  >
                    {achievement.title}
                  </Text>
                  <Text
                    style={[
                      styles.achievementDescription,
                      {
                        fontSize: scale(12),
                        marginTop: scale(2),
                      },
                    ]}
                  >
                    {achievement.description}
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        </View>

        {/* Acciones Rápidas */}
        <View style={[styles.section, { marginVertical: padding.section }]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: scale(16),
                marginBottom: scale(12),
                paddingHorizontal: padding.horizontal,
              },
            ]}
          >
            Acciones
          </Text>
          <View
            style={[
              styles.actionButtons,
              {
                paddingHorizontal: padding.horizontal,
                gap: scale(12),
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  borderRadius: scale(12),
                  padding: scale(16),
                  height: sizes.actionButtonHeight,
                },
              ]}
              onPress={() => navigation.navigate('Teams')}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.actionButtonIcon,
                  {
                    backgroundColor: `${COLORS.secondary}15`,
                    width: scale(32),
                    height: scale(32),
                    borderRadius: scale(16),
                    marginBottom: scale(8),
                  },
                ]}
              >
                <Ionicons
                  name="people"
                  size={scale(18)}
                  color={COLORS.secondary}
                />
              </View>
              <Text style={[styles.actionButtonText, { fontSize: scale(11) }]}>
                Comparar con Equipo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  borderRadius: scale(12),
                  padding: scale(16),
                  height: sizes.actionButtonHeight,
                },
              ]}
              onPress={() => {
                /* Ver historial completo */
              }}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.actionButtonIcon,
                  {
                    backgroundColor: `${COLORS.secondary}15`,
                    width: scale(32),
                    height: scale(32),
                    borderRadius: scale(16),
                    marginBottom: scale(8),
                  },
                ]}
              >
                <Ionicons
                  name="time"
                  size={scale(18)}
                  color={COLORS.secondary}
                />
              </View>
              <Text style={[styles.actionButtonText, { fontSize: scale(11) }]}>
                Historial Completo
              </Text>
            </TouchableOpacity>
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
  section: {
    // margins se manejan dinámicamente
  },
  sectionTitle: {
    fontWeight: '700',
    color: COLORS.white || '#ffffff',
    letterSpacing: 0.3,
  },
  sportSelector: {
    // padding se maneja dinámicamente
  },
  sportOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedSport: {
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
  sportText: {
    fontWeight: '500',
    color: COLORS.white || '#ffffff',
    textAlign: 'center',
    opacity: 0.8,
  },
  selectedSportText: {
    color: COLORS.white || '#ffffff',
    fontWeight: '600',
    opacity: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    // dimensions se manejan dinámicamente
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontWeight: '700',
    color: COLORS.darkGray || '#374151',
    letterSpacing: 0.3,
  },
  statLabel: {
    color: COLORS.gray || '#6B7280',
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  chartCard: {
    // margins y padding se manejan dinámicamente
  },
  chartTitle: {
    fontWeight: '700',
    color: COLORS.darkGray || '#374151',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  chart: {
    // borderRadius se maneja dinámicamente
  },
  seasonCard: {
    // margins se manejan dinámicamente
  },
  seasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: COLORS.lightGray || '#E5E7EB',
  },
  seasonYear: {
    fontWeight: '700',
    color: COLORS.darkGray || '#374151',
    letterSpacing: 0.3,
  },
  seasonStats: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  seasonStat: {
    alignItems: 'center',
  },
  seasonStatValue: {
    fontWeight: '700',
    color: COLORS.secondary || '#4CAF50',
    letterSpacing: 0.3,
  },
  seasonStatLabel: {
    color: COLORS.gray || '#6B7280',
    fontWeight: '500',
  },
  achievementCard: {
    // margins se manejan dinámicamente
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: COLORS.lightGray || '#E5E7EB',
  },
  achievementIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontWeight: '700',
    color: COLORS.darkGray || '#374151',
    letterSpacing: 0.3,
  },
  achievementDescription: {
    color: COLORS.gray || '#6B7280',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: COLORS.white || '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.darkGray || '#374151',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});

export default StatsScreen;
