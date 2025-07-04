// Utilidades de validación para SportCampus
import { USER_TYPES, SPORTS } from './constants';

/**
 * Validaciones de correo electrónico
 */
export const emailValidators = {
  // Validación básica de formato de email
  isValidFormat: email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validación específica para emails universitarios
  isUniversityEmail: email => {
    const universityDomains = [
      'universidad.edu',
      'unam.mx',
      'itesm.mx',
      'ipn.mx',
      'udg.mx',
      'uanl.mx',
      'buap.mx',
      'uv.mx',
      'ual.es',
      'edu.mx',
      '.edu',
      '.ac.',
    ];

    if (!emailValidators.isValidFormat(email)) {
      return false;
    }

    const domain = email.toLowerCase().split('@')[1];
    return universityDomains.some(
      univDomain => domain.includes(univDomain) || domain.endsWith(univDomain)
    );
  },

  // Validar longitud del email
  isValidLength: email => {
    return email && email.length >= 5 && email.length <= 254;
  },

  // Validación completa de email
  validate: email => {
    const errors = [];

    if (!email || email.trim() === '') {
      errors.push('El correo electrónico es requerido');
      return { isValid: false, errors };
    }

    if (!emailValidators.isValidLength(email)) {
      errors.push('El correo debe tener entre 5 y 254 caracteres');
    }

    if (!emailValidators.isValidFormat(email)) {
      errors.push('Formato de correo electrónico inválido');
    }

    if (!emailValidators.isUniversityEmail(email)) {
      errors.push('Debe usar un correo electrónico universitario válido');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

/**
 * Validaciones de contraseña
 */
export const passwordValidators = {
  // Longitud mínima
  hasMinLength: (password, minLength = 8) => {
    return password && password.length >= minLength;
  },

  // Contiene al menos una mayúscula
  hasUppercase: password => {
    return /[A-Z]/.test(password);
  },

  // Contiene al menos una minúscula
  hasLowercase: password => {
    return /[a-z]/.test(password);
  },

  // Contiene al menos un número
  hasNumber: password => {
    return /\d/.test(password);
  },

  // Contiene al menos un carácter especial
  hasSpecialChar: password => {
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  },

  // No contiene espacios
  hasNoSpaces: password => {
    return !/\s/.test(password);
  },

  // Calcular fuerza de la contraseña
  getStrength: password => {
    let score = 0;
    const checks = [
      { test: passwordValidators.hasMinLength(password), points: 2 },
      { test: passwordValidators.hasUppercase(password), points: 1 },
      { test: passwordValidators.hasLowercase(password), points: 1 },
      { test: passwordValidators.hasNumber(password), points: 1 },
      { test: passwordValidators.hasSpecialChar(password), points: 2 },
      { test: passwordValidators.hasNoSpaces(password), points: 1 },
      { test: password && password.length >= 12, points: 1 },
    ];

    checks.forEach(check => {
      if (check.test) score += check.points;
    });

    if (score >= 8)
      return { level: 'strong', text: 'Fuerte', color: '#4CAF50' };
    if (score >= 5) return { level: 'medium', text: 'Media', color: '#ff9800' };
    return { level: 'weak', text: 'Débil', color: '#f44336' };
  },

  // Validación completa de contraseña
  validate: (password, confirmPassword = null) => {
    const errors = [];

    if (!password || password.trim() === '') {
      errors.push('La contraseña es requerida');
      return { isValid: false, errors };
    }

    if (!passwordValidators.hasMinLength(password)) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }

    if (!passwordValidators.hasUppercase(password)) {
      errors.push('Debe contener al menos una letra mayúscula');
    }

    if (!passwordValidators.hasLowercase(password)) {
      errors.push('Debe contener al menos una letra minúscula');
    }

    if (!passwordValidators.hasNumber(password)) {
      errors.push('Debe contener al menos un número');
    }

    if (!passwordValidators.hasSpecialChar(password)) {
      errors.push('Debe contener al menos un carácter especial');
    }

    if (!passwordValidators.hasNoSpaces(password)) {
      errors.push('No debe contener espacios');
    }

    if (confirmPassword !== null && password !== confirmPassword) {
      errors.push('Las contraseñas no coinciden');
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength: passwordValidators.getStrength(password),
    };
  },
};

/**
 * Validaciones de datos personales
 */
export const personalValidators = {
  // Validar nombre
  isValidName: name => {
    if (!name || name.trim().length < 2) return false;
    // Solo letras, espacios, guiones y apostrofes
    const nameRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]+$/;
    return nameRegex.test(name.trim());
  },

  // Validar ID de estudiante
  isValidStudentId: studentId => {
    if (!studentId) return false;
    // Formato típico: 6-12 dígitos
    const studentIdRegex = /^\d{6,12}$/;
    return studentIdRegex.test(studentId);
  },

  // Validar número de teléfono
  isValidPhone: phone => {
    if (!phone) return false;
    // Remover espacios y guiones
    const cleanPhone = phone.replace(/[\s-]/g, '');
    // Formato mexicano con código de país opcional
    const phoneRegex = /^(\+52)?[1-9]\d{9}$/;
    return phoneRegex.test(cleanPhone);
  },

  // Validar edad
  isValidAge: (birthDate, minAge = 16, maxAge = 65) => {
    if (!birthDate) return false;

    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    let calculatedAge = age;
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      calculatedAge--;
    }

    return calculatedAge >= minAge && calculatedAge <= maxAge;
  },

  // Validar facultad
  isValidFaculty: faculty => {
    const validFaculties = [
      'Ingeniería',
      'Medicina',
      'Derecho',
      'Economía',
      'Psicología',
      'Administración',
      'Arquitectura',
      'Comunicaciones',
      'Educación',
      'Ciencias',
      'Artes',
      'Filosofía',
      'Historia',
    ];
    return validFaculties.includes(faculty);
  },
};

