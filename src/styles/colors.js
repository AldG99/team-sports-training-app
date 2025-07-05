import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Clipboard,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../utils/constants';

const Colors = ({ onColorSelect = null, showCopyOption = true }) => {
  const colorPalette = [
    {
      category: 'Principales',
      colors: [
        {
          name: 'Primary',
          value: COLORS.primary,
          description: 'Color principal de la marca',
        },
        {
          name: 'Secondary',
          value: COLORS.secondary,
          description: 'Color secundario/accent',
        },
        {
          name: 'Background',
          value: COLORS.background,
          description: 'Fondo principal de la app',
        },
      ],
    },
    {
      category: 'Neutros',
      colors: [
        { name: 'White', value: COLORS.white, description: 'Blanco puro' },
        { name: 'Black', value: COLORS.black, description: 'Negro puro' },
        {
          name: 'Light Gray',
          value: COLORS.lightGray,
          description: 'Gris claro para fondos',
        },
        {
          name: 'Gray',
          value: COLORS.gray,
          description: 'Gris medio para texto secundario',
        },
        {
          name: 'Dark Gray',
          value: COLORS.darkGray,
          description: 'Gris oscuro para texto principal',
        },
      ],
    },
    {
      category: 'Estados',
      colors: [
        {
          name: 'Success',
          value: COLORS.success,
          description: 'Color para estados exitosos',
        },
        {
          name: 'Error',
          value: COLORS.error,
          description: 'Color para errores y alertas',
        },
        {
          name: 'Warning',
          value: COLORS.warning,
          description: 'Color para advertencias',
        },
      ],
    },
    {
      category: 'Deportes',
      colors: [
        {
          name: 'Football Green',
          value: '#2E7D47',
          description: 'Verde para fútbol',
        },
        {
          name: 'Basketball Orange',
          value: '#FF8C00',
          description: 'Naranja para basquetbol',
        },
        {
          name: 'Volleyball Blue',
          value: '#1E90FF',
          description: 'Azul para voleibol',
        },
        {
          name: 'American Football Brown',
          value: '#8B4513',
          description: 'Café para fútbol americano',
        },
      ],
    },
    {
      category: 'Gradientes',
      colors: [
        {
          name: 'Primary Gradient',
          value: 'linear-gradient(135deg, #06597d 0%, #0a7ea4 100%)',
          description: 'Gradiente principal',
        },
        {
          name: 'Secondary Gradient',
          value: 'linear-gradient(135deg, #f8ac58 0%, #ffc107 100%)',
          description: 'Gradiente secundario',
        },
        {
          name: 'Success Gradient',
          value: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
          description: 'Gradiente de éxito',
        },
      ],
    },
    {
      category: 'Transparencias',
      colors: [
        {
          name: 'Overlay Dark',
          value: 'rgba(0, 0, 0, 0.5)',
          description: 'Overlay oscuro 50%',
        },
        {
          name: 'Overlay Light',
          value: 'rgba(255, 255, 255, 0.8)',
          description: 'Overlay claro 80%',
        },
        {
          name: 'Primary Alpha',
          value: 'rgba(6, 89, 125, 0.1)',
          description: 'Primary con 10% opacidad',
        },
        {
          name: 'Secondary Alpha',
          value: 'rgba(248, 172, 88, 0.2)',
          description: 'Secondary con 20% opacidad',
        },
      ],
    },
  ];

  const copyToClipboard = (colorValue, colorName) => {
    if (showCopyOption) {
      Clipboard.setString(colorValue);
      Alert.alert('Copiado', `Color ${colorName} copiado al portapapeles`);
    }
  };

  const getContrastColor = hexColor => {
    // Verificar si es un gradiente o rgba
    if (hexColor.includes('gradient') || hexColor.includes('rgba')) {
      return COLORS.white;
    }

    // Extraer valores RGB del hex
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calcular luminancia
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? COLORS.black : COLORS.white;
  };

  const isGradient = colorValue => {
    return colorValue.includes('gradient');
  };

  const isRGBA = colorValue => {
    return colorValue.includes('rgba');
  };

  const ColorItem = ({ color }) => {
    const textColor = getContrastColor(color.value);
    const isSpecialColor = isGradient(color.value) || isRGBA(color.value);

    return (
      <TouchableOpacity
        style={[
          styles.colorItem,
          {
            backgroundColor: isSpecialColor ? COLORS.lightGray : color.value,
            borderWidth: isSpecialColor ? 2 : 0,
            borderColor: COLORS.gray,
            borderStyle: isSpecialColor ? 'dashed' : 'solid',
          },
        ]}
        onPress={() => {
          if (onColorSelect) {
            onColorSelect(color);
          } else {
            copyToClipboard(color.value, color.name);
          }
        }}
        activeOpacity={0.8}
      >
        {isSpecialColor ? (
          <View style={styles.specialColorContent}>
            <Ionicons
              name={isGradient(color.value) ? 'color-palette' : 'eye-off'}
              size={24}
              color={COLORS.gray}
            />
            <Text style={[styles.colorName, { color: COLORS.darkGray }]}>
              {color.name}
            </Text>
          </View>
        ) : (
          <>
            <Text style={[styles.colorName, { color: textColor }]}>
              {color.name}
            </Text>
            <Text style={[styles.colorValue, { color: textColor }]}>
              {color.value}
            </Text>
          </>
        )}

        {showCopyOption && (
          <View style={[styles.copyIcon, { backgroundColor: textColor }]}>
            <Ionicons
              name="copy"
              size={12}
              color={isSpecialColor ? COLORS.white : color.value}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const ColorCategory = ({ category }) => (
    <View style={styles.categorySection}>
      <Text style={styles.categoryTitle}>{category.category}</Text>
      <View style={styles.colorsGrid}>
        {category.colors.map((color, index) => (
          <ColorItem key={index} color={color} />
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Paleta de Colores</Text>
        <Text style={styles.subtitle}>SportCampus Design System</Text>
      </View>

      {colorPalette.map((category, index) => (
        <ColorCategory key={index} category={category} />
      ))}

      <View style={styles.usageGuide}>
        <Text style={styles.guideTitle}>Guía de Uso</Text>

        <View style={styles.guideSection}>
          <Text style={styles.guideSubtitle}>Colores Principales</Text>
          <Text style={styles.guideText}>
            • <Text style={styles.colorReference}>Primary:</Text> Usar para
            headers, navegación principal y elementos importantes
          </Text>
          <Text style={styles.guideText}>
            • <Text style={styles.colorReference}>Secondary:</Text> Usar para
            botones de acción, enlaces y highlights
          </Text>
        </View>

        <View style={styles.guideSection}>
          <Text style={styles.guideSubtitle}>Colores de Estado</Text>
          <Text style={styles.guideText}>
            • <Text style={styles.colorReference}>Success:</Text>{' '}
            Confirmaciones, éxito en acciones
          </Text>
          <Text style={styles.guideText}>
            • <Text style={styles.colorReference}>Error:</Text> Errores,
            validaciones fallidas
          </Text>
          <Text style={styles.guideText}>
            • <Text style={styles.colorReference}>Warning:</Text> Advertencias,
            información importante
          </Text>
        </View>

        <View style={styles.guideSection}>
          <Text style={styles.guideSubtitle}>Texto y Fondos</Text>
          <Text style={styles.guideText}>
            • <Text style={styles.colorReference}>Dark Gray:</Text> Texto
            principal, títulos
          </Text>
          <Text style={styles.guideText}>
            • <Text style={styles.colorReference}>Gray:</Text> Texto secundario,
            subtítulos
          </Text>
          <Text style={styles.guideText}>
            • <Text style={styles.colorReference}>Light Gray:</Text> Fondos de
            secciones, separadores
          </Text>
        </View>

        <View style={styles.accessibilityNote}>
          <Ionicons
            name="information-circle"
            size={16}
            color={COLORS.secondary}
          />
          <Text style={styles.accessibilityText}>
            Todos los colores cumplen con estándares de accesibilidad WCAG 2.1
            AA
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Toca cualquier color para{' '}
          {onColorSelect ? 'seleccionarlo' : 'copiarlo al portapapeles'}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
  },
  categorySection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorItem: {
    width: '48%',
    height: 100,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  specialColorContent: {
    alignItems: 'center',
  },
  colorName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  colorValue: {
    fontSize: 11,
    textAlign: 'center',
    opacity: 0.8,
  },
  copyIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
  },
  usageGuide: {
    padding: 20,
    backgroundColor: COLORS.lightGray,
  },
  guideTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  guideSection: {
    marginBottom: 16,
  },
  guideSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  guideText: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
    marginBottom: 4,
  },
  colorReference: {
    fontWeight: '600',
    color: COLORS.secondary,
  },
  accessibilityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  accessibilityText: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
  },
});

export default Colors;
