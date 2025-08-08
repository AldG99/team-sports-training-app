import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../../utils/constants';
import { globalStyles } from '../../styles/globalStyles';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import storageService from '../../services/storageService';
import firestoreService from '../../services/firestoreService';
import useAuth from '../../hooks/useAuth';

const UploadPhotos = ({ navigation, route }) => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'training',
    teamId: '',
    tags: '',
  });
  const [uploadProgress, setUploadProgress] = useState(0);

  const eventTypes = [
    { id: 'training', name: 'Entrenamiento', icon: 'fitness' },
    { id: 'match', name: 'Partido', icon: 'football' },
    { id: 'tournament', name: 'Torneo', icon: 'trophy' },
    { id: 'celebration', name: 'Celebración', icon: 'happy' },
    { id: 'team', name: 'Equipo', icon: 'people' },
  ];

  useEffect(() => {
    loadMyTeams();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permisos necesarios',
        'Necesitamos acceso a tu galería para seleccionar fotos.',
        [{ text: 'OK' }]
      );
    }
  };

  const loadMyTeams = async () => {
    try {
      // Simular carga de equipos del entrenador
      const mockTeams = [
        { id: '1', name: 'Ingeniería FC', sport: 'Fútbol' },
        { id: '2', name: 'Ingeniería BB', sport: 'Basquetbol' },
      ];
      setMyTeams(mockTeams);
      if (mockTeams.length > 0) {
        setFormData(prev => ({ ...prev, teamId: mockTeams[0].id }));
      }
    } catch (error) {
      console.error('Error loading teams:', error);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 10,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset, index) => ({
          id: Date.now() + index,
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          size: asset.fileSize,
        }));

        setSelectedImages(prev => [...prev, ...newImages]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron seleccionar las imágenes');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Se necesitan permisos de cámara');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets[0]) {
        const newImage = {
          id: Date.now(),
          uri: result.assets[0].uri,
          width: result.assets[0].width,
          height: result.assets[0].height,
          size: result.assets[0].fileSize,
        };

        setSelectedImages(prev => [...prev, newImage]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const removeImage = imageId => {
    setSelectedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const validateForm = () => {
    if (selectedImages.length === 0) {
      Alert.alert('Error', 'Debes seleccionar al menos una foto');
      return false;
    }

    if (!formData.title.trim()) {
      Alert.alert('Error', 'Debes agregar un título');
      return false;
    }

    if (!formData.teamId) {
      Alert.alert('Error', 'Debes seleccionar un equipo');
      return false;
    }

    return true;
  };

  const uploadPhotos = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setUploadProgress(0);

      const selectedTeam = myTeams.find(team => team.id === formData.teamId);
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      // Preparar metadata para las fotos
      const metadata = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        eventType: formData.eventType,
        teamId: formData.teamId,
        teamName: selectedTeam?.name,
        sport: selectedTeam?.sport,
        tags,
        uploadedBy: userProfile?.uid,
        uploaderName: userProfile?.displayName,
        uploadDate: new Date().toISOString(),
      };

      // Subir fotos al storage
      const uploadPromises = selectedImages.map(async (image, index) => {
        const imageMetadata = {
          ...metadata,
          originalIndex: index,
        };

        const uploadResult = await storageService.uploadSingleGalleryPhoto(
          image.uri,
          imageMetadata
        );

        // Actualizar progreso
        setUploadProgress(((index + 1) / selectedImages.length) * 100);

        return uploadResult;
      });

      const uploadResults = await Promise.all(uploadPromises);

      // Guardar metadata en Firestore
      const savePromises = uploadResults.map(result =>
        firestoreService.savePhoto({
          url: result.url,
          filename: result.filename,
          title: metadata.title,
          description: metadata.description,
          eventType: metadata.eventType,
          teamId: metadata.teamId,
          teamName: metadata.teamName,
          sport: metadata.sport,
          tags: metadata.tags,
          uploadedBy: metadata.uploadedBy,
          uploaderName: metadata.uploaderName,
          likes: 0,
          comments: [],
          featured: false,
        })
      );

      await Promise.all(savePromises);

      Alert.alert(
        'Éxito',
        `Se subieron ${selectedImages.length} fotos correctamente.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setSelectedImages([]);
              setFormData({
                title: '',
                description: '',
                eventType: 'training',
                teamId: myTeams[0]?.id || '',
                tags: '',
              });
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudieron subir las fotos: ' + error.message);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const EventTypeSelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorTitle}>Tipo de Evento</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.eventTypeScroll}
      >
        {eventTypes.map(type => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.eventTypeOption,
              formData.eventType === type.id && styles.selectedEventType,
            ]}
            onPress={() => updateFormData('eventType', type.id)}
          >
            <Ionicons
              name={type.icon}
              size={20}
              color={
                formData.eventType === type.id ? COLORS.white : COLORS.darkGray
              }
            />
            <Text
              style={[
                styles.eventTypeText,
                formData.eventType === type.id && styles.selectedEventTypeText,
              ]}
            >
              {type.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const TeamSelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorTitle}>Equipo</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.teamScroll}
      >
        {myTeams.map(team => (
          <TouchableOpacity
            key={team.id}
            style={[
              styles.teamOption,
              formData.teamId === team.id && styles.selectedTeam,
            ]}
            onPress={() => updateFormData('teamId', team.id)}
          >
            <Text
              style={[
                styles.teamText,
                formData.teamId === team.id && styles.selectedTeamText,
              ]}
            >
              {team.name}
            </Text>
            <Text
              style={[
                styles.teamSport,
                formData.teamId === team.id && styles.selectedTeamSport,
              ]}
            >
              {team.sport}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const ImageGrid = () => (
    <View style={styles.imageGridContainer}>
      <View style={styles.imageGridHeader}>
        <Text style={styles.imageGridTitle}>
          Fotos Seleccionadas ({selectedImages.length})
        </Text>
        <View style={styles.addButtonsContainer}>
          <TouchableOpacity style={styles.addButton} onPress={takePhoto}>
            <Ionicons name="camera" size={20} color={COLORS.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={pickImages}>
            <Ionicons name="images" size={20} color={COLORS.secondary} />
          </TouchableOpacity>
        </View>
      </View>

      {selectedImages.length === 0 ? (
        <View style={styles.emptyImageGrid}>
          <Ionicons name="images-outline" size={48} color={COLORS.gray} />
          <Text style={styles.emptyText}>No hay fotos seleccionadas</Text>
          <Text style={styles.emptySubtext}>
            Toca los botones de arriba para agregar fotos
          </Text>
        </View>
      ) : (
        <FlatList
          data={selectedImages}
          numColumns={3}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.imageItem}>
              <Image source={{ uri: item.uri }} style={styles.selectedImage} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(item.id)}
              >
                <Ionicons name="close-circle" size={20} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.imageGrid}
        />
      )}
    </View>
  );

  const ProgressBar = () =>
    uploadProgress > 0 && (
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Subiendo fotos... {Math.round(uploadProgress)}%
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${uploadProgress}%` }]}
          />
        </View>
      </View>
    );

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Header
          title="Subir Fotos"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <Loading text="Subiendo fotos..." />
          <ProgressBar />
        </View>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Header
        title="Subir Fotos"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Grid de Imágenes */}
        <Card style={styles.section}>
          <ImageGrid />
        </Card>

        {/* Información */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Información</Text>

          <Input
            label="Título"
            value={formData.title}
            onChangeText={value => updateFormData('title', value)}
            placeholder="Ej: Entrenamiento de la semana"
            leftIcon="text"
          />

          <Input
            label="Descripción (Opcional)"
            value={formData.description}
            onChangeText={value => updateFormData('description', value)}
            placeholder="Describe el evento..."
            leftIcon="document-text"
            multiline={true}
            numberOfLines={3}
          />

          <Input
            label="Tags (Opcional)"
            value={formData.tags}
            onChangeText={value => updateFormData('tags', value)}
            placeholder="gol, victoria, equipo (separados por comas)"
            leftIcon="pricetag"
          />

          <EventTypeSelector />
          <TeamSelector />
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
            title="Subir Fotos"
            onPress={uploadPhotos}
            loading={loading}
            icon="cloud-upload"
            style={styles.uploadButton}
            disabled={selectedImages.length === 0}
          />
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
  imageGridContainer: {
    marginBottom: 16,
  },
  imageGridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  imageGridTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  addButtonsContainer: {
    flexDirection: 'row',
  },
  addButton: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
  },
  emptyImageGrid: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 6,
  },
  imageGrid: {
    paddingVertical: 8,
  },
  imageItem: {
    width: '31%',
    aspectRatio: 1,
    marginRight: '3.5%',
    marginBottom: 8,
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },
  selectorContainer: {
    marginVertical: 12,
  },
  selectorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 12,
  },
  eventTypeScroll: {
    paddingVertical: 8,
  },
  eventTypeOption: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedEventType: {
    backgroundColor: COLORS.secondary,
  },
  eventTypeText: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginLeft: 6,
    fontWeight: '500',
  },
  selectedEventTypeText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  teamScroll: {
    paddingVertical: 8,
  },
  teamOption: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  selectedTeam: {
    backgroundColor: COLORS.secondary,
  },
  teamText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkGray,
    textAlign: 'center',
  },
  selectedTeamText: {
    color: COLORS.white,
  },
  teamSport: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  selectedTeamSport: {
    color: COLORS.white,
    opacity: 0.8,
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
  uploadButton: {
    flex: 1,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  progressContainer: {
    marginTop: 20,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.lightGray,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
  },
  bottomPadding: {
    height: 40,
  },
});

export default UploadPhotos;
