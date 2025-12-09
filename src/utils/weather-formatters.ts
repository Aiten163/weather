import { useSettingsStore } from '@/store/settings'

export const formatTemperature = (temp: number, unit?: 'C' | 'F'): string => {
    const settingsStore = useSettingsStore()
    const targetUnit = unit || settingsStore.temperatureUnit

    if (targetUnit === 'F') {
        return `${Math.round((temp * 9/5) + 32)}°F`
    }
    return `${Math.round(temp)}°C`
}

export const formatWindSpeed = (speed: number, unit?: 'kmh' | 'mph' | 'ms'): string => {
    const settingsStore = useSettingsStore()
    const targetUnit = unit || settingsStore.windSpeedUnit

    switch (targetUnit) {
        case 'kmh':
            return `${Math.round(speed * 3.6)} km/h`
        case 'mph':
            return `${Math.round(speed * 2.237)} mph`
        case 'ms':
        default:
            return `${Math.round(speed * 10) / 10} m/s`
    }
}

export const formatPressure = (pressure: number, unit?: 'mmHg' | 'hPa'): string => {
    const settingsStore = useSettingsStore()
    const targetUnit = unit || settingsStore.pressureUnit

    if (targetUnit === 'mmHg') {
        return `${Math.round(pressure * 0.75006)} mmHg`
    }
    return `${pressure} hPa`
}

export const getWindDirection = (degrees: number, language: 'en' | 'ru'): string => {
    const index = Math.round(degrees / 45) % 8

    // Определяем направления компаса
    const directions = [
        { en: 'N', ru: 'С' },
        { en: 'NE', ru: 'СВ' },
        { en: 'E', ru: 'В' },
        { en: 'SE', ru: 'ЮВ' },
        { en: 'S', ru: 'Ю' },
        { en: 'SW', ru: 'ЮЗ' },
        { en: 'W', ru: 'З' },
        { en: 'NW', ru: 'СЗ' }
    ]

    return directions[index][language]
}

export const getWeatherCondition = (condition: string, language: 'en' | 'ru'): string => {
    const conditions = {
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
    }

    const key = condition.toLowerCase()
    return conditions[language][key as keyof typeof conditions.en] || condition
}

export const getPressureStatus = (pressure: number): 'low' | 'normal' | 'high' => {
    if (pressure < 1000) return 'low'
    if (pressure > 1020) return 'high'
    return 'normal'
}

export const getWeatherIcon = (condition: string, isDay: boolean = true): string => {
    const icons: Record<string, string> = {
        'clear': isDay ? '☀️' : '🌙',
        'clouds': '☁️',
        'rain': '🌧️',
        'snow': '❄️',
        'thunderstorm': '⛈️',
        'drizzle': '🌦️',
        'mist': '🌫️',
        'fog': '🌁'
    }

    const key = condition.toLowerCase()
    return icons[key] || '🌈'
}
export const getWindDirectionFull = (degrees: number, language: 'en' | 'ru' = 'en'): string => {
    const index = Math.round(degrees / 45) % 8

    const fullDirections = {
        en: ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'],
        ru: ['Северный', 'Северо-восточный', 'Восточный', 'Юго-восточный', 'Южный', 'Юго-западный', 'Западный', 'Северо-западный']
    }

    return fullDirections[language][index]
}

export const formatTemperatureSimple = (temp: number, unit: 'C' | 'F' = 'C'): string => {
    if (unit === 'F') {
        return `${Math.round((temp * 9/5) + 32)}°F`
    }
    return `${Math.round(temp)}°C`
}

export const formatWindSpeedSimple = (speed: number, unit: 'kmh' | 'mph' | 'ms' = 'kmh'): string => {
    switch (unit) {
        case 'kmh':
            return `${Math.round(speed * 3.6)} km/h`
        case 'mph':
            return `${Math.round(speed * 2.237)} mph`
        case 'ms':
        default:
            return `${Math.round(speed * 10) / 10} m/s`
    }
}

export const formatPressureSimple = (pressure: number, unit: 'mmHg' | 'hPa' = 'hPa'): string => {
    if (unit === 'mmHg') {
        return `${Math.round(pressure * 0.75006)} mmHg`
    }
    return `${pressure} hPa`
}

export const getWindDirectionSimple = (degrees: number, language: 'en' | 'ru' = 'en'): string => {
    const index = Math.round(degrees / 45) % 8

    const directions = {
        en: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
        ru: ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ']
    }

    return directions[language][index]
}

export const getWeatherConditionSimple = (condition: string, language: 'en' | 'ru' = 'en'): string => {
    const conditions = {
        en: {
            'clear': 'Clear',
            'clouds': 'Cloudy',
            'rain': 'Rain',
            'snow': 'Snow',
            'thunderstorm': 'Thunderstorm',
            'drizzle': 'Drizzle',
            'mist': 'Mist',
            'fog': 'Fog',
            'haze': 'Haze',
            'smoke': 'Smoke',
            'dust': 'Dust',
            'sand': 'Sand',
            'ash': 'Ash',
            'squall': 'Squall',
            'tornado': 'Tornado'
        },
        ru: {
            'clear': 'Ясно',
            'clouds': 'Облачно',
            'rain': 'Дождь',
            'snow': 'Снег',
            'thunderstorm': 'Гроза',
            'drizzle': 'Морось',
            'mist': 'Туман',
            'fog': 'Туман',
            'haze': 'Дымка',
            'smoke': 'Дым',
            'dust': 'Пыль',
            'sand': 'Песок',
            'ash': 'Пепел',
            'squall': 'Шквал',
            'tornado': 'Торнадо'
        }
    }

    const key = condition.toLowerCase()
    return conditions[language][key as keyof typeof conditions.en] || condition
}

export const getPressureStatusSimple = (pressure: number): 'low' | 'normal' | 'high' => {
    if (pressure < 1000) return 'low'
    if (pressure > 1020) return 'high'
    return 'normal'
}

// Функция для получения текста статуса давления
export const getPressureStatusText = (pressure: number, language: 'en' | 'ru' = 'en'): string => {
    const status = getPressureStatusSimple(pressure)
    const texts = {
        en: {
            low: 'Low',
            normal: 'Normal',
            high: 'High'
        },
        ru: {
            low: 'Низкое',
            normal: 'Нормальное',
            high: 'Высокое'
        }
    }

    return texts[language][status]
}