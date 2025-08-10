import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Modal,
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
    horizontal: Math.max(scale(16), screenWidth * 0.04),
    vertical: Math.max(scale(12), screenHeight * 0.015),
    section: Math.max(scale(8), screenHeight * 0.01),
  };
};

// Función para obtener tamaños de elementos
const getElementSizes = () => {
  return {
    searchHeight: scale(44),
    filterButtonSize: scale(44),
    iconSize: scale(20),
    sportIconSize: scale(28),
    modalMaxHeight: screenHeight * 0.7,
  };
};

const TeamsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const padding = getResponsivePadding();
  const sizes = getElementSizes();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedSport, setSelectedSport] = useState('all');
  const [showFilterModal, setShowFilterModal] = useState(false);

  const sports = [
    { id: 'all', name: 'Todos', icon: 'grid' },
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
    loadTeams();
  }, []);

  useEffect(() => {
    filterTeams();
  }, [teams, searchText, selectedSport]);

  const loadTeams = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockTeams = [
        {
          id: '1',
          name: 'Ingeniería FC',
          sport: SPORTS.FUTBOL,
          faculty: 'Ingeniería',
          players: 22,
          wins: 8,
          losses: 2,
          draws: 1,
          coach: 'Carlos Mendoza',
          founded: '2020',
        },
        {
          id: '2',
          name: 'Medicina Basketball',
          sport: SPORTS.BASQUETBOL,
          faculty: 'Medicina',
          players: 15,
          wins: 12,
          losses: 3,
          draws: 0,
          coach: 'Ana García',
          founded: '2019',
        },
        {
          id: '3',
          name: 'Derecho Volleyball',
          sport: SPORTS.VOLEIBOL,
          faculty: 'Derecho',
          players: 18,
          wins: 10,
          losses: 5,
          draws: 2,
          coach: 'Luis Torres',
          founded: '2021',
        },
        {
          id: '4',
          name: 'Economía Eagles',
          sport: SPORTS.FUTBOL_AMERICANO,
          faculty: 'Economía',
          players: 25,
          wins: 6,
          losses: 4,
          draws: 0,
          coach: 'Roberto Silva',
          founded: '2018',
        },
        {
          id: '5',
          name: 'Psicología FC',
          sport: SPORTS.FUTBOL,
          faculty: 'Psicología',
          players: 20,
          wins: 5,
          losses: 6,
          draws: 2,
          coach: 'María López',
          founded: '2022',
        },
      ];

      setTeams(mockTeams);
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTeams = () => {
    let filtered = teams;

    if (selectedSport !== 'all') {
      filtered = filtered.filter(team => team.sport === selectedSport);
    }

    if (searchText.trim() !== '') {
      filtered = filtered.filter(
        team =>
          team.name.toLowerCase().includes(searchText.toLowerCase()) ||
          team.faculty.toLowerCase().includes(searchText.toLowerCase()) ||
          team.coach.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredTeams(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTeams();
    setRefreshing(false);
  };

  const getSportIcon = sport => {
    const sportObj = sports.find(s => s.id === sport);
    return sportObj ? sportObj.icon : 'help-circle';
  };

  const getSportName = sport => {
    const sportObj = sports.find(s => s.id === sport);
    return sportObj ? sportObj.name : 'Desconocido';
  };

  const TeamCard = ({ team }) => (
    <Card
      variant="default"
      elevationLevel="low"
      style={[
        styles.teamCard,
        {
          marginHorizontal: padding.horizontal,
          marginVertical: scale(6),
        },
      ]}
      onPress={() => navigation.navigate('TeamDetails', { team })}
    >
      <View style={[styles.teamHeader, { marginBottom: scale(12) }]}>
        <View style={styles.teamInfo}>
          <Text
            style={[
              styles.teamName,
              {
                fontSize: scale(16),
                marginBottom: scale(4),
              },
            ]}
          >
            {team.name}
          </Text>
          <Text style={[styles.teamFaculty, { fontSize: scale(13) }]}>
            {team.faculty}
          </Text>
        </View>
        <View style={[styles.sportIcon, { marginLeft: scale(12) }]}>
          <View
            style={[
              styles.sportIconContainer,
              {
                backgroundColor: `${COLORS.secondary}15`,
                width: scale(48),
                height: scale(48),
                borderRadius: scale(24),
              },
            ]}
          >
            <Ionicons
              name={getSportIcon(team.sport)}
              size={sizes.sportIconSize}
              color={COLORS.secondary}
            />
          </View>
        </View>
      </View>

      <View
        style={[
          styles.teamStats,
          {
            paddingVertical: scale(12),
            borderTopWidth: scale(1),
            borderBottomWidth: scale(1),
            marginVertical: scale(8),
          },
        ]}
      >
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { fontSize: scale(16) }]}>
            {team.players}
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
            Jugadores
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { fontSize: scale(16) }]}>
            {team.wins}
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
            Ganados
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { fontSize: scale(16) }]}>
            {team.losses}
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
            Perdidos
          </Text>
        </View>
        {team.draws > 0 && (
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { fontSize: scale(16) }]}>
              {team.draws}
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
              Empates
            </Text>
          </View>
        )}
      </View>

      <View style={styles.teamFooter}>
        <View style={styles.coachContainer}>
          <Ionicons name="person" size={scale(14)} color={COLORS.gray} />
          <Text
            style={[
              styles.coachText,
              {
                fontSize: scale(13),
                marginLeft: scale(6),
              },
            ]}
          >
            {team.coach}
          </Text>
        </View>
        <View
          style={[
            styles.sportBadge,
            {
              backgroundColor: `${COLORS.secondary}20`,
              borderRadius: scale(10),
              paddingVertical: scale(3),
              paddingHorizontal: scale(8),
            },
          ]}
        >
          <Text style={[styles.sportText, { fontSize: scale(10) }]}>
            {getSportName(team.sport)}
          </Text>
        </View>
      </View>
    </Card>
  );

  const FilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            {
              borderTopLeftRadius: scale(20),
              borderTopRightRadius: scale(20),
              paddingVertical: scale(20),
              maxHeight: sizes.modalMaxHeight,
              paddingBottom: insets.bottom + scale(20),
            },
          ]}
        >
          <View
            style={[
              styles.modalHeader,
              {
                paddingHorizontal: padding.horizontal,
                marginBottom: scale(20),
              },
            ]}
          >
            <Text style={[styles.modalTitle, { fontSize: scale(16) }]}>
              Filtrar por Deporte
            </Text>
            <TouchableOpacity
              onPress={() => setShowFilterModal(false)}
              style={[
                styles.closeButton,
                {
                  width: scale(32),
                  height: scale(32),
                  borderRadius: scale(16),
                },
              ]}
              activeOpacity={0.8}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={scale(20)} color={COLORS.darkGray} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={sports}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.sportOption,
                  {
                    paddingVertical: scale(12),
                    paddingHorizontal: padding.horizontal,
                    marginHorizontal: scale(10),
                    borderRadius: scale(8),
                  },
                  selectedSport === item.id && styles.selectedSportOption,
                ]}
                onPress={() => {
                  setSelectedSport(item.id);
                  setShowFilterModal(false);
                }}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={item.icon}
                  size={sizes.iconSize}
                  color={
                    selectedSport === item.id ? COLORS.white : COLORS.darkGray
                  }
                />
                <Text
                  style={[
                    styles.sportOptionText,
                    {
                      fontSize: scale(14),
                      marginLeft: scale(12),
                    },
                    selectedSport === item.id && styles.selectedSportOptionText,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Header
          title="Equipos"
          variant={isSmallScreen ? 'compact' : 'default'}
        />
        <Loading variant="default" animation="scale" />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Header title="Equipos" variant={isSmallScreen ? 'compact' : 'default'} />

      {/* Barra de búsqueda y filtros */}
      <View
        style={[
          styles.searchContainer,
          {
            paddingHorizontal: padding.horizontal,
            paddingVertical: scale(12),
          },
        ]}
      >
        <View
          style={[
            styles.searchInputContainer,
            {
              borderRadius: scale(8),
              paddingHorizontal: scale(12),
              marginRight: scale(12),
              height: sizes.searchHeight,
            },
          ]}
        >
          <Ionicons
            name="search"
            size={sizes.iconSize}
            color={COLORS.gray}
            style={[styles.searchIcon, { marginRight: scale(8) }]}
          />
          <TextInput
            style={[
              styles.searchInput,
              {
                fontSize: scale(14),
                paddingVertical: scale(12),
              },
            ]}
            placeholder={
              isSmallScreen
                ? 'Buscar equipos...'
                : 'Buscar equipos, facultades o entrenadores...'
            }
            placeholderTextColor={COLORS.gray}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              borderRadius: scale(8),
              width: sizes.filterButtonSize,
              height: sizes.filterButtonSize,
            },
          ]}
          onPress={() => setShowFilterModal(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="filter" size={sizes.iconSize} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Filtro activo */}
      {selectedSport !== 'all' && (
        <View
          style={[
            styles.activeFilterContainer,
            {
              marginHorizontal: padding.horizontal,
              marginTop: scale(8),
              paddingHorizontal: scale(12),
              paddingVertical: scale(8),
              borderRadius: scale(6),
            },
          ]}
        >
          <Text style={[styles.activeFilterText, { fontSize: scale(13) }]}>
            Mostrando: {getSportName(selectedSport)}
          </Text>
          <TouchableOpacity
            onPress={() => setSelectedSport('all')}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={scale(16)} color={COLORS.secondary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Lista de equipos */}
      <FlatList
        data={filteredTeams}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TeamCard team={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.secondary}
            colors={[COLORS.secondary]}
          />
        }
        contentContainerStyle={[
          styles.listContainer,
          {
            paddingVertical: scale(8),
            paddingBottom: insets.bottom + scale(20),
          },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View
            style={[
              styles.emptyContainer,
              {
                paddingVertical: scale(60),
              },
            ]}
          >
            <Ionicons name="search" size={scale(56)} color={COLORS.gray} />
            <Text
              style={[
                styles.emptyText,
                {
                  fontSize: scale(16),
                  marginTop: scale(16),
                },
              ]}
            >
              No se encontraron equipos
            </Text>
            <Text
              style={[
                styles.emptySubtext,
                {
                  fontSize: scale(13),
                  marginTop: scale(8),
                },
              ]}
            >
              Intenta con otros términos de búsqueda
            </Text>
          </View>
        }
      />

      <FilterModal />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  searchIcon: {
    // margin se maneja dinámicamente
  },
  searchInput: {
    flex: 1,
    color: COLORS.darkGray,
    fontWeight: '500',
  },
  filterButton: {
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  activeFilterText: {
    color: COLORS.darkGray,
    fontWeight: '500',
  },
  listContainer: {
    // padding se maneja dinámicamente
  },
  teamCard: {
    // margins se manejan dinámicamente
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontWeight: '700',
    color: COLORS.darkGray,
    letterSpacing: 0.3,
  },
  teamFaculty: {
    color: COLORS.gray,
    fontWeight: '500',
  },
  sportIcon: {
    // marginLeft se maneja dinámicamente
  },
  sportIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderColor: COLORS.lightGray,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: '700',
    color: COLORS.darkGray,
    letterSpacing: 0.3,
  },
  statLabel: {
    color: COLORS.gray,
    fontWeight: '500',
  },
  teamFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coachContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  coachText: {
    color: COLORS.gray,
    fontWeight: '500',
  },
  sportBadge: {
    // styles se manejan dinámicamente
  },
  sportText: {
    color: COLORS.secondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
  },
  emptySubtext: {
    color: COLORS.white,
    textAlign: 'center',
    opacity: 0.7,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: '700',
    color: COLORS.darkGray,
    letterSpacing: 0.3,
  },
  closeButton: {
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sportOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedSportOption: {
    backgroundColor: COLORS.secondary,
  },
  sportOptionText: {
    color: COLORS.darkGray,
    fontWeight: '500',
  },
  selectedSportOptionText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default TeamsScreen;
