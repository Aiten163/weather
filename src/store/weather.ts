import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import { fetchWeatherByName, fetchForecastByName } from '@/utils/api'
import {
    fetchWeatherData,
    fetchForecastData,
    searchCities,
    fetchWeatherByCoords,
    fetchForecastByCoords,
    getCityByCoords
} from '@/utils/api'
import type { WeatherData, ForecastData, City } from '@/types/weather'

export const useWeatherStore = defineStore('weather', () => {
    const currentWeather: Ref<WeatherData | null> = ref(null)
    const forecast: Ref<ForecastData | null> = ref(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const selectedCity: Ref<City | null> = ref(null)

    const loadWeatherData = async (cityId: number) => {
        if (!cityId || isNaN(cityId)) {
            error.value = 'Invalid city ID'
            return
        }

        isLoading.value = true
        error.value = null

        try {
            console.log(`Loading weather for city ID: ${cityId}`)
            const [weather, forecastData] = await Promise.all([
                fetchWeatherData(cityId),
                fetchForecastData(cityId)
            ])

            console.log('Weather data received:', weather)
            console.log('Forecast data received:', forecastData)

            currentWeather.value = weather
            forecast.value = forecastData

            // Сохраняем последний выбранный город
            if (weather) {
                selectedCity.value = {
                    id: weather.id,
                    name: weather.name,
                    country: weather.sys.country,
                    coord: weather.coord
                }
                saveSelectedCity()
            }
        } catch (err) {
            console.error('Error loading weather:', err)
            error.value = err instanceof Error ? err.message : 'Unknown error'

            // Показываем более понятное сообщение об ошибке
            if (error.value.includes('timeout')) {
                error.value = 'Request timeout. Please check your internet connection.'
            } else if (error.value.includes('City not found')) {
                error.value = 'City not found. Please try another city.'
            } else if (error.value.includes('Invalid API key')) {
                error.value = 'API key error. Please contact administrator.'
            }
        } finally {
            isLoading.value = false
        }
    }

    const loadWeatherByCoords = async (lat: number, lon: number) => {
        if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
            error.value = 'Invalid coordinates'
            return
        }

        isLoading.value = true
        error.value = null

        try {
            // Получаем город по координатам
            const city = await getCityByCoords(lat, lon)

            // Загружаем погоду и прогноз
            const [weather, forecastData] = await Promise.all([
                fetchWeatherByCoords(lat, lon),
                fetchForecastByCoords(lat, lon)
            ])

            currentWeather.value = weather
            forecast.value = forecastData
            selectedCity.value = city

            saveSelectedCity()
        } catch (err) {
            console.error('Error loading weather by coords:', err)
            error.value = err instanceof Error ? err.message : 'Unknown error'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const saveSelectedCity = () => {
        if (selectedCity.value) {
            localStorage.setItem(
                'weather-dashboard-selectedCity',
                JSON.stringify(selectedCity.value)
            )
        }
    }

    const loadSelectedCity = (): City | null => {
        const stored = localStorage.getItem('weather-dashboard-selectedCity')
        return stored ? JSON.parse(stored) : null
    }

    const searchCity = async (query: string): Promise<City[]> => {
        return await searchCities(query)
    }
    const loadWeatherByName = async (cityName: string, countryCode?: string) => {
        if (!cityName || cityName.trim().length === 0) {
            error.value = 'City name is required'
            return
        }

        isLoading.value = true
        error.value = null

        try {
            const [weather, forecastData] = await Promise.all([
                fetchWeatherByName(cityName, countryCode),
                fetchForecastByName(cityName, countryCode)
            ])

            console.log('Weather by name received:', weather)
            console.log('Forecast by name received:', forecastData)

            currentWeather.value = weather
            forecast.value = forecastData

            if (weather) {
                // Убедитесь, что selectedCity устанавливается корректно
                selectedCity.value = {
                    id: weather.id,
                    name: weather.name,
                    country: weather.sys.country,
                    coord: weather.coord,
                    state: weather.sys?.state || '',
                    hasRealId: true
                }

                // Дополнительно сохраняем в localStorage
                localStorage.setItem('last-searched-city', JSON.stringify({
                    id: weather.id,
                    name: weather.name,
                    country: weather.sys.country,
                    lat: weather.coord.lat,
                    lon: weather.coord.lon
                }))

                saveSelectedCity()
            }
        } catch (err) {
            console.error('Error loading weather by name:', err)
            error.value = err instanceof Error ? err.message : 'Unknown error'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // Убедимся что все функции экспортируются
    return {
        // State
        currentWeather,
        forecast,
        isLoading,
        error,
        selectedCity,

        // Actions
        loadWeatherData,
        loadWeatherByCoords,
        searchCity,
        loadSelectedCity,
        loadWeatherByName
    }
})