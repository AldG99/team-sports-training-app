import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  TOURNAMENT_TYPES,
  TOURNAMENT_STATUS,
  SPORTS,
} from '../../utils/constants';
import { globalStyles } from '../../styles/globalStyles';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/helpers';
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
  },
  // Icon sizes
  iconSize: {
    sm: isSmallScreen ? 14 : 16,
    md: isSmallScreen ? 18 : 20,
    lg: isSmallScreen ? 24 : 28,
    xl: isSmallScreen ? 32 : 40,
  },
  // Card dimensions
  cardWidth: isTablet ? (screenWidth - 48) / 2 : screenWidth - 32,
  maxCardWidth: 400,
};

const TournamentsScreen = ({ navigation }) => {
  // Auth context handling
  let userProfile = null;
  try {
    const authContext = useAuth();
    userProfile = authContext?.userProfile;
  } catch (error) {
    console.warn('AuthProvider no disponible, usando valores por defecto');
    userProfile = { userType: 'student' };
  }

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTab, setSelectedTab] = useState('active');
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [myTournaments, setMyTournaments] = useState([]);

  const tabs = [
    { id: 'active', name: 'Activos', icon: 'play-circle' },
    { id: 'upcoming', name: 'Próximos', icon: 'time' },
    { id: 'finished', name: 'Finalizados', icon: 'checkmark-circle' },
    { id: 'my', name: 'Mis Torneos', icon: 'star' },
  ];

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockTournaments = [
        {
          id: '1',
          name: 'Copa Universitaria de Fútbol 2024',
          sport: SPORTS.FUTBOL,
          type: TOURNAMENT_TYPES.COPA_UNIVERSITARIA,
          status: TOURNAMENT_STATUS.ACTIVE,
          startDate: '2024-03-01',
          endDate: '2024-06-15',
          registrationDeadline: '2024-02-20',
          teams: 16,
          maxTeams: 16,
          registeredTeams: 16,
          matches: 31,
          completedMatches: 24,
          currentRound: 'Cuartos de Final',
          prize: '$5,000',
          registrationFee: '$100',
          description: 'El torneo más prestigioso de fútbol universitario.',
          rules: 'Reglamento FIFA adaptado para universitarios.',
          location: 'Estadio Universitario Principal',
          organizer: 'Deportes UNAM',
          isRegistered: true,
          standings: [
            { position: 1, team: 'Ingeniería FC', points: 12 },
            { position: 2, team: 'Medicina United', points: 10 },
            { position: 3, team: 'Derecho FC', points: 8 },
            { position: 4, team: 'Economía Stars', points: 6 },
          ],
        },
        {
          id: '2',
          name: 'Liga Inter-facultades Basquetbol',
          sport: SPORTS.BASQUETBOL,
          type: TOURNAMENT_TYPES.INTER_FACULTADES,
          status: TOURNAMENT_STATUS.ACTIVE,
          startDate: '2024-02-15',
          endDate: '2024-05-30',
          registrationDeadline: '2024-02-01',
          teams: 12,
          maxTeams: 12,
          registeredTeams: 12,
          matches: 66,
          completedMatches: 45,
          currentRound: 'Fase Regular - Jornada 8',
          prize: '$3,000',
          registrationFee: '$75',
          description:
            'Competencia entre todas las facultades en formato de liga. Cada equipo juega contra todos los demás.',
          rules:
            'Reglas FIBA universitarias. Partidos de 4 períodos de 10 minutos.',
          location: 'Gimnasio Central y Auxiliar',
          organizer: 'Liga Universitaria de Basquetbol',
          isRegistered: false,
          standings: [
            { position: 1, team: 'Medicina Sharks', points: 18 },
            { position: 2, team: 'Ingeniería Hawks', points: 16 },
            { position: 3, team: 'Derecho Flames', points: 14 },
            { position: 4, team: 'Psicología Lions', points: 12 },
          ],
        },
        {
          id: '3',
          name: 'Torneo Relámpago Voleibol',
          sport: SPORTS.VOLEIBOL,
          type: TOURNAMENT_TYPES.LIGA_REGULAR,
          status: TOURNAMENT_STATUS.UPCOMING,
          startDate: '2024-07-01',
          endDate: '2024-07-03',
          registrationDeadline: '2024-06-20',
          teams: 8,
          maxTeams: 8,
          registeredTeams: 5,
          matches: 14,
          completedMatches: 0,
          currentRound: 'Por iniciar',
          prize: '$1,500',
          registrationFee: '$50',
          description:
            'Torneo intensivo de fin de semana. Formato de eliminación directa.',
          rules: 'Sets a 21 puntos, mejor de 3 sets por partido.',
          location: 'Cancha de Voleibol Techada',
          organizer: 'Club de Voleibol Universitario',
          isRegistered: false,
        },
        {
          id: '4',
          name: 'Campeonato Fútbol Americano 2023',
          sport: SPORTS.FUTBOL_AMERICANO,
          type: TOURNAMENT_TYPES.COPA_UNIVERSITARIA,
          status: TOURNAMENT_STATUS.FINISHED,
          startDate: '2023-09-01',
          endDate: '2023-12-15',
          registrationDeadline: '2023-08-15',
          teams: 8,
          maxTeams: 8,
          registeredTeams: 8,
          matches: 15,
          completedMatches: 15,
          currentRound: 'Finalizado',
          prize: '$7,500',
          registrationFee: '$150',
          description: 'Temporada completa de fútbol americano con playoffs.',
          rules:
            'Reglamento NCAA adaptado. Partidos de 4 cuartos de 12 minutos.',
          location: 'Campo de Fútbol Americano',
          organizer: 'Asociación Deportiva Universitaria',
          winner: 'Ingeniería Eagles',
          isRegistered: true,
          standings: [
            { position: 1, team: 'Ingeniería Eagles', points: 24 },
            { position: 2, team: 'Medicina Rams', points: 20 },
            { position: 3, team: 'Derecho Bulls', points: 16 },
            { position: 4, team: 'Economía Wolves', points: 12 },
          ],
        },
        {
          id: '5',
          name: 'Copa de Verano Fútbol',
          sport: SPORTS.FUTBOL,
          type: TOURNAMENT_TYPES.LIGA_REGULAR,
          status: TOURNAMENT_STATUS.UPCOMING,
          startDate: '2024-06-20',
          endDate: '2024-07-20',
          registrationDeadline: '2024-06-10',
          teams: 10,
          maxTeams: 12,
          registeredTeams: 7,
          matches: 25,
          completedMatches: 0,
          currentRound: 'Inscripciones abiertas',
          prize: '$2,500',
          registrationFee: '$80',
          description:
            'Torneo de verano para mantener la actividad deportiva durante las vacaciones.',
          rules:
            'Partidos de 70 minutos en horario vespertino para evitar el calor.',
          location: 'Campo Auxiliar',
          organizer: 'Deportes de Verano',
          isRegistered: false,
        },
        {
          id: '6',
          name: 'Liga Mixta de Tenis',
          sport: SPORTS.TENIS,
          type: TOURNAMENT_TYPES.INTER_FACULTADES,
          status: TOURNAMENT_STATUS.ACTIVE,
          startDate: '2024-03-15',
          endDate: '2024-05-15',
          registrationDeadline: '2024-03-01',
          teams: 16,
          maxTeams: 16,
          registeredTeams: 16,
          matches: 30,
          completedMatches: 18,
          currentRound: 'Octavos de Final',
          prize: '$2,000',
          registrationFee: '$60',
          description:
            'Competencia individual y por parejas mixtas entre todas las facultades.',
          rules: 'Sets al mejor de 3, tie-break a 7 puntos.',
          location: 'Canchas de Tenis Universidad',
          organizer: 'Club de Tenis Universitario',
          isRegistered: true,
          standings: [
            { position: 1, team: 'Ingeniería Aces', points: 28 },
            { position: 2, team: 'Medicina Smash', points: 24 },
            { position: 3, team: 'Psicología Serve', points: 22 },
            { position: 4, team: 'Derecho Match', points: 18 },
          ],
        },
      ];

      setTournaments(mockTournaments);
      const userTournaments = mockTournaments.filter(t => t.isRegistered);
      setMyTournaments(userTournaments);
    } catch (error) {
      console.error('Error loading tournaments:', error);
      Alert.alert('Error', 'No se pudieron cargar los torneos');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTournaments();
    setRefreshing(false);
  };

  const getFilteredTournaments = () => {
    switch (selectedTab) {
      case 'active':
        return tournaments.filter(t => t.status === TOURNAMENT_STATUS.ACTIVE);
      case 'upcoming':
        return tournaments.filter(t => t.status === TOURNAMENT_STATUS.UPCOMING);
      case 'finished':
        return tournaments.filter(t => t.status === TOURNAMENT_STATUS.FINISHED);
      case 'my':
        return myTournaments;
      default:
        return tournaments;
    }
  };

  const getSportIcon = sport => {
    const icons = {
      [SPORTS.FUTBOL]: 'football',
      [SPORTS.BASQUETBOL]: 'basketball',
      [SPORTS.FUTBOL_AMERICANO]: 'american-football',
      [SPORTS.VOLEIBOL]: 'tennis',
      [SPORTS.TENIS]: 'tennis',
    };
    return icons[sport] || 'trophy';
  };

  const getStatusColor = status => {
    const colors = {
      [TOURNAMENT_STATUS.ACTIVE]: COLORS.success,
      [TOURNAMENT_STATUS.UPCOMING]: COLORS.warning,
      [TOURNAMENT_STATUS.FINISHED]: COLORS.gray,
    };
    return colors[status] || COLORS.gray;
  };

  const getStatusText = status => {
    const texts = {
      [TOURNAMENT_STATUS.ACTIVE]: 'En Curso',
      [TOURNAMENT_STATUS.UPCOMING]: 'Próximo',
      [TOURNAMENT_STATUS.FINISHED]: 'Finalizado',
    };
    return texts[status] || 'Desconocido';
  };

  const getTournamentTypeText = type => {
    const types = {
      [TOURNAMENT_TYPES.INTER_FACULTADES]: 'Inter-facultades',
      [TOURNAMENT_TYPES.COPA_UNIVERSITARIA]: 'Copa Universitaria',
      [TOURNAMENT_TYPES.LIGA_REGULAR]: 'Liga Regular',
    };
    return types[type] || type;
  };

  const handleRegisterTeam = tournament => {
    if (tournament.registeredTeams >= tournament.maxTeams) {
      Alert.alert('Completo', 'Este torneo ya alcanzó el máximo de equipos');
      return;
    }

    Alert.alert(
      'Inscribir Equipo',
      `¿Deseas inscribir tu equipo al torneo "${tournament.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Inscribir',
          onPress: () => {
            Alert.alert('Éxito', 'Equipo inscrito correctamente');
            // Aquí iría la lógica real de inscripción
          },
        },
      ]
    );
  };

  const TournamentCard = ({ tournament }) => (
    <TouchableOpacity
      style={styles.tournamentCard}
      onPress={() => {
        setSelectedTournament(tournament);
        setShowDetailsModal(true);
      }}
      activeOpacity={0.7}
    >
      {/* Header minimalista */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Ionicons
            name={getSportIcon(tournament.sport)}
            size={responsive.iconSize.lg}
            color={COLORS.secondary}
          />
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor(tournament.status) },
            ]}
          />
        </View>
        {tournament.isRegistered && (
          <View style={styles.registeredIndicator}>
            <Ionicons
              name="checkmark-circle"
              size={responsive.iconSize.sm}
              color={COLORS.success}
            />
          </View>
        )}
      </View>

      {/* Contenido principal */}
      <View style={styles.cardContent}>
        <Text style={styles.tournamentName} numberOfLines={2}>
          {tournament.name}
        </Text>

        <View style={styles.tournamentMeta}>
          <Text style={styles.tournamentType}>
            {getTournamentTypeText(tournament.type)}
          </Text>
          <Text style={styles.tournamentDates}>
            {formatDate(tournament.startDate)}
          </Text>
        </View>

        {/* Progress bar minimalista */}
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    (tournament.registeredTeams / tournament.maxTeams) * 100
                  }%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {tournament.registeredTeams}/{tournament.maxTeams}
          </Text>
        </View>

        {/* Info compacta */}
        <View style={styles.cardFooter}>
          <View style={styles.infoItem}>
            <Ionicons
              name="location-outline"
              size={responsive.iconSize.sm}
              color={COLORS.gray}
            />
            <Text style={styles.infoText} numberOfLines={1}>
              {tournament.location}
            </Text>
          </View>
          <Text style={styles.prizeText}>{tournament.prize}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const TournamentDetailsModal = () => (
    <Modal
      visible={showDetailsModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowDetailsModal(false)}
    >
      <View style={styles.modalContainer}>
        {/* Header del modal */}
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => setShowDetailsModal(false)}
            style={styles.closeButton}
          >
            <Ionicons
              name="close"
              size={responsive.iconSize.lg}
              color={COLORS.darkGray}
            />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Detalles</Text>
          <View style={styles.closeButton} />
        </View>

        {selectedTournament && (
          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Hero section */}
            <View style={styles.modalHero}>
              <View style={styles.modalSportIcon}>
                <Ionicons
                  name={getSportIcon(selectedTournament.sport)}
                  size={responsive.iconSize.xl}
                  color={COLORS.secondary}
                />
              </View>
              <Text style={styles.modalTournamentName}>
                {selectedTournament.name}
              </Text>
              <View
                style={[
                  styles.modalStatusBadge,
                  {
                    backgroundColor: getStatusColor(selectedTournament.status),
                  },
                ]}
              >
                <Text style={styles.modalStatusText}>
                  {getStatusText(selectedTournament.status)}
                </Text>
              </View>
            </View>

            {/* Información esencial */}
            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>Información</Text>
              <Text style={styles.description}>
                {selectedTournament.description}
              </Text>

              <View style={styles.detailsGrid}>
                <DetailItem
                  icon="calendar-outline"
                  label="Fechas"
                  value={`${formatDate(
                    selectedTournament.startDate
                  )} - ${formatDate(selectedTournament.endDate)}`}
                />
                <DetailItem
                  icon="people-outline"
                  label="Equipos"
                  value={`${selectedTournament.registeredTeams}/${selectedTournament.maxTeams}`}
                />
                <DetailItem
                  icon="trophy-outline"
                  label="Premio"
                  value={selectedTournament.prize}
                />
                <DetailItem
                  icon="location-outline"
                  label="Ubicación"
                  value={selectedTournament.location}
                />
              </View>
            </View>

            {/* Tabla de posiciones (si existe) */}
            {selectedTournament.standings && (
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Posiciones</Text>
                <View style={styles.standingsContainer}>
                  {selectedTournament.standings.map((standing, index) => (
                    <View key={index} style={styles.standingRow}>
                      <Text style={styles.standingPosition}>
                        #{standing.position}
                      </Text>
                      <Text style={styles.standingTeam}>{standing.team}</Text>
                      <Text style={styles.standingPoints}>
                        {standing.points} pts
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Acciones */}
            <View style={styles.modalActions}>
              {selectedTournament.status === TOURNAMENT_STATUS.UPCOMING &&
                !selectedTournament.isRegistered && (
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => {
                      setShowDetailsModal(false);
                      handleRegisterTeam(selectedTournament);
                    }}
                  >
                    <Text style={styles.primaryButtonText}>
                      Inscribir Equipo
                    </Text>
                  </TouchableOpacity>
                )}

              {selectedTournament.status === TOURNAMENT_STATUS.ACTIVE && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => {
                      setShowDetailsModal(false);
                      Alert.alert(
                        'Bracket',
                        'Navegando al bracket del torneo...'
                      );
                    }}
                  >
                    <Text style={styles.primaryButtonText}>Ver Bracket</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => {
                      setShowDetailsModal(false);
                      Alert.alert('Resultados', 'Mostrando resultados...');
                    }}
                  >
                    <Text style={styles.secondaryButtonText}>Resultados</Text>
                  </TouchableOpacity>
                </View>
              )}

              {selectedTournament.status === TOURNAMENT_STATUS.FINISHED && (
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => {
                    setShowDetailsModal(false);
                    Alert.alert(
                      'Resultados Finales',
                      'Mostrando resultados finales...'
                    );
                  }}
                >
                  <Text style={styles.primaryButtonText}>
                    Ver Resultados Finales
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.modalBottomPadding} />
          </ScrollView>
        )}
      </View>
    </Modal>
  );

  const DetailItem = ({ icon, label, value }) => (
    <View style={styles.detailItem}>
      <Ionicons name={icon} size={responsive.iconSize.sm} color={COLORS.gray} />
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Header title="Torneos" />
        <Loading />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Header
        title="Torneos"
        rightIcon={
          userProfile?.userType === 'admin' ? 'add-circle-outline' : null
        }
        onRightPress={() => {
          if (userProfile?.userType === 'admin') {
            navigation.navigate('CreateTournament');
          }
        }}
      />

      {/* Tabs minimalistas */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, selectedTab === tab.id && styles.selectedTab]}
              onPress={() => setSelectedTab(tab.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={tab.icon}
                size={responsive.iconSize.sm}
                color={selectedTab === tab.id ? COLORS.white : COLORS.gray}
              />
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab.id && styles.selectedTabText,
                ]}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de torneos */}
      <FlatList
        data={getFilteredTournaments()}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TournamentCard tournament={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        numColumns={isTablet ? 2 : 1}
        key={isTablet ? 'tablet' : 'phone'}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="trophy-outline"
              size={responsive.iconSize.xl * 2}
              color={COLORS.gray}
            />
            <Text style={styles.emptyText}>
              {selectedTab === 'my'
                ? 'No estás inscrito en ningún torneo'
                : `No hay torneos ${
                    selectedTab === 'active'
                      ? 'activos'
                      : selectedTab === 'upcoming'
                      ? 'próximos'
                      : 'finalizados'
                  }`}
            </Text>
            <Text style={styles.emptySubtext}>
              {selectedTab === 'my'
                ? 'Inscríbete en los torneos disponibles'
                : 'Los nuevos torneos aparecerán aquí'}
            </Text>
          </View>
        }
      />

      <TournamentDetailsModal />
    </View>
  );
};

const styles = StyleSheet.create({
  // Tabs
  tabsContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: responsive.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  tabsContent: {
    paddingHorizontal: responsive.spacing.md,
    gap: responsive.spacing.xs,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingVertical: responsive.spacing.xs,
    paddingHorizontal: responsive.spacing.sm,
    marginRight: responsive.spacing.xs,
  },
  selectedTab: {
    backgroundColor: COLORS.secondary,
  },
  tabText: {
    fontSize: responsive.fontSize.xs,
    fontWeight: '500',
    color: COLORS.gray,
    marginLeft: responsive.spacing.xs / 2,
  },
  selectedTabText: {
    color: COLORS.white,
    fontWeight: '600',
  },

  // Lista
  listContainer: {
    padding: responsive.spacing.md,
    paddingBottom: responsive.spacing.xl,
  },

  // Card del torneo
  tournamentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: responsive.spacing.md,
    marginBottom: responsive.spacing.md,
    width: isTablet ? (screenWidth - 48) / 2 - 8 : '100%',
    marginHorizontal: isTablet ? 4 : 0,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsive.spacing.sm,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: responsive.spacing.xs,
  },
  registeredIndicator: {
    backgroundColor: COLORS.success + '20',
    borderRadius: 12,
    padding: responsive.spacing.xs / 2,
  },
  cardContent: {
    flex: 1,
  },
  tournamentName: {
    fontSize: responsive.fontSize.md,
    fontWeight: '700',
    color: COLORS.darkGray,
    marginBottom: responsive.spacing.xs,
    lineHeight: responsive.fontSize.md * 1.3,
  },
  tournamentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsive.spacing.sm,
  },
  tournamentType: {
    fontSize: responsive.fontSize.xs,
    color: COLORS.secondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tournamentDates: {
    fontSize: responsive.fontSize.xs,
    color: COLORS.gray,
    fontWeight: '500',
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.spacing.sm,
    gap: responsive.spacing.xs,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.lightGray,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
  },
  progressText: {
    fontSize: responsive.fontSize.xs,
    color: COLORS.gray,
    fontWeight: '600',
    minWidth: 30,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: responsive.spacing.xs / 2,
  },
  infoText: {
    fontSize: responsive.fontSize.xs,
    color: COLORS.gray,
    flex: 1,
  },
  prizeText: {
    fontSize: responsive.fontSize.sm,
    color: COLORS.secondary,
    fontWeight: '700',
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsive.spacing.md,
    paddingTop: responsive.spacing.xl,
    paddingBottom: responsive.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: responsive.fontSize.lg,
    fontWeight: '700',
    color: COLORS.darkGray,
  },
  modalContent: {
    flex: 1,
  },
  modalHero: {
    alignItems: 'center',
    padding: responsive.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  modalSportIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.secondary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsive.spacing.md,
  },
  modalTournamentName: {
    fontSize: responsive.fontSize.xl,
    fontWeight: '700',
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: responsive.spacing.sm,
    lineHeight: responsive.fontSize.xl * 1.3,
  },
  modalStatusBadge: {
    borderRadius: 16,
    paddingVertical: responsive.spacing.xs,
    paddingHorizontal: responsive.spacing.sm,
  },
  modalStatusText: {
    fontSize: responsive.fontSize.xs,
    color: COLORS.white,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalSection: {
    padding: responsive.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  sectionTitle: {
    fontSize: responsive.fontSize.md,
    fontWeight: '700',
    color: COLORS.darkGray,
    marginBottom: responsive.spacing.sm,
  },
  description: {
    fontSize: responsive.fontSize.sm,
    color: COLORS.gray,
    lineHeight: responsive.fontSize.sm * 1.4,
    marginBottom: responsive.spacing.md,
  },
  detailsGrid: {
    gap: responsive.spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.spacing.sm,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: responsive.fontSize.xs,
    color: COLORS.gray,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: responsive.fontSize.sm,
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  standingsContainer: {
    gap: responsive.spacing.xs,
  },
  standingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsive.spacing.xs,
    paddingHorizontal: responsive.spacing.sm,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  standingPosition: {
    fontSize: responsive.fontSize.sm,
    fontWeight: '700',
    color: COLORS.secondary,
    width: 30,
  },
  standingTeam: {
    fontSize: responsive.fontSize.sm,
    color: COLORS.darkGray,
    flex: 1,
    marginLeft: responsive.spacing.sm,
  },
  standingPoints: {
    fontSize: responsive.fontSize.sm,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  modalActions: {
    padding: responsive.spacing.md,
  },
  actionButtons: {
    gap: responsive.spacing.sm,
  },
  primaryButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    paddingVertical: responsive.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: responsive.fontSize.md,
    color: COLORS.white,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingVertical: responsive.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  secondaryButtonText: {
    fontSize: responsive.fontSize.md,
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  modalBottomPadding: {
    height: responsive.spacing.xl,
  },

  // Estado vacío
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsive.spacing.xl * 2,
  },
  emptyText: {
    fontSize: responsive.fontSize.lg,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginTop: responsive.spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: responsive.fontSize.sm,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: responsive.spacing.xs,
  },
});

export default TournamentsScreen;