/**
 * Validaciones específicas de deportes
 */
export const sportsValidators = {
  // Validar deporte
  isValidSport: sport => {
    return Object.values(SPORTS).includes(sport);
  },

  // Validar número de jugadores por deporte
  isValidPlayerCount: (sport, playerCount) => {
    const sportLimits = {
      [SPORTS.FUTBOL]: { min: 11, max: 25 },
      [SPORTS.BASQUETBOL]: { min: 5, max: 15 },
      [SPORTS.VOLEIBOL]: { min: 6, max: 18 },
      [SPORTS.FUTBOL_AMERICANO]: { min: 11, max: 30 },
    };

    const limits = sportLimits[sport];
    if (!limits) return false;

    return playerCount >= limits.min && playerCount <= limits.max;
  },

  // Validar posición de jugador
  isValidPosition: (sport, position) => {
    const positions = {
      [SPORTS.FUTBOL]: [
        'Portero',
        'Defensa Central',
        'Lateral Derecho',
        'Lateral Izquierdo',
        'Mediocampista Defensivo',
        'Mediocampista Central',
        'Mediocampista Ofensivo',
        'Extremo Derecho',
        'Extremo Izquierdo',
        'Delantero Centro',
        'Segundo Delantero',
      ],
      [SPORTS.BASQUETBOL]: ['Base', 'Escolta', 'Alero', 'Ala-Pívot', 'Pívot'],
      [SPORTS.VOLEIBOL]: [
        'Colocador',
        'Opuesto',
        'Central',
        'Receptor-Atacante',
        'Líbero',
      ],
      [SPORTS.FUTBOL_AMERICANO]: [
        'Quarterback',
        'Running Back',
        'Wide Receiver',
        'Tight End',
        'Offensive Line',
        'Defensive Line',
        'Linebacker',
        'Cornerback',
        'Safety',
        'Kicker',
        'Punter',
      ],
    };

    return positions[sport]?.includes(position) || false;
  },

  // Validar estadísticas de jugador
  isValidStat: (sport, statName, value) => {
    if (typeof value !== 'number' || value < 0) return false;

    const statLimits = {
      [SPORTS.FUTBOL]: {
        goles: { max: 50 },
        asistencias: { max: 30 },
        partidos_jugados: { max: 50 },
        tarjetas_amarillas: { max: 15 },
        tarjetas_rojas: { max: 5 },
      },
      [SPORTS.BASQUETBOL]: {
        puntos: { max: 40 },
        rebotes: { max: 20 },
        asistencias: { max: 15 },
        robos: { max: 10 },
        partidos_jugados: { max: 50 },
      },
    };

    const limits = statLimits[sport]?.[statName];
    return !limits || value <= limits.max;
  },
};

