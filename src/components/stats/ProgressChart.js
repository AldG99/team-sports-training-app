import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { COLORS } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';

const { width: screenWidth } = Dimensions.get('window');

const ProgressChart = ({
  data = [],
  type = 'line',
  title = 'Progreso',
  statKey = 'value',
  period = 'month',
  showPeriodSelector = true,
  style = {},
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const [selectedChartType, setSelectedChartType] = useState(type);

  const periods = [
    { id: 'week', name: 'Semana', icon: 'calendar' },
    { id: 'month', name: 'Mes', icon: 'calendar' },
    { id: 'quarter', name: 'Trimestre', icon: 'calendar' },
    { id: 'year', name: 'Año', icon: 'calendar' },
  ];

  const chartTypes = [
    { id: 'line', name: 'Línea', icon: 'trending-up' },
    { id: 'bar', name: 'Barras', icon: 'bar-chart' },
    { id: 'pie', name: 'Circular', icon: 'pie-chart' },
  ];

  const chartConfig = {
    backgroundGradientFrom: COLORS.white,
    backgroundGradientTo: COLORS.white,
    color: (opacity = 1) => `rgba(248, 172, 88, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: COLORS.secondary,
    },
  };

  const processData = () => {
    if (!data || data.length === 0) {
      return {
        labels: ['Sin datos'],
        datasets: [{ data: [0] }],
      };
    }

    // Filtrar datos por período
    const now = new Date();
    let filteredData = data;

    switch (selectedPeriod) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredData = data.filter(item => new Date(item.date) >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        filteredData = data.filter(item => new Date(item.date) >= monthAgo);
        break;
      case 'quarter':
        const quarterAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 3,
          now.getDate()
        );
        filteredData = data.filter(item => new Date(item.date) >= quarterAgo);
        break;
      case 'year':
        const yearAgo = new Date(
          now.getFullYear() - 1,
          now.getMonth(),
          now.getDate()
        );
        filteredData = data.filter(item => new Date(item.date) >= yearAgo);
        break;
    }

    // Agrupar datos por período
    const groupedData = {};

    filteredData.forEach(item => {
      let key;
      const date = new Date(item.date);

      switch (selectedPeriod) {
        case 'week':
          key = date.toLocaleDateString('es-ES', { weekday: 'short' });
          break;
        case 'month':
          key = date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
          });
          break;
        case 'quarter':
        case 'year':
          key = date.toLocaleDateString('es-ES', { month: 'short' });
          break;
        default:
          key = formatDate(date);
      }

      if (!groupedData[key]) {
        groupedData[key] = [];
      }
      groupedData[key].push(item[statKey] || 0);
    });

    // Calcular promedios o sumas
    const labels = Object.keys(groupedData);
    const values = labels.map(label => {
      const values = groupedData[label];
      return values.reduce((sum, val) => sum + val, 0) / values.length;
    });

    return {
      labels,
      datasets: [
        {
          data: values.length > 0 ? values : [0],
          color: () => COLORS.secondary,
        },
      ],
    };
  };

  const processPieData = () => {
    if (!data || data.length === 0) return [];

    const groupedData = {};

    data.forEach(item => {
      const category = item.category || 'Sin categoría';
      if (!groupedData[category]) {
        groupedData[category] = 0;
      }
      groupedData[category] += item[statKey] || 0;
    });

    const colors = [
      COLORS.secondary,
      COLORS.primary,
      COLORS.success,
      COLORS.warning,
      COLORS.error,
    ];

    return Object.keys(groupedData).map((key, index) => ({
      name: key,
      population: groupedData[key],
      color: colors[index % colors.length],
      legendFontColor: COLORS.darkGray,
      legendFontSize: 12,
    }));
  };

  const getChartHeight = () => {
    switch (selectedChartType) {
      case 'pie':
        return 220;
      case 'bar':
        return 250;
      default:
        return 220;
    }
  };

  const renderChart = () => {
    const chartData = processData();
    const chartWidth = screenWidth - 64;
    const chartHeight = getChartHeight();

    if (chartData.datasets[0].data.every(val => val === 0)) {
      return (
        <View style={styles.noDataContainer}>
          <Ionicons name="analytics-outline" size={48} color={COLORS.gray} />
          <Text style={styles.noDataText}>No hay datos para mostrar</Text>
        </View>
      );
    }

    switch (selectedChartType) {
      case 'bar':
        return (
          <BarChart
            data={chartData}
            width={chartWidth}
            height={chartHeight}
            chartConfig={chartConfig}
            style={styles.chart}
            verticalLabelRotation={30}
            showValuesOnTopOfBars
          />
        );
      case 'pie':
        const pieData = processPieData();
        if (pieData.length === 0) {
          return (
            <View style={styles.noDataContainer}>
              <Ionicons
                name="analytics-outline"
                size={48}
                color={COLORS.gray}
              />
              <Text style={styles.noDataText}>No hay datos para mostrar</Text>
            </View>
          );
        }
        return (
          <PieChart
            data={pieData}
            width={chartWidth}
            height={chartHeight}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        );
      default: // line
        return (
          <LineChart
            data={chartData}
            width={chartWidth}
            height={chartHeight}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withDots={true}
            withInnerLines={false}
            withOuterLines={true}
            withVerticalLabels={true}
            withHorizontalLabels={true}
          />
        );
    }
  };

  const getStats = () => {
    if (!data || data.length === 0) return null;

    const values = data.map(item => item[statKey] || 0);
    const total = values.reduce((sum, val) => sum + val, 0);
    const average = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    // Calcular tendencia (últimos vs primeros valores)
    const recentValues = values.slice(-3);
    const oldValues = values.slice(0, 3);
    const recentAvg =
      recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length;
    const oldAvg =
      oldValues.reduce((sum, val) => sum + val, 0) / oldValues.length;
    const trend =
      recentAvg > oldAvg ? 'up' : recentAvg < oldAvg ? 'down' : 'stable';

    return {
      total: total.toFixed(1),
      average: average.toFixed(1),
      max: max.toFixed(1),
      min: min.toFixed(1),
      trend,
    };
  };

  const stats = getStats();

  const PeriodSelector = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.selectorContainer}
    >
      {periods.map(p => (
        <TouchableOpacity
          key={p.id}
          style={[
            styles.selectorOption,
            selectedPeriod === p.id && styles.selectedOption,
          ]}
          onPress={() => setSelectedPeriod(p.id)}
        >
          <Ionicons
            name={p.icon}
            size={16}
            color={selectedPeriod === p.id ? COLORS.white : COLORS.darkGray}
          />
          <Text
            style={[
              styles.selectorText,
              selectedPeriod === p.id && styles.selectedSelectorText,
            ]}
          >
            {p.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const ChartTypeSelector = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.selectorContainer}
    >
      {chartTypes.map(ct => (
        <TouchableOpacity
          key={ct.id}
          style={[
            styles.selectorOption,
            selectedChartType === ct.id && styles.selectedOption,
          ]}
          onPress={() => setSelectedChartType(ct.id)}
        >
          <Ionicons
            name={ct.icon}
            size={16}
            color={selectedChartType === ct.id ? COLORS.white : COLORS.darkGray}
          />
          <Text
            style={[
              styles.selectorText,
              selectedChartType === ct.id && styles.selectedSelectorText,
            ]}
          >
            {ct.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const StatsOverview = () => {
    if (!stats) return null;

    return (
      <View style={styles.statsOverview}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.average}</Text>
          <Text style={styles.statLabel}>Promedio</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.max}</Text>
          <Text style={styles.statLabel}>Máximo</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.min}</Text>
          <Text style={styles.statLabel}>Mínimo</Text>
        </View>
        <View style={styles.statItem}>
          <View style={styles.trendContainer}>
            <Ionicons
              name={
                stats.trend === 'up'
                  ? 'trending-up'
                  : stats.trend === 'down'
                  ? 'trending-down'
                  : 'remove'
              }
              size={20}
              color={
                stats.trend === 'up'
                  ? COLORS.success
                  : stats.trend === 'down'
                  ? COLORS.error
                  : COLORS.gray
              }
            />
          </View>
          <Text style={styles.statLabel}>Tendencia</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>
          {statKey.replace('_', ' ').toUpperCase()}
        </Text>
      </View>

      {showPeriodSelector && (
        <View style={styles.selectorSection}>
          <Text style={styles.selectorTitle}>Período</Text>
          <PeriodSelector />
        </View>
      )}

      <View style={styles.selectorSection}>
        <Text style={styles.selectorTitle}>Tipo de Gráfico</Text>
        <ChartTypeSelector />
      </View>

      <StatsOverview />

      <View style={styles.chartContainer}>{renderChart()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  selectorSection: {
    marginBottom: 16,
  },
  selectorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  selectorContainer: {
    paddingVertical: 4,
  },
  selectorOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  selectedOption: {
    backgroundColor: COLORS.secondary,
  },
  selectorText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.darkGray,
    marginLeft: 4,
  },
  selectedSelectorText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  statsOverview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.gray,
    marginTop: 2,
  },
  trendContainer: {
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  noDataContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 8,
  },
});

export default ProgressChart;
