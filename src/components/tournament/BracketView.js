import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../utils/constants';

const { width: screenWidth } = Dimensions.get('window');

const BracketView = ({
  bracket,
  onMatchPress = null,
  editable = false,
  style = {},
}) => {
  const [selectedMatch, setSelectedMatch] = useState(null);

  if (!bracket || !bracket.rounds) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.emptyState}>
          <Ionicons name="git-branch-outline" size={64} color={COLORS.gray} />
          <Text style={styles.emptyText}>No hay bracket disponible</Text>
          <Text style={styles.emptySubtext}>
            El bracket se generará cuando haya suficientes equipos
          </Text>
        </View>
      </View>
    );
  }

  const handleMatchPress = match => {
    setSelectedMatch(match);
    if (onMatchPress) {
      onMatchPress(match);
    }
  };

  const getRoundName = (roundNumber, totalRounds) => {
    const roundNames = {
      1:
        totalRounds === 1
          ? 'Final'
          : totalRounds === 2
          ? 'Semifinal'
          : totalRounds === 3
          ? 'Cuartos'
          : totalRounds === 4
          ? 'Octavos'
          : `Ronda ${roundNumber}`,
      2:
        totalRounds === 2
          ? 'Final'
          : totalRounds === 3
          ? 'Semifinal'
          : totalRounds === 4
          ? 'Cuartos'
          : `Ronda ${roundNumber}`,
      3:
        totalRounds === 3
          ? 'Final'
          : totalRounds === 4
          ? 'Semifinal'
          : `Ronda ${roundNumber}`,
      4: totalRounds === 4 ? 'Final' : `Ronda ${roundNumber}`,
    };

    return roundNames[roundNumber] || `Ronda ${roundNumber}`;
  };

  const MatchCard = ({ match, roundNumber, totalRounds }) => {
    const isSelected = selectedMatch?.id === match.id;
    const isCompleted = match.completed;
    const hasTeams = match.homeTeam && match.awayTeam;

    return (
      <TouchableOpacity
        style={[
          styles.matchCard,
          isSelected && styles.selectedMatch,
          isCompleted && styles.completedMatch,
          !hasTeams && styles.pendingMatch,
        ]}
        onPress={() => handleMatchPress(match)}
        disabled={!hasTeams && !editable}
      >
        <View style={styles.matchHeader}>
          <Text style={styles.matchId}>#{match.id.split('_').pop()}</Text>
          {isCompleted && (
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={COLORS.success}
            />
          )}
        </View>

        <View style={styles.teamsContainer}>
          <View style={styles.teamRow}>
            <Text
              style={[
                styles.teamName,
                match.winner?.id === match.homeTeam?.id && styles.winnerTeam,
              ]}
            >
              {match.homeTeam?.name || 'TBD'}
            </Text>
            {isCompleted && match.result && (
              <Text style={styles.score}>{match.result.homeScore}</Text>
            )}
          </View>

          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>VS</Text>
          </View>

          <View style={styles.teamRow}>
            <Text
              style={[
                styles.teamName,
                match.winner?.id === match.awayTeam?.id && styles.winnerTeam,
              ]}
            >
              {match.awayTeam?.name || 'TBD'}
            </Text>
            {isCompleted && match.result && (
              <Text style={styles.score}>{match.result.awayScore}</Text>
            )}
          </View>
        </View>

        {match.scheduledDate && (
          <View style={styles.matchFooter}>
            <Ionicons name="calendar" size={12} color={COLORS.gray} />
            <Text style={styles.matchDate}>
              {new Date(match.scheduledDate).toLocaleDateString('es-ES', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        )}

        {!hasTeams && (
          <View style={styles.pendingOverlay}>
            <Text style={styles.pendingText}>Pendiente</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const RoundColumn = ({ round, roundIndex, totalRounds }) => {
    const roundName = getRoundName(
      round[0]?.round || roundIndex + 1,
      totalRounds
    );

    return (
      <View style={styles.roundColumn}>
        <View style={styles.roundHeader}>
          <Text style={styles.roundTitle}>{roundName}</Text>
          <Text style={styles.roundSubtitle}>
            {round.length} {round.length === 1 ? 'partido' : 'partidos'}
          </Text>
        </View>

        <View style={styles.matchesContainer}>
          {round.map((match, matchIndex) => (
            <View key={match.id} style={styles.matchWrapper}>
              <MatchCard
                match={match}
                roundNumber={roundIndex + 1}
                totalRounds={totalRounds}
              />

              {/* Líneas conectoras */}
              {roundIndex < totalRounds - 1 && (
                <View style={styles.connectorContainer}>
                  <View style={styles.connectorLine} />
                  {matchIndex % 2 === 0 && matchIndex + 1 < round.length && (
                    <>
                      <View style={styles.connectorVertical} />
                      <View style={styles.connectorHorizontal} />
                    </>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const BracketLegend = () => (
    <View style={styles.legend}>
      <Text style={styles.legendTitle}>Leyenda:</Text>
      <View style={styles.legendItems}>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColor, { backgroundColor: COLORS.success }]}
          />
          <Text style={styles.legendText}>Completado</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColor, { backgroundColor: COLORS.secondary }]}
          />
          <Text style={styles.legendText}>En progreso</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColor, { backgroundColor: COLORS.lightGray }]}
          />
          <Text style={styles.legendText}>Pendiente</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      <BracketLegend />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bracketContainer}
      >
        {bracket.rounds.map((round, roundIndex) => (
          <RoundColumn
            key={roundIndex}
            round={round}
            roundIndex={roundIndex}
            totalRounds={bracket.rounds.length}
          />
        ))}
      </ScrollView>

      {bracket.rounds.length > 0 &&
        bracket.rounds[bracket.rounds.length - 1][0]?.winner && (
          <View style={styles.championContainer}>
            <Ionicons name="trophy" size={32} color={COLORS.secondary} />
            <Text style={styles.championTitle}>Campeón</Text>
            <Text style={styles.championName}>
              {bracket.rounds[bracket.rounds.length - 1][0].winner.name}
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
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 8,
  },
  legend: {
    backgroundColor: COLORS.lightGray,
    padding: 12,
    marginBottom: 16,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    color: COLORS.gray,
  },
  bracketContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  roundColumn: {
    marginRight: 24,
    minWidth: 180,
  },
  roundHeader: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  roundTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  roundSubtitle: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: 2,
  },
  matchesContainer: {
    flex: 1,
  },
  matchWrapper: {
    marginBottom: 20,
    position: 'relative',
  },
  matchCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    padding: 12,
    minHeight: 100,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedMatch: {
    borderColor: COLORS.secondary,
    shadowOpacity: 0.2,
  },
  completedMatch: {
    borderColor: COLORS.success,
    backgroundColor: '#f8fff8',
  },
  pendingMatch: {
    borderColor: COLORS.lightGray,
    backgroundColor: '#f9f9f9',
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchId: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray,
  },
  teamsContainer: {
    flex: 1,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  teamName: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.darkGray,
    flex: 1,
  },
  winnerTeam: {
    fontWeight: 'bold',
    color: COLORS.success,
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginLeft: 8,
  },
  vsContainer: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  vsText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.gray,
  },
  matchFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  matchDate: {
    fontSize: 11,
    color: COLORS.gray,
    marginLeft: 4,
  },
  pendingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  pendingText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray,
  },
  connectorContainer: {
    position: 'absolute',
    right: -24,
    top: 50,
    width: 24,
    height: 2,
  },
  connectorLine: {
    width: '100%',
    height: 2,
    backgroundColor: COLORS.lightGray,
  },
  connectorVertical: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 2,
    height: 40,
    backgroundColor: COLORS.lightGray,
  },
  connectorHorizontal: {
    position: 'absolute',
    right: 0,
    top: 40,
    width: 24,
    height: 2,
    backgroundColor: COLORS.lightGray,
  },
  championContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    padding: 20,
    marginTop: 16,
  },
  championTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginTop: 8,
  },
  championName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginTop: 4,
  },
});

export default BracketView;
