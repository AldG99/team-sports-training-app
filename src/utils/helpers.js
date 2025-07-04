import { SPORTS, USER_TYPES, TOURNAMENT_STATUS } from './constants';

// ==================== FORMATEO DE FECHAS ====================

export const formatDate = (date, options = {}) => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    ...options,
  };

  return dateObj.toLocaleDateString('es-ES', defaultOptions);
};

export const formatDateTime = date => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTimeAgo = date => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now - dateObj;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInMinutes < 1) return 'Ahora';
  if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;
  if (diffInHours < 24) return `Hace ${diffInHours}h`;
  if (diffInDays < 7) return `Hace ${diffInDays}d`;
  if (diffInWeeks < 4) return `Hace ${diffInWeeks}sem`;
  if (diffInMonths < 12) return `Hace ${diffInMonths}mes`;

  return formatDate(dateObj, { month: 'short', day: '2-digit' });
};

export const isToday = date => {
  if (!date) return false;

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();

  return dateObj.toDateString() === today.toDateString();
};

export const isTomorrow = date => {
  if (!date) return false;

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return dateObj.toDateString() === tomorrow.toDateString();
};

// ==================== FORMATEO DE TEXTO ====================

export const capitalize = str => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = str => {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const slugify = text => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const removeAccents = text => {
  if (!text) return '';
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

// ==================== VALIDACIONES ====================

export const isValidEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = password => {
  return password && password.length >= 6;
};

export const isValidStudentId = studentId => {
  const studentIdRegex = /^\d{6,12}$/;
  return studentIdRegex.test(studentId);
};

export const isValidPhone = phone => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// ==================== FORMATEO DE NÚMEROS ====================

export const formatNumber = num => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('es-ES').format(num);
};

export const formatCurrency = (amount, currency = 'MXN') => {
  if (amount === null || amount === undefined) return '$0';
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  return `${(value * 100).toFixed(decimals)}%`;
};

export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return (value / total) * 100;
};

// ==================== DEPORTES Y ESTADÍSTICAS ====================

export const getSportName = sportKey => {
  const sportNames = {
    [SPORTS.FUTBOL]: 'Fútbol',
    [SPORTS.BASQUETBOL]: 'Basquetbol',
    [SPORTS.FUTBOL_AMERICANO]: 'Fútbol Americano',
    [SPORTS.VOLEIBOL]: 'Voleibol',
  };
  return sportNames[sportKey] || sportKey;
};

export const getSportIcon = sportKey => {
  const sportIcons = {
    [SPORTS.FUTBOL]: 'football',
    [SPORTS.BASQUETBOL]: 'basketball',
    [SPORTS.FUTBOL_AMERICANO]: 'american-football',
    [SPORTS.VOLEIBOL]: 'tennis',
  };
  return sportIcons[sportKey] || 'help-circle';
};

export const getUserTypeName = userType => {
  const typeNames = {
    [USER_TYPES.STUDENT]: 'Estudiante',
    [USER_TYPES.COACH]: 'Entrenador',
    [USER_TYPES.ADMIN]: 'Administrador',
  };
  return typeNames[userType] || userType;
};

export const getTournamentStatusName = status => {
  const statusNames = {
    [TOURNAMENT_STATUS.UPCOMING]: 'Próximo',
    [TOURNAMENT_STATUS.ACTIVE]: 'En Curso',
    [TOURNAMENT_STATUS.FINISHED]: 'Finalizado',
  };
  return statusNames[status] || status;
};

export const calculateStats = (stats, statKey) => {
  if (!stats || !Array.isArray(stats)) return 0;

  return stats.reduce((total, stat) => {
    return total + (stat.stats?.[statKey] || 0);
  }, 0);
};

export const calculateAverage = (stats, statKey, gamesPlayed = null) => {
  const total = calculateStats(stats, statKey);
  const games = gamesPlayed || stats.length;

  if (games === 0) return 0;
  return (total / games).toFixed(1);
};

// ==================== GESTIÓN DE ARRAYS ====================

export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const filterBy = (array, filters) => {
  return array.filter(item => {
    return Object.keys(filters).every(key => {
      const filterValue = filters[key];
      const itemValue = item[key];

      if (filterValue === null || filterValue === undefined) return true;
      if (typeof filterValue === 'string') {
        return itemValue?.toLowerCase().includes(filterValue.toLowerCase());
      }

      return itemValue === filterValue;
    });
  });
};

