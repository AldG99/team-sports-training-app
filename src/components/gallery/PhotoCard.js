import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../utils/constants';
import { formatTimeAgo } from '../../utils/helpers';

const PhotoCard = ({
  photo,
  onLike = null,
  onComment = null,
  onShare = null,
  onDelete = null,
  canDelete = false,
  style = {},
  size = 'medium',
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(photo.likes || 0);

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { width: 100, height: 100 };
      case 'large':
        return { width: 300, height: 200 };
      default:
        return { width: 150, height: 150 };
    }
  };

  const handleLike = () => {
    if (onLike) {
      onLike(photo.id);
    }
    setLiked(!liked);
    setLikesCount(prev => (liked ? prev - 1 : prev + 1));
  };

  const handleShare = () => {
    if (onShare) {
      onShare(photo);
    } else {
      Alert.alert('Compartir', `Compartiendo: ${photo.title}`);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Foto',
      '¿Estás seguro de que quieres eliminar esta foto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDelete && onDelete(photo.id),
        },
      ]
    );
  };

  const PhotoDetailsModal = () => (
    <Modal
      visible={showDetails}
      animationType="fade"
      presentationStyle="overFullScreen"
      onRequestClose={() => setShowDetails(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowDetails(false)}>
              <Ionicons name="close" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Image source={{ uri: photo.url }} style={styles.modalImage} />

            <View style={styles.photoInfo}>
              <Text style={styles.photoTitle}>{photo.title}</Text>
              {photo.description && (
                <Text style={styles.photoDescription}>{photo.description}</Text>
              )}

              <View style={styles.photoMeta}>
                <View style={styles.metaRow}>
                  <Ionicons name="person" size={16} color={COLORS.gray} />
                  <Text style={styles.metaText}>
                    {photo.uploaderName || 'Usuario'}
                  </Text>
                </View>

                <View style={styles.metaRow}>
                  <Ionicons name="calendar" size={16} color={COLORS.gray} />
                  <Text style={styles.metaText}>
                    {formatTimeAgo(photo.createdAt)}
                  </Text>
                </View>

                {photo.teamName && (
                  <View style={styles.metaRow}>
                    <Ionicons name="people" size={16} color={COLORS.gray} />
                    <Text style={styles.metaText}>{photo.teamName}</Text>
                  </View>
                )}
              </View>

              {photo.tags && photo.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {photo.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <View style={[styles.container, style]}>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => setShowDetails(true)}
        >
          <Image
            source={{ uri: photo.url }}
            style={[styles.image, getSizeStyle()]}
            resizeMode="cover"
          />

          {size !== 'small' && (
            <View style={styles.overlay}>
              <View style={styles.overlayInfo}>
                <Text style={styles.overlayTitle} numberOfLines={2}>
                  {photo.title}
                </Text>
                <Text style={styles.overlayDate}>
                  {formatTimeAgo(photo.createdAt)}
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {size !== 'small' && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <Ionicons
                name={liked ? 'heart' : 'heart-outline'}
                size={20}
                color={liked ? COLORS.error : COLORS.gray}
              />
              <Text style={styles.actionText}>{likesCount}</Text>
            </TouchableOpacity>

            {onComment && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onComment(photo)}
              >
                <Ionicons
                  name="chatbubble-outline"
                  size={20}
                  color={COLORS.gray}
                />
                <Text style={styles.actionText}>
                  {photo.comments?.length || 0}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={20} color={COLORS.gray} />
            </TouchableOpacity>

            {canDelete && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleDelete}
              >
                <Ionicons name="trash-outline" size={20} color={COLORS.error} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <PhotoDetailsModal />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    backgroundColor: COLORS.lightGray,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
  },
  overlayInfo: {
    flex: 1,
  },
  overlayTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  overlayDate: {
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 4,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  modalBody: {
    flex: 1,
  },
  modalImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  photoInfo: {
    backgroundColor: COLORS.white,
    padding: 20,
  },
  photoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  photoDescription: {
    fontSize: 16,
    color: COLORS.gray,
    lineHeight: 24,
    marginBottom: 16,
  },
  photoMeta: {
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: '600',
  },
});

export default PhotoCard;
