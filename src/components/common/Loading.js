/**
 * ========================================
 * ⏳ COMPONENTE LOADING - INDICADOR VERSÁTIL
 * ========================================
 * 
 * Indicador de carga versátil con múltiples variantes para SportCampus
 * 
 * Características principales:
 * ✅ 4 variantes de presentación: default, minimal, card, inline
 * ✅ 3 tipos de animación: fade, scale, bounce, none
 * ✅ Overlay modal con opacidad configurable
 * ✅ Tamaños responsivos automáticos por dispositivo
 * ✅ Indicadores personalizados según contexto
 * ✅ Animaciones fluidas con Animated API
 * ✅ Texto personalizable y opcional
 * 
 * Props principales:
 * @param {string} size - Tamaño: 'small'|'medium'|'large' o número
 * @param {string} color - Color personalizado del indicador
 * @param {string} text - Texto a mostrar
 * @param {boolean} showText - Mostrar o ocultar texto
 * @param {boolean} overlay - Activar overlay modal
 * @param {string} variant - Tipo: 'default'|'minimal'|'card'|'inline'
 * @param {string} animation - Animación: 'fade'|'scale'|'bounce'|'none'
 * @param {number} overlayOpacity - Opacidad del overlay (0-1)
 * @param {number} duration - Duración animación bounce
 * 
 * Ejemplo de uso:
 * <Loading 
 *   variant="card"
 *   animation="scale"
 *   text="Cargando torneos..."
 *   overlay={true}
 *   overlayOpacity={0.7}
 * />
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
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

const Loading = ({
  size = 'large',
  color = null,
  text = 'Cargando...',
  showText = true,
  overlay = false,
  variant = 'default', // 'default', 'minimal', 'card', 'inline'
  animation = 'fade', // 'fade', 'scale', 'bounce', 'none'
  style = {},
  textStyle = {},
  backgroundColor = null,
  overlayOpacity = 0.5,
  duration = 800,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  // Color por defecto responsivo
  const getDefaultColor = () => {
    return color || COLORS.secondary || '#4CAF50';
  };

  // Tamaño responsivo del indicador
  const getResponsiveSize = () => {
    if (typeof size === 'string') {
      switch (size) {
        case 'small':
          return scale(20);
        case 'large':
          return scale(36);
        default: // 'medium'
          return scale(28);
      }
    }
    return scale(size);
  };

  // Tamaño de texto responsivo
  const getTextSize = () => {
    switch (variant) {
      case 'minimal':
        return scale(12);
      case 'card':
        return scale(14);
      case 'inline':
        return scale(13);
      default:
        return scale(16);
    }
  };

  // Espaciado responsivo
  const getSpacing = () => {
    switch (variant) {
      case 'minimal':
        return scale(8);
      case 'card':
        return scale(12);
      case 'inline':
        return scale(6);
      default:
        return scale(16);
    }
  };

  // Animaciones de entrada
  useEffect(() => {
    const animations = [];

    if (animation === 'fade') {
      animations.push(
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      );
    }

    if (animation === 'scale') {
      animations.push(
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        })
      );
    }

    if (animation === 'bounce') {
      const bounceSequence = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -10,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ])
      );
      bounceSequence.start();
      return () => bounceSequence.stop();
    }

    if (animations.length > 0) {
      Animated.parallel(animations).start();
    }
  }, [animation, fadeAnim, scaleAnim, bounceAnim, duration]);

  // Estilos del contenedor según variante
  const getContainerStyle = () => {
    const baseStyle = [styles.container];

    switch (variant) {
      case 'minimal':
        baseStyle.push(styles.minimalContainer);
        break;
      case 'card':
        baseStyle.push(styles.cardContainer);
        break;
      case 'inline':
        baseStyle.push(styles.inlineContainer);
        break;
      default:
        baseStyle.push(styles.defaultContainer);
    }

    if (overlay) {
      baseStyle.push([
        styles.overlay,
        {
          backgroundColor:
            backgroundColor || `rgba(0, 0, 0, ${overlayOpacity})`,
        },
      ]);
    }

    // Aplicar animaciones
    const animationStyle = {};
    if (animation === 'fade') {
      animationStyle.opacity = fadeAnim;
    }
    if (animation === 'scale') {
      animationStyle.transform = [{ scale: scaleAnim }];
    }

    return [...baseStyle, animationStyle, style];
  };

  // Estilos del contenido
  const getContentStyle = () => {
    const baseStyle = [styles.content];

    if (variant === 'inline') {
      baseStyle.push(styles.inlineContent);
    }

    if (animation === 'bounce') {
      baseStyle.push({
        transform: [{ translateY: bounceAnim }],
      });
    }

    return baseStyle;
  };

  // Estilos del texto
  const getTextStyle = () => {
    return [
      styles.text,
      {
        color: getDefaultColor(),
        fontSize: getTextSize(),
        marginTop: variant === 'inline' ? 0 : getSpacing(),
        marginLeft: variant === 'inline' ? getSpacing() : 0,
      },
      textStyle,
    ];
  };

  // Renderizar indicador personalizado para variante card
  const renderIndicator = () => {
    if (variant === 'card') {
      return (
        <View style={styles.cardIndicator}>
          <ActivityIndicator
            size={getResponsiveSize()}
            color={getDefaultColor()}
          />
        </View>
      );
    }

    return (
      <ActivityIndicator
        size={typeof size === 'string' ? size : 'large'}
        color={getDefaultColor()}
      />
    );
  };

  return (
    <Animated.View style={getContainerStyle()}>
      <Animated.View style={getContentStyle()}>
        {renderIndicator()}
        {showText && (
          <Text style={getTextStyle()} numberOfLines={2}>
            {text}
          </Text>
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  minimalContainer: {
    padding: scale(16),
    backgroundColor: 'transparent',
  },
  cardContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: scale(12),
    margin: scale(20),
    padding: scale(24),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIndicator: {
    padding: scale(12),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: scale(50),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: scale(20),
  },
});

export default Loading;
