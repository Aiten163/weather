// Безопасное получение переменных окружения
const getEnvVar = (key: string, defaultValue: string = ''): string => {
    try {
        // Проверяем, доступен ли import.meta.env
        if (typeof import.meta !== 'undefined' && import.meta.env) {
            const value = import.meta.env[key];
            return value !== undefined ? String(value) : defaultValue;
        }
    } catch (error) {
        console.warn(`Failed to get env var ${key}:`, error);
    }
    return defaultValue;
};

// Используем наш прокси
const USE_PROXY = getEnvVar('VITE_USE_PROXY') === 'true';
const PROXY_URL = getEnvVar('VITE_PROXY_URL') || 'http://elmir.mordovia.ru/';
const DIRECT_API_KEY = getEnvVar('VITE_WEATHER_API_KEY') || '';

export const API_CONFIG = {
    USE_PROXY,

    // URL нашего прокси
    PROXY_URL,

    // Для совместимости (если захотим переключиться)
    OPENWEATHER_URL: 'https://api.openweathermap.org/data/2.5',
    GEOCODING_URL: 'https://api.openweathermap.org/geo/1.0',

    // API ключ (может не понадобиться с прокси)
    API_KEY: DIRECT_API_KEY,

    // Таймауты
    TIMEOUT: 15000
};

export const WEATHER_CONDITIONS = {
    en: {
        'clear': 'Clear',
        'clouds': 'Cloudy',
        'rain': 'Rain',
        'snow': 'Snow',
        'thunderstorm': 'Thunderstorm',
        'drizzle': 'Drizzle',
        'mist': 'Mist',
        'fog': 'Fog'
    },
    ru: {
        'clear': 'Ясно',
        'clouds': 'Облачно',
        'rain': 'Дождь',
        'snow': 'Снег',
        'thunderstorm': 'Гроза',
        'drizzle': 'Морось',
        'mist': 'Туман',
        'fog': 'Туман'
    }
};

export const WIND_DIRECTIONS = {
    en: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
    ru: ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ']
};