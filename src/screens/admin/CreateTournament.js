import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, SPORTS, TOURNAMENT_TYPES } from '../../utils/constants';
import { globalStyles } from '../../styles/globalStyles';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import tournamentService from '../../services/tournamentService';

const CreateTournament = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sport: '',
    type: '',
    startDate: new Date(),
    endDate: new Date(),
    registrationDeadline: new Date(),
    maxTeams: '',
    minTeams: '',
    registrationFee: '',
    prize: '',
    location: '',
    rules: '',
    organizer: '',
  });
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(null);

  const sports = [
    { id: SPORTS.FUTBOL, name: 'Fútbol', icon: 'football' },
    { id: SPORTS.BASQUETBOL, name: 'Basquetbol', icon: 'basketball' },
    {
      id: SPORTS.FUTBOL_AMERICANO,
      name: 'Fútbol Americano',
      icon: 'american-football',
    },
    { id: SPORTS.VOLEIBOL, name: 'Voleibol', icon: 'tennis' },
  ];

  const tournamentTypes = [
    { id: TOURNAMENT_TYPES.INTER_FACULTADES, name: 'Inter-facultades' },
    { id: TOURNAMENT_TYPES.COPA_UNIVERSITARIA, name: 'Copa Universitaria' },
    { id: TOURNAMENT_TYPES.LIGA_REGULAR, name: 'Liga Regular' },
  ];

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del torneo es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.sport) {
      newErrors.sport = 'Debes seleccionar un deporte';
    }

    if (!formData.type) {
      newErrors.type = 'Debes seleccionar un tipo de torneo';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es requerida';
    }

    if (!formData.organizer.trim()) {
      newErrors.organizer = 'El organizador es requerido';
    }

    if (formData.maxTeams && parseInt(formData.maxTeams) < 2) {
      newErrors.maxTeams = 'Debe haber al menos 2 equipos';
    }

    if (formData.minTeams && parseInt(formData.minTeams) < 2) {
      newErrors.minTeams = 'Debe haber al menos 2 equipos';
    }

    if (
      formData.maxTeams &&
      formData.minTeams &&
      parseInt(formData.maxTeams) < parseInt(formData.minTeams)
    ) {
      newErrors.maxTeams = 'El máximo debe ser mayor al mínimo';
    }

    if (formData.endDate <= formData.startDate) {
      newErrors.endDate = 'La fecha de fin debe ser posterior a la de inicio';
    }

    if (formData.registrationDeadline >= formData.startDate) {
      newErrors.registrationDeadline =
        'La fecha límite debe ser antes del inicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateTournament = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const tournamentData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        sport: formData.sport,
        type: formData.type,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        registrationDeadline: formData.registrationDeadline.toISOString(),
        maxTeams: formData.maxTeams ? parseInt(formData.maxTeams) : null,
        minTeams: formData.minTeams ? parseInt(formData.minTeams) : 2,
        registrationFee: formData.registrationFee.trim(),
        prize: formData.prize.trim(),
        location: formData.location.trim(),
        rules: formData.rules.trim(),
        organizer: formData.organizer.trim(),
      };

      const newTournament = await tournamentService.createTournament(
        tournamentData
      );

      Alert.alert(
        'Torneo Creado',
        `El torneo "${formData.name}" ha sido creado exitosamente.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(null);

    if (selectedDate) {
      updateFormData(showDatePicker, selectedDate);
    }
  };

  const formatDate = date => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const SportSelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorTitle}>Deporte *</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.selectorScroll}
      >
        {sports.map(sport => (
          <TouchableOpacity
            key={sport.id}
            style={[
              styles.selectorOption,
              formData.sport === sport.id && styles.selectedOption,
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
                styles.selectorText,
                formData.sport === sport.id && styles.selectedSelectorText,
              ]}
            >
              {sport.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {errors.sport && <Text style={styles.errorText}>{errors.sport}</Text>}
    </View>
  );

  const TypeSelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorTitle}>Tipo de Torneo *</Text>
      <View style={styles.typeGrid}>
        {tournamentTypes.map(type => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.typeOption,
              formData.type === type.id && styles.selectedTypeOption,
            ]}
            onPress={() => updateFormData('type', type.id)}
          >
            <Text
              style={[
                styles.typeText,
                formData.type === type.id && styles.selectedTypeText,
              ]}
            >
              {type.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
    </View>
  );

  const DateSelector = ({ label, field, error }) => (
    <View style={styles.dateContainer}>
      <Text style={styles.dateLabel}>{label} *</Text>
      <TouchableOpacity
        style={[styles.dateButton, error && styles.dateButtonError]}
        onPress={() => setShowDatePicker(field)}
      >
        <Ionicons name="calendar" size={20} color={COLORS.gray} />
        <Text style={styles.dateText}>{formatDate(formData[field])}</Text>
        <Ionicons name="chevron-down" size={20} color={COLORS.gray} />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Header
          title="Crear Torneo"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <Loading text="Creando torneo..." />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Header
        title="Crear Torneo"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Información Básica */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Información Básica</Text>

          <Input
            label="Nombre del Torneo"
            value={formData.name}
            onChangeText={value => updateFormData('name', value)}
            placeholder="Ej: Copa Inter-facultades 2024"
            leftIcon="trophy"
            error={errors.name}
          />

          <Input
            label="Descripción"
            value={formData.description}
            onChangeText={value => updateFormData('description', value)}
            placeholder="Describe el torneo..."
            leftIcon="document-text"
            multiline={true}
            numberOfLines={3}
            error={errors.description}
          />

          <SportSelector />
          <TypeSelector />
        </Card>

        {/* Fechas */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Fechas Importantes</Text>

          <DateSelector
            label="Fecha Límite de Inscripción"
            field="registrationDeadline"
            error={errors.registrationDeadline}
          />

          <DateSelector
            label="Fecha de Inicio"
            field="startDate"
            error={errors.startDate}
          />

          <DateSelector
            label="Fecha de Fin"
            field="endDate"
            error={errors.endDate}
          />
        </Card>

        {/* Configuración */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>

          <View style={styles.numberRow}>
            <Input
              label="Mínimo de Equipos"
              value={formData.minTeams}
              onChangeText={value => updateFormData('minTeams', value)}
              placeholder="2"
              keyboardType="numeric"
              leftIcon="people"
              error={errors.minTeams}
              style={styles.halfInput}
            />

            <Input
              label="Máximo de Equipos"
              value={formData.maxTeams}
              onChangeText={value => updateFormData('maxTeams', value)}
              placeholder="16"
              keyboardType="numeric"
              leftIcon="people"
              error={errors.maxTeams}
              style={styles.halfInput}
            />
          </View>

          <Input
            label="Costo de Inscripción"
            value={formData.registrationFee}
            onChangeText={value => updateFormData('registrationFee', value)}
            placeholder="$100"
            leftIcon="card"
          />

          <Input
            label="Premio"
            value={formData.prize}
            onChangeText={value => updateFormData('prize', value)}
            placeholder="$5,000 + Trofeo"
            leftIcon="gift"
          />

          <Input
            label="Ubicación"
            value={formData.location}
            onChangeText={value => updateFormData('location', value)}
            placeholder="Estadio Universitario"
            leftIcon="location"
            error={errors.location}
          />

          <Input
            label="Organizador"
            value={formData.organizer}
            onChangeText={value => updateFormData('organizer', value)}
            placeholder="Deportes Universidad"
            leftIcon="person"
            error={errors.organizer}
          />
        </Card>

        {/* Reglamento */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Reglamento</Text>

          <Input
            label="Reglas y Normativas"
            value={formData.rules}
            onChangeText={value => updateFormData('rules', value)}
            placeholder="Describe las reglas del torneo..."
            leftIcon="document"
            multiline={true}
            numberOfLines={4}
          />
        </Card>

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <Button
            title="Cancelar"
            type="outline"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          />

          <Button
            title="Crear Torneo"
            onPress={handleCreateTournament}
            loading={loading}
            icon="add-circle"
            style={styles.createButton}
          />
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={formData[showDatePicker]}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  selectorContainer: {
    marginVertical: 12,
  },
  selectorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 12,
  },
  selectorScroll: {
    paddingVertical: 8,
  },
  selectorOption: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginRight: 12,
    minWidth: 100,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  selectorText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.darkGray,
    marginTop: 6,
    textAlign: 'center',
  },
  selectedSelectorText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeOption: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTypeOption: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.darkGray,
    textAlign: 'center',
  },
  selectedTypeText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  dateContainer: {
    marginVertical: 8,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  dateButtonError: {
    borderColor: COLORS.error,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.darkGray,
    marginLeft: 12,
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  createButton: {
    flex: 1,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
    marginLeft: 4,
  },
  bottomPadding: {
    height: 40,
  },
});

export default CreateTournament;
