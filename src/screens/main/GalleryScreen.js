import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  Modal,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../utils/constants';
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
    horizontal: Math.max(scale(16), screenWidth * 0.04), // 4% del ancho
    vertical: Math.max(scale(12), screenHeight * 0.015), // 1.5% del alto
    grid: Math.max(scale(6), screenWidth * 0.015), // 1.5% del ancho
  };
};

// Función para calcular tamaño de imagen estilo Instagram (3 columnas exactas)
const getImageSize = () => {
  const numColumns = 3; // Siempre 3 columnas como Instagram
  return screenWidth / numColumns; // Sin padding, imágenes edge-to-edge
};

const GalleryScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const padding = getResponsivePadding();
  const imageSize = getImageSize();
  const numColumns = 3; // Siempre 3 columnas como Instagram

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const categories = [
    { id: 'all', name: 'Todas', icon: 'grid' },
    { id: 'training', name: 'Entrenamientos', icon: 'fitness' },
    { id: 'match', name: 'Partidos', icon: 'football' },
    { id: 'tournament', name: 'Torneos', icon: 'trophy' },
    { id: 'celebration', name: 'Celebraciones', icon: 'happy' },
    { id: 'team', name: 'Equipo', icon: 'people' },
  ];

  useEffect(() => {
    loadPhotos();
  }, []);

  useEffect(() => {
    filterPhotos();
  }, [photos, selectedCategory]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockPhotos = [
        {
          id: '1',
          uri: 'https://picsum.photos/400/300?random=1',
          title: 'Entrenamiento de Fútbol',
          description: 'Práctica vespertina en el campo principal',
          category: 'training',
          teamName: 'Ingeniería FC',
          date: '2024-05-28',
          likes: 24,
          comments: 8,
          tags: ['#futbol', '#entrenamiento', '#ingenieria'],
          photographer: 'Coach Martinez',
        },
        {
          id: '2',
          uri: 'https://picsum.photos/400/300?random=2',
          title: 'Victoria en Semi-final',
          description: 'Celebración después del gol de la victoria',
          category: 'match',
          teamName: 'Medicina BB',
          date: '2024-05-25',
          likes: 45,
          comments: 15,
          tags: ['#basquetbol', '#victoria', '#medicina'],
          photographer: 'Admin Deportes',
        },
        {
          id: '3',
          uri: 'https://picsum.photos/400/300?random=3',
          title: 'Torneo Inter-facultades',
          description: 'Ceremonia de apertura del torneo',
          category: 'tournament',
          teamName: 'Todos los Equipos',
          date: '2024-05-20',
          likes: 67,
          comments: 22,
          tags: ['#torneo', '#ceremonia', '#universidad'],
          photographer: 'Eventos UNAM',
        },
        {
          id: '4',
          uri: 'https://picsum.photos/400/300?random=4',
          title: 'Campeones 2024',
          description: 'Levantando la copa del campeonato',
          category: 'celebration',
          teamName: 'Derecho VB',
          date: '2024-05-22',
          likes: 89,
          comments: 31,
          tags: ['#campeon', '#copa', '#derecho'],
          photographer: 'Coach Silva',
        },
        {
          id: '5',
          uri: 'https://picsum.photos/400/300?random=5',
          title: 'Foto Oficial del Equipo',
          description: 'Temporada 2024 - Economía Eagles',
          category: 'team',
          teamName: 'Economía Eagles',
          date: '2024-05-15',
          likes: 34,
          comments: 12,
          tags: ['#equipo', '#oficial', '#economia'],
          photographer: 'Fotografo Oficial',
        },
        {
          id: '6',
          uri: 'https://picsum.photos/400/300?random=6',
          title: 'Calentamiento Pre-partido',
          description: 'Preparación antes del partido decisivo',
          category: 'training',
          teamName: 'Psicología FC',
          date: '2024-05-18',
          likes: 28,
          comments: 6,
          tags: ['#calentamiento', '#psicologia', '#preparacion'],
          photographer: 'Coach Lopez',
        },
        {
          id: '7',
          uri: 'https://picsum.photos/400/300?random=7',
          title: 'Gol del Triunfo',
          description: 'El momento exacto del gol ganador',
          category: 'match',
          teamName: 'Ingeniería FC',
          date: '2024-05-16',
          likes: 52,
          comments: 18,
          tags: ['#gol', '#triunfo', '#ingenieria'],
          photographer: 'Deportes TV',
        },
        {
          id: '8',
          uri: 'https://picsum.photos/400/300?random=8',
          title: 'Premiación Final',
          description: 'Entrega de medallas y trofeos',
          category: 'celebration',
          teamName: 'Varios Equipos',
          date: '2024-05-23',
          likes: 76,
          comments: 25,
          tags: ['#premiacion', '#medallas', '#trofeos'],
          photographer: 'Admin Deportes',
        },
        {
          id: '9',
          uri: 'https://picsum.photos/400/300?random=9',
          title: 'Nueva Cancha de Voleibol',
          description: 'Inauguración de las instalaciones renovadas',
          category: 'tournament',
          teamName: 'Universidad',
          date: '2024-05-10',
          likes: 41,
          comments: 14,
          tags: ['#inauguracion', '#voleibol', '#instalaciones'],
          photographer: 'Prensa UNAM',
        },
      ];

      setPhotos(mockPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPhotos = () => {
    if (selectedCategory === 'all') {
      setFilteredPhotos(photos);
    } else {
      setFilteredPhotos(
        photos.filter(photo => photo.category === selectedCategory)
      );
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPhotos();
    setRefreshing(false);
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleLikePhoto = photoId => {
    setPhotos(prevPhotos =>
      prevPhotos.map(photo =>
        photo.id === photoId ? { ...photo, likes: photo.likes + 1 } : photo
      )
    );
  };

  const handleSharePhoto = photo => {
    Alert.alert('Compartir Foto', `¿Quieres compartir "${photo.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Compartir',
        onPress: () => {
          /* Implementar compartir */
        },
      },
    ]);
  };

  const PhotoItem = ({ photo, index }) => (
    <TouchableOpacity
      style={[
        styles.photoItem,
        {
          width: imageSize,
          height: imageSize,
        },
      ]}
      onPress={() => {
        setSelectedPhoto(photo);
        setShowPhotoModal(true);
      }}
      activeOpacity={0.9}
    >
      <Image source={{ uri: photo.uri }} style={styles.photoImage} />
      <View
        style={[
          styles.photoOverlay,
          {
            padding: scale(8),
          },
        ]}
      >
        <View style={styles.photoInfo}>
          <View
            style={[
              styles.likesContainer,
              {
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                borderRadius: scale(12),
                paddingHorizontal: scale(6),
                paddingVertical: scale(3),
              },
            ]}
          >
            <Ionicons name="heart" size={scale(11)} color={COLORS.white} />
            <Text
              style={[
                styles.photoLikes,
                {
                  fontSize: scale(10),
                  marginLeft: scale(3),
                },
              ]}
            >
              {photo.likes}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const CategorySelector = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        styles.categorySelector,
        {
          paddingHorizontal: padding.horizontal,
          paddingVertical: scale(8),
        },
      ]}
    >
      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryOption,
            {
              borderRadius: scale(20),
              paddingVertical: scale(8),
              paddingHorizontal: scale(14),
              marginRight: scale(10),
            },
            selectedCategory === category.id && styles.selectedCategory,
          ]}
          onPress={() => setSelectedCategory(category.id)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={category.icon}
            size={scale(16)}
            color={
              selectedCategory === category.id ? COLORS.white : COLORS.darkGray
            }
          />
          <Text
            style={[
              styles.categoryText,
              {
                fontSize: scale(12),
                marginLeft: scale(6),
              },
              selectedCategory === category.id && styles.selectedCategoryText,
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const PhotoDetailsModal = () => (
    <Modal
      visible={showPhotoModal}
      animationType="fade"
      presentationStyle="overFullScreen"
      onRequestClose={() => setShowPhotoModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View
            style={[
              styles.modalHeader,
              {
                paddingHorizontal: padding.horizontal,
                paddingTop: insets.top + scale(16),
                paddingBottom: scale(16),
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => setShowPhotoModal(false)}
              style={[
                styles.modalHeaderButton,
                {
                  width: scale(40),
                  height: scale(40),
                  borderRadius: scale(20),
                },
              ]}
              activeOpacity={0.8}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={scale(24)} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.modalHeaderActions}>
              <TouchableOpacity
                style={[
                  styles.modalAction,
                  {
                    width: scale(40),
                    height: scale(40),
                    borderRadius: scale(20),
                    marginLeft: scale(12),
                  },
                ]}
                onPress={() => selectedPhoto && handleSharePhoto(selectedPhoto)}
                activeOpacity={0.8}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="share-outline"
                  size={scale(22)}
                  color={COLORS.white}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalAction,
                  {
                    width: scale(40),
                    height: scale(40),
                    borderRadius: scale(20),
                    marginLeft: scale(12),
                  },
                ]}
                activeOpacity={0.8}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="download-outline"
                  size={scale(22)}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>
          </View>

          {selectedPhoto && (
            <ScrollView
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Imagen Principal */}
              <Image
                source={{ uri: selectedPhoto.uri }}
                style={[
                  styles.modalImage,
                  {
                    width: screenWidth,
                    height: screenWidth * 0.75,
                  },
                ]}
                resizeMode="cover"
              />

              {/* Información de la Foto */}
              <View
                style={[
                  styles.photoDetails,
                  {
                    padding: padding.horizontal,
                    paddingBottom: insets.bottom + scale(20),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.photoTitle,
                    {
                      fontSize: scale(18),
                      marginBottom: scale(6),
                    },
                  ]}
                >
                  {selectedPhoto.title}
                </Text>
                <Text
                  style={[
                    styles.photoDescription,
                    {
                      fontSize: scale(14),
                      lineHeight: scale(20),
                      marginBottom: scale(16),
                    },
                  ]}
                >
                  {selectedPhoto.description}
                </Text>

                <View style={[styles.photoMeta, { marginBottom: scale(16) }]}>
                  <View style={[styles.metaRow, { marginBottom: scale(8) }]}>
                    <Ionicons
                      name="camera"
                      size={scale(14)}
                      color={COLORS.gray}
                    />
                    <Text
                      style={[
                        styles.metaText,
                        {
                          fontSize: scale(13),
                          marginLeft: scale(8),
                        },
                      ]}
                    >
                      {selectedPhoto.photographer}
                    </Text>
                  </View>

                  <View style={[styles.metaRow, { marginBottom: scale(8) }]}>
                    <Ionicons
                      name="calendar"
                      size={scale(14)}
                      color={COLORS.gray}
                    />
                    <Text
                      style={[
                        styles.metaText,
                        {
                          fontSize: scale(13),
                          marginLeft: scale(8),
                        },
                      ]}
                    >
                      {formatDate(selectedPhoto.date)}
                    </Text>
                  </View>

                  <View style={[styles.metaRow, { marginBottom: scale(8) }]}>
                    <Ionicons
                      name="people"
                      size={scale(14)}
                      color={COLORS.gray}
                    />
                    <Text
                      style={[
                        styles.metaText,
                        {
                          fontSize: scale(13),
                          marginLeft: scale(8),
                        },
                      ]}
                    >
                      {selectedPhoto.teamName}
                    </Text>
                  </View>
                </View>

                {/* Tags */}
                <View
                  style={[styles.tagsContainer, { marginBottom: scale(20) }]}
                >
                  {selectedPhoto.tags.map((tag, index) => (
                    <View
                      key={index}
                      style={[
                        styles.tag,
                        {
                          borderRadius: scale(14),
                          paddingVertical: scale(4),
                          paddingHorizontal: scale(10),
                          marginRight: scale(6),
                          marginBottom: scale(6),
                        },
                      ]}
                    >
                      <Text style={[styles.tagText, { fontSize: scale(11) }]}>
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Acciones */}
                <View
                  style={[
                    styles.photoActions,
                    {
                      paddingVertical: scale(16),
                      marginBottom: scale(20),
                      borderTopWidth: scale(1),
                      borderBottomWidth: scale(1),
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleLikePhoto(selectedPhoto.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="heart"
                      size={scale(18)}
                      color={COLORS.secondary}
                    />
                    <Text
                      style={[
                        styles.actionText,
                        {
                          fontSize: scale(13),
                          marginLeft: scale(6),
                        },
                      ]}
                    >
                      {selectedPhoto.likes} Me gusta
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="chatbubble"
                      size={scale(18)}
                      color={COLORS.secondary}
                    />
                    <Text
                      style={[
                        styles.actionText,
                        {
                          fontSize: scale(13),
                          marginLeft: scale(6),
                        },
                      ]}
                    >
                      {selectedPhoto.comments} Comentarios
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Comentarios Simulados */}
                <View style={styles.commentsSection}>
                  <Text
                    style={[
                      styles.commentsTitle,
                      {
                        fontSize: scale(15),
                        marginBottom: scale(12),
                      },
                    ]}
                  >
                    Comentarios
                  </Text>
                  <View style={[styles.comment, { marginBottom: scale(12) }]}>
                    <Text
                      style={[
                        styles.commentAuthor,
                        {
                          fontSize: scale(13),
                          marginBottom: scale(3),
                        },
                      ]}
                    >
                      Carlos M.
                    </Text>
                    <Text
                      style={[
                        styles.commentText,
                        {
                          fontSize: scale(13),
                          lineHeight: scale(18),
                        },
                      ]}
                    >
                      ¡Excelente captura del momento!
                    </Text>
                  </View>
                  <View style={[styles.comment, { marginBottom: scale(12) }]}>
                    <Text
                      style={[
                        styles.commentAuthor,
                        {
                          fontSize: scale(13),
                          marginBottom: scale(3),
                        },
                      ]}
                    >
                      Ana G.
                    </Text>
                    <Text
                      style={[
                        styles.commentText,
                        {
                          fontSize: scale(13),
                          lineHeight: scale(18),
                        },
                      ]}
                    >
                      Qué buena jugada, felicidades al equipo
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Header
          title="Galería"
          variant={isSmallScreen ? 'compact' : 'default'}
        />
        <Loading variant="default" animation="scale" />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Header
        title="Galería"
        rightIcon="camera-outline"
        onRightPress={() => {
          /* Abrir cámara para subir foto */
        }}
        variant={isSmallScreen ? 'compact' : 'default'}
      />

      {/* Filtros por Categoría */}
      <View
        style={[
          styles.filtersContainer,
          {
            paddingVertical: scale(8),
          },
        ]}
      >
        <CategorySelector />
      </View>

      {/* Grid de Fotos */}
      <FlatList
        data={filteredPhotos}
        keyExtractor={item => item.id}
        numColumns={numColumns}
        key={numColumns} // Force re-render when columns change
        renderItem={({ item, index }) => (
          <PhotoItem photo={item} index={index} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.secondary}
            colors={[COLORS.secondary]}
          />
        }
        contentContainerStyle={[
          styles.photosGrid,
          {
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
                width: screenWidth, // Ocupa todo el ancho
                alignItems: 'center',
              },
            ]}
          >
            <Ionicons
              name="images-outline"
              size={scale(56)}
              color={COLORS.gray}
            />
            <Text
              style={[
                styles.emptyText,
                {
                  fontSize: scale(16),
                  marginTop: scale(16),
                },
              ]}
            >
              No hay fotos en esta categoría
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
              Las nuevas fotos aparecerán aquí
            </Text>
          </View>
        }
      />

      <PhotoDetailsModal />
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    backgroundColor: COLORS.primary,
  },
  categorySelector: {
    // padding se maneja dinámicamente
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: scale(1),
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedCategory: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
    shadowColor: COLORS.secondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryText: {
    fontWeight: '500',
    color: COLORS.white,
    opacity: 0.8,
  },
  selectedCategoryText: {
    color: COLORS.white,
    fontWeight: '600',
    opacity: 1,
  },
  photosGrid: {
    // Solo padding bottom, sin espaciado entre elementos
  },
  photoItem: {
    // Sin margins, imágenes edge-to-edge como Instagram
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.lightGray,
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Overlay más sutil
    justifyContent: 'flex-end',
  },
  photoInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoLikes: {
    color: COLORS.white,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: screenHeight * 0.5, // Altura mínima para centrado
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
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeaderButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeaderActions: {
    flexDirection: 'row',
  },
  modalAction: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
  },
  modalImage: {
    backgroundColor: COLORS.lightGray,
  },
  photoDetails: {
    backgroundColor: COLORS.white,
  },
  photoTitle: {
    fontWeight: '700',
    color: COLORS.darkGray,
    letterSpacing: 0.3,
  },
  photoDescription: {
    color: COLORS.gray,
    fontWeight: '500',
  },
  photoMeta: {
    // marginBottom se maneja dinámicamente
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: COLORS.gray,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: `${COLORS.secondary}15`,
    borderWidth: scale(1),
    borderColor: `${COLORS.secondary}30`,
  },
  tagText: {
    color: COLORS.secondary,
    fontWeight: '600',
  },
  photoActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderColor: COLORS.lightGray,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  commentsSection: {
    // marginTop se maneja en el parent
  },
  commentsTitle: {
    fontWeight: '700',
    color: COLORS.darkGray,
    letterSpacing: 0.3,
  },
  comment: {
    // marginBottom se maneja dinámicamente
  },
  commentAuthor: {
    fontWeight: '600',
    color: COLORS.secondary,
  },
  commentText: {
    color: COLORS.gray,
    fontWeight: '500',
  },
});

export default GalleryScreen;
