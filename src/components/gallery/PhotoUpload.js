import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../../utils/constants';
import Button from '../common/Button';

const PhotoUpload = ({
  onPhotosSelected = null,
  onUploadComplete = null,
  maxPhotos = 10,
  allowMultiple = true,
  style = {},
}) => {
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permisos necesarios',
        'Necesitamos acceso a tu galería para seleccionar fotos.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: allowMultiple,
        selectionLimit: maxPhotos,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets) {
        const newPhotos = result.assets.map((asset, index) => ({
          id: Date.now() + index,
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          size: asset.fileSize,
          type: 'image',
        }));

        if (allowMultiple) {
          const totalPhotos = selectedPhotos.length + newPhotos.length;
          if (totalPhotos > maxPhotos) {
            Alert.alert(
              'Límite alcanzado',
              `Solo puedes seleccionar hasta ${maxPhotos} fotos`
            );
            return;
          }
          setSelectedPhotos(prev => [...prev, ...newPhotos]);
        } else {
          setSelectedPhotos(newPhotos);
        }

        if (onPhotosSelected) {
          onPhotosSelected(
            allowMultiple ? [...selectedPhotos, ...newPhotos] : newPhotos
          );
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron seleccionar las fotos');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Se necesitan permisos de cámara');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        aspect: [4, 3],
        allowsEditing: true,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhoto = {
          id: Date.now(),
          uri: result.assets[0].uri,
          width: result.assets[0].width,
          height: result.assets[0].height,
          size: result.assets[0].fileSize,
          type: 'image',
        };

        if (allowMultiple) {
          if (selectedPhotos.length >= maxPhotos) {
            Alert.alert(
              'Límite alcanzado',
              `Solo puedes seleccionar hasta ${maxPhotos} fotos`
            );
            return;
          }
          setSelectedPhotos(prev => [...prev, newPhoto]);
        } else {
          setSelectedPhotos([newPhoto]);
        }

        if (onPhotosSelected) {
          onPhotosSelected(
            allowMultiple ? [...selectedPhotos, newPhoto] : [newPhoto]
          );
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const removePhoto = photoId => {
    const updatedPhotos = selectedPhotos.filter(photo => photo.id !== photoId);
    setSelectedPhotos(updatedPhotos);
    if (onPhotosSelected) {
      onPhotosSelected(updatedPhotos);
    }
  };

  const clearAll = () => {
    setSelectedPhotos([]);
    if (onPhotosSelected) {
      onPhotosSelected([]);
    }
  };

  const simulateUpload = async () => {
    if (selectedPhotos.length === 0) {
      Alert.alert('Error', 'No hay fotos para subir');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simular proceso de subida
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(i);
      }

      Alert.alert('Éxito', 'Fotos subidas correctamente');

      if (onUploadComplete) {
        onUploadComplete(selectedPhotos);
      }

      setSelectedPhotos([]);
    } catch (error) {
      Alert.alert('Error', 'Error al subir las fotos');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const PhotoItem = ({ photo }) => (
    <View style={styles.photoItem}>
      <Image source={{ uri: photo.uri }} style={styles.photoImage} />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removePhoto(photo.id)}
      >
        <Ionicons name="close-circle" size={24} color={COLORS.error} />
      </TouchableOpacity>
      <View style={styles.photoInfo}>
        <Text style={styles.photoSize}>
          {photo.size ? (photo.size / 1024 / 1024).toFixed(1) + ' MB' : 'N/A'}
        </Text>
      </View>
    </View>
  );

  const UploadButtons = () => (
    <View style={styles.uploadButtons}>
      <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
        <Ionicons name="camera" size={32} color={COLORS.secondary} />
        <Text style={styles.uploadButtonText}>Cámara</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadButton} onPress={pickFromGallery}>
        <Ionicons name="images" size={32} color={COLORS.secondary} />
        <Text style={styles.uploadButtonText}>Galería</Text>
      </TouchableOpacity>
    </View>
  );

  const ProgressBar = () => (
    <View style={styles.progressContainer}>
      <Text style={styles.progressText}>
        Subiendo fotos... {uploadProgress}%
      </Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      {selectedPhotos.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="images-outline" size={64} color={COLORS.gray} />
          <Text style={styles.emptyTitle}>No hay fotos seleccionadas</Text>
          <Text style={styles.emptySubtitle}>
            Selecciona hasta {maxPhotos} fotos para subir
          </Text>
          <UploadButtons />
        </View>
      ) : (
        <View style={styles.photosContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {selectedPhotos.length} de {maxPhotos} fotos
            </Text>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={pickFromGallery}
              >
                <Ionicons name="add" size={20} color={COLORS.secondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={clearAll}>
                <Ionicons name="trash" size={20} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={selectedPhotos}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <PhotoItem photo={item} />}
            numColumns={3}
            style={styles.photosList}
            contentContainerStyle={styles.photosListContent}
          />

          {uploading && <ProgressBar />}

          <View style={styles.actions}>
            <Button
              title="Cancelar"
              type="outline"
              onPress={clearAll}
              style={styles.actionButton}
              disabled={uploading}
            />
            <Button
              title="Subir Fotos"
              onPress={simulateUpload}
              loading={uploading}
              icon="cloud-upload"
              style={styles.actionButton}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 24,
  },
  uploadButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  uploadButton: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    minWidth: 100,
  },
  uploadButtonText: {
    fontSize: 12,
    color: COLORS.darkGray,
    fontWeight: '600',
    marginTop: 8,
  },
  photosContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
  },
  photosList: {
    flex: 1,
  },
  photosListContent: {
    paddingBottom: 16,
  },
  photoItem: {
    flex: 1,
    margin: 4,
    position: 'relative',
    aspectRatio: 1,
    maxWidth: '31%',
  },
  photoImage: {
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
    borderRadius: 12,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  photoInfo: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 4,
    padding: 2,
  },
  photoSize: {
    fontSize: 10,
    color: COLORS.white,
    textAlign: 'center',
  },
  progressContainer: {
    marginVertical: 16,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default PhotoUpload;
