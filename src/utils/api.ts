import axios from 'axios'
import { API_CONFIG } from './constants'
import type { WeatherData, ForecastData, City } from '@/types/weather'

const createApiUrl = (endpoint: string, params: Record<string, any>): string => {
    if (API_CONFIG.USE_PROXY) {
        // Используем наш прокси сервер
        const queryParams = new URLSearchParams(params).toString()
        return `${API_CONFIG.PROXY_URL}?endpoint=${endpoint}&${queryParams}`
    } else {
        // Прямой доступ к API (если отключим прокси)
        const baseUrl = endpoint.includes('geo') ? API_CONFIG.GEOCODING_URL : API_CONFIG.OPENWEATHER_URL
        const apiParams = { ...params, appid: API_CONFIG.API_KEY }
        return `${baseUrl}/${endpoint}?${new URLSearchParams(apiParams).toString()}`
    }
}

// Создаем экземпляр axios с настройками
const api = axios.create({
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})

// Интерцептор для обработки ошибок
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.message)
        console.error('Request URL:', error.config?.url)
        console.error('Response:', error.response?.data)

        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout. Please try again.')
        }

        if (error.response?.status === 400) {
            const errorMsg = error.response.data?.error || 'Invalid request'
            console.error('400 Error details:', errorMsg)
            throw new Error(`Invalid request: ${errorMsg}`)
        }

        if (error.response?.status === 404) {
            throw new Error('City not found')
        }

        if (error.response?.status === 429) {
            throw new Error('Too many requests. Please try again later.')
        }

        if (error.response?.status === 500) {
            throw new Error('Server error. Please try again.')
        }

        throw new Error(error.message || 'An error occurred')
    }
)

// Функции API с проверкой параметров
export const fetchWeatherData = async (cityId: number): Promise<WeatherData> => {
    if (!cityId || isNaN(cityId)) {
        throw new Error('Invalid city ID')
    }

    // Проверяем если это временный ID (на основе координат)
    // Временные ID обычно очень большие (> 1000000000)
    if (cityId > 1000000000) {
        console.warn('Using temporary city ID, switching to coordinate search')
        throw new Error('Temporary city ID, use coordinates instead')
    }

    const url = createApiUrl('weather', { id: cityId, units: 'metric' })
    console.log('Fetching weather from:', url)
    const response = await api.get(url)
    return response.data
}

export const fetchWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
        throw new Error('Invalid coordinates')
    }

    const url = createApiUrl('weather', { lat, lon, units: 'metric' })
    console.log('Fetching weather by coords from:', url)
    const response = await api.get(url)
    return response.data
}

export const fetchForecastData = async (cityId: number): Promise<ForecastData> => {
    if (!cityId || isNaN(cityId)) {
        throw new Error('Invalid city ID')
    }

    const url = createApiUrl('forecast', { id: cityId, units: 'metric' })
    console.log('Fetching forecast from:', url)
    const response = await api.get(url)
    return response.data
}

export const fetchForecastByCoords = async (lat: number, lon: number): Promise<ForecastData> => {
    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
        throw new Error('Invalid coordinates')
    }

    const url = createApiUrl('forecast', { lat, lon, units: 'metric' })
    console.log('Fetching forecast by coords from:', url)
    const response = await api.get(url)
    return response.data
}
const selectCity = async (city: City) => {
    console.log('Selecting city (debug):', JSON.parse(JSON.stringify(city)))

    // Если у города нет ID, используем геокодирование по координатам
    if (!city.id || city.id === 0) {
        console.log('City has no ID, trying to get weather by coordinates')

        if (city.coord?.lat && city.coord?.lon) {
            try {
                // Пробуем получить погоду по координатам
                await weatherStore.loadWeatherByCoords(city.coord.lat, city.coord.lon)

                // Получаем ID из загруженных данных
                if (weatherStore.currentWeather?.id) {
                    city.id = weatherStore.currentWeather.id
                    console.log('Got ID from weather data:', city.id)
                }
            } catch (error) {
                console.error('Failed to get weather by coordinates:', error)
                // Используем fallback ID
                city.id = Date.now()
            }
        } else {
            // Если нет координат, используем временный ID
            city.id = Date.now()
        }
    }

    // Если все еще нет ID, создаем временный
    if (!city.id) {
        city.id = Date.now()
    }

    citiesStore.addCity(city)

    // Загружаем погоду
    await weatherStore.loadWeatherData(city.id)

    searchQuery.value = ''
    suggestions.value = []
    showSuggestions.value = false
}
export const searchCities = async (query: string): Promise<City[]> => {
    if (!query || query.trim().length < 2) {
        return []
    }

    const url = createApiUrl('geo/direct', { q: query, limit: 5 })
    console.log('Searching cities from:', url)
    const response = await api.get(url)

    console.log('Search response raw:', response.data)

    if (!Array.isArray(response.data)) {
        console.error('Invalid response format:', response.data)
        return []
    }

    return response.data.map((city: any) => {
        console.log('Processing city:', city)

        // ВАЖНО: OpenWeather geo API не возвращает id!
        // Используем временный ID на основе координат
        const tempId = Math.abs(
            Math.round(city.lat * 1000000) +
            Math.round(city.lon * 1000000)
        )

        return {
            id: tempId, // Временный ID
            name: city.name,
            country: city.country,
            coord: {
                lat: city.lat,
                lon: city.lon
            },
            // Добавляем дополнительные данные для загрузки погоды
            hasRealId: false,
            query: `${city.name},${city.country}`
        }
    })
}
// Загрузка погоды по названию города (не по ID)
export const fetchWeatherByName = async (cityName: string, countryCode?: string): Promise<WeatherData> => {
    const query = countryCode ? `${cityName},${countryCode}` : cityName
    const url = createApiUrl('weather', { q: query, units: 'metric' })
    console.log('Fetching weather by name from:', url)
    const response = await api.get(url)
    return response.data
}

// Загрузка прогноза по названию города
export const fetchForecastByName = async (cityName: string, countryCode?: string): Promise<ForecastData> => {
    const query = countryCode ? `${cityName},${countryCode}` : cityName
    const url = createApiUrl('forecast', { q: query, units: 'metric' })
    console.log('Fetching forecast by name from:', url)
    const response = await api.get(url)
    return response.data
}

export const getCityByCoords = async (lat: number, lon: number): Promise<City> => {
    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
        throw new Error('Invalid coordinates')
    }

    const url = createApiUrl('geo/reverse', { lat, lon, limit: 1 })
    console.log('Getting city by coords from:', url)
    const response = await api.get(url)

    if (!Array.isArray(response.data) || response.data.length === 0) {
        throw new Error('City not found for these coordinates')
    }

    const city = response.data[0]
    return {
        id: city.id,
        name: city.name,
        country: city.country,
        coord: {
            lat: city.lat,
            lon: city.lon
        }
    }
}