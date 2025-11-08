/**
 * ========================================
 * 📝 COMPONENTE INPUT - CAMPO AVANZADO
 * ========================================
 * 
 * Campo de entrada avanzado con validación visual para SportCampus
 * 
 * Características principales:
 * ✅ Floating labels animados con Animated API
 * ✅ Validación visual en tiempo real con estados de error
 * ✅ Soporte completo de iconos izquierda/derecha
 * ✅ Manejo de contraseñas con toggle de visibilidad
 * ✅ Contador de caracteres y texto de ayuda
 * ✅ Multiline y responsive según variante
 * ✅ Animaciones fluidas y estados focus
 * 
 * Props principales:
 * @param {string} label - Etiqueta del campo
 * @param {string} value - Valor actual del input
 * @param {function} onChangeText - Función de cambio de texto
 * @param {string} placeholder - Texto placeholder
 * @param {string} error - Mensaje de error
 * @param {string} variant - Espaciado: 'compact'|'default'|'comfortable'
 * @param {boolean} floatingLabel - Activar label flotante animado
 * @param {boolean} secureTextEntry - Campo de contraseña
 * @param {string} leftIcon - Icono izquierdo (Ionicons)
 * @param {string} rightIcon - Icono derecho (Ionicons)
 * @param {boolean} multiline - Campo de múltiples líneas
 * @param {number} maxLength - Longitud máxima
 * @param {boolean} showCharacterCount - Mostrar contador de caracteres
 * 
 * Ejemplo de uso:
 * <Input 
 *   label="Correo Electrónico"
 *   value={email}
 *   onChangeText={setEmail}
 *   leftIcon="mail"
 *   floatingLabel={true}
 *   error={emailError}
 *   keyboardType="email-address"
 * />
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
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
const getResponsivePadding = variant => {
  const basePadding = screenWidth * 0.04; // 4% del ancho de pantalla

  switch (variant) {
    case 'compact':
      return {
        horizontal: Math.max(scale(12), basePadding * 0.75),
        vertical: Math.max(scale(8), basePadding * 0.5),
      };
    case 'comfortable':
      return {
        horizontal: Math.max(scale(20), basePadding * 1.25),
        vertical: Math.max(scale(16), basePadding),
      };
    default: // 'default'
      return {
        horizontal: Math.max(scale(16), basePadding),
        vertical: Math.max(scale(12), basePadding * 0.75),
      };
  }
};

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  error = null,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  onRightIconPress = null,
  style = {},
  inputStyle = {},
  labelStyle = {},
  variant = 'default', // 'compact', 'default', 'comfortable'
  borderRadius = 'medium', // 'small', 'medium', 'large'
  floatingLabel = false,
  helperText = null,
  maxLength = null,
  showCharacterCount = false,
  backgroundColor = null,
  borderColor = null,
  focusedBorderColor = null,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [labelAnimation] = useState(new Animated.Value(value ? 1 : 0));

  const padding = getResponsivePadding(variant);

  // Animación para floating label
  React.useEffect(() => {
    if (floatingLabel) {
      Animated.timing(labelAnimation, {
        toValue: isFocused || value ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [isFocused, value, floatingLabel]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Obtener radio de borde responsivo
  const getBorderRadius = () => {
    switch (borderRadius) {
      case 'small':
        return scale(6);
      case 'large':
        return scale(16);
      default: // 'medium'
        return scale(12);
    }
  };

  // Obtener tamaño de iconos responsivo
  const getIconSize = () => {
    switch (variant) {
      case 'compact':
        return scale(18);
      case 'comfortable':
        return scale(22);
      default:
        return scale(20);
    }
  };

  // Obtener tamaño de texto responsivo
  const getTextSize = () => {
    switch (variant) {
      case 'compact':
        return scale(14);
      case 'comfortable':
        return scale(18);
      default:
        return scale(16);
    }
  };

  // Estilos del contenedor de input
  const getInputContainerStyle = () => {
    const baseStyle = [
      styles.inputContainer,
      {
        borderRadius: getBorderRadius(),
        backgroundColor: backgroundColor || COLORS.white || '#ffffff',
        borderColor: error
          ? COLORS.error || '#EF4444'
          : isFocused
          ? focusedBorderColor || COLORS.secondary || '#4CAF50'
          : borderColor || COLORS.lightGray || '#E5E7EB',
      },
    ];

    if (disabled) {
      baseStyle.push(styles.disabledContainer);
    }

    if (error) {
      baseStyle.push(styles.errorContainer);
    }

    if (isFocused) {
      baseStyle.push(styles.focusedContainer);
    }

    return baseStyle;
  };

  // Estilos del input
  const getInputStyle = () => {
    const baseStyle = [
      styles.input,
      {
        paddingHorizontal: padding.horizontal,
        paddingVertical: padding.vertical,
        fontSize: getTextSize(),
        minHeight: multiline ? scale(80) : scale(44),
        textAlignVertical: multiline ? 'top' : 'center',
      },
      inputStyle,
    ];

    if (floatingLabel && isFocused) {
      baseStyle.push({ paddingTop: padding.vertical + scale(8) });
    }

    return baseStyle;
  };

  // Estilos del label
  const getLabelStyle = () => {
    const baseStyle = [
      styles.label,
      {
        fontSize: scale(14),
        marginBottom: floatingLabel ? 0 : scale(6),
      },
      labelStyle,
    ];

    if (floatingLabel) {
      return [
        ...baseStyle,
        styles.floatingLabel,
        {
          fontSize: labelAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [getTextSize(), scale(12)],
          }),
          top: labelAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [padding.vertical + scale(2), scale(8)],
          }),
          left: padding.horizontal,
          color: isFocused
            ? COLORS.secondary || '#4CAF50'
            : COLORS.gray || '#6B7280',
        },
      ];
    }

    return baseStyle;
  };

  return (
    <View style={[styles.container, style]}>
      {label && !floatingLabel && <Text style={getLabelStyle()}>{label}</Text>}

      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <View
            style={[styles.iconContainer, { paddingLeft: padding.horizontal }]}
          >
            <Ionicons
              name={leftIcon}
              size={getIconSize()}
              color={
                isFocused
                  ? COLORS.secondary || '#4CAF50'
                  : COLORS.gray || '#6B7280'
              }
            />
          </View>
        )}

        {floatingLabel && label && (
          <Animated.Text style={getLabelStyle()}>{label}</Animated.Text>
        )}

        <TextInput
          style={getInputStyle()}
          value={value}
          onChangeText={onChangeText}
          placeholder={floatingLabel ? '' : placeholder}
          placeholderTextColor={COLORS.gray || '#9CA3AF'}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity
            style={[styles.iconContainer, { paddingRight: padding.horizontal }]}
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={getIconSize()}
              color={COLORS.gray || '#6B7280'}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && (
          <TouchableOpacity
            style={[styles.iconContainer, { paddingRight: padding.horizontal }]}
            onPress={onRightIconPress}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={rightIcon}
              size={getIconSize()}
              color={COLORS.gray || '#6B7280'}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Información adicional */}
      <View style={styles.infoContainer}>
        {error && (
          <Text style={[styles.errorText, { fontSize: scale(12) }]}>
            {error}
          </Text>
        )}

        {helperText && !error && (
          <Text style={[styles.helperText, { fontSize: scale(12) }]}>
            {helperText}
          </Text>
        )}

        {showCharacterCount && maxLength && (
          <Text style={[styles.characterCount, { fontSize: scale(11) }]}>
            {value?.length || 0}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: scale(6),
  },
  label: {
    fontWeight: '600',
    color: COLORS.white || '#ffffff',
    letterSpacing: 0.2,
  },
  floatingLabel: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: scale(1.5),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  focusedContainer: {
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorContainer: {
    shadowColor: COLORS.error || '#EF4444',
    shadowOpacity: 0.1,
  },
  disabledContainer: {
    backgroundColor: COLORS.lightGray || '#F3F4F6',
    opacity: 0.7,
  },
  input: {
    flex: 1,
    color: COLORS.darkGray || '#374151',
    fontWeight: '400',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scale(4),
    paddingHorizontal: scale(4),
  },
  errorText: {
    color: COLORS.error || '#EF4444',
    fontWeight: '500',
    flex: 1,
  },
  helperText: {
    color: COLORS.gray || '#6B7280',
    fontWeight: '400',
    flex: 1,
  },
  characterCount: {
    color: COLORS.gray || '#9CA3AF',
    fontWeight: '400',
    textAlign: 'right',
  },
});

export default Input;
