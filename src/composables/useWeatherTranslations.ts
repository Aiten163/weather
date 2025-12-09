import { useSettingsStore } from '@/store/settings'
import { getPressureStatusSimple } from '@/utils/weather-formatters'

export const useWeatherTranslations = () => {
    const settingsStore = useSettingsStore()

    const getWindDirection = (degrees: number): string => {
        const index = Math.round(degrees / 45) % 8

        const fullDirections = {
            en: ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'],
            ru: ['Северный', 'Северо-восточный', 'Восточный', 'Юго-восточный', 'Южный', 'Юго-западный', 'Западный', 'Северо-западный']
        }

        return fullDirections[settingsStore.language][index]
    }

    const getWeatherCondition = (condition: string): string => {
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
        return conditions[settingsStore.language][key as keyof typeof conditions.en] || condition
    }

    const getPressureStatusText = (pressure: number): string => {
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

        return texts[settingsStore.language][status]
    }

    const getTemperatureUnitText = (): string => {
        return settingsStore.temperatureUnit === 'C' ? '°C' : '°F'
    }

    const getWindSpeedUnitText = (): string => {
        switch (settingsStore.windSpeedUnit) {
            case 'kmh': return 'km/h'
            case 'mph': return 'mph'
            case 'ms': return 'm/s'
            default: return 'm/s'
        }
    }

    const getPressureUnitText = (): string => {
        return settingsStore.pressureUnit === 'mmHg' ? 'mmHg' : 'hPa'
    }

    return {
        getWindDirection,
        getWeatherCondition,
        getPressureStatusText,
        getTemperatureUnitText,
        getWindSpeedUnitText,
        getPressureUnitText
    }
}