import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../utils/constants';
import { globalStyles } from '../../styles/globalStyles';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import PhotoUpload from '../../components/gallery/PhotoUpload';

const ManageGallery = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [filterBy, setFilterBy] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [sortBy, setSortBy] = useState('date');

  const filters = [
    { id: 'all', name: 'Todas', icon: 'grid' },
    { id: 'training', name: 'Entrenamientos', icon: 'fitness' },
    { id: 'match', name: 'Partidos', icon: 'football' },
    { id: 'tournament', name: 'Torneos', icon: 'trophy' },
    { id: 'celebration', name: 'Celebraciones', icon: 'happy' },
    { id: 'featured', name: 'Destacadas', icon: 'star' },
  ];

  const sortOptions = [
    { id: 'date', name: 'Fecha', icon: 'calendar' },
    { id: 'likes', name: 'Me gusta', icon: 'heart' },
    { id: 'title', name: 'Título', icon: 'text' },
    { id: 'team', name: 'Equipo', icon: 'people' },
  ];

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockPhotos = [
        {
          id: '1',
          url: 'https://picsum.photos/300/200?random=1',
          title: 'Gol de la victoria',
          description: 'Momento exacto del gol ganador en la final',
          category: 'match',
          teamName: 'Ingeniería FC',
          teamId: '1',
          uploadedBy: 'admin1',
          uploaderName: 'Admin Deportes',
          createdAt: '2024-05-28T18:30:00Z',
          likes: 45,
          featured: true,
          tags: ['gol', 'final', 'victoria'],
          size: '2.3 MB',
        },
        {
          id: '2',
          url: 'https://picsum.photos/300/200?random=2',
          title: 'Entrenamiento matutino',
          description: 'Práctica de tiros libres',
          category: 'training',
          teamName: 'Medicina BB',
          teamId: '2',
          uploadedBy: 'coach1',
          uploaderName: 'Coach Martinez',
          createdAt: '2024-05-27T09:15:00Z',
          likes: 23,
          featured: false,
          tags: ['entrenamiento', 'tiros', 'medicina'],
          size: '1.8 MB',
        },
        {
          id: '3',
          url: 'https://picsum.photos/300/200?random=3',
          title: 'Celebración del campeonato',
          description: 'Los jugadores celebran con la copa',
          category: 'celebration',
          teamName: 'Derecho VB',
          teamId: '3',
          uploadedBy: 'admin1',
          uploaderName: 'Admin Deportes',
          createdAt: '2024-05-25T20:45:00Z',
          likes: 67,
          featured: true,
          tags: ['campeonato', 'copa', 'celebración'],
          size: '3.1 MB',
        },
        // Más fotos...
      ];

      setPhotos(mockPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPhotos();
    setRefreshing(false);
  };

  const getFilteredAndSortedPhotos = () => {
    let filteredPhotos = photos;

    // Filtrar por categoría
    if (filterBy !== 'all') {
      if (filterBy === 'featured') {
        filteredPhotos = filteredPhotos.filter(photo => photo.featured);
      } else {
        filteredPhotos = filteredPhotos.filter(
          photo => photo.category === filterBy
        );
      }
    }

    // Filtrar por búsqueda
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filteredPhotos = filteredPhotos.filter(
        photo =>
          photo.title.toLowerCase().includes(searchLower) ||
          photo.description.toLowerCase().includes(searchLower) ||
          photo.teamName.toLowerCase().includes(searchLower) ||
          photo.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Ordenar
    filteredPhotos.sort((a, b) => {
      switch (sortBy) {
        case 'likes':
          return b.likes - a.likes;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'team':
          return a.teamName.localeCompare(b.teamName);
        default: // date
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filteredPhotos;
  };

  const togglePhotoSelection = photoId => {
    setSelectedPhotos(prev => {
      if (prev.includes(photoId)) {
        return prev.filter(id => id !== photoId);
      } else {
        return [...prev, photoId];
      }
    });
  };

  const selectAllPhotos = () => {
    const allPhotoIds = getFilteredAndSortedPhotos().map(photo => photo.id);
    setSelectedPhotos(allPhotoIds);
  };

  const clearSelection = () => {
    setSelectedPhotos([]);
  };

  const deleteSelectedPhotos = () => {
    Alert.alert(
      'Eliminar Fotos',
      `¿Estás seguro de que quieres eliminar ${selectedPhotos.length} foto(s)?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setPhotos(prev =>
              prev.filter(photo => !selectedPhotos.includes(photo.id))
            );
            setSelectedPhotos([]);
          },
        },
      ]
    );
  };

  const toggleFeaturedPhotos = () => {
    setPhotos(prev =>
      prev.map(photo =>
        selectedPhotos.includes(photo.id)
          ? { ...photo, featured: !photo.featured }
          : photo
      )
    );
    setSelectedPhotos([]);
  };

  const editPhoto = photo => {
    setEditingPhoto(photo);
    setShowEditModal(true);
  };

  const savePhotoEdits = updates => {
    setPhotos(prev =>
      prev.map(photo =>
        photo.id === editingPhoto.id ? { ...photo, ...updates } : photo
      )
    );
    setShowEditModal(false);
    setEditingPhoto(null);
  };

  const PhotoItem = ({ photo, index }) => {
    const isSelected = selectedPhotos.includes(photo.id);

    if (viewMode === 'list') {
      return (
        <Card style={styles.listItem}>
          <TouchableOpacity
            style={styles.listItemContent}
            onPress={() => togglePhotoSelection(photo.id)}
          >
            <View style={styles.selectionIndicator}>
              <Ionicons
                name={isSelected ? 'checkbox' : 'square-outline'}
                size={20}
                color={isSelected ? COLORS.secondary : COLORS.gray}
              />
            </View>

            <Image source={{ uri: photo.url }} style={styles.listThumbnail} />

            <View style={styles.listInfo}>
              <Text style={styles.listTitle} numberOfLines={1}>
                {photo.title}
              </Text>
              <Text style={styles.listTeam}>{photo.teamName}</Text>
              <Text style={styles.listDate}>
                {new Date(photo.createdAt).toLocaleDateString('es-ES')}
              </Text>
            </View>

            <View style={styles.listStats}>
              <View style={styles.statItem}>
                <Ionicons name="heart" size={14} color={COLORS.error} />
                <Text style={styles.statText}>{photo.likes}</Text>
              </View>
              {photo.featured && (
                <Ionicons name="star" size={16} color={COLORS.secondary} />
              )}
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => editPhoto(photo)}
            >
              <Ionicons name="pencil" size={16} color={COLORS.secondary} />
            </TouchableOpacity>
          </TouchableOpacity>
        </Card>
      );
    }

    return (
      <TouchableOpacity
        style={[styles.gridItem, isSelected && styles.selectedGridItem]}
        onPress={() => togglePhotoSelection(photo.id)}
      >
        <Image source={{ uri: photo.url }} style={styles.gridImage} />

        <View style={styles.gridOverlay}>
          <View style={styles.gridHeader}>
            <View style={styles.selectionIndicator}>
              <Ionicons
                name={isSelected ? 'checkbox' : 'square-outline'}
                size={16}
                color={isSelected ? COLORS.secondary : COLORS.white}
              />
            </View>
            {photo.featured && (
              <Ionicons name="star" size={16} color={COLORS.secondary} />
            )}
          </View>

          <View style={styles.gridFooter}>
            <Text style={styles.gridTitle} numberOfLines={1}>
              {photo.title}
            </Text>
            <View style={styles.gridStats}>
              <Ionicons name="heart" size={12} color={COLORS.white} />
              <Text style={styles.gridStatsText}>{photo.likes}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.gridEditButton}
          onPress={() => editPhoto(photo)}
        >
          <Ionicons name="pencil" size={14} color={COLORS.white} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const EditPhotoModal = () => (
    <Modal
      visible={showEditModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowEditModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Editar Foto</Text>
          <TouchableOpacity onPress={() => setShowEditModal(false)}>
            <Ionicons name="close" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {editingPhoto && (
          <ScrollView style={styles.modalContent}>
            <Image
              source={{ uri: editingPhoto.url }}
              style={styles.editImage}
            />

            <View style={styles.editForm}>
              <Text style={styles.editLabel}>Título</Text>
              <TextInput
                style={styles.editInput}
                value={editingPhoto.title}
                onChangeText={text =>
                  setEditingPhoto(prev => ({ ...prev, title: text }))
                }
                placeholder="Título de la foto"
              />

              <Text style={styles.editLabel}>Descripción</Text>
              <TextInput
                style={[styles.editInput, styles.editTextArea]}
                value={editingPhoto.description}
                onChangeText={text =>
                  setEditingPhoto(prev => ({ ...prev, description: text }))
                }
                placeholder="Descripción de la foto"
                multiline
                numberOfLines={3}
              />

              <View style={styles.editRow}>
                <Text style={styles.editLabel}>Destacada</Text>
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() =>
                    setEditingPhoto(prev => ({
                      ...prev,
                      featured: !prev.featured,
                    }))
                  }
                >
                  <Ionicons
                    name={editingPhoto.featured ? 'star' : 'star-outline'}
                    size={20}
                    color={
                      editingPhoto.featured ? COLORS.secondary : COLORS.gray
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalActions}>
              <Button
                title="Cancelar"
                type="outline"
                onPress={() => setShowEditModal(false)}
                style={styles.modalButton}
              />
              <Button
                title="Guardar"
                onPress={() => savePhotoEdits(editingPhoto)}
                style={styles.modalButton}
              />
            </View>
          </ScrollView>
        )}
      </View>
    </Modal>
  );

  const UploadModal = () => (
    <Modal
      visible={showUploadModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowUploadModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Subir Fotos</Text>
          <TouchableOpacity onPress={() => setShowUploadModal(false)}>
            <Ionicons name="close" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.modalContent}>
          <PhotoUpload
            onUploadComplete={photos => {
              // Agregar fotos nuevas al estado
              const newPhotos = photos.map((photo, index) => ({
                id: Date.now() + index,
                url: photo.uri,
                title: `Nueva foto ${index + 1}`,
                description: '',
                category: 'training',
                teamName: 'Equipo General',
                teamId: 'general',
                uploadedBy: 'admin',
                uploaderName: 'Administrador',
                createdAt: new Date().toISOString(),
                likes: 0,
                featured: false,
                tags: [],
                size: photo.size
                  ? `${(photo.size / 1024 / 1024).toFixed(1)} MB`
                  : '0 MB',
              }));

              setPhotos(prev => [...newPhotos, ...prev]);
              setShowUploadModal(false);
            }}
            maxPhotos={20}
            allowMultiple={true}
          />
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Header
          title="Gestionar Galería"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <Loading />
      </View>
    );
  }

  const filteredPhotos = getFilteredAndSortedPhotos();

  return (
    <View style={globalStyles.container}>
      <Header
        title="Gestionar Galería"
        showBackButton
        onBackPress={() => navigation.goBack()}
        rightIcon="add"
        onRightPress={() => setShowUploadModal(true)}
      />

      {/* Búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={COLORS.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar fotos..."
            placeholderTextColor={COLORS.gray}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Filtros y controles */}
      <View style={styles.controlsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          {filters.map(filter => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                filterBy === filter.id && styles.activeFilterChip,
              ]}
              onPress={() => setFilterBy(filter.id)}
            >
              <Ionicons
                name={filter.icon}
                size={16}
                color={filterBy === filter.id ? COLORS.white : COLORS.darkGray}
              />
              <Text
                style={[
                  styles.filterChipText,
                  filterBy === filter.id && styles.activeFilterChipText,
                ]}
              >
                {filter.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.viewControls}>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => {
              const currentIndex = sortOptions.findIndex(
                opt => opt.id === sortBy
              );
              const nextIndex = (currentIndex + 1) % sortOptions.length;
              setSortBy(sortOptions[nextIndex].id);
            }}
          >
            <Ionicons name="funnel" size={16} color={COLORS.secondary} />
            <Text style={styles.sortButtonText}>
              {sortOptions.find(opt => opt.id === sortBy)?.name}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            <Ionicons
              name={viewMode === 'grid' ? 'list' : 'grid'}
              size={20}
              color={COLORS.secondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Acciones de selección */}
      {selectedPhotos.length > 0 && (
        <View style={styles.selectionActions}>
          <Text style={styles.selectionCount}>
            {selectedPhotos.length} seleccionada(s)
          </Text>
          <View style={styles.selectionButtons}>
            <TouchableOpacity
              style={styles.selectionButton}
              onPress={toggleFeaturedPhotos}
            >
              <Ionicons name="star" size={16} color={COLORS.secondary} />
              <Text style={styles.selectionButtonText}>Destacar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.selectionButton}
              onPress={deleteSelectedPhotos}
            >
              <Ionicons name="trash" size={16} color={COLORS.error} />
              <Text
                style={[styles.selectionButtonText, { color: COLORS.error }]}
              >
                Eliminar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.selectionButton}
              onPress={clearSelection}
            >
              <Text style={styles.selectionButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Lista/Grid de fotos */}
      <FlatList
        data={filteredPhotos}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <PhotoItem photo={item} index={index} />
        )}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode} // Force re-render when view mode changes
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.photosList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="images-outline" size={64} color={COLORS.gray} />
            <Text style={styles.emptyText}>No hay fotos</Text>
            <Text style={styles.emptySubtext}>
              {searchText || filterBy !== 'all'
                ? 'No se encontraron fotos con los filtros actuales'
                : 'Sube las primeras fotos de la galería'}
            </Text>
            {!searchText && filterBy === 'all' && (
              <Button
                title="Subir Fotos"
                onPress={() => setShowUploadModal(true)}
                icon="camera"
                style={styles.emptyButton}
              />
            )}
          </View>
        }
        ListHeaderComponent={
          filteredPhotos.length > 0 && (
            <View style={styles.listHeader}>
              <Text style={styles.photoCount}>
                {filteredPhotos.length} foto(s)
              </Text>
              <TouchableOpacity onPress={selectAllPhotos}>
                <Text style={styles.selectAllText}>Seleccionar todas</Text>
              </TouchableOpacity>
            </View>
          )
        }
      />

      <EditPhotoModal />
      <UploadModal />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.darkGray,
    marginLeft: 8,
  },
  controlsContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  filtersScroll: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: COLORS.secondary,
  },
  filterChipText: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginLeft: 4,
    fontWeight: '500',
  },
  activeFilterChipText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  viewControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButtonText: {
    fontSize: 14,
    color: COLORS.secondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  viewButton: {
    padding: 4,
  },
  selectionActions: {
    backgroundColor: COLORS.secondary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectionCount: {
    color: COLORS.white,
    fontWeight: '600',
  },
  selectionButtons: {
    flexDirection: 'row',
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  selectionButtonText: {
    color: COLORS.white,
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
  },
  photoCount: {
    fontSize: 14,
    color: COLORS.darkGray,
    fontWeight: '500',
  },
  selectAllText: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  photosList: {
    paddingVertical: 8,
  },
  // Grid styles
  gridItem: {
    flex: 1,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    aspectRatio: 1,
  },
  selectedGridItem: {
    borderWidth: 3,
    borderColor: COLORS.secondary,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.lightGray,
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
    padding: 8,
  },
  gridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridTitle: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  gridStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridStatsText: {
    color: COLORS.white,
    fontSize: 10,
    marginLeft: 2,
  },
  gridEditButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 4,
  },
  // List styles
  listItem: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
  },
  listThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
    marginLeft: 12,
  },
  listInfo: {
    flex: 1,
    marginLeft: 12,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  listTeam: {
    fontSize: 14,
    color: COLORS.secondary,
    marginBottom: 2,
  },
  listDate: {
    fontSize: 12,
    color: COLORS.gray,
  },
  listStats: {
    alignItems: 'center',
    marginRight: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statText: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 4,
  },
  editButton: {
    padding: 8,
  },
  selectionIndicator: {
    padding: 4,
  },
  // Modal styles
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
    padding: 20,
  },
  editImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
    marginBottom: 20,
  },
  editForm: {
    marginBottom: 20,
  },
  editLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 8,
  },
  editInput: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  editTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  editRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleButton: {
    padding: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  emptyState: {
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
    paddingHorizontal: 40,
  },
  emptyButton: {
    marginTop: 20,
  },
});

export default ManageGallery;
