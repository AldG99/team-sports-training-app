import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPORTS, SPORT_STATS } from '../../utils/constants';

const PlayerComparison = ({
  player1 = null,
  player2 = null,
  sport = SPORTS.FUTBOL,
  onPlayerSelect = null,
  style = {},
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const stats = SPORT_STATS[sport] || [];

  const getStatValue = (player, stat) => {
    return player?.stats?.[stat] || 0;
  };

  const calculatePercentage = (value1, value2) => {
    const total = value1 + value2;
    if (total === 0) return 50;
    return (value1 / total) * 100;
  };

  const getBetterPlayer = stat => {
    if (!player1 || !player2) return null;
    const value1 = getStatValue(player1, stat);
    const value2 = getStatValue(player2, stat);

    if (value1 > value2) return 'player1';
    if (value2 > value1) return 'player2';
    return 'tie';
  };

  const getStatIcon = stat => {
    const icons = {
      goles: 'football',
      asistencias: 'hand-left',
      partidos_jugados: 'calendar',
      tarjetas_amarillas: 'warning',
      tarjetas_rojas: 'alert-circle',
      puntos: 'trophy',
      rebotes: 'refresh',
      robos: 'eye',
      touchdowns: 'flag',
      yardas: 'speedometer',
      tackles: 'shield',
      intercepciones: 'hand-right',
      aces: 'flash',
      bloqueos: 'hand-left',
      recepciones: 'checkmark-circle',
      sets_jugados: 'layers',
    };
    return icons[stat] || 'stats-chart';
  };

  const PlayerCard = ({ player, side }) => (
    <TouchableOpacity
      style={[
        styles.playerCard,
        selectedPlayer === side && styles.selectedPlayerCard,
      ]}
      onPress={() => {
        setSelectedPlayer(side);
        if (onPlayerSelect) {
          onPlayerSelect(player, side);
        }
      }}
    >
      {player ? (
        <>
          <Image
            source={{ uri: player.avatar || 'https://via.placeholder.com/80' }}
            style={styles.playerAvatar}
          />
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={styles.playerPosition}>{player.position}</Text>
          <Text style={styles.playerTeam}>{player.teamName}</Text>
          {player.isCaptain && (
            <View style={styles.captainBadge}>
              <Ionicons name="star" size={12} color={COLORS.white} />
              <Text style={styles.captainText}>Capitán</Text>
            </View>
          )}
        </>
      ) : (
        <View style={styles.emptyPlayer}>
          <Ionicons name="person-add" size={32} color={COLORS.gray} />
          <Text style={styles.emptyPlayerText}>Seleccionar Jugador</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const StatRow = ({ stat }) => {
    const value1 = getStatValue(player1, stat);
    const value2 = getStatValue(player2, stat);
    const betterPlayer = getBetterPlayer(stat);
    const percentage1 = calculatePercentage(value1, value2);
    const percentage2 = 100 - percentage1;

    return (
      <View style={styles.statRow}>
        <View style={styles.statHeader}>
          <Ionicons
            name={getStatIcon(stat)}
            size={16}
            color={COLORS.secondary}
          />
          <Text style={styles.statName}>
            {stat.replace('_', ' ').toUpperCase()}
          </Text>
        </View>

        <View style={styles.statComparison}>
          <View style={styles.statValueContainer}>
            <Text
              style={[
                styles.statValue,
                betterPlayer === 'player1' && styles.betterStatValue,
              ]}
            >
              {value1}
            </Text>
          </View>

          <View style={styles.statBarContainer}>
            <View style={styles.statBar}>
              <View
                style={[
                  styles.statBarFill,
                  styles.statBarLeft,
                  { width: `${percentage1}%` },
                  betterPlayer === 'player1' && styles.betterStatBar,
                ]}
              />
              <View
                style={[
                  styles.statBarFill,
                  styles.statBarRight,
                  { width: `${percentage2}%` },
                  betterPlayer === 'player2' && styles.betterStatBar,
                ]}
              />
            </View>
          </View>

          <View style={styles.statValueContainer}>
            <Text
              style={[
                styles.statValue,
                betterPlayer === 'player2' && styles.betterStatValue,
              ]}
            >
              {value2}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const OverallComparison = () => {
    if (!player1 || !player2) return null;

    let player1Wins = 0;
    let player2Wins = 0;
    let ties = 0;

    stats.forEach(stat => {
      const better = getBetterPlayer(stat);
      if (better === 'player1') player1Wins++;
      else if (better === 'player2') player2Wins++;
      else ties++;
    });

    const getWinner = () => {
      if (player1Wins > player2Wins) return player1;
      if (player2Wins > player1Wins) return player2;
      return null;
    };

    const winner = getWinner();

    return (
      <View style={styles.overallComparison}>
        <Text style={styles.overallTitle}>Comparación General</Text>
        <View style={styles.overallStats}>
          <View style={styles.overallStatItem}>
            <Text style={styles.overallStatValue}>{player1Wins}</Text>
            <Text style={styles.overallStatLabel}>
              Victorias {player1?.name}
            </Text>
          </View>
          <View style={styles.overallStatItem}>
            <Text style={styles.overallStatValue}>{ties}</Text>
            <Text style={styles.overallStatLabel}>Empates</Text>
          </View>
          <View style={styles.overallStatItem}>
            <Text style={styles.overallStatValue}>{player2Wins}</Text>
            <Text style={styles.overallStatLabel}>
              Victorias {player2?.name}
            </Text>
          </View>
        </View>
        {winner && (
          <View style={styles.winnerSection}>
            <Ionicons name="trophy" size={24} color={COLORS.secondary} />
            <Text style={styles.winnerText}>
              {winner.name} tiene mejores estadísticas generales
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>Comparación de Jugadores</Text>
        <Text style={styles.subtitle}>
          {sport.replace('_', ' ').toUpperCase()}
        </Text>
      </View>

      <View style={styles.playersContainer}>
        <PlayerCard player={player1} side="player1" />
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
        </View>
        <PlayerCard player={player2} side="player2" />
      </View>

      {player1 && player2 ? (
        <ScrollView
          style={styles.statsContainer}
          showsVerticalScrollIndicator={false}
        >
          <OverallComparison />

          <View style={styles.detailedStats}>
            <Text style={styles.detailedStatsTitle}>
              Estadísticas Detalladas
            </Text>
            {stats.map(stat => (
              <StatRow key={stat} stat={stat} />
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={64} color={COLORS.gray} />
          <Text style={styles.emptyStateTitle}>Selecciona dos jugadores</Text>
          <Text style={styles.emptyStateSubtitle}>
            Elige dos jugadores para comparar sus estadísticas
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  playersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  playerCard: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPlayerCard: {
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.white,
  },
  playerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.gray,
    marginBottom: 8,
  },
  playerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: 4,
  },
  playerPosition: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  playerTeam: {
    fontSize: 11,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 8,
  },
  captainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  captainText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: 2,
  },
  emptyPlayer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyPlayerText: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 8,
  },
  vsContainer: {
    width: 40,
    alignItems: 'center',
  },
  vsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  statsContainer: {
    flex: 1,
  },
  overallComparison: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  overallTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: 16,
  },
  overallStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  overallStatItem: {
    alignItems: 'center',
  },
  overallStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  overallStatLabel: {
    fontSize: 10,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 4,
  },
  winnerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.white,
  },
  winnerText: {
    fontSize: 14,
    color: COLORS.darkGray,
    fontWeight: '600',
    marginLeft: 8,
    textAlign: 'center',
  },
  detailedStats: {
    marginTop: 8,
  },
  detailedStatsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  statRow: {
    marginBottom: 20,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginLeft: 6,
  },
  statComparison: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValueContainer: {
    width: 40,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.gray,
  },
  betterStatValue: {
    color: COLORS.secondary,
  },
  statBarContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  statBar: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
  },
  statBarLeft: {
    backgroundColor: COLORS.primary,
  },
  statBarRight: {
    backgroundColor: COLORS.warning,
  },
  betterStatBar: {
    backgroundColor: COLORS.secondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
  },
});

export default PlayerComparison;
