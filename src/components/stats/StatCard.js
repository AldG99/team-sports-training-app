import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../utils/constants';

const StatCard = ({
  title,
  value,
  icon = 'stats-chart',
  subtitle = null,
  trend = null,
  trendValue = null,
  color = COLORS.secondary,
  size = 'medium',
  onPress = null,
  style = {},
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.smallContainer,
          value: styles.smallValue,
          title: styles.smallTitle,
          icon: 16,
        };
      case 'large':
        return {
          container: styles.largeContainer,
          value: styles.largeValue,
          title: styles.largeTitle,
          icon: 32,
        };
      default:
        return {
          container: styles.mediumContainer,
          value: styles.mediumValue,
          title: styles.mediumTitle,
          icon: 24,
        };
    }
  };

  const getTrendColor = () => {
    if (!trend) return COLORS.gray;
    switch (trend) {
      case 'up':
        return COLORS.success;
      case 'down':
        return COLORS.error;
      default:
        return COLORS.gray;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      case 'stable':
        return 'remove';
      default:
        return null;
    }
  };

  const formatValue = val => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return (val / 1000000).toFixed(1) + 'M';
      } else if (val >= 1000) {
        return (val / 1000).toFixed(1) + 'K';
      }
      return val.toLocaleString();
    }
    return val;
  };

  const sizeStyles = getSizeStyles();
  const trendColor = getTrendColor();
  const trendIcon = getTrendIcon();

  const content = (
    <View style={[styles.container, sizeStyles.container, style]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <Ionicons name={icon} size={sizeStyles.icon} color={COLORS.white} />
        </View>
        {trend && trendIcon && (
          <View style={styles.trendContainer}>
            <Ionicons name={trendIcon} size={16} color={trendColor} />
            {trendValue && (
              <Text style={[styles.trendValue, { color: trendColor }]}>
                {trendValue}
              </Text>
            )}
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={[styles.value, sizeStyles.value, { color }]}>
          {formatValue(value)}
        </Text>
        <Text style={[styles.title, sizeStyles.title]}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={styles.touchable}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 12,
  },
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  smallContainer: {
    padding: 12,
  },
  mediumContainer: {
    padding: 16,
  },
  largeContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendValue: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    alignItems: 'flex-start',
  },
  value: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  smallValue: {
    fontSize: 18,
  },
  mediumValue: {
    fontSize: 24,
  },
  largeValue: {
    fontSize: 32,
  },
  title: {
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  smallTitle: {
    fontSize: 12,
  },
  mediumTitle: {
    fontSize: 14,
  },
  largeTitle: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
});

export default StatCard;
