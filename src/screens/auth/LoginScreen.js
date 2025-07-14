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
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../utils/constants';
import { globalStyles } from '../../styles/globalStyles';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
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

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Formato de correo electrónico inválido';
    }

    if (!password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const result = await authService.login(email.trim(), password);
    } catch (error) {
      Alert.alert('Error de Inicio de Sesión', error.message, [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Recuperar Contraseña',
      'Esta funcionalidad estará disponible próximamente.',
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <View style={globalStyles.centerContainer}>
        <Loading text="Iniciando sesión..." />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo y Título */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="trophy" size={scale(40)} color={COLORS.secondary} />
          </View>
          <Text style={styles.appTitle}>SportCampus</Text>
          <Text style={styles.appSubtitle}>
            Tu plataforma deportiva universitaria
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Iniciar Sesión</Text>

          <View style={styles.inputContainer}>
            <Input
              label="Correo Electrónico"
              value={email}
              onChangeText={setEmail}
              placeholder="ejemplo@universidad.edu"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail"
              error={errors.email}
            />

            <Input
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry={true}
              leftIcon="lock-closed"
              error={errors.password}
            />
          </View>

          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={handleForgotPassword}
            activeOpacity={0.7}
          >
            <Text style={styles.forgotPasswordText}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>

          <Button
            title="Iniciar Sesión"
            onPress={handleLogin}
            loading={loading}
            icon="log-in"
            style={styles.loginButton}
          />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Registro */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿No tienes una cuenta?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.7}
            >
              <Text style={styles.registerLink}>Regístrate aquí</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features - Solo mostrar en pantallas más grandes */}
        {!isSmallScreen && (
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons
                name="bar-chart"
                size={scale(20)}
                color={COLORS.secondary}
              />
              <Text style={styles.featureText}>Estadísticas</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons
                name="trophy"
                size={scale(20)}
                color={COLORS.secondary}
              />
              <Text style={styles.featureText}>Torneos</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons
                name="images"
                size={scale(20)}
                color={COLORS.secondary}
              />
              <Text style={styles.featureText}>Galería</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary || '#1a1a2e',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: screenWidth * 0.06, // 6% del ancho de pantalla
    paddingVertical: screenHeight * 0.04, // 4% del alto de pantalla
    minHeight: screenHeight,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: screenHeight * 0.05, // 5% del alto de pantalla
  },
  logoCircle: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    backgroundColor: COLORS.white || '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 6,
  },
  appTitle: {
    fontSize: scale(28),
    fontWeight: '700',
    color: COLORS.white || '#ffffff',
    marginBottom: scale(6),
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: scale(14),
    color: COLORS.white || '#ffffff',
    textAlign: 'center',
    opacity: 0.85,
    lineHeight: scale(20),
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: scale(16),
    padding: screenWidth * 0.06, // 6% del ancho de pantalla
    marginBottom: screenHeight * 0.03, // 3% del alto de pantalla
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  formTitle: {
    fontSize: scale(22),
    fontWeight: '600',
    color: COLORS.white || '#ffffff',
    textAlign: 'center',
    marginBottom: scale(20),
    letterSpacing: 0.3,
  },
  inputContainer: {
    marginBottom: scale(8),
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: scale(20),
    paddingVertical: scale(4),
  },
  forgotPasswordText: {
    fontSize: scale(13),
    color: COLORS.secondary || '#4CAF50',
    fontWeight: '500',
  },
  loginButton: {
    marginVertical: scale(8),
    borderRadius: scale(12),
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: scale(20),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.white || '#ffffff',
    opacity: 0.25,
  },
  dividerText: {
    fontSize: scale(13),
    color: COLORS.white || '#ffffff',
    marginHorizontal: scale(16),
    opacity: 0.7,
    fontWeight: '500',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingVertical: scale(4),
  },
  registerText: {
    fontSize: scale(13),
    color: COLORS.white || '#ffffff',
    opacity: 0.8,
    marginRight: scale(4),
  },
  registerLink: {
    fontSize: scale(13),
    color: COLORS.secondary || '#4CAF50',
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: screenHeight * 0.02,
    paddingHorizontal: screenWidth * 0.02,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: scale(8),
  },
  featureText: {
    fontSize: scale(11),
    color: COLORS.white || '#ffffff',
    textAlign: 'center',
    marginTop: scale(6),
    opacity: 0.75,
    fontWeight: '500',
  },
});

export default LoginScreen;
