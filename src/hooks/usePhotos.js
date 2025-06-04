import { useState, useEffect } from 'react';
import firestoreService from '../services/firestoreService';
import storageService from '../services/storageService';

export const usePhotos = (filters = {}) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPhotos();
  }, [filters]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      setError(null);
      const photosData = await firestoreService.getPhotos(
        filters.teamId,
        filters.eventType
      );
      setPhotos(photosData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    await loadPhotos();
    setRefreshing(false);
  };

  const uploadPhotos = async (images, metadata) => {
    try {
      setError(null);

      // Subir imágenes al storage
      const uploadResults = await storageService.uploadGalleryPhotos(
        images,
        metadata
      );

      // Guardar metadata en Firestore
      const savePromises = uploadResults.map(result =>
        firestoreService.savePhoto({
          url: result.url,
          filename: result.filename,
          ...metadata,
          likes: 0,
          comments: [],
          featured: false,
        })
      );

      const savedPhotos = await Promise.all(savePromises);

      // Actualizar estado local
      setPhotos(prev => [...savedPhotos, ...prev]);

      return savedPhotos;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deletePhoto = async (photoId, photoUrl) => {
    try {
      setError(null);

      // Eliminar de Storage
      await storageService.deleteGalleryPhoto(photoUrl);

      // Eliminar de Firestore
      await firestoreService.deleteDocument('photos', photoId);

      // Actualizar estado local
      setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const likePhoto = async photoId => {
    try {
      setError(null);

      // Actualizar en Firestore
      await firestoreService.updateDocument('photos', photoId, {
        likes: photos.find(p => p.id === photoId)?.likes + 1 || 1,
      });

      // Actualizar estado local
      setPhotos(prev =>
        prev.map(photo =>
          photo.id === photoId
            ? { ...photo, likes: (photo.likes || 0) + 1 }
            : photo
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const toggleFeatured = async photoId => {
    try {
      setError(null);
      const photo = photos.find(p => p.id === photoId);

      await firestoreService.updateDocument('photos', photoId, {
        featured: !photo.featured,
      });

      setPhotos(prev =>
        prev.map(p => (p.id === photoId ? { ...p, featured: !p.featured } : p))
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Funciones de filtrado
  const getPhotosByTeam = teamId => {
    return photos.filter(photo => photo.teamId === teamId);
  };

  const getPhotosByEventType = eventType => {
    return photos.filter(photo => photo.eventType === eventType);
  };

  const getFeaturedPhotos = () => {
    return photos.filter(photo => photo.featured);
  };

  const getRecentPhotos = (limit = 10) => {
    return photos
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  };

  const searchPhotos = searchTerm => {
    if (!searchTerm.trim()) return photos;

    const term = searchTerm.toLowerCase();
    return photos.filter(
      photo =>
        photo.title?.toLowerCase().includes(term) ||
        photo.description?.toLowerCase().includes(term) ||
        photo.tags?.some(tag => tag.toLowerCase().includes(term)) ||
        photo.teamName?.toLowerCase().includes(term)
    );
  };

  return {
    photos,
    loading,
    error,
    refreshing,
    refresh,
    uploadPhotos,
    deletePhoto,
    likePhoto,
    toggleFeatured,
    getPhotosByTeam,
    getPhotosByEventType,
    getFeaturedPhotos,
    getRecentPhotos,
    searchPhotos,
  };
};

export const usePhotoUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadSinglePhoto = async (imageUri, metadata) => {
    try {
      setUploading(true);
      setProgress(0);
      setError(null);

      const result = await storageService.uploadSingleGalleryPhoto(
        imageUri,
        metadata
      );
      setProgress(50);

      const savedPhoto = await firestoreService.savePhoto({
        url: result.url,
        filename: result.filename,
        ...metadata,
        likes: 0,
        comments: [],
        featured: false,
      });

      setProgress(100);
      return savedPhoto;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const uploadMultiplePhotos = async (images, metadata) => {
    try {
      setUploading(true);
      setProgress(0);
      setError(null);

      const uploadPromises = images.map(async (image, index) => {
        const result = await storageService.uploadSingleGalleryPhoto(
          image.uri,
          {
            ...metadata,
            originalIndex: index,
          }
        );

        setProgress(((index + 1) / images.length) * 50);

        return firestoreService.savePhoto({
          url: result.url,
          filename: result.filename,
          ...metadata,
          likes: 0,
          comments: [],
          featured: false,
        });
      });

      const results = await Promise.all(uploadPromises);
      setProgress(100);

      return results;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return {
    uploading,
    progress,
    error,
    uploadSinglePhoto,
    uploadMultiplePhotos,
  };
};

export default usePhotos;
