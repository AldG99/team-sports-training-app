import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { COLORS, SPORTS } from '../../utils/constants';
import { globalStyles } from '../../styles/globalStyles';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import { formatDate, formatNumber } from '../../utils/helpers';

const { width: screenWidth } = Dimensions.get('window');

const Reports = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [reportData, setReportData] = useState({});

  const periods = [
    { id: 'week', name: 'Semana', icon: 'calendar' },
    { id: 'month', name: 'Mes', icon: 'calendar' },
    { id: 'semester', name: 'Semestre', icon: 'calendar' },
    { id: 'year', name: 'Año', icon: 'calendar' },
  ];

  useEffect(() => {
    loadReportData();
  }, [selectedPeriod]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      // Simular carga de datos de reportes
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockData = {
        userGrowth: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
          datasets: [
            {
              data: [45, 62, 78, 95, 112, 134],
              color: () => COLORS.secondary,
            },
          ],
        },
        sportsDistribution: [
          {
            name: 'Fútbol',
            population: 35,
            color: '#FF6384',
            legendFontColor: COLORS.darkGray,
          },
          {
            name: 'Basquetbol',
            population: 28,
            color: '#36A2EB',
            legendFontColor: COLORS.darkGray,
          },
          {
            name: 'Voleibol',
            population: 22,
            color: '#FFCE56',
            legendFontColor: COLORS.darkGray,
          },
          {
            name: 'Fútbol Americano',
            population: 15,
            color: '#4BC0C0',
            legendFontColor: COLORS.darkGray,
          },
        ],
        tournamentActivity: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
          datasets: [
            {
              data: [3, 5, 4, 7, 6, 8],
              color: () => COLORS.primary,
            },
          ],
        },
        topMetrics: {
          totalUsers: 1247,
          activeUsers: 892,
          totalTeams: 68,
          activeTournaments: 5,
          totalMatches: 234,
          completedMatches: 198,
          photosUploaded: 1543,
          avgPhotosPerEvent: 12.4,
        },
        facultyRanking: [
          { name: 'Ingeniería', teams: 18, users: 234, wins: 145 },
          { name: 'Medicina', teams: 14, users: 189, wins: 123 },
          { name: 'Derecho', teams: 12, users: 156, wins: 98 },
          { name: 'Economía', teams: 10, users: 134, wins: 87 },
          { name: 'Psicología', teams: 8, users: 112, wins: 76 },
          { name: 'Arquitectura', teams: 6, users: 98, wins: 54 },
        ],
        recentActivity: [
          { type: 'tournament_completed', count: 3, trend: '+15%' },
          { type: 'new_registrations', count: 47, trend: '+23%' },
          { type: 'matches_played', count: 28, trend: '+8%' },
          { type: 'photos_uploaded', count: 156, trend: '+31%' },
        ],
      };

      setReportData(mockData);
    } catch (error) {
      console.error('Error loading report data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del reporte');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReportData();
    setRefreshing(false);
  };

  const exportReport = () => {
    Alert.alert('Exportar Reporte', 'Selecciona el formato de exportación:', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'PDF', onPress: () => exportToPDF() },
      { text: 'Excel', onPress: () => exportToExcel() },
    ]);
  };

  const exportToPDF = () => {
    Alert.alert('Exportar PDF', 'Funcionalidad próximamente disponible');
  };

  const exportToExcel = () => {
    Alert.alert('Exportar Excel', 'Funcionalidad próximamente disponible');
  };

  const chartConfig = {
    backgroundGradientFrom: COLORS.white,
    backgroundGradientTo: COLORS.white,
    color: (opacity = 1) => `rgba(6, 89, 125, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  const PeriodSelector = () => (
    <Card style={styles.periodCard}>
      <Text style={styles.cardTitle}>Período de Análisis</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.periodScroll}
      >
        {periods.map(period => (
          <TouchableOpacity
            key={period.id}
            style={[
              styles.periodOption,
              selectedPeriod === period.id && styles.selectedPeriod,
            ]}
            onPress={() => setSelectedPeriod(period.id)}
          >
            <Ionicons
              name={period.icon}
              size={20}
              color={
                selectedPeriod === period.id ? COLORS.white : COLORS.darkGray
              }
            />
            <Text
              style={[
                styles.periodText,
                selectedPeriod === period.id && styles.selectedPeriodText,
              ]}
            >
              {period.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Card>
  );

  const MetricsOverview = () => (
    <Card style={styles.metricsCard}>
      <Text style={styles.cardTitle}>Métricas Principales</Text>
      <View style={styles.metricsGrid}>
        <View style={styles.metricItem}>
          <Ionicons name="people" size={24} color={COLORS.secondary} />
          <Text style={styles.metricValue}>
            {formatNumber(reportData.topMetrics?.totalUsers)}
          </Text>
          <Text style={styles.metricLabel}>Usuarios Totales</Text>
        </View>

        <View style={styles.metricItem}>
          <Ionicons name="pulse" size={24} color={COLORS.success} />
          <Text style={styles.metricValue}>
            {formatNumber(reportData.topMetrics?.activeUsers)}
          </Text>
          <Text style={styles.metricLabel}>Usuarios Activos</Text>
        </View>

        <View style={styles.metricItem}>
          <Ionicons name="shield" size={24} color={COLORS.primary} />
          <Text style={styles.metricValue}>
            {reportData.topMetrics?.totalTeams}
          </Text>
          <Text style={styles.metricLabel}>Equipos</Text>
        </View>

        <View style={styles.metricItem}>
          <Ionicons name="trophy" size={24} color={COLORS.warning} />
          <Text style={styles.metricValue}>
            {reportData.topMetrics?.activeTournaments}
          </Text>
          <Text style={styles.metricLabel}>Torneos Activos</Text>
        </View>
      </View>
    </Card>
  );

  const UserGrowthChart = () => (
    <Card style={styles.chartCard}>
      <Text style={styles.cardTitle}>Crecimiento de Usuarios</Text>
      {reportData.userGrowth && (
        <LineChart
          data={reportData.userGrowth}
          width={screenWidth - 64}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      )}
    </Card>
  );

  const SportsDistributionChart = () => (
    <Card style={styles.chartCard}>
      <Text style={styles.cardTitle}>Distribución por Deportes</Text>
      {reportData.sportsDistribution && (
        <PieChart
          data={reportData.sportsDistribution}
          width={screenWidth - 64}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
      )}
    </Card>
  );

  const FacultyRanking = () => (
    <Card style={styles.rankingCard}>
      <Text style={styles.cardTitle}>Ranking por Facultades</Text>
      {reportData.facultyRanking?.map((faculty, index) => (
        <View key={faculty.name} style={styles.rankingRow}>
          <View style={styles.rankingPosition}>
            <Text style={styles.positionNumber}>#{index + 1}</Text>
          </View>
          <View style={styles.facultyInfo}>
            <Text style={styles.facultyName}>{faculty.name}</Text>
            <Text style={styles.facultyStats}>
              {faculty.teams} equipos • {faculty.users} usuarios
            </Text>
          </View>
          <View style={styles.facultyWins}>
            <Text style={styles.winsNumber}>{faculty.wins}</Text>
            <Text style={styles.winsLabel}>victorias</Text>
          </View>
        </View>
      ))}
    </Card>
  );

  const ActivitySummary = () => (
    <Card style={styles.activityCard}>
      <Text style={styles.cardTitle}>Resumen de Actividad</Text>
      {reportData.recentActivity?.map((activity, index) => (
        <View key={index} style={styles.activityRow}>
          <View style={styles.activityIcon}>
            <Ionicons
              name={
                activity.type === 'tournament_completed'
                  ? 'trophy'
                  : activity.type === 'new_registrations'
                  ? 'person-add'
                  : activity.type === 'matches_played'
                  ? 'football'
                  : 'camera'
              }
              size={20}
              color={COLORS.secondary}
            />
          </View>
          <View style={styles.activityInfo}>
            <Text style={styles.activityCount}>{activity.count}</Text>
            <Text style={styles.activityType}>
              {activity.type === 'tournament_completed'
                ? 'Torneos Completados'
                : activity.type === 'new_registrations'
                ? 'Nuevos Registros'
                : activity.type === 'matches_played'
                ? 'Partidos Jugados'
                : 'Fotos Subidas'}
            </Text>
          </View>
          <View style={styles.activityTrend}>
            <Text
              style={[
                styles.trendText,
                {
                  color: activity.trend.includes('+')
                    ? COLORS.success
                    : COLORS.error,
                },
              ]}
            >
              {activity.trend}
            </Text>
          </View>
        </View>
      ))}
    </Card>
  );

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Header
          title="Reportes"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <Loading />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Header
        title="Reportes"
        showBackButton
        onBackPress={() => navigation.goBack()}
        rightIcon="download-outline"
        onRightPress={exportReport}
      />

      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Selector de Período */}
        <PeriodSelector />

        {/* Métricas Principales */}
        <MetricsOverview />

        {/* Gráfico de Crecimiento */}
        <UserGrowthChart />

        {/* Distribución por Deportes */}
        <SportsDistributionChart />

        {/* Ranking de Facultades */}
        <FacultyRanking />

        {/* Resumen de Actividad */}
        <ActivitySummary />

        {/* Acciones */}
        <Card style={styles.actionsCard}>
          <Text style={styles.cardTitle}>Acciones</Text>
          <View style={styles.actionsGrid}>
            <Button
              title="Exportar PDF"
              type="outline"
              icon="document-text"
              onPress={exportToPDF}
              style={styles.actionButton}
            />
            <Button
              title="Exportar Excel"
              type="outline"
              icon="grid"
              onPress={exportToExcel}
              style={styles.actionButton}
            />
          </View>

          <Button
            title="Generar Reporte Completo"
            icon="bar-chart"
            onPress={() =>
              Alert.alert('Reporte', 'Generando reporte completo...')
            }
            style={styles.fullReportButton}
          />
        </Card>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  periodCard: {
    margin: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  periodScroll: {
    paddingVertical: 8,
  },
  periodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  selectedPeriod: {
    backgroundColor: COLORS.secondary,
  },
  periodText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginLeft: 8,
    fontWeight: '500',
  },
  selectedPeriodText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  metricsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    paddingVertical: 16,
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
    textAlign: 'center',
  },
  chartCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  chart: {
    borderRadius: 8,
  },
  rankingCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  rankingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  rankingPosition: {
    width: 40,
    alignItems: 'center',
  },
  positionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  facultyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  facultyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  facultyStats: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  facultyWins: {
    alignItems: 'center',
  },
  winsNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  winsLabel: {
    fontSize: 11,
    color: COLORS.gray,
  },
  activityCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  activityCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  activityType: {
    fontSize: 14,
    color: COLORS.gray,
  },
  activityTrend: {
    alignItems: 'center',
  },
  trendText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 6,
  },
  fullReportButton: {
    marginTop: 8,
  },
  bottomPadding: {
    height: 20,
  },
});

export default Reports;