/**
 * Validaciones de archivos
 */
export const fileValidators = {
  // Validar tipo de imagen
  isValidImageType: fileName => {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const extension = fileName
      .toLowerCase()
      .substring(fileName.lastIndexOf('.'));
    return validExtensions.includes(extension);
  },

  // Validar tamaño de archivo
  isValidFileSize: (fileSize, maxSizeMB = 5) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return fileSize <= maxSizeBytes;
  },

  // Validar dimensiones de imagen
  isValidImageDimensions: (
    width,
    height,
    minWidth = 100,
    minHeight = 100,
    maxWidth = 4000,
    maxHeight = 4000
  ) => {
    return (
      width >= minWidth &&
      width <= maxWidth &&
      height >= minHeight &&
      height <= maxHeight
    );
  },
};

/**
 * Validaciones de torneo
 */
export const tournamentValidators = {
  // Validar nombre de torneo
  isValidTournamentName: name => {
    return name && name.trim().length >= 3 && name.trim().length <= 100;
  },

  // Validar fechas de torneo
  isValidTournamentDates: (startDate, endDate, registrationDeadline) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    const deadline = new Date(registrationDeadline);

    // La fecha límite debe ser antes del inicio
    if (deadline >= start) return false;

    // El inicio debe ser antes del fin
    if (start >= end) return false;

    // Las fechas deben ser futuras
    if (deadline <= now) return false;

    return true;
  },

  // Validar número de equipos
  isValidTeamCount: (minTeams, maxTeams) => {
    return minTeams >= 2 && maxTeams >= minTeams && maxTeams <= 64;
  },
};

/**
 * Validador general que combina todas las validaciones
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach(field => {
    const rules = validationRules[field];
    const value = formData[field];
    const fieldErrors = [];

    rules.forEach(rule => {
      const result = rule.validator(value);
      if (
        (typeof result === 'boolean' && !result) ||
        (typeof result === 'object' && !result.isValid)
      ) {
        fieldErrors.push(rule.message);
        isValid = false;
      }
    });

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
    }
  });

  return { isValid, errors };
};

/**
 * Validaciones comunes predefinidas
 */
export const commonValidationRules = {
  email: [
    {
      validator: emailValidators.isValidFormat,
      message: 'Formato de correo inválido',
    },
    {
      validator: emailValidators.isUniversityEmail,
      message: 'Debe ser un correo universitario',
    },
  ],

  password: [
    {
      validator: password => passwordValidators.hasMinLength(password),
      message: 'Mínimo 8 caracteres',
    },
    {
      validator: passwordValidators.hasUppercase,
      message: 'Debe contener mayúsculas',
    },
    {
      validator: passwordValidators.hasNumber,
      message: 'Debe contener números',
    },
  ],

  name: [
    {
      validator: personalValidators.isValidName,
      message: 'Nombre inválido',
    },
  ],

  studentId: [
    {
      validator: personalValidators.isValidStudentId,
      message: 'ID de estudiante inválido (6-12 dígitos)',
    },
  ],

  phone: [
    {
      validator: personalValidators.isValidPhone,
      message: 'Número de teléfono inválido',
    },
  ],
};

/**
 * Utilidad para sanitizar datos de entrada
 */
export const sanitizeInput = {
  // Limpiar string básico
  string: input => {
    if (typeof input !== 'string') return '';
    return input.trim().replace(/[<>]/g, '');
  },

  // Limpiar email
  email: input => {
    return sanitizeInput.string(input).toLowerCase();
  },

  // Limpiar nombre
  name: input => {
    return sanitizeInput
      .string(input)
      .replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]/g, '');
  },

  // Limpiar número
  number: input => {
    const cleaned = String(input).replace(/[^0-9.-]/g, '');
    return parseFloat(cleaned) || 0;
  },

  // Limpiar teléfono
  phone: input => {
    return sanitizeInput.string(input).replace(/[^0-9+\s-]/g, '');
  },
};

export default {
  emailValidators,
  passwordValidators,
  personalValidators,
  sportsValidators,
  fileValidators,
  tournamentValidators,
  validateForm,
  commonValidationRules,
  sanitizeInput,
};
