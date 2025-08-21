/**
 * ========================================
 * 🔘 COMPONENTE BUTTON - UNIVERSAL
 * ========================================
 * 
 * Componente de botón totalmente responsivo y versátil para SportCampus
 * 
 * Características principales:
 * ✅ Totalmente responsivo con breakpoints automáticos
 * ✅ 6 variantes de estilo: primary, secondary, outline, ghost, danger, success
 * ✅ 3 tamaños adaptativos: small, medium, large
 * ✅ Estados avanzados: loading, disabled con indicadores visuales
 * ✅ Soporte de iconos con Ionicons y tamaños responsivos
 * ✅ Animaciones y sombras según tipo de botón
 * 
 * Props principales:
 * @param {string} title - Texto del botón
 * @param {function} onPress - Función a ejecutar al presionar
 * @param {string} type - Tipo: 'primary'|'secondary'|'outline'|'ghost'|'danger'|'success'
 * @param {string} size - Tamaño: 'small'|'medium'|'large'
 * @param {boolean} disabled - Estado deshabilitado
 * @param {boolean} loading - Estado de carga
 * @param {string} icon - Nombre del icono de Ionicons
 * @param {boolean} fullWidth - Ancho completo
 * 
 * Ejemplo de uso:
 * <Button 
 *   title="Iniciar Sesión" 
 *   type="primary" 
 *   size="large"
 *   icon="log-in"
 *   onPress={handleLogin}
 *   loading={isLoading}
 * />
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../utils/constants';

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
  const basePadding = screenWidth * 0.04; // 4% del ancho de pantalla
  return {
    vertical: Math.max(scale(12), basePadding * 0.8),
    horizontal: Math.max(scale(20), basePadding),
  };
};

const Button = ({
  title,
  onPress,
  type = 'primary',
  size = 'medium', // 'small', 'medium', 'large'
  disabled = false,
  loading = false,
  icon = null,
  iconSize = null,
  style = {},
  textStyle = {},
  fullWidth = false,
}) => {
  const padding = getResponsivePadding();

  // Tamaños responsivos según el tipo de botón
  const getSizeStyles = () => {
    const baseHeight = scale(48);

    switch (size) {
      case 'small':
        return {
          minHeight: baseHeight * 0.75,
          paddingVertical: padding.vertical * 0.7,
          paddingHorizontal: padding.horizontal * 0.8,
        };
      case 'large':
        return {
          minHeight: baseHeight * 1.25,
          paddingVertical: padding.vertical * 1.3,
          paddingHorizontal: padding.horizontal * 1.2,
        };
      default: // medium
        return {
          minHeight: baseHeight,
          paddingVertical: padding.vertical,
          paddingHorizontal: padding.horizontal,
        };
    }
  };

  // Tamaño de icono responsivo
  const getIconSize = () => {
    if (iconSize) return scale(iconSize);

    switch (size) {
      case 'small':
        return scale(16);
      case 'large':
        return scale(24);
      default:
        return scale(20);
    }
  };

  // Tamaño de texto responsivo
  const getTextSize = () => {
    switch (size) {
      case 'small':
        return scale(14);
      case 'large':
        return scale(18);
      default:
        return scale(16);
    }
  };

  const getButtonStyle = () => {
    const baseStyle = [
      styles.button,
      getSizeStyles(),
      fullWidth && styles.fullWidth,
    ];

    switch (type) {
      case 'secondary':
        baseStyle.push(styles.secondaryButton);
        break;
      case 'outline':
        baseStyle.push(styles.outlineButton);
        break;
      case 'ghost':
        baseStyle.push(styles.ghostButton);
        break;
      case 'danger':
        baseStyle.push(styles.dangerButton);
        break;
      case 'success':
        baseStyle.push(styles.successButton);
        break;
      default:
        baseStyle.push(styles.primaryButton);
    }

    if (disabled) {
      baseStyle.push(styles.disabledButton);
    }

    return [...baseStyle, style];
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText, { fontSize: getTextSize() }];

    switch (type) {
      case 'outline':
        baseStyle.push(styles.outlineButtonText);
        break;
      case 'ghost':
        baseStyle.push(styles.ghostButtonText);
        break;
      case 'danger':
        baseStyle.push(styles.dangerButtonText);
        break;
      case 'success':
        baseStyle.push(styles.successButtonText);
        break;
      default:
        baseStyle.push(styles.primaryButtonText);
    }

    if (disabled) {
      baseStyle.push(styles.disabledButtonText);
    }

    return [...baseStyle, textStyle];
  };

  const getIconColor = () => {
    if (disabled) return COLORS.gray || '#9CA3AF';

    switch (type) {
      case 'outline':
        return COLORS.secondary || '#4CAF50';
      case 'ghost':
        return COLORS.secondary || '#4CAF50';
      case 'danger':
        return COLORS.white || '#ffffff';
      case 'success':
        return COLORS.white || '#ffffff';
      default:
        return COLORS.white || '#ffffff';
    }
  };

  const getActiveOpacity = () => {
    if (disabled) return 1;
    return type === 'ghost' ? 0.6 : 0.85;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={getActiveOpacity()}
    >
      {loading ? (
        <ActivityIndicator
          color={getIconColor()}
          size={size === 'small' ? 'small' : 'small'}
        />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={getIconSize()}
              color={getIconColor()}
              style={[styles.icon, { marginRight: title ? scale(8) : 0 }]}
            />
          )}
          {title && <Text style={getTextStyle()}>{title}</Text>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(12),
    marginVertical: scale(4),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  fullWidth: {
    width: '100%',
  },
  // Tipos de botón
  primaryButton: {
    backgroundColor: COLORS.secondary || '#4CAF50',
    shadowOpacity: 0.15,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: COLORS.primary || '#1a1a2e',
    shadowOpacity: 0.12,
    elevation: 3,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: scale(1.5),
    borderColor: COLORS.secondary || '#4CAF50',
    shadowOpacity: 0,
    elevation: 0,
  },
  ghostButton: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  dangerButton: {
    backgroundColor: COLORS.error || '#EF4444',
    shadowOpacity: 0.15,
    elevation: 4,
  },
  successButton: {
    backgroundColor: '#10B981',
    shadowOpacity: 0.15,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: COLORS.lightGray || '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
  },
  // Estilos de texto
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  primaryButtonText: {
    color: COLORS.white || '#ffffff',
  },
  outlineButtonText: {
    color: COLORS.secondary || '#4CAF50',
    fontWeight: '600',
  },
  ghostButtonText: {
    color: COLORS.secondary || '#4CAF50',
    fontWeight: '500',
  },
  dangerButtonText: {
    color: COLORS.white || '#ffffff',
  },
  successButtonText: {
    color: COLORS.white || '#ffffff',
  },
  disabledButtonText: {
    color: COLORS.gray || '#9CA3AF',
  },
  icon: {
    // El marginRight se maneja dinámicamente
  },
});

export default Button;
