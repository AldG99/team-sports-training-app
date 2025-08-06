import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPORTS, USER_TYPES } from '../../utils/constants';
import { globalStyles } from '../../styles/globalStyles';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import useAuth from '../../hooks/useAuth';

const TeamRegistration = ({ navigation, route }) => {
  const { tournament } = route.params || {};
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    teamName: '',
    sport: tournament?.sport || '',
    faculty: userProfile?.faculty || '',
    captain: userProfile?.uid || '',
    coach: '',
    description: '',
    players: [],
  });
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [searchText, setSearchText] = useState('');

  const sports = [
    {
      id: SPORTS.FUTBOL,
      name: 'Fútbol',
      icon: 'football',
      minPlayers: 11,
      maxPlayers: 25,
    },
    {
      id: SPORTS.BASQUETBOL,
      name: 'Basquetbol',
      icon: 'basketball',
      minPlayers: 5,
      maxPlayers: 15,
    },
    {
      id: SPORTS.VOLEIBOL,
      name: 'Voleibol',
      icon: 'tennis',
      minPlayers: 6,
      maxPlayers: 18,
    },
    {
      id: SPORTS.FUTBOL_AMERICANO,
      name: 'Fútbol Americano',
      icon: 'american-football',
      minPlayers: 11,
      maxPlayers: 30,
    },
  ];

  const faculties = [
    'Ingeniería',
    'Medicina',
    'Derecho',
    'Economía',
    'Psicología',
    'Administración',
    'Arquitectura',
    'Comunicaciones',
    'Educación',
    'Ciencias',
  ];

  useEffect(() => {
    loadAvailablePlayers();
  }, [formData.sport, formData.faculty]);

  const loadAvailablePlayers = async () => {
    try {
      // Simular carga de jugadores disponibles
      const mockPlayers = [
        {
          id: '1',
          name: 'Juan Pérez',
          email: 'juan.perez@universidad.edu',
          faculty: formData.faculty,
          avatar: 'https://via.placeholder.com/50',
          sport: formData.sport,
          position: 'Delantero',
          experience: 'Avanzado',
        },
        {
          id: '2',
          name: 'María García',
          email: 'maria.garcia@universidad.edu',
          faculty: formData.faculty,
          avatar: 'https://via.placeholder.com/50',
          sport: formData.sport,
          position: 'Mediocampista',
          experience: 'Intermedio',
        },
        {
          id: '3',
          name: 'Carlos López',
          email: 'carlos.lopez@universidad.edu',
          faculty: formData.faculty,
          avatar: 'https://via.placeholder.com/50',
          sport: formData.sport,
          position: 'Portero',
          experience: 'Avanzado',
        },
        {
          id: '4',
          name: 'Ana Torres',
          email: 'ana.torres@universidad.edu',
          faculty: formData.faculty,
          avatar: 'https://via.placeholder.com/50',
          sport: formData.sport,
          position: 'Defensa',
          experience: 'Principiante',
        },
        // Más jugadores simulados...
      ];

      setAvailablePlayers(mockPlayers);
    } catch (error) {
      console.error('Error loading players:', error);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getSelectedSport = () => {
    return sports.find(sport => sport.id === formData.sport);
  };

  const togglePlayerSelection = player => {
    setSelectedPlayers(prev => {
      const isSelected = prev.some(p => p.id === player.id);
      if (isSelected) {
        return prev.filter(p => p.id !== player.id);
      } else {
        const sportConfig = getSelectedSport();
        if (prev.length >= sportConfig?.maxPlayers) {
          Alert.alert(
            'Límite alcanzado',
            `Solo puedes seleccionar hasta ${sportConfig.maxPlayers} jugadores para ${sportConfig.name}`
          );
          return prev;
        }
        return [...prev, player];
      }
    });
  };

  const getFilteredPlayers = () => {
    return availablePlayers.filter(
      player =>
        player.name.toLowerCase().includes(searchText.toLowerCase()) ||
        player.email.toLowerCase().includes(searchText.toLowerCase()) ||
        player.position.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.teamName.trim()) {
          Alert.alert('Error', 'El nombre del equipo es requerido');
          return false;
        }
        if (!formData.sport) {
          Alert.alert('Error', 'Debes seleccionar un deporte');
          return false;
        }
        if (!formData.faculty) {
          Alert.alert('Error', 'Debes seleccionar una facultad');
          return false;
        }
        return true;
      case 2:
        const sportConfig = getSelectedSport();
        if (selectedPlayers.length < sportConfig?.minPlayers) {
          Alert.alert(
            'Error',
            `Debes seleccionar al menos ${sportConfig.minPlayers} jugadores para ${sportConfig.name}`
          );
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const submitRegistration = async () => {
    if (!validateStep()) return;

    try {
      setLoading(true);

      const teamData = {
        ...formData,
        players: selectedPlayers,
        createdBy: userProfile?.uid,
        createdAt: new Date().toISOString(),
        tournament: tournament?.id,
      };

      // Simular registro del equipo
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Registro Exitoso',
        `El equipo "${formData.teamName}" ha sido registrado correctamente.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar el equipo');
    } finally {
      setLoading(false);
    }
  };

  const PlayerItem = ({ player }) => {
    const isSelected = selectedPlayers.some(p => p.id === player.id);

    return (
      <TouchableOpacity
        style={[styles.playerItem, isSelected && styles.selectedPlayer]}
        onPress={() => togglePlayerSelection(player)}
      >
        <Image source={{ uri: player.avatar }} style={styles.playerAvatar} />
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={styles.playerPosition}>{player.position}</Text>
          <Text style={styles.playerExperience}>{player.experience}</Text>
        </View>
        <View style={styles.selectionIndicator}>
          <Ionicons
            name={isSelected ? 'checkbox' : 'square-outline'}
            size={24}
            color={isSelected ? COLORS.secondary : COLORS.gray}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderStep1 = () => (
    <ScrollView style={styles.stepContainer}>
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Información del Equipo</Text>

        <Input
          label="Nombre del Equipo"
          value={formData.teamName}
          onChangeText={value => updateFormData('teamName', value)}
          placeholder="Ej: Ingeniería FC"
          leftIcon="shield"
        />

        <Input
          label="Descripción (Opcional)"
          value={formData.description}
          onChangeText={value => updateFormData('description', value)}
          placeholder="Describe tu equipo..."
          leftIcon="document-text"
          multiline
          numberOfLines={3}
        />
      </Card>

      {!tournament && (
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Deporte</Text>
          <View style={styles.sportsGrid}>
            {sports.map(sport => (
              <TouchableOpacity
                key={sport.id}
                style={[
                  styles.sportOption,
                  formData.sport === sport.id && styles.selectedSport,
                ]}
                onPress={() => updateFormData('sport', sport.id)}
              >
                <Ionicons
                  name={sport.icon}
                  size={24}
                  color={
                    formData.sport === sport.id ? COLORS.white : COLORS.darkGray
                  }
                />
                <Text
                  style={[
                    styles.sportText,
                    formData.sport === sport.id && styles.selectedSportText,
                  ]}
                >
                  {sport.name}
                </Text>
                <Text
                  style={[
                    styles.sportInfo,
                    formData.sport === sport.id && styles.selectedSportInfo,
                  ]}
                >
                  {sport.minPlayers}-{sport.maxPlayers} jugadores
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      )}

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Facultad</Text>
        <View style={styles.facultyGrid}>
          {faculties.map(faculty => (
            <TouchableOpacity
              key={faculty}
              style={[
                styles.facultyOption,
                formData.faculty === faculty && styles.selectedFaculty,
              ]}
              onPress={() => updateFormData('faculty', faculty)}
            >
              <Text
                style={[
                  styles.facultyText,
                  formData.faculty === faculty && styles.selectedFacultyText,
                ]}
              >
                {faculty}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>
    </ScrollView>
  );

  const renderStep2 = () => {
    const sportConfig = getSelectedSport();
    const filteredPlayers = getFilteredPlayers();

    return (
      <View style={styles.stepContainer}>
        <Card style={styles.section}>
          <View style={styles.playersHeader}>
            <Text style={styles.sectionTitle}>
              Seleccionar Jugadores ({selectedPlayers.length}/
              {sportConfig?.maxPlayers})
            </Text>
            <Text style={styles.playersSubtitle}>
              Mínimo: {sportConfig?.minPlayers} jugadores
            </Text>
          </View>

          <Input
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Buscar jugadores..."
            leftIcon="search"
          />

          <FlatList
            data={filteredPlayers}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <PlayerItem player={item} />}
            style={styles.playersList}
            ListEmptyComponent={
              <View style={styles.emptyPlayers}>
                <Ionicons name="people-outline" size={48} color={COLORS.gray} />
                <Text style={styles.emptyPlayersText}>
                  No se encontraron jugadores
                </Text>
              </View>
            }
          />
        </Card>
      </View>
    );
  };

  const renderStep3 = () => (
    <ScrollView style={styles.stepContainer}>
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen del Registro</Text>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Nombre del Equipo:</Text>
          <Text style={styles.summaryValue}>{formData.teamName}</Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Deporte:</Text>
          <Text style={styles.summaryValue}>{getSelectedSport()?.name}</Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Facultad:</Text>
          <Text style={styles.summaryValue}>{formData.faculty}</Text>
        </View>

        {tournament && (
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Torneo:</Text>
            <Text style={styles.summaryValue}>{tournament.name}</Text>
          </View>
        )}

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Jugadores Seleccionados:</Text>
          <Text style={styles.summaryValue}>{selectedPlayers.length}</Text>
        </View>

        {formData.description && (
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Descripción:</Text>
            <Text style={styles.summaryValue}>{formData.description}</Text>
          </View>
        )}
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Jugadores del Equipo</Text>
        {selectedPlayers.map((player, index) => (
          <View key={player.id} style={styles.selectedPlayerItem}>
            <Image source={{ uri: player.avatar }} style={styles.smallAvatar} />
            <View style={styles.selectedPlayerInfo}>
              <Text style={styles.selectedPlayerName}>
                {index + 1}. {player.name}
              </Text>
              <Text style={styles.selectedPlayerPosition}>
                {player.position}
              </Text>
            </View>
          </View>
        ))}
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Términos y Condiciones</Text>
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            • El equipo debe tener la cantidad mínima de jugadores requerida
          </Text>
          <Text style={styles.termsText}>
            • Todos los jugadores deben ser estudiantes activos de la
            universidad
          </Text>
          <Text style={styles.termsText}>
            • El equipo se compromete a participar en todos los partidos
            programados
          </Text>
          <Text style={styles.termsText}>
            • Se debe respetar el fair play y las reglas del deporte
          </Text>
          <Text style={styles.termsText}>
            • El equipo puede ser descalificado por conducta antideportiva
          </Text>
        </View>
      </Card>
    </ScrollView>
  );

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return 'Información Básica';
      case 2:
        return 'Seleccionar Jugadores';
      case 3:
        return 'Confirmar Registro';
      default:
        return 'Registro de Equipo';
    }
  };

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Header
          title="Registrar Equipo"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <Loading text="Registrando equipo..." />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Header
        title="Registrar Equipo"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          {[1, 2, 3].map(stepNumber => (
            <View
              key={stepNumber}
              style={[
                styles.progressStep,
                step >= stepNumber && styles.activeProgressStep,
              ]}
            >
              <Text
                style={[
                  styles.progressStepText,
                  step >= stepNumber && styles.activeProgressStepText,
                ]}
              >
                {stepNumber}
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.stepTitle}>{getStepTitle()}</Text>
      </View>

      {/* Step Content */}
      <View style={styles.content}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        {step > 1 && (
          <Button
            title="Anterior"
            type="outline"
            onPress={prevStep}
            icon="arrow-back"
            style={styles.navButton}
          />
        )}

        {step < 3 ? (
          <Button
            title="Siguiente"
            onPress={nextStep}
            icon="arrow-forward"
            style={styles.navButton}
          />
        ) : (
          <Button
            title="Registrar Equipo"
            onPress={submitRegistration}
            loading={loading}
            icon="checkmark-circle"
            style={styles.navButton}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  progressBar: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  progressStep: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  activeProgressStep: {
    backgroundColor: COLORS.secondary,
  },
  progressStepText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.gray,
  },
  activeProgressStepText: {
    color: COLORS.white,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sportOption: {
    width: '48%',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedSport: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  sportText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginTop: 8,
    textAlign: 'center',
  },
  selectedSportText: {
    color: COLORS.white,
  },
  sportInfo: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 4,
    textAlign: 'center',
  },
  selectedSportInfo: {
    color: COLORS.white,
    opacity: 0.8,
  },
  facultyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  facultyOption: {
    width: '48%',
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedFaculty: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  facultyText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.darkGray,
    textAlign: 'center',
  },
  selectedFacultyText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  playersHeader: {
    marginBottom: 16,
  },
  playersSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 4,
  },
  playersList: {
    maxHeight: 300,
    marginTop: 16,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: COLORS.lightGray,
  },
  selectedPlayer: {
    backgroundColor: COLORS.secondary,
  },
  playerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.gray,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  playerPosition: {
    fontSize: 14,
    color: COLORS.secondary,
    marginTop: 2,
  },
  playerExperience: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  selectionIndicator: {
    padding: 8,
  },
  emptyPlayers: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyPlayersText: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.darkGray,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  selectedPlayerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  smallAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray,
  },
  selectedPlayerInfo: {
    marginLeft: 12,
  },
  selectedPlayerName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  selectedPlayerPosition: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  termsContainer: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 16,
  },
  termsText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 8,
    lineHeight: 20,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default TeamRegistration;
