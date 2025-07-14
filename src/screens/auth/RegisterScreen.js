import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, USER_TYPES } from '../../utils/constants';
import { globalStyles } from '../../styles/globalStyles';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import Header from '../../components/common/Header';
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
    section: Math.max(scale(20), screenHeight * 0.025), // 2.5% del alto
  };
};

const RegisterScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const padding = getResponsivePadding();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    faculty: '',
    userType: USER_TYPES.STUDENT,
    profileImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const userTypes = [
    { id: USER_TYPES.STUDENT, name: 'Estudiante', icon: 'school' },
    { id: USER_TYPES.COACH, name: 'Entrenador', icon: 'fitness' },
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

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permisos necesarios',
          'Necesitamos acceso a tu galería para seleccionar una foto de perfil.',
          [{ text: 'OK' }]
        );
        return;
      }

      Alert.alert('Foto de Perfil', 'Selecciona una opción', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Galería', onPress: () => openImagePicker() },
        { text: 'Cámara', onPress: () => openCamera() },
      ]);
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'No se pudo acceder a la galería');
    }
  };

  const openImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        updateFormData('profileImage', result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error selecting image:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Error', 'Se necesitan permisos de cámara');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        updateFormData('profileImage', result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error taking photo:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const removeImage = () => {
    Alert.alert(
      'Remover Foto',
      '¿Estás seguro de que quieres remover la foto de perfil?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          onPress: () => updateFormData('profileImage', null),
        },
      ]
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Formato de correo electrónico inválido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (
      formData.userType === USER_TYPES.STUDENT &&
      !formData.studentId.trim()
    ) {
      newErrors.studentId = 'El ID de estudiante es requerido';
    }

    if (!formData.faculty.trim()) {
      newErrors.faculty = 'La facultad es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        studentId: formData.studentId.trim(),
        faculty: formData.faculty,
        userType: formData.userType,
        displayName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        profileImage: formData.profileImage,
      };

      const result = await authService.register(
        formData.email.trim(),
        formData.password,
        userData
      );

      Alert.alert(
        'Registro Exitoso',
        '¡Bienvenido a SportCampus! Tu cuenta ha sido creada correctamente.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error de Registro', error.message, [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  const ProfileImageSelector = () => {
    const imageSize = Math.min(scale(100), screenWidth * 0.25);

    return (
      <View style={styles.profileImageSection}>
        <Text style={[styles.sectionTitle, { fontSize: scale(16) }]}>
          Foto de Perfil (Opcional)
        </Text>
        <TouchableOpacity
          style={[
            styles.imageContainer,
            {
              width: imageSize,
              height: imageSize,
              borderRadius: imageSize / 2,
            },
          ]}
          onPress={pickImage}
          activeOpacity={0.8}
        >
          {formData.profileImage ? (
            <>
              <Image
                source={{ uri: formData.profileImage }}
                style={[
                  styles.profileImage,
                  {
                    width: imageSize,
                    height: imageSize,
                    borderRadius: imageSize / 2,
                  },
                ]}
              />
              <TouchableOpacity
                style={[
                  styles.removeImageButton,
                  {
                    top: scale(-4),
                    right: scale(-4),
                  },
                ]}
                onPress={removeImage}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="close-circle"
                  size={scale(24)}
                  color={COLORS.error}
                />
              </TouchableOpacity>
            </>
          ) : (
            <View
              style={[
                styles.placeholderImage,
                {
                  width: imageSize,
                  height: imageSize,
                  borderRadius: imageSize / 2,
                },
              ]}
            >
              <Ionicons name="camera" size={scale(28)} color={COLORS.gray} />
              <Text style={[styles.placeholderText, { fontSize: scale(11) }]}>
                Tocar para{'\n'}agregar foto
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const UserTypeSelector = () => (
    <View style={styles.userTypeContainer}>
      <Text style={[styles.sectionTitle, { fontSize: scale(16) }]}>
        Tipo de Usuario
      </Text>
      <View style={styles.userTypeOptions}>
        {userTypes.map(type => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.userTypeOption,
              {
                borderRadius: scale(12),
                padding: scale(14),
                marginHorizontal: scale(6),
              },
              formData.userType === type.id && styles.selectedUserType,
            ]}
            onPress={() => updateFormData('userType', type.id)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={type.icon}
              size={scale(22)}
              color={
                formData.userType === type.id ? COLORS.white : COLORS.darkGray
              }
            />
            <Text
              style={[
                styles.userTypeText,
                {
                  fontSize: scale(13),
                  marginTop: scale(6),
                },
                formData.userType === type.id && styles.selectedUserTypeText,
              ]}
            >
              {type.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const FacultySelector = () => (
    <View style={styles.facultyContainer}>
      <Text style={[styles.sectionTitle, { fontSize: scale(16) }]}>
        Facultad
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.facultyScroll,
          {
            paddingVertical: scale(8),
            paddingHorizontal: scale(4),
          },
        ]}
      >
        {faculties.map(faculty => (
          <TouchableOpacity
            key={faculty}
            style={[
              styles.facultyOption,
              {
                borderRadius: scale(18),
                paddingVertical: scale(8),
                paddingHorizontal: scale(14),
                marginRight: scale(10),
              },
              formData.faculty === faculty && styles.selectedFaculty,
            ]}
            onPress={() => updateFormData('faculty', faculty)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.facultyText,
                { fontSize: scale(13) },
                formData.faculty === faculty && styles.selectedFacultyText,
              ]}
            >
              {faculty}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {errors.faculty && (
        <Text style={[styles.errorText, { fontSize: scale(11) }]}>
          {errors.faculty}
        </Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Header
          title="Registro"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <Loading
          text="Creando tu cuenta..."
          variant="default"
          animation="scale"
        />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Header
        title="Crear Cuenta"
        showBackButton
        onBackPress={() => navigation.goBack()}
        variant={isSmallScreen ? 'compact' : 'default'}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContainer,
            {
              paddingHorizontal: padding.horizontal,
              paddingVertical: padding.vertical,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Foto de Perfil */}
          <ProfileImageSelector />

          {/* Información Personal */}
          <View style={[styles.section, { marginBottom: padding.section }]}>
            <Text style={[styles.sectionTitle, { fontSize: scale(16) }]}>
              Información Personal
            </Text>

            <View style={styles.nameRow}>
              <Input
                label="Nombre"
                value={formData.firstName}
                onChangeText={value => updateFormData('firstName', value)}
                placeholder="Juan"
                leftIcon="person"
                error={errors.firstName}
                style={[
                  styles.halfInput,
                  {
                    width: isSmallScreen ? '100%' : '48%',
                    marginBottom: isSmallScreen ? scale(8) : 0,
                  },
                ]}
                variant={isSmallScreen ? 'compact' : 'default'}
              />

              {!isSmallScreen && <View style={styles.inputSpacer} />}

              <Input
                label="Apellido"
                value={formData.lastName}
                onChangeText={value => updateFormData('lastName', value)}
                placeholder="Pérez"
                leftIcon="person"
                error={errors.lastName}
                style={[
                  styles.halfInput,
                  {
                    width: isSmallScreen ? '100%' : '48%',
                  },
                ]}
                variant={isSmallScreen ? 'compact' : 'default'}
              />
            </View>

            <Input
              label="Correo Electrónico"
              value={formData.email}
              onChangeText={value => updateFormData('email', value)}
              placeholder="juan.perez@universidad.edu"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail"
              error={errors.email}
              variant={isSmallScreen ? 'compact' : 'default'}
            />
          </View>

          {/* Tipo de Usuario */}
          <UserTypeSelector />

          {/* ID de Estudiante (solo para estudiantes) */}
          {formData.userType === USER_TYPES.STUDENT && (
            <View style={[styles.section, { marginBottom: padding.section }]}>
              <Input
                label="ID de Estudiante"
                value={formData.studentId}
                onChangeText={value => updateFormData('studentId', value)}
                placeholder="202012345"
                keyboardType="numeric"
                leftIcon="card"
                error={errors.studentId}
                variant={isSmallScreen ? 'compact' : 'default'}
              />
            </View>
          )}

          {/* Facultad */}
          <FacultySelector />

          {/* Contraseñas */}
          <View style={[styles.section, { marginBottom: padding.section }]}>
            <Text style={[styles.sectionTitle, { fontSize: scale(16) }]}>
              Seguridad
            </Text>

            <Input
              label="Contraseña"
              value={formData.password}
              onChangeText={value => updateFormData('password', value)}
              placeholder="••••••••"
              secureTextEntry={true}
              leftIcon="lock-closed"
              error={errors.password}
              variant={isSmallScreen ? 'compact' : 'default'}
            />

            <Input
              label="Confirmar Contraseña"
              value={formData.confirmPassword}
              onChangeText={value => updateFormData('confirmPassword', value)}
              placeholder="••••••••"
              secureTextEntry={true}
              leftIcon="lock-closed"
              error={errors.confirmPassword}
              variant={isSmallScreen ? 'compact' : 'default'}
            />
          </View>

          {/* Botón de Registro */}
          <Button
            title="Crear Cuenta"
            onPress={handleRegister}
            loading={loading}
            icon="person-add"
            style={[
              styles.registerButton,
              {
                marginVertical: scale(12),
              },
            ]}
            size={isSmallScreen ? 'medium' : 'large'}
            fullWidth
          />

          {/* Link a Login */}
          <View
            style={[
              styles.loginContainer,
              {
                marginTop: scale(12),
                paddingVertical: scale(8),
              },
            ]}
          >
            <Text style={[styles.loginText, { fontSize: scale(13) }]}>
              ¿Ya tienes una cuenta?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.loginLink, { fontSize: scale(13) }]}>
                Inicia sesión aquí
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: insets.bottom + scale(20) }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  section: {
    // marginBottom se maneja dinámicamente
  },
  sectionTitle: {
    fontWeight: '700',
    color: COLORS.white || '#ffffff',
    marginBottom: scale(12),
    letterSpacing: 0.3,
  },
  profileImageSection: {
    marginBottom: scale(20),
    alignItems: 'center',
  },
  imageContainer: {
    marginTop: scale(8),
    position: 'relative',
  },
  profileImage: {
    backgroundColor: COLORS.lightGray || '#F3F4F6',
  },
  placeholderImage: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: scale(2),
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: COLORS.white || '#ffffff',
    marginTop: scale(6),
    textAlign: 'center',
    opacity: 0.8,
    fontWeight: '500',
  },
  removeImageButton: {
    position: 'absolute',
    backgroundColor: COLORS.white || '#ffffff',
    borderRadius: scale(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  nameRow: {
    flexDirection: isSmallScreen ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: isSmallScreen ? 'stretch' : 'flex-start',
  },
  halfInput: {
    // width se maneja dinámicamente
  },
  inputSpacer: {
    width: '4%',
  },
  userTypeContainer: {
    marginBottom: scale(20),
  },
  userTypeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userTypeOption: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    borderWidth: scale(1.5),
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedUserType: {
    backgroundColor: COLORS.secondary || '#4CAF50',
    borderColor: COLORS.secondary || '#4CAF50',
    shadowColor: COLORS.secondary || '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  userTypeText: {
    fontWeight: '600',
    color: COLORS.white || '#ffffff',
    textAlign: 'center',
    opacity: 0.8,
  },
  selectedUserTypeText: {
    color: COLORS.white || '#ffffff',
    opacity: 1,
  },
  facultyContainer: {
    marginBottom: scale(20),
  },
  facultyScroll: {
    // padding se maneja dinámicamente
  },
  facultyOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: scale(1.5),
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedFaculty: {
    backgroundColor: COLORS.secondary || '#4CAF50',
    borderColor: COLORS.secondary || '#4CAF50',
    shadowColor: COLORS.secondary || '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  facultyText: {
    fontWeight: '500',
    color: COLORS.white || '#ffffff',
    opacity: 0.8,
  },
  selectedFacultyText: {
    color: COLORS.white || '#ffffff',
    fontWeight: '600',
    opacity: 1,
  },
  registerButton: {
    // margin se maneja dinámicamente
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  loginText: {
    color: COLORS.white || '#ffffff',
    opacity: 0.8,
    marginRight: scale(4),
  },
  loginLink: {
    color: COLORS.secondary || '#4CAF50',
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.error || '#EF4444',
    marginTop: scale(4),
    marginLeft: scale(4),
    fontWeight: '500',
  },
});

export default RegisterScreen;
