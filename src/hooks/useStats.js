import { useState, useEffect } from 'react';
import firestoreService from '../services/firestoreService';
import { SPORT_STATS } from '../utils/constants';

export const useStats = (playerId, sport = null) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (playerId) {
      loadPlayerStats();
    }
  }, [playerId, sport]);

  const loadPlayerStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const playerStats = await firestoreService.getPlayerStats(
        playerId,
        sport
      );
      setStats(playerStats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addStats = async (teamId, sport, statsData) => {
    try {
      setError(null);
      const newStats = await firestoreService.savePlayerStats(
        playerId,
        teamId,
        sport,
        statsData
      );
      await loadPlayerStats(); // Recargar stats
      return newStats;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getAggregatedStats = () => {
    if (!stats.length) return {};

    const sportStatsKeys = sport ? SPORT_STATS[sport] : [];
    const aggregated = {};

    sportStatsKeys.forEach(statKey => {
      aggregated[statKey] = stats.reduce((sum, stat) => {
        return sum + (stat.stats[statKey] || 0);
      }, 0);
    });

    return aggregated;
  };

  const getSeasonStats = season => {
    const seasonStats = stats.filter(stat => {
      const statYear = new Date(stat.date).getFullYear().toString();
      return statYear === season;
    });

    return seasonStats.reduce((acc, stat) => {
      Object.keys(stat.stats).forEach(key => {
        acc[key] = (acc[key] || 0) + stat.stats[key];
      });
      return acc;
    }, {});
  };

  const getProgressData = (statKey, months = 6) => {
    const now = new Date();
    const monthsAgo = new Date(now.getFullYear(), now.getMonth() - months, 1);

    const recentStats = stats.filter(stat => new Date(stat.date) >= monthsAgo);

    const monthlyData = {};
    recentStats.forEach(stat => {
      const month = new Date(stat.date).toLocaleDateString('es-ES', {
        month: 'short',
      });
      monthlyData[month] =
        (monthlyData[month] || 0) + (stat.stats[statKey] || 0);
    });

    return {
      labels: Object.keys(monthlyData),
      datasets: [
        {
          data: Object.values(monthlyData),
        },
      ],
    };
  };

  return {
    stats,
    loading,
    error,
    addStats,
    refresh: loadPlayerStats,
    aggregatedStats: getAggregatedStats(),
    getSeasonStats,
    getProgressData,
  };
};

export const useTeamStats = (teamId, sport = null) => {
  const [teamStats, setTeamStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (teamId) {
      loadTeamStats();
    }
  }, [teamId, sport]);

  const loadTeamStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const stats = await firestoreService.getTeamStats(teamId, sport);
      setTeamStats(stats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTopPerformers = statKey => {
    const playerTotals = {};

    teamStats.forEach(stat => {
      const playerId = stat.playerId;
      if (!playerTotals[playerId]) {
        playerTotals[playerId] = {
          playerId,
          total: 0,
          matches: 0,
        };
      }
      playerTotals[playerId].total += stat.stats[statKey] || 0;
      playerTotals[playerId].matches++;
    });

    return Object.values(playerTotals)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };

  const getTeamTotals = () => {
    const totals = {};

    teamStats.forEach(stat => {
      Object.keys(stat.stats).forEach(key => {
        totals[key] = (totals[key] || 0) + stat.stats[key];
      });
    });

    return totals;
  };

  return {
    teamStats,
    loading,
    error,
    refresh: loadTeamStats,
    getTopPerformers,
    teamTotals: getTeamTotals(),
  };
};

export default useStats;
