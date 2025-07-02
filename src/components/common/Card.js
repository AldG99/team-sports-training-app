import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
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
      return Math.max(scale(8), basePadding * 0.5);
    case 'comfortable':
      return Math.max(scale(20), basePadding * 1.25);
    case 'spacious':
      return Math.max(scale(24), basePadding * 1.5);
    default: // 'default'
      return Math.max(scale(16), basePadding);
  }
};

// Función para obtener margin responsivo
const getResponsiveMargin = () => {
  return {
    vertical: Math.max(scale(6), screenHeight * 0.008), // 0.8% del alto
    horizontal: Math.max(scale(12), screenWidth * 0.03), // 3% del ancho
  };
};

const Card = ({
  children,
  style = {},
  onPress = null,
  disabled = false,
  elevated = true,
  variant = 'default', // 'compact', 'default', 'comfortable', 'spacious'
  elevationLevel = 'medium', // 'low', 'medium', 'high', 'none'
  borderRadius = 'medium', // 'small', 'medium', 'large', 'xlarge'
  fullWidth = false,
  backgroundColor = null,
  borderColor = null,
  borderWidth = 0,
}) => {
  const margin = getResponsiveMargin();
  const padding = getResponsivePadding(variant);

  // Obtener radio de borde responsivo
  const getBorderRadius = () => {
    switch (borderRadius) {
      case 'small':
        return scale(8);
      case 'large':
        return scale(16);
      case 'xlarge':
        return scale(20);
      default: // 'medium'
        return scale(12);
    }
  };

  // Obtener estilos de elevación
  const getElevationStyles = () => {
    if (!elevated || elevationLevel === 'none') return {};

    const elevationConfig = {
      low: {
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
      },
      medium: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 4,
      },
      high: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.16,
        shadowRadius: 8,
        elevation: 8,
      },
    };

    return {
      shadowColor: COLORS.black || '#000000',
      ...elevationConfig[elevationLevel],
    };
  };

  // Construcción de estilos
  const cardStyle = [
    styles.card,
    {
      borderRadius: getBorderRadius(),
      padding: padding,
      marginVertical: margin.vertical,
      marginHorizontal: fullWidth ? 0 : margin.horizontal,
    },
    getElevationStyles(),
    backgroundColor && { backgroundColor },
    borderColor &&
      borderWidth > 0 && {
        borderColor,
        borderWidth: scale(borderWidth),
      },
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  // Estilos para estado interactivo
  const getActiveOpacity = () => {
    if (disabled) return 1;
    return elevationLevel === 'high' ? 0.9 : 0.85;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={getActiveOpacity()}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white || '#ffffff',
    // Bordes y espaciado se manejan dinámicamente
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Card;
