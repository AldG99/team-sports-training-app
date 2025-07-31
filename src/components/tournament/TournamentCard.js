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

const TournamentsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTab, setSelectedTab] = useState('active');
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const tabs = [
    { id: 'active', name: 'Activos', icon: 'play-circle' },
    { id: 'upcoming', name: 'Próximos', icon: 'time' },
    { id: 'finished', name: 'Finalizados', icon: 'checkmark-circle' },
  ];

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      setLoading(true);
      // Simular carga de datos
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
          teams: 16,
          matches: 31,
          currentRound: 'Cuartos de Final',
          prize: '$5,000',
          registrationFee: '$100',
          description: 'El torneo más prestigioso de fútbol universitario',
          rules: 'Reglamento FIFA adaptado para universitarios',
          location: 'Estadio Universitario',
          organizer: 'Deportes UNAM',
        },
        {
          id: '2',
          name: 'Liga Inter-facultades Basquetbol',
          sport: SPORTS.BASQUETBOL,
          type: TOURNAMENT_TYPES.INTER_FACULTADES,
          status: TOURNAMENT_STATUS.ACTIVE,
          startDate: '2024-02-15',
          endDate: '2024-05-30',
          teams: 12,
          matches: 66,
          currentRound: 'Fase Regular',
          prize: '$3,000',
          registrationFee: '$75',
          description: 'Competencia entre todas las facultades',
          rules: 'Reglas FIBA universitarias',
          location: 'Gimnasio Central',
          organizer: 'Liga Universitaria',
        },
        {
          id: '3',
          name: 'Torneo Relámpago Voleibol',
          sport: SPORTS.VOLEIBOL,
          type: TOURNAMENT_TYPES.LIGA_REGULAR,
          status: TOURNAMENT_STATUS.UPCOMING,
          startDate: '2024-07-01',
          endDate: '2024-07-03',
          teams: 8,
          matches: 14,
          currentRound: 'Por iniciar',
          prize: '$1,500',
          registrationFee: '$50',
          description: 'Torneo intensivo de fin de semana',
          rules: 'Sets a 21 puntos',
          location: 'Cancha de Voleibol',
          organizer: 'Club de Voleibol',
        },
        {
          id: '4',
          name: 'Campeonato Fútbol Americano 2023',
          sport: SPORTS.FUTBOL_AMERICANO,
          type: TOURNAMENT_TYPES.COPA_UNIVERSITARIA,
          status: TOURNAMENT_STATUS.FINISHED,
          startDate: '2023-09-01',
          endDate: '2023-12-15',
          teams: 8,
          matches: 15,
          currentRound: 'Finalizado',
          prize: '$7,500',
          registrationFee: '$150',
          description: 'Temporada completa de fútbol americano',
          rules: 'Reglamento NCAA adaptado',
          location: 'Campo de Fútbol Americano',
          organizer: 'Asociación Deportiva',
          winner: 'Ingeniería Eagles',
        },
      ];

      setTournaments(mockTournaments);
    } catch (error) {
      console.error('Error loading tournaments:', error);
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
    return tournaments.filter(tournament => {
      switch (selectedTab) {
        case 'active':
          return tournament.status === TOURNAMENT_STATUS.ACTIVE;
        case 'upcoming':
          return tournament.status === TOURNAMENT_STATUS.UPCOMING;
        case 'finished':
          return tournament.status === TOURNAMENT_STATUS.FINISHED;
        default:
          return true;
      }
    });
  };

  const getSportIcon = sport => {
    const icons = {
      [SPORTS.FUTBOL]: 'football',
      [SPORTS.BASQUETBOL]: 'basketball',
      [SPORTS.FUTBOL_AMERICANO]: 'american-football',
      [SPORTS.VOLEIBOL]: 'tennis',
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

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const TournamentCard = ({ tournament }) => (
    <Card
      style={styles.tournamentCard}
      onPress={() => {
        setSelectedTournament(tournament);
        setShowDetailsModal(true);
      }}
    >
      <View style={styles.tournamentHeader}>
        <View style={styles.tournamentInfo}>
          <Text style={styles.tournamentName} numberOfLines={2}>
            {tournament.name}
          </Text>
          <Text style={styles.tournamentType}>
            {tournament.type.replace('_', ' ').toUpperCase()}
          </Text>
        </View>

        <View style={styles.tournamentIcons}>
          <Ionicons
            name={getSportIcon(tournament.sport)}
            size={32}
            color={COLORS.secondary}
          />
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(tournament.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {getStatusText(tournament.status)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.tournamentDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={16} color={COLORS.gray} />
          <Text style={styles.detailText}>
            {formatDate(tournament.startDate)} -{' '}
            {formatDate(tournament.endDate)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="people" size={16} color={COLORS.gray} />
          <Text style={styles.detailText}>{tournament.teams} equipos</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="trophy" size={16} color={COLORS.gray} />
          <Text style={styles.detailText}>Premio: {tournament.prize}</Text>
        </View>
      </View>

      <View style={styles.tournamentFooter}>
        <Text style={styles.currentRound}>{tournament.currentRound}</Text>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>Ver Detalles</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  const TournamentDetailsModal = () => (
    <Modal
      visible={showDetailsModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowDetailsModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Detalles del Torneo</Text>
          <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
            <Ionicons name="close" size={24} color={COLORS.darkGray} />
          </TouchableOpacity>
        </View>

        {selectedTournament && (
          <ScrollView style={styles.modalContent}>
            <View style={styles.modalTournamentHeader}>
              <Ionicons
                name={getSportIcon(selectedTournament.sport)}
                size={48}
                color={COLORS.secondary}
              />
              <View style={styles.modalTournamentInfo}>
                <Text style={styles.modalTournamentName}>
                  {selectedTournament.name}
                </Text>
                <Text style={styles.modalTournamentType}>
                  {selectedTournament.type.replace('_', ' ').toUpperCase()}
                </Text>
                <View
                  style={[
                    styles.modalStatusBadge,
                    {
                      backgroundColor: getStatusColor(
                        selectedTournament.status
                      ),
                    },
                  ]}
                >
                  <Text style={styles.modalStatusText}>
                    {getStatusText(selectedTournament.status)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Información General</Text>
              <Text style={styles.modalDescription}>
                {selectedTournament.description}
              </Text>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Detalles</Text>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Fechas:</Text>
                <Text style={styles.modalDetailValue}>
                  {formatDate(selectedTournament.startDate)} -{' '}
                  {formatDate(selectedTournament.endDate)}
                </Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Equipos:</Text>
                <Text style={styles.modalDetailValue}>
                  {selectedTournament.teams}
                </Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Partidos:</Text>
                <Text style={styles.modalDetailValue}>
                  {selectedTournament.matches}
                </Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Premio:</Text>
                <Text style={styles.modalDetailValue}>
                  {selectedTournament.prize}
                </Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Inscripción:</Text>
                <Text style={styles.modalDetailValue}>
                  {selectedTournament.registrationFee}
                </Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Ubicación:</Text>
                <Text style={styles.modalDetailValue}>
                  {selectedTournament.location}
                </Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Organizador:</Text>
                <Text style={styles.modalDetailValue}>
                  {selectedTournament.organizer}
                </Text>
              </View>
              {selectedTournament.winner && (
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Ganador:</Text>
                  <Text
                    style={[
                      styles.modalDetailValue,
                      { color: COLORS.secondary, fontWeight: 'bold' },
                    ]}
                  >
                    {selectedTournament.winner}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Reglamento</Text>
              <Text style={styles.modalDescription}>
                {selectedTournament.rules}
              </Text>
            </View>

            <View style={styles.modalActions}>
              {selectedTournament.status === TOURNAMENT_STATUS.UPCOMING && (
                <Button
                  title="Inscribir Equipo"
                  icon="add-circle"
                  onPress={() => {
                    setShowDetailsModal(false);
                    // Navegar a inscripción
                  }}
                />
              )}

              {selectedTournament.status === TOURNAMENT_STATUS.ACTIVE && (
                <>
                  <Button
                    title="Ver Bracket"
                    icon="git-branch"
                    onPress={() => {
                      setShowDetailsModal(false);
                      // Navegar a bracket
                    }}
                  />
                  <Button
                    title="Ver Resultados"
                    type="outline"
                    icon="list"
                    onPress={() => {
                      setShowDetailsModal(false);
                      // Navegar a resultados
                    }}
                  />
                </>
              )}

              {selectedTournament.status === TOURNAMENT_STATUS.FINISHED && (
                <Button
                  title="Ver Resultados Finales"
                  icon="trophy"
                  onPress={() => {
                    setShowDetailsModal(false);
                    // Navegar a resultados finales
                  }}
                />
              )}
            </View>

            <View style={styles.modalBottomPadding} />
          </ScrollView>
        )}
      </View>
    </Modal>
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
        rightIcon="add-circle-outline"
        onRightPress={() => {
          /* Crear torneo (solo admins) */
        }}
      />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, selectedTab === tab.id && styles.selectedTab]}
              onPress={() => setSelectedTab(tab.id)}
            >
              <Ionicons
                name={tab.icon}
                size={20}
                color={selectedTab === tab.id ? COLORS.white : COLORS.darkGray}
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

      {/* Lista de Torneos */}
      <FlatList
        data={getFilteredTournaments()}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TournamentCard tournament={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={64} color={COLORS.gray} />
            <Text style={styles.emptyText}>No hay torneos {selectedTab}</Text>
            <Text style={styles.emptySubtext}>
              Los nuevos torneos aparecerán aquí
            </Text>
          </View>
        }
      />

      <TournamentDetailsModal />
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
  },
  tabsScroll: {
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  selectedTab: {
    backgroundColor: COLORS.secondary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.darkGray,
    marginLeft: 6,
  },
  selectedTabText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  listContainer: {
    paddingVertical: 8,
  },
  tournamentCard: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  tournamentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tournamentInfo: {
    flex: 1,
    marginRight: 12,
  },
  tournamentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  tournamentType: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  tournamentIcons: {
    alignItems: 'center',
  },
  statusBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  statusText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '600',
  },
  tournamentDetails: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGray,
    paddingVertical: 12,
    marginVertical: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 8,
  },
  tournamentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentRound: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '600',
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.white,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: COLORS.primary,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  modalContent: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalTournamentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 12,
  },
  modalTournamentInfo: {
    marginLeft: 16,
    flex: 1,
  },
  modalTournamentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  modalTournamentType: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalStatusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  modalStatusText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '600',
  },
  modalSection: {
    backgroundColor: COLORS.white,
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    padding: 16,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  modalDetailLabel: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  modalDetailValue: {
    fontSize: 14,
    color: COLORS.darkGray,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  modalActions: {
    padding: 16,
  },
  modalBottomPadding: {
    height: 20,
  },
});

export default TournamentsScreen;