export const removeDuplicates = (array, key = null) => {
  if (key) {
    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  }

  return [...new Set(array)];
};

// ==================== UTILIDADES DE IMAGEN ====================

export const getImageDimensions = uri => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
      });
    };
    img.onerror = reject;
    img.src = uri;
  });
};

export const formatFileSize = bytes => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isValidImageFormat = filename => {
  const validFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return validFormats.includes(extension);
};

// ==================== UTILIDADES DE COLOR ====================

export const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getContrastColor = hexColor => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
};

// ==================== UTILIDADES DE NAVEGACIÓN ====================

export const generateTabConfig = userType => {
  const commonTabs = [
    { name: 'Home', icon: 'home', title: 'Inicio' },
    { name: 'Teams', icon: 'people', title: 'Equipos' },
    { name: 'Tournaments', icon: 'trophy', title: 'Torneos' },
    { name: 'Gallery', icon: 'images', title: 'Galería' },
    { name: 'Profile', icon: 'person', title: 'Perfil' },
  ];

  switch (userType) {
    case USER_TYPES.COACH:
      return [
        { name: 'Dashboard', icon: 'speedometer', title: 'Dashboard' },
        ...commonTabs.slice(1, 4),
        { name: 'ManageStats', icon: 'stats-chart', title: 'Estadísticas' },
        commonTabs[4],
      ];

    case USER_TYPES.ADMIN:
      return [
        { name: 'Dashboard', icon: 'settings', title: 'Admin' },
        ...commonTabs.slice(1, 4),
        { name: 'CreateTournament', icon: 'add-circle', title: 'Crear Torneo' },
        commonTabs[4],
      ];

    default: // STUDENT
      return [
        ...commonTabs.slice(0, 4),
        { name: 'MyTeam', icon: 'shield', title: 'Mi Equipo' },
        { name: 'Stats', icon: 'bar-chart', title: 'Estadísticas' },
        commonTabs[3],
        commonTabs[4],
      ];
  }
};

// ==================== UTILIDADES DE ALMACENAMIENTO ====================

export const generateFileName = (prefix = 'file', extension = 'jpg') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}.${extension}`;
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// ==================== UTILIDADES DE RENDIMIENTO ====================

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// ==================== UTILIDADES DE DESARROLLO ====================

export const logError = (error, context = '') => {
  if (__DEV__) {
    console.error(`Error${context ? ` in ${context}` : ''}:`, error);
  }

  // Aquí podrías integrar un servicio de tracking de errores
  // como Sentry, Crashlytics, etc.
};

export const logInfo = (message, data = null) => {
  if (__DEV__) {
    console.log(message, data);
  }
};

export const measurePerformance = (name, func) => {
  const start = performance.now();
  const result = func();
  const end = performance.now();

  if (__DEV__) {
    console.log(`${name} took ${end - start} milliseconds`);
  }

  return result;
};

// ==================== EXPORTACIONES AGRUPADAS ====================

export const dateHelpers = {
  formatDate,
  formatDateTime,
  formatTimeAgo,
  isToday,
  isTomorrow,
};

export const textHelpers = {
  capitalize,
  capitalizeWords,
  truncateText,
  slugify,
  removeAccents,
};

export const validationHelpers = {
  isValidEmail,
  isValidPassword,
  isValidStudentId,
  isValidPhone,
};

export const numberHelpers = {
  formatNumber,
  formatCurrency,
  formatPercentage,
  calculatePercentage,
};

export const arrayHelpers = {
  groupBy,
  sortBy,
  filterBy,
  removeDuplicates,
};

export const sportHelpers = {
  getSportName,
  getSportIcon,
  getUserTypeName,
  getTournamentStatusName,
  calculateStats,
  calculateAverage,
};

export default {
  ...dateHelpers,
  ...textHelpers,
  ...validationHelpers,
  ...numberHelpers,
  ...arrayHelpers,
  ...sportHelpers,
  getImageDimensions,
  formatFileSize,
  isValidImageFormat,
  hexToRgba,
  getContrastColor,
  generateTabConfig,
  generateFileName,
  generateId,
  debounce,
  throttle,
  logError,
  logInfo,
  measurePerformance,
};
