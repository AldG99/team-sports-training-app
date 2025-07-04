// Colores de la aplicación
export const COLORS = {
  primary: '#06597d',
  secondary: '#f8ac58',
  white: '#ffffff',
  black: '#000000',
  gray: '#666666',
  lightGray: '#f5f5f5',
  darkGray: '#333333',
  success: '#4CAF50',
  error: '#f44336',
  warning: '#ff9800',
  background: '#06597d',
};

// Deportes disponibles
export const SPORTS = {
  FUTBOL: 'futbol',
  BASQUETBOL: 'basquetbol',
  FUTBOL_AMERICANO: 'futbol_americano',
  VOLEIBOL: 'voleibol',
};

// Estadísticas por deporte
export const SPORT_STATS = {
  [SPORTS.FUTBOL]: [
    'goles',
    'asistencias',
    'partidos_jugados',
    'tarjetas_amarillas',
    'tarjetas_rojas',
  ],
  [SPORTS.BASQUETBOL]: [
    'puntos',
    'rebotes',
    'asistencias',
    'robos',
    'partidos_jugados',
  ],
  [SPORTS.FUTBOL_AMERICANO]: [
    'touchdowns',
    'yardas',
    'tackles',
    'intercepciones',
    'partidos_jugados',
  ],
  [SPORTS.VOLEIBOL]: [
    'puntos',
    'aces',
    'bloqueos',
    'recepciones',
    'sets_jugados',
  ],
};

// Tipos de usuario
export const USER_TYPES = {
  STUDENT: 'student',
  COACH: 'coach',
  ADMIN: 'admin',
};

// Tipos de torneo
export const TOURNAMENT_TYPES = {
  INTER_FACULTADES: 'inter_facultades',
  COPA_UNIVERSITARIA: 'copa_universitaria',
  LIGA_REGULAR: 'liga_regular',
};

// Estados de torneo
export const TOURNAMENT_STATUS = {
  UPCOMING: 'upcoming',
  ACTIVE: 'active',
  FINISHED: 'finished',
};

// Configuraciones de la app
export const APP_CONFIG = {
  name: 'SportCampus',
  version: '1.0.0',
  maxPhotoSize: 5 * 1024 * 1024, // 5MB
  maxPhotosPerUpload: 10,
  defaultAvatar: 'https://via.placeholder.com/150',
};
