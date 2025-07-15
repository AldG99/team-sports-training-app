import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, USER_TYPES } from '../../utils/constants';
import { globalStyles } from '../../styles/globalStyles';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import authService from '../../services/authService';

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
    section: Math.max(scale(16), screenHeight * 0.02), // 2% del alto
  };
};

// Función para obtener tamaños de elementos
const getElementSizes = () => {
  return {
    avatar: Math.min(scale(80), screenWidth * 0.2), // 20% del ancho, máximo 80px
    editButton: Math.min(scale(30), screenWidth * 0.075), // 7.5% del ancho
    achievementGrid: (screenWidth - scale(64)) / 4, // 4 columnas
  };
};

const ProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const padding = getResponsivePadding();
  const sizes = getElementSizes();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [notifications, setNotifications] = useState({
    matches: true,
    tournaments: true,
    photos: false,
    achievements: true,
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const { user: currentUser, userProfile: currentProfile } =
        authService.getCurrentUser();

      if (currentUser && currentProfile) {
        setUser(currentUser);
        setUserProfile(currentProfile);
        setEditForm({
          firstName: currentProfile.firstName || '',
          lastName: currentProfile.lastName || '',
          studentId: currentProfile.studentId || '',
          faculty: currentProfile.faculty || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar Sesión',
        style: 'destructive',
        onPress: async () => {
          try {
            await authService.logout();
          } catch (error) {
            Alert.alert('Error', 'No se pudo cerrar sesión');
          }
        },
      },
    ]);
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await authService.updateUserProfile(user.uid, editForm);

      setUserProfile(prev => ({ ...prev, ...editForm }));
      setShowEditModal(false);

      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const updateEditForm = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const ProfileHeader = () => (
    <Card
      variant="comfortable"
      elevationLevel="medium"
      style={[
        styles.profileHeader,
        {
          marginHorizontal: padding.horizontal,
          marginVertical: scale(16),
          paddingVertical: scale(24),
        },
      ]}
    >
      <View style={[styles.avatarContainer, { marginBottom: scale(16) }]}>
        <Image
          source={{
            uri:
              userProfile?.avatar ||
              'https://via.placeholder.com/100/06597d/ffffff?text=Usuario',
          }}
          style={[
            styles.avatar,
            {
              width: sizes.avatar,
              height: sizes.avatar,
              borderRadius: sizes.avatar / 2,
            },
          ]}
        />
        <TouchableOpacity
          style={[
            styles.editAvatarButton,
            {
              width: sizes.editButton,
              height: sizes.editButton,
              borderRadius: sizes.editButton / 2,
              bottom: scale(2),
              right: scale(2),
              borderWidth: scale(2),
            },
          ]}
          activeOpacity={0.8}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="camera" size={scale(14)} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileInfo}>
        <Text
          style={[
            styles.userName,
            {
              fontSize: scale(18),
              marginBottom: scale(4),
            },
          ]}
        >
          {userProfile?.displayName ||
            `${userProfile?.firstName} ${userProfile?.lastName}`}
        </Text>
        <Text
          style={[
            styles.userEmail,
            {
              fontSize: scale(13),
              marginBottom: scale(8),
            },
          ]}
        >
          {user?.email}
        </Text>
        <View
          style={[
            styles.userBadge,
            {
              borderRadius: scale(12),
              paddingVertical: scale(4),
              paddingHorizontal: scale(12),
            },
          ]}
        >
          <Text style={[styles.userType, { fontSize: scale(11) }]}>
            {userProfile?.userType === USER_TYPES.STUDENT
              ? 'Estudiante'
              : userProfile?.userType === USER_TYPES.COACH
              ? 'Entrenador'
              : 'Administrador'}
          </Text>
        </View>
      </View>
    </Card>
  );

  const ProfileStats = () => (
    <Card
      variant="default"
      elevationLevel="low"
      style={[
        styles.statsCard,
        {
          marginHorizontal: padding.horizontal,
          marginBottom: scale(16),
        },
      ]}
    >
      <Text
        style={[
          styles.sectionTitle,
          {
            fontSize: scale(15),
            marginBottom: scale(16),
          },
        ]}
      >
        Mis Logros
      </Text>
      <View style={styles.achievementsGrid}>
        {[
          { icon: 'trophy', number: '3', label: 'Torneos' },
          { icon: 'medal', number: '12', label: 'Goles' },
          { icon: 'star', number: '8', label: 'Asistencias' },
          { icon: 'calendar', number: '25', label: 'Partidos' },
        ].map((achievement, index) => (
          <View key={index} style={styles.achievement}>
            <View
              style={[
                styles.achievementIcon,
                {
                  backgroundColor: `${COLORS.secondary || '#4CAF50'}15`,
                  width: scale(40),
                  height: scale(40),
                  borderRadius: scale(20),
                  marginBottom: scale(8),
                },
              ]}
            >
              <Ionicons
                name={achievement.icon}
                size={scale(20)}
                color={COLORS.secondary || '#4CAF50'}
              />
            </View>
            <Text style={[styles.achievementNumber, { fontSize: scale(16) }]}>
              {achievement.number}
            </Text>
            <Text
              style={[
                styles.achievementLabel,
                {
                  fontSize: scale(10),
                  marginTop: scale(3),
                },
              ]}
            >
              {achievement.label}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );

  const MenuSection = ({ title, items }) => (
    <Card
      variant="default"
      elevationLevel="low"
      style={[
        styles.menuSection,
        {
          marginHorizontal: padding.horizontal,
          marginBottom: scale(16),
        },
      ]}
    >
      <Text
        style={[
          styles.sectionTitle,
          {
            fontSize: scale(15),
            marginBottom: scale(16),
          },
        ]}
      >
        {title}
      </Text>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.menuItem,
            {
              paddingVertical: scale(12),
              borderBottomWidth: index < items.length - 1 ? scale(1) : 0,
            },
          ]}
          onPress={item.onPress}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <View
              style={[
                styles.menuItemIcon,
                {
                  backgroundColor: `${COLORS.gray || '#6B7280'}10`,
                  width: scale(32),
                  height: scale(32),
                  borderRadius: scale(16),
                  marginRight: scale(12),
                },
              ]}
            >
              <Ionicons
                name={item.icon}
                size={scale(16)}
                color={COLORS.gray || '#6B7280'}
              />
            </View>
            <Text style={[styles.menuItemText, { fontSize: scale(14) }]}>
              {item.title}
            </Text>
          </View>
          <View style={styles.menuItemRight}>
            {item.hasSwitch ? (
              <Switch
                value={item.switchValue}
                onValueChange={item.onSwitchChange}
                trackColor={{
                  false: COLORS.lightGray || '#E5E7EB',
                  true: COLORS.secondary || '#4CAF50',
                }}
                thumbColor={COLORS.white || '#ffffff'}
                style={{
                  transform: [{ scaleX: scale(0.9) }, { scaleY: scale(0.9) }],
                }}
              />
            ) : (
              <>
                {item.value && (
                  <Text
                    style={[
                      styles.menuItemValue,
                      {
                        fontSize: scale(12),
                        marginRight: scale(8),
                      },
                    ]}
                  >
                    {item.value}
                  </Text>
                )}
                <Ionicons
                  name="chevron-forward"
                  size={scale(14)}
                  color={COLORS.gray || '#6B7280'}
                />
              </>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </Card>
  );

  const EditProfileModal = () => (
    <Modal
      visible={showEditModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowEditModal(false)}
    >
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.modalHeader,
            {
              paddingHorizontal: padding.horizontal,
              paddingTop: insets.top + scale(16),
              paddingBottom: scale(20),
            },
          ]}
        >
          <Text style={[styles.modalTitle, { fontSize: scale(18) }]}>
            Editar Perfil
          </Text>
          <TouchableOpacity
            onPress={() => setShowEditModal(false)}
            style={[
              styles.closeButton,
              {
                width: scale(40),
                height: scale(40),
                borderRadius: scale(20),
              },
            ]}
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={scale(22)} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.modalContent}
          contentContainerStyle={{
            padding: padding.horizontal,
            paddingBottom: insets.bottom + scale(20),
          }}
          showsVerticalScrollIndicator={false}
        >
          <Input
            label="Nombre"
            value={editForm.firstName}
            onChangeText={value => updateEditForm('firstName', value)}
            placeholder="Tu nombre"
            leftIcon="person"
            variant={isSmallScreen ? 'compact' : 'default'}
          />

          <Input
            label="Apellido"
            value={editForm.lastName}
            onChangeText={value => updateEditForm('lastName', value)}
            placeholder="Tu apellido"
            leftIcon="person"
            variant={isSmallScreen ? 'compact' : 'default'}
          />

          {userProfile?.userType === USER_TYPES.STUDENT && (
            <Input
              label="ID de Estudiante"
              value={editForm.studentId}
              onChangeText={value => updateEditForm('studentId', value)}
              placeholder="Tu ID de estudiante"
              leftIcon="card"
              keyboardType="numeric"
              variant={isSmallScreen ? 'compact' : 'default'}
            />
          )}

          <Input
            label="Facultad"
            value={editForm.faculty}
            onChangeText={value => updateEditForm('faculty', value)}
            placeholder="Tu facultad"
            leftIcon="school"
            variant={isSmallScreen ? 'compact' : 'default'}
          />

          <View style={[styles.modalActions, { marginTop: scale(24) }]}>
            <Button
              title="Cancelar"
              type="outline"
              onPress={() => setShowEditModal(false)}
              style={[styles.modalButton, { marginRight: scale(8) }]}
              size={isSmallScreen ? 'medium' : 'large'}
            />
            <Button
              title="Guardar"
              onPress={handleSaveProfile}
              loading={loading}
              style={[styles.modalButton, { marginLeft: scale(8) }]}
              size={isSmallScreen ? 'medium' : 'large'}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  const personalMenuItems = [
    {
      title: 'Editar Perfil',
      icon: 'person-outline',
      onPress: () => setShowEditModal(true),
    },
    {
      title: 'Mis Estadísticas',
      icon: 'bar-chart-outline',
      onPress: () => navigation.navigate('Stats'),
    },
    {
      title: 'Mi Equipo',
      icon: 'people-outline',
      onPress: () => navigation.navigate('MyTeam'),
    },
    {
      title: 'Historial de Torneos',
      icon: 'trophy-outline',
      onPress: () => navigation.navigate('Tournaments'),
    },
  ];

  const notificationMenuItems = [
    {
      title: 'Partidos',
      icon: 'notifications-outline',
      hasSwitch: true,
      switchValue: notifications.matches,
      onSwitchChange: value =>
        setNotifications(prev => ({ ...prev, matches: value })),
    },
    {
      title: 'Torneos',
      icon: 'trophy-outline',
      hasSwitch: true,
      switchValue: notifications.tournaments,
      onSwitchChange: value =>
        setNotifications(prev => ({ ...prev, tournaments: value })),
    },
    {
      title: 'Fotos',
      icon: 'images-outline',
      hasSwitch: true,
      switchValue: notifications.photos,
      onSwitchChange: value =>
        setNotifications(prev => ({ ...prev, photos: value })),
    },
    {
      title: 'Logros',
      icon: 'medal-outline',
      hasSwitch: true,
      switchValue: notifications.achievements,
      onSwitchChange: value =>
        setNotifications(prev => ({ ...prev, achievements: value })),
    },
  ];

  const appMenuItems = [
    {
      title: 'Ayuda y Soporte',
      icon: 'help-circle-outline',
      onPress: () => Alert.alert('Ayuda', 'Contacta a soporte@sportcampus.com'),
    },
    {
      title: 'Términos y Condiciones',
      icon: 'document-text-outline',
      onPress: () => Alert.alert('Términos', 'Funcionalidad próximamente'),
    },
    {
      title: 'Política de Privacidad',
      icon: 'shield-outline',
      onPress: () => Alert.alert('Privacidad', 'Funcionalidad próximamente'),
    },
    {
      title: 'Acerca de',
      icon: 'information-circle-outline',
      value: 'v1.0.0',
      onPress: () =>
        Alert.alert(
          'SportCampus',
          'Versión 1.0.0\nDesarrollado para la comunidad universitaria'
        ),
    },
  ];

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Header
          title="Perfil"
          variant={isSmallScreen ? 'compact' : 'default'}
        />
        <Loading variant="default" animation="scale" />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Header
        title="Perfil"
        rightIcon="settings-outline"
        onRightPress={() =>
          Alert.alert('Configuración', 'Funcionalidad próximamente')
        }
        variant={isSmallScreen ? 'compact' : 'default'}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: insets.bottom + scale(20),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header del Perfil */}
        <ProfileHeader />

        {/* Estadísticas/Logros */}
        <ProfileStats />

        {/* Información Personal */}
        <Card
          variant="default"
          elevationLevel="low"
          style={[
            styles.infoCard,
            {
              marginHorizontal: padding.horizontal,
              marginBottom: scale(16),
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: scale(15),
                marginBottom: scale(16),
              },
            ]}
          >
            Información Personal
          </Text>
          {[
            { label: 'Facultad:', value: userProfile?.faculty },
            ...(userProfile?.studentId
              ? [{ label: 'ID Estudiante:', value: userProfile?.studentId }]
              : []),
            {
              label: 'Miembro desde:',
              value: userProfile?.createdAt
                ? new Date(userProfile.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                  })
                : 'Fecha no disponible',
            },
          ].map((info, index, array) => (
            <View
              key={index}
              style={[
                styles.infoRow,
                {
                  paddingVertical: scale(8),
                  borderBottomWidth: index < array.length - 1 ? scale(1) : 0,
                },
              ]}
            >
              <Text style={[styles.infoLabel, { fontSize: scale(13) }]}>
                {info.label}
              </Text>
              <Text style={[styles.infoValue, { fontSize: scale(13) }]}>
                {info.value}
              </Text>
            </View>
          ))}
        </Card>

        {/* Menú Personal */}
        <MenuSection title="Personal" items={personalMenuItems} />

        {/* Notificaciones */}
        <MenuSection title="Notificaciones" items={notificationMenuItems} />

        {/* Aplicación */}
        <MenuSection title="Aplicación" items={appMenuItems} />

        {/* Botón de Cerrar Sesión */}
        <Card
          variant="default"
          elevationLevel="low"
          style={[
            styles.logoutCard,
            {
              marginHorizontal: padding.horizontal,
              marginBottom: scale(16),
            },
          ]}
        >
          <Button
            title="Cerrar Sesión"
            type="danger"
            icon="log-out"
            onPress={handleLogout}
            size={isSmallScreen ? 'medium' : 'large'}
            fullWidth
          />
        </Card>
      </ScrollView>

      <EditProfileModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    backgroundColor: COLORS.lightGray || '#F3F4F6',
  },
  editAvatarButton: {
    position: 'absolute',
    backgroundColor: COLORS.secondary || '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.white || '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontWeight: '700',
    color: COLORS.darkGray || '#374151',
    letterSpacing: 0.3,
  },
  userEmail: {
    color: COLORS.gray || '#6B7280',
    fontWeight: '500',
  },
  userBadge: {
    backgroundColor: COLORS.secondary || '#4CAF50',
  },
  userType: {
    color: COLORS.white || '#ffffff',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  statsCard: {
    // margins se manejan dinámicamente
  },
  sectionTitle: {
    fontWeight: '700',
    color: COLORS.darkGray || '#374151',
    letterSpacing: 0.3,
  },
  achievementsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  achievement: {
    alignItems: 'center',
    flex: 1,
  },
  achievementIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementNumber: {
    fontWeight: '700',
    color: COLORS.secondary || '#4CAF50',
    letterSpacing: 0.5,
  },
  achievementLabel: {
    color: COLORS.gray || '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  infoCard: {
    // margins se manejan dinámicamente
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: COLORS.lightGray || '#E5E7EB',
  },
  infoLabel: {
    color: COLORS.gray || '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    color: COLORS.darkGray || '#374151',
    fontWeight: '600',
  },
  menuSection: {
    // margins se manejan dinámicamente
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: COLORS.lightGray || '#E5E7EB',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    color: COLORS.darkGray || '#374151',
    fontWeight: '500',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemValue: {
    color: COLORS.gray || '#6B7280',
    fontWeight: '500',
  },
  logoutCard: {
    // margins se manejan dinámicamente
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background || COLORS.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  modalTitle: {
    fontWeight: '700',
    color: COLORS.white || '#ffffff',
    letterSpacing: 0.3,
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
  },
});

export default ProfileScreen;
