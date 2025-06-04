import { useState, useEffect } from 'react';
import tournamentService from '../services/tournamentService';
import { TOURNAMENT_STATUS } from '../utils/constants';

export const useTournaments = (filters = {}) => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTournaments();
  }, [filters]);

  const loadTournaments = async () => {
    try {
      setLoading(true);
      setError(null);
      const tournamentsData = await tournamentService.getTournaments(filters);
      setTournaments(tournamentsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    await loadTournaments();
    setRefreshing(false);
  };

  const createTournament = async tournamentData => {
    try {
      setError(null);
      const newTournament = await tournamentService.createTournament(
        tournamentData
      );
      setTournaments(prev => [newTournament, ...prev]);
      return newTournament;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTournament = async (tournamentId, updates) => {
    try {
      setError(null);
      await tournamentService.updateTournament(tournamentId, updates);
      setTournaments(prev =>
        prev.map(tournament =>
          tournament.id === tournamentId
            ? { ...tournament, ...updates }
            : tournament
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const registerTeam = async (tournamentId, teamData) => {
    try {
      setError(null);
      await tournamentService.registerTeamToTournament(tournamentId, teamData);
      await loadTournaments(); // Recargar para actualizar equipos registrados
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const unregisterTeam = async (tournamentId, teamId) => {
    try {
      setError(null);
      await tournamentService.unregisterTeamFromTournament(
        tournamentId,
        teamId
      );
      await loadTournaments(); // Recargar para actualizar equipos registrados
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Funciones de filtrado y utilidades
  const getActiveTournaments = () => {
    return tournaments.filter(t => t.status === TOURNAMENT_STATUS.ACTIVE);
  };

  const getUpcomingTournaments = () => {
    return tournaments.filter(t => t.status === TOURNAMENT_STATUS.UPCOMING);
  };

  const getFinishedTournaments = () => {
    return tournaments.filter(t => t.status === TOURNAMENT_STATUS.FINISHED);
  };

  const getTournamentsBySport = sport => {
    return tournaments.filter(t => t.sport === sport);
  };

  const getMyTournaments = (teamIds = []) => {
    return tournaments.filter(tournament =>
      tournament.teams?.some(team => teamIds.includes(team.id))
    );
  };

  return {
    tournaments,
    loading,
    error,
    refreshing,
    refresh,
    createTournament,
    updateTournament,
    registerTeam,
    unregisterTeam,
    getActiveTournaments,
    getUpcomingTournaments,
    getFinishedTournaments,
    getTournamentsBySport,
    getMyTournaments,
  };
};

export const useTournament = tournamentId => {
  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tournamentId) {
      loadTournamentDetails();
    }
  }, [tournamentId]);

  const loadTournamentDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const [tournamentData, matchesData, statsData] = await Promise.all([
        tournamentService.getTournamentById(tournamentId),
        tournamentService.getTournamentMatches(tournamentId),
        tournamentService.getTournamentStatistics(tournamentId),
      ]);

      setTournament(tournamentData);
      setMatches(matchesData);
      setStatistics(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateBracket = async () => {
    try {
      setError(null);
      const bracket = await tournamentService.generateBracket(tournamentId);
      setTournament(prev => ({ ...prev, bracket }));
      return bracket;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateMatchResult = async (matchId, result) => {
    try {
      setError(null);
      await tournamentService.updateMatchResult(matchId, result);
      await loadTournamentDetails(); // Recargar para actualizar standings
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    tournament,
    matches,
    statistics,
    loading,
    error,
    refresh: loadTournamentDetails,
    generateBracket,
    updateMatchResult,
  };
};

export default useTournaments;
