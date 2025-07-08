import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../utils/constants';
import { formatTimeAgo } from '../../utils/helpers';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const PhotoViewer = ({
  visible,
  photos = [],
  initialIndex = 0,
  onClose,
  onLike = null,
  onDelete = null,
  canDelete = false,
  showInfo = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showDetails, setShowDetails] = useState(false);
  const flatListRef = useRef(null);

  const currentPhoto = photos[currentIndex];

  const handleScroll = event => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / screenWidth);
    setCurrentIndex(index);
  };

  const goToNext = () => {
    if (currentIndex < photos.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
  };

  const handleLike = () => {
    if (onLike && currentPhoto) {
      onLike(currentPhoto.id);
    }
  };

  const handleShare = async () => {
    if (!currentPhoto) return;

    try {
      await Share.share({
        message: `${currentPhoto.title}\n\n${
          currentPhoto.description || ''
        }\n\nCompartido desde SportCampus`,
        url: currentPhoto.url,
      });
    } catch (error) {
      console.error('Error sharing photo:', error);
    }
  };

  const handleDelete = () => {
    if (!currentPhoto || !onDelete) return;

    Alert.alert(
      'Eliminar Foto',
      '¿Estás seguro de que quieres eliminar esta foto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDelete(currentPhoto.id, currentPhoto.url),
        },
      ]
    );
  };

  const PhotoItem = ({ photo, index }) => (
    <View style={styles.photoContainer}>
      <TouchableOpacity
        style={styles.photoTouchable}
        onPress={() => setShowDetails(!showDetails)}
        activeOpacity={1}
      >
        <Image
          source={{ uri: photo.url }}
          style={styles.photo}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Navegación */}
      {photos.length > 1 && (
        <>
          {index > 0 && (
            <TouchableOpacity
              style={[styles.navButton, styles.prevButton]}
              onPress={goToPrevious}
            >
              <Ionicons name="chevron-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
          )}

          {index < photos.length - 1 && (
            <TouchableOpacity
              style={[styles.navButton, styles.nextButton]}
              onPress={goToNext}
            >
              <Ionicons name="chevron-forward" size={24} color={COLORS.white} />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );

  const PhotoDetails = () => {
    if (!showDetails || !currentPhoto || !showInfo) return null;

    return (
      <View style={styles.detailsContainer}>
        <ScrollView style={styles.detailsScroll}>
          <Text style={styles.photoTitle}>{currentPhoto.title}</Text>
          {currentPhoto.description && (
            <Text style={styles.photoDescription}>
              {currentPhoto.description}
            </Text>
          )}

          <View style={styles.metaContainer}>
            <View style={styles.metaRow}>
              <Ionicons name="camera" size={16} color={COLORS.gray} />
              <Text style={styles.metaText}>
                {currentPhoto.uploaderName || 'Usuario'}
              </Text>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="calendar" size={16} color={COLORS.gray} />
              <Text style={styles.metaText}>
                {formatTimeAgo(currentPhoto.createdAt)}
              </Text>
            </View>

            {currentPhoto.teamName && (
              <View style={styles.metaRow}>
                <Ionicons name="people" size={16} color={COLORS.gray} />
                <Text style={styles.metaText}>{currentPhoto.teamName}</Text>
              </View>
            )}

            {currentPhoto.eventType && (
              <View style={styles.metaRow}>
                <Ionicons name="bookmark" size={16} color={COLORS.gray} />
                <Text style={styles.metaText}>
                  {currentPhoto.eventType === 'training'
                    ? 'Entrenamiento'
                    : currentPhoto.eventType === 'match'
                    ? 'Partido'
                    : currentPhoto.eventType === 'tournament'
                    ? 'Torneo'
                    : currentPhoto.eventType === 'celebration'
                    ? 'Celebración'
                    : currentPhoto.eventType}
                </Text>
              </View>
            )}
          </View>

          {currentPhoto.tags && currentPhoto.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {currentPhoto.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  if (!visible || photos.length === 0) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.photoCounter}>
              {currentIndex + 1} de {photos.length}
            </Text>
          </View>

          <View style={styles.headerActions}>
            {showInfo && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowDetails(!showDetails)}
              >
                <Ionicons
                  name="information-circle"
                  size={24}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color={COLORS.white} />
            </TouchableOpacity>

            {canDelete && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleDelete}
              >
                <Ionicons name="trash-outline" size={24} color={COLORS.white} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Galería de Fotos */}
        <View style={styles.galleryContainer}>
          <FlatList
            ref={flatListRef}
            data={photos}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) => (
              <PhotoItem photo={item} index={index} />
            )}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            getItemLayout={(data, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
            initialScrollIndex={initialIndex}
          />
        </View>

        {/* Footer con acciones */}
        {showInfo && (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.footerAction} onPress={handleLike}>
              <Ionicons name="heart-outline" size={24} color={COLORS.white} />
              <Text style={styles.footerActionText}>
                {currentPhoto?.likes || 0}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.footerAction}>
              <Ionicons
                name="chatbubble-outline"
                size={24}
                color={COLORS.white}
              />
              <Text style={styles.footerActionText}>
                {currentPhoto?.comments?.length || 0}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.footerAction}
              onPress={() => setShowDetails(!showDetails)}
            >
              <Ionicons
                name={showDetails ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color={COLORS.white}
              />
              <Text style={styles.footerActionText}>Info</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Detalles de la foto */}
        <PhotoDetails />

        {/* Indicador de página */}
        {photos.length > 1 && (
          <View style={styles.pageIndicator}>
            {photos.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, index === currentIndex && styles.activeDot]}
              />
            ))}
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  photoCounter: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  galleryContainer: {
    flex: 1,
  },
  photoContainer: {
    width: screenWidth,
    height: screenHeight - 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  photoTouchable: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: screenWidth,
    height: '100%',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
    marginTop: -20,
  },
  prevButton: {
    left: 20,
  },
  nextButton: {
    right: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  footerAction: {
    alignItems: 'center',
  },
  footerActionText: {
    color: COLORS.white,
    fontSize: 12,
    marginTop: 4,
  },
  detailsContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    maxHeight: 200,
  },
  detailsScroll: {
    padding: 20,
  },
  photoTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  photoDescription: {
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    opacity: 0.9,
  },
  metaContainer: {
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  metaText: {
    color: COLORS.white,
    fontSize: 14,
    marginLeft: 8,
    opacity: 0.8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(248, 172, 88, 0.3)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '500',
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: COLORS.white,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default PhotoViewer;
