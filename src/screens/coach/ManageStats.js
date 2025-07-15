import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPORTS, SPORT_STATS } from '../../utils/constants';
import { globalStyles } from '../../styles/globalStyles';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

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
    xs: isSmallScreen ? 12 : 14,
    sm: isSmallScreen ? 16 : 18,
    md: isSmallScreen ? 20 : 24,
    lg: isSmallScreen ? 24 : 28,
    xl: isSmallScreen ? 32 : 36,
  },
  // Card dimensions
  cardWidth: isTablet ? (screenWidth - 48) / 2 : screenWidth - 32,
  teamCardWidth: isSmallScreen ? 140 : 160,
};

const ManageStats = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [myTeams, setMyTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [statsForm, setStatsForm] = useState({});
  const [recentMatches, setRecentMatches] = useState([]);

  useEffect(() => {
    loadTeamsData();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      loadPlayersData(selectedTeam.id);
    }
  }, [selectedTeam]);

  const loadTeamsData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockTeams = [
        {
          id: '1',
          name: 'Ingeniería FC',
          sport: SPORTS.FUTBOL,
          players: 22,
          recentMatch: {
            opponent: 'Medicina FC',
            date: '2024-05-25',
            result: 'W',
            score: '3-1',
            statsEntered: false,
          },
        },
        {
          id: '2',
          name: 'Ingeniería BB',
          sport: SPORTS.BASQUETBOL,
          players: 15,
          recentMatch: {
            opponent: 'Derecho BB',
            date: '2024-05-23',
            result: 'L',
            score: '78-82',
            statsEntered: true,
          },
        },
        {
          id: '3',
          name: 'Ingeniería VB',
          sport: SPORTS.VOLEIBOL,
          players: 12,
          recentMatch: {
            opponent: 'Psicología VB',
            date: '2024-05-20',
            result: 'W',
            score: '3-1',
            statsEntered: false,
          },
        },
      ];

      const mockRecentMatches = [
        {
          id: '1',
          teamId: '1',
          opponent: 'Medicina FC',
          date: '2024-05-25',
          result: 'W',
          score: '3-1',
          statsEntered: false,
        },
        {
          id: '2',
          teamId: '1',
          opponent: 'Psicología FC',
          date: '2024-05-18',
          result: 'D',
          score: '2-2',
          statsEntered: true,
        },
        {
          id: '3',
          teamId: '2',
          opponent: 'Derecho BB',
          date: '2024-05-23',
          result: 'L',
          score: '78-82',
          statsEntered: true,
        },
        {
          id: '4',
          teamId: '3',
          opponent: 'Psicología VB',
          date: '2024-05-20',
          result: 'W',
          score: '3-1',
          statsEntered: false,
        },
      ];

      setMyTeams(mockTeams);
      setRecentMatches(mockRecentMatches);
      if (mockTeams.length > 0) {
        setSelectedTeam(mockTeams[0]);
      }
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPlayersData = async teamId => {
    try {
      const mockPlayers = [
        {
          id: '1',
          name: 'Juan Pérez',
          number: 10,
          position: 'Delantero',
          currentStats: {
            goles: 8,
            asistencias: 5,
            partidos_jugados: 15,
            tarjetas_amarillas: 2,
            tarjetas_rojas: 0,
          },
        },
        {
          id: '2',
          name: 'Carlos López',
          number: 1,
          position: 'Portero',
          currentStats: {
            goles: 0,
            asistencias: 0,
            partidos_jugados: 17,
            tarjetas_amarillas: 1,
            tarjetas_rojas: 0,
          },
        },
        {
          id: '3',
          name: 'Ana García',
          number: 8,
          position: 'Mediocampista',
          currentStats: {
            goles: 3,
            asistencias: 12,
            partidos_jugados: 16,
            tarjetas_amarillas: 3,
            tarjetas_rojas: 0,
          },
        },
        {
          id: '4',
          name: 'Luis Torres',
          number: 4,
          position: 'Defensa',
          currentStats: {
            goles: 1,
            asistencias: 2,
            partidos_jugados: 15,
            tarjetas_amarillas: 4,
            tarjetas_rojas: 1,
          },
        },
      ];

      setPlayers(mockPlayers);
    } catch (error) {
      console.error('Error loading players:', error);
    }
  };

  const initializeStatsForm = (player, sport) => {
    const stats = SPORT_STATS[sport] || [
      'goles',
      'asistencias',
      'tarjetas_amarillas',
    ];
    const form = {};
    stats.forEach(stat => {
      form[stat] = '';
    });
    setStatsForm(form);
  };

  const updateStatsForm = (field, value) => {
    setStatsForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePlayerSelect = player => {
    setSelectedPlayer(player);
    initializeStatsForm(player, selectedTeam.sport);
    setShowStatsModal(true);
  };

  const handleSaveStats = () => {
    const emptyFields = Object.entries(statsForm)
      .filter(([key, value]) => value === '')
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      Alert.alert('Error', 'Por favor completa todas las estadísticas');
      return;
    }

    Alert.alert(
      'Estadísticas Guardadas',
      `Estadísticas del partido registradas para ${selectedPlayer.name}`,
      [
        {
          text: 'OK',
          onPress: () => {
            setShowStatsModal(false);
            setSelectedPlayer(null);
            setStatsForm({});
            // Actualizar el estado del partido
            setRecentMatches(prev =>
              prev.map(match =>
                match.teamId === selectedTeam.id && !match.statsEntered
                  ? { ...match, statsEntered: true }
                  : match
              )
            );
          },
        },
      ]
    );
  };

  const getSportIcon = sport => {
    const icons = {
      [SPORTS.FUTBOL]: 'football',
      [SPORTS.BASQUETBOL]: 'basketball',
      [SPORTS.VOLEIBOL]: 'tennis',
      [SPORTS.FUTBOL_AMERICANO]: 'american-football',
    };
    return icons[sport] || 'trophy';
  };

  const getResultColor = result => {
    switch (result) {
      case 'W':
        return COLORS.success;
      case 'L':
        return COLORS.error;
      case 'D':
        return COLORS.warning;
      default:
        return COLORS.gray;
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
        return 'Sin resultado';
    }
  };

  const TeamSelector = () => (
    <View style={styles.teamSelectorContainer}>
      <Text style={styles.sectionTitle}>Seleccionar Equipo</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.teamsScroll}
      >
        {myTeams.map(team => (
          <TouchableOpacity
            key={team.id}
            style={[
              styles.teamCard,
              selectedTeam?.id === team.id && styles.selectedTeamCard,
            ]}
            onPress={() => setSelectedTeam(team)}
            activeOpacity={0.7}
          >
            <View style={styles.teamIconContainer}>
              <Ionicons
                name={getSportIcon(team.sport)}
                size={responsive.iconSize.lg}
                color={
                  selectedTeam?.id === team.id ? COLORS.white : COLORS.secondary
                }
              />
              {!team.recentMatch.statsEntered && (
                <View style={styles.pendingIndicator}>
                  <View style={styles.pendingDot} />
                </View>
              )}
            </View>

            <Text
              style={[
                styles.teamName,
                selectedTeam?.id === team.id && styles.selectedTeamText,
              ]}
            >
              {team.name}
            </Text>

            <Text
              style={[
                styles.teamSport,
                selectedTeam?.id === team.id && styles.selectedTeamText,
              ]}
            >
              {team.sport}
            </Text>

            <Text
              style={[
                styles.teamPlayers,
                selectedTeam?.id === team.id && styles.selectedTeamText,
              ]}
            >
              {team.players} jugadores
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const PlayerCard = ({ player }) => (
    <TouchableOpacity
      style={styles.playerCard}
      onPress={() => handlePlayerSelect(player)}
      activeOpacity={0.7}
    >
      <View style={styles.playerHeader}>
        <View style={styles.playerNumberContainer}>
          <Text style={styles.playerNumber}>#{player.number}</Text>
        </View>

        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={styles.playerPosition}>{player.position}</Text>
        </View>

        <View style={styles.playerAction}>
          <Ionicons
            name="stats-chart"
            size={responsive.iconSize.md}
            color={COLORS.secondary}
          />
        </View>
      </View>

      <View style={styles.playerStats}>
        <View style={styles.statsGrid}>
          {Object.entries(player.currentStats)
            .slice(0, 3)
            .map(([key, value]) => (
              <View key={key} style={styles.statItem}>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statLabel}>
                  {key
                    .replace('_', ' ')
                    .replace('goles', 'G')
                    .replace('asistencias', 'A')
                    .replace('partidos jugados', 'PJ')}
                </Text>
              </View>
            ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const MatchCard = ({ match }) => (
    <View style={styles.matchCard}>
      <View style={styles.matchHeader}>
        <View style={styles.matchInfo}>
          <Text style={styles.matchOpponent}>vs {match.opponent}</Text>
          <Text style={styles.matchDate}>
            {new Date(match.date).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
        </View>

        <View style={styles.matchResult}>
          <View
            style={[
              styles.resultBadge,
              { backgroundColor: getResultColor(match.result) + '20' },
            ]}
          >
            <Text
              style={[
                styles.resultText,
                { color: getResultColor(match.result) },
              ]}
            >
              {getResultText(match.result)}
            </Text>
          </View>
          <Text style={styles.matchScore}>{match.score}</Text>
        </View>
      </View>

      <View style={styles.matchFooter}>
        <View
          style={[
            styles.statusIndicator,
            {
              backgroundColor: match.statsEntered
                ? COLORS.success + '20'
                : COLORS.error + '20',
            },
          ]}
        >
          <Ionicons
            name={match.statsEntered ? 'checkmark-circle' : 'time'}
            size={responsive.iconSize.sm}
            color={match.statsEntered ? COLORS.success : COLORS.error}
          />
          <Text
            style={[
              styles.statusText,
              { color: match.statsEntered ? COLORS.success : COLORS.error },
            ]}
          >
            {match.statsEntered
              ? 'Estadísticas registradas'
              : 'Pendiente registrar'}
          </Text>
        </View>
      </View>
    </View>
  );

  const StatsModal = () => (
    <Modal
      visible={showStatsModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowStatsModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => setShowStatsModal(false)}
            style={styles.closeButton}
          >
            <Ionicons
              name="close"
              size={responsive.iconSize.md}
              color={COLORS.darkGray}
            />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Registrar Estadísticas</Text>
          <View style={styles.closeButton} />
        </View>

        <ScrollView
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.modalPlayerInfo}>
            <View style={styles.modalPlayerIcon}>
              <Text style={styles.modalPlayerNumber}>
                #{selectedPlayer?.number}
              </Text>
            </View>
            <View>
              <Text style={styles.modalPlayerName}>{selectedPlayer?.name}</Text>
              <Text style={styles.modalPlayerPosition}>
                {selectedPlayer?.position}
              </Text>
              <Text style={styles.modalMatchInfo}>
                vs {selectedTeam?.recentMatch.opponent}
              </Text>
            </View>
          </View>

          <View style={styles.statsForm}>
            {selectedTeam &&
              (
                SPORT_STATS[selectedTeam.sport] || [
                  'goles',
                  'asistencias',
                  'tarjetas_amarillas',
                ]
              ).map(stat => (
                <View key={stat} style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>
                    {stat.replace('_', ' ').toUpperCase()}
                  </Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="stats-chart"
                      size={responsive.iconSize.sm}
                      color={COLORS.gray}
                      style={styles.inputIcon}
                    />
                    <Input
                      value={statsForm[stat]}
                      onChangeText={value => updateStatsForm(stat, value)}
                      placeholder="0"
                      keyboardType="numeric"
                      style={styles.statInput}
                    />
                  </View>
                </View>
              ))}
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowStatsModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveStats}
            >
              <Text style={styles.saveButtonText}>Guardar Estadísticas</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Header title="Gestionar Estadísticas" />
        <Loading text="Cargando equipos..." />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Header
        title="Gestionar Estadísticas"
        rightIcon="help-circle-outline"
        onRightPress={() =>
          Alert.alert(
            'Ayuda',
            'Selecciona un equipo y luego toca sobre un jugador para registrar sus estadísticas del partido más reciente.'
          )
        }
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Selector de Equipo */}
        <TeamSelector />

        {selectedTeam && (
          <>
            {/* Partidos Recientes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Partidos Recientes</Text>
              {recentMatches
                .filter(match => match.teamId === selectedTeam.id)
                .slice(0, 3)
                .map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
            </View>

            {/* Lista de Jugadores */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Jugadores del Equipo</Text>
              {players.map(player => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </View>
          </>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      <StatsModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

  // Team Selector
  teamSelectorContainer: {
    marginBottom: responsive.spacing.lg,
  },
  teamsScroll: {
    paddingHorizontal: responsive.spacing.md,
    paddingVertical: responsive.spacing.sm,
  },
  teamCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: responsive.spacing.md,
    marginRight: responsive.spacing.sm,
    width: responsive.teamCardWidth,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTeamCard: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  teamIconContainer: {
    position: 'relative',
    marginBottom: responsive.spacing.sm,
  },
  pendingIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  pendingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.error,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  teamName: {
    fontSize: responsive.fontSize.sm,
    fontWeight: '700',
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: responsive.spacing.xs / 2,
  },
  teamSport: {
    fontSize: responsive.fontSize.xs,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: responsive.spacing.xs / 2,
  },
  teamPlayers: {
    fontSize: responsive.fontSize.xs,
    color: COLORS.gray,
    textAlign: 'center',
  },
  selectedTeamText: {
    color: COLORS.white,
  },

  // Player Cards
  playerCard: {
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
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.spacing.sm,
  },
  playerNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsive.spacing.sm,
  },
  playerNumber: {
    fontSize: responsive.fontSize.sm,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: responsive.fontSize.md,
    fontWeight: '700',
    color: COLORS.darkGray,
    marginBottom: responsive.spacing.xs / 2,
  },
  playerPosition: {
    fontSize: responsive.fontSize.sm,
    color: COLORS.gray,
    fontWeight: '500',
  },
  playerAction: {
    padding: responsive.spacing.xs,
  },
  playerStats: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: responsive.spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: responsive.fontSize.lg,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: responsive.spacing.xs / 2,
  },
  statLabel: {
    fontSize: responsive.fontSize.xs,
    color: COLORS.gray,
    fontWeight: '500',
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
  matchInfo: {
    flex: 1,
  },
  matchOpponent: {
    fontSize: responsive.fontSize.md,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: responsive.spacing.xs / 2,
  },
  matchDate: {
    fontSize: responsive.fontSize.xs,
    color: COLORS.gray,
  },
  matchResult: {
    alignItems: 'flex-end',
  },
  resultBadge: {
    borderRadius: 8,
    paddingHorizontal: responsive.spacing.sm,
    paddingVertical: responsive.spacing.xs / 2,
    marginBottom: responsive.spacing.xs / 2,
  },
  resultText: {
    fontSize: responsive.fontSize.xs,
    fontWeight: '600',
  },
  matchScore: {
    fontSize: responsive.fontSize.sm,
    fontWeight: '700',
    color: COLORS.darkGray,
  },
  matchFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: responsive.spacing.sm,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: responsive.spacing.sm,
    paddingVertical: responsive.spacing.xs,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: responsive.fontSize.xs,
    fontWeight: '600',
    marginLeft: responsive.spacing.xs / 2,
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
    padding: responsive.spacing.md,
  },
  modalPlayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: responsive.spacing.md,
    marginBottom: responsive.spacing.lg,
  },
  modalPlayerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.secondary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsive.spacing.md,
  },
  modalPlayerNumber: {
    fontSize: responsive.fontSize.lg,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  modalPlayerName: {
    fontSize: responsive.fontSize.lg,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: responsive.spacing.xs / 2,
  },
  modalPlayerPosition: {
    fontSize: responsive.fontSize.sm,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: responsive.spacing.xs / 2,
  },
  modalMatchInfo: {
    fontSize: responsive.fontSize.sm,
    color: COLORS.white,
    opacity: 0.8,
  },
  statsForm: {
    marginBottom: responsive.spacing.xl,
  },
  inputContainer: {
    marginBottom: responsive.spacing.md,
  },
  inputLabel: {
    fontSize: responsive.fontSize.sm,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: responsive.spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: responsive.spacing.sm,
  },
  inputIcon: {
    marginRight: responsive.spacing.xs,
  },
  statInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: responsive.spacing.sm,
  },
  modalActions: {
    flexDirection: 'row',
    gap: responsive.spacing.sm,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    paddingVertical: responsive.spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: responsive.fontSize.md,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  saveButton: {
    flex: 2,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    paddingVertical: responsive.spacing.md,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: responsive.fontSize.md,
    fontWeight: '600',
    color: COLORS.white,
  },

  bottomPadding: {
    height: responsive.spacing.xl,
  },
});

export default ManageStats;
