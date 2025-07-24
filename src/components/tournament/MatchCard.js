import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../utils/constants';
import { formatDate, formatDateTime } from '../../utils/helpers';

const MatchCard = ({
  match,
  onPress = null,
  showResult = true,
  showDetails = true,
  style = {},
  size = 'medium',
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.smallContainer,
          teamName: styles.smallTeamName,
          score: styles.smallScore,
          logo: 40,
        };
      case 'large':
        return {
          container: styles.largeContainer,
          teamName: styles.largeTeamName,
          score: styles.largeScore,
          logo: 60,
        };
      default:
        return {
          container: styles.mediumContainer,
          teamName: styles.mediumTeamName,
          score: styles.mediumScore,
          logo: 50,
        };
    }
  };

  const getStatusColor = () => {
    switch (match.status) {
      case 'completed':
        return COLORS.success;
      case 'live':
        return COLORS.error;
      case 'upcoming':
        return COLORS.warning;
      case 'postponed':
        return COLORS.gray;
      default:
        return COLORS.gray;
    }
  };

  const getStatusText = () => {
    switch (match.status) {
      case 'completed':
        return 'Finalizado';
      case 'live':
        return 'En Vivo';
      case 'upcoming':
        return 'Próximo';
      case 'postponed':
        return 'Pospuesto';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Programado';
    }
  };

  const getWinnerStyle = team => {
    if (!match.result || match.status !== 'completed') return {};

    const homeScore = match.result.homeScore || 0;
    const awayScore = match.result.awayScore || 0;

    if (homeScore === awayScore) return {}; // Empate

    const isHomeWinner = homeScore > awayScore;
    const isHomeTeam = team === 'home';

    if ((isHomeWinner && isHomeTeam) || (!isHomeWinner && !isHomeTeam)) {
      return styles.winnerTeam;
    }

    return styles.loserTeam;
  };

  const sizeStyles = getSizeStyles();
  const statusColor = getStatusColor();

  const TeamSection = ({ team, side, score }) => (
    <View style={[styles.teamSection, side === 'away' && styles.awayTeam]}>
      <Image
        source={{
          uri:
            team?.logo || 'https://via.placeholder.com/50/cccccc/666666?text=T',
        }}
        style={[
          styles.teamLogo,
          { width: sizeStyles.logo, height: sizeStyles.logo },
        ]}
      />
      <View style={styles.teamInfo}>
        <Text
          style={[styles.teamName, sizeStyles.teamName, getWinnerStyle(side)]}
          numberOfLines={2}
        >
          {team?.name || 'TBD'}
        </Text>
        {team?.faculty && (
          <Text style={styles.teamFaculty}>{team.faculty}</Text>
        )}
      </View>
      {showResult && match.status === 'completed' && match.result && (
        <Text style={[styles.score, sizeStyles.score, getWinnerStyle(side)]}>
          {score}
        </Text>
      )}
    </View>
  );

  const MatchDetails = () => {
    if (!showDetails) return null;

    return (
      <View style={styles.detailsSection}>
        {match.tournament && (
          <View style={styles.detailRow}>
            <Ionicons name="trophy" size={14} color={COLORS.gray} />
            <Text style={styles.detailText}>{match.tournament}</Text>
          </View>
        )}

        {match.location && (
          <View style={styles.detailRow}>
            <Ionicons name="location" size={14} color={COLORS.gray} />
            <Text style={styles.detailText}>{match.location}</Text>
          </View>
        )}

        {match.sport && (
          <View style={styles.detailRow}>
            <Ionicons name="fitness" size={14} color={COLORS.gray} />
            <Text style={styles.detailText}>{match.sport}</Text>
          </View>
        )}
      </View>
    );
  };

  const StatusBadge = () => (
    <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
      <Text style={styles.statusText}>{getStatusText()}</Text>
      {match.status === 'live' && <View style={styles.liveIndicator} />}
    </View>
  );

  const getDateDisplay = () => {
    if (match.status === 'completed' && match.completedAt) {
      return formatDate(match.completedAt);
    }
    if (match.scheduledDate) {
      return match.status === 'upcoming'
        ? formatDateTime(match.scheduledDate)
        : formatDate(match.scheduledDate);
    }
    return 'Fecha TBD';
  };

  const content = (
    <View style={[styles.container, sizeStyles.container, style]}>
      <View style={styles.header}>
        <StatusBadge />
        <Text style={styles.dateText}>{getDateDisplay()}</Text>
      </View>

      <View style={styles.matchContent}>
        <TeamSection
          team={match.homeTeam}
          side="home"
          score={match.result?.homeScore}
        />

        <View style={styles.vsSection}>
          <Text style={styles.vsText}>VS</Text>
          {match.status === 'live' && match.currentTime && (
            <Text style={styles.timeText}>{match.currentTime}'</Text>
          )}
        </View>

        <TeamSection
          team={match.awayTeam}
          side="away"
          score={match.result?.awayScore}
        />
      </View>

      <MatchDetails />

      {match.status === 'completed' && match.result && (
        <View style={styles.resultSummary}>
          {match.result.penalties && (
            <Text style={styles.penaltiesText}>
              Penales: {match.result.penalties.home} -{' '}
              {match.result.penalties.away}
            </Text>
          )}
          {match.result.extraTime && (
            <Text style={styles.extraTimeText}>
              Tiempo Extra: {match.result.extraTime.home} -{' '}
              {match.result.extraTime.away}
            </Text>
          )}
        </View>
      )}

      {match.highlights && match.highlights.length > 0 && (
        <View style={styles.highlights}>
          <Text style={styles.highlightsTitle}>Momentos destacados:</Text>
          {match.highlights.slice(0, 3).map((highlight, index) => (
            <View key={index} style={styles.highlightItem}>
              <Ionicons
                name={highlight.type === 'goal' ? 'football' : 'card'}
                size={12}
                color={COLORS.secondary}
              />
              <Text style={styles.highlightText}>
                {highlight.minute}' {highlight.player} ({highlight.type})
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => onPress(match)}
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
    marginVertical: 4,
  },
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
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
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '600',
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.white,
    marginLeft: 6,
    opacity: 0.8,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: '500',
  },
  matchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamSection: {
    flex: 1,
    alignItems: 'center',
  },
  awayTeam: {
    alignItems: 'center',
  },
  teamLogo: {
    borderRadius: 25,
    backgroundColor: COLORS.lightGray,
    marginBottom: 8,
  },
  teamInfo: {
    alignItems: 'center',
    flex: 1,
  },
  teamName: {
    fontWeight: '600',
    color: COLORS.darkGray,
    textAlign: 'center',
  },
  smallTeamName: {
    fontSize: 12,
  },
  mediumTeamName: {
    fontSize: 14,
  },
  largeTeamName: {
    fontSize: 16,
  },
  teamFaculty: {
    fontSize: 10,
    color: COLORS.gray,
    marginTop: 2,
  },
  winnerTeam: {
    color: COLORS.success,
    fontWeight: 'bold',
  },
  loserTeam: {
    color: COLORS.gray,
    opacity: 0.7,
  },
  vsSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  vsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.gray,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.error,
    fontWeight: '600',
    marginTop: 4,
  },
  score: {
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginTop: 8,
  },
  smallScore: {
    fontSize: 16,
  },
  mediumScore: {
    fontSize: 20,
  },
  largeScore: {
    fontSize: 24,
  },
  detailsSection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 12,
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 6,
  },
  resultSummary: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  penaltiesText: {
    fontSize: 12,
    color: COLORS.darkGray,
    fontWeight: '500',
    textAlign: 'center',
  },
  extraTimeText: {
    fontSize: 12,
    color: COLORS.darkGray,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
  },
  highlights: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  highlightsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  highlightText: {
    fontSize: 11,
    color: COLORS.gray,
    marginLeft: 6,
  },
});

export default MatchCard;
