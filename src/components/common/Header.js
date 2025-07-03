import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  return {
    horizontal: Math.max(scale(16), screenWidth * 0.04), // 4% del ancho
    bottom: Math.max(scale(12), screenHeight * 0.015), // 1.5% del alto
  };
};

const Header = ({
  title,
  subtitle = null,
  showBackButton = false,
  onBackPress = null,
  rightComponent = null,
  rightIcon = null,
  onRightPress = null,
  leftIcon = null,
  onLeftPress = null,
  style = {},
  titleStyle = {},
  variant = 'default', // 'default', 'compact', 'prominent'
  backgroundColor = null,
  statusBarStyle = 'light-content',
  elevation = true,
  centerTitle = true,
  transparent = false,
}) => {
  const insets = useSafeAreaInsets();
  const padding = getResponsivePadding();

  // Obtener altura del header según variante
  const getHeaderHeight = () => {
    const baseHeight = scale(56);

    switch (variant) {
      case 'compact':
        return baseHeight * 0.8;
      case 'prominent':
        return subtitle ? baseHeight * 1.8 : baseHeight * 1.4;
      default:
        return subtitle ? baseHeight * 1.3 : baseHeight;
    }
  };

  // Obtener tamaño de iconos responsivo
  const getIconSize = () => {
    switch (variant) {
      case 'compact':
        return scale(20);
      case 'prominent':
        return scale(26);
      default:
        return scale(24);
    }
  };

  // Obtener tamaño de título responsivo
  const getTitleSize = () => {
    switch (variant) {
      case 'compact':
        return scale(16);
      case 'prominent':
        return scale(22);
      default:
        return scale(18);
    }
  };

  // Obtener estilos de elevación
  const getElevationStyles = () => {
    if (!elevation || transparent) return {};

    return {
      shadowColor: COLORS.black || '#000000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 4,
    };
  };

  // Construcción de estilos del header
  const headerStyle = [
    styles.header,
    {
      paddingTop: Platform.OS === 'ios' ? insets.top : insets.top + scale(8),
      paddingBottom: padding.bottom,
      paddingHorizontal: padding.horizontal,
      minHeight:
        getHeaderHeight() +
        (Platform.OS === 'ios' ? insets.top : insets.top + scale(8)),
      backgroundColor: transparent
        ? 'transparent'
        : backgroundColor || COLORS.primary || '#1a1a2e',
    },
    getElevationStyles(),
    style,
  ];

  // Estilos del título
  const titleTextStyle = [
    styles.title,
    {
      fontSize: getTitleSize(),
      textAlign: centerTitle ? 'center' : 'left',
    },
    titleStyle,
  ];

  // Renderizar componente izquierdo
  const renderLeftComponent = () => {
    if (showBackButton || leftIcon) {
      const iconName = showBackButton ? 'arrow-back' : leftIcon;
      const onPress = showBackButton ? onBackPress : onLeftPress;

      return (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onPress}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={iconName}
            size={getIconSize()}
            color={COLORS.white || '#ffffff'}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  // Renderizar componente derecho
  const renderRightComponent = () => {
    if (rightComponent) {
      return rightComponent;
    }

    if (rightIcon) {
      return (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onRightPress}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={rightIcon}
            size={getIconSize()}
            color={COLORS.white || '#ffffff'}
          />
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={
          transparent ? 'transparent' : backgroundColor || COLORS.primary
        }
        translucent={transparent}
      />
      <View style={headerStyle}>
        <View style={styles.leftContainer}>{renderLeftComponent()}</View>

        <View
          style={[
            styles.centerContainer,
            !centerTitle && styles.leftAlignedCenter,
          ]}
        >
          <Text style={titleTextStyle} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        <View style={styles.rightContainer}>{renderRightComponent()}</View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1000,
  },
  leftContainer: {
    width: scale(44),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(8),
  },
  leftAlignedCenter: {
    alignItems: 'flex-start',
  },
  rightContainer: {
    width: scale(44),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  title: {
    fontWeight: '600',
    color: COLORS.white || '#ffffff',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: scale(12),
    color: COLORS.white || '#ffffff',
    opacity: 0.8,
    marginTop: scale(2),
    fontWeight: '400',
  },
  actionButton: {
    padding: scale(8),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: scale(40),
    minHeight: scale(40),
  },
});

export default Header;
