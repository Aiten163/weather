import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { City } from '@/types/weather'

export const useCitiesStore = defineStore('cities', () => {
    const cities: Ref<City[]> = ref([])
    const favoriteCities: Ref<City[]> = ref([])

    // Загрузка из localStorage
    const loadFromStorage = () => {
        const storedCities = localStorage.getItem('weather-dashboard-cities')
        const storedFavorites = localStorage.getItem('weather-dashboard-favoriteCities')

        if (storedCities) {
            cities.value = JSON.parse(storedCities)
        }
        if (storedFavorites) {
            favoriteCities.value = JSON.parse(storedFavorites)
        }
    }

    // Сохранение в localStorage
    const saveToStorage = () => {
        localStorage.setItem('weather-dashboard-cities', JSON.stringify(cities.value))
        localStorage.setItem('weather-dashboard-favoriteCities', JSON.stringify(favoriteCities.value))
    }

    // Добавление города
    const addCity = (city: City) => {
        if (!cities.value.some(c => c.id === city.id)) {
            cities.value.push(city)
            saveToStorage()
        }
    }

    // Удаление города
    const removeCity = (cityId: number) => {
        cities.value = cities.value.filter(c => c.id !== cityId)
        favoriteCities.value = favoriteCities.value.filter(c => c.id !== cityId)
        saveToStorage()
    }

    // Добавление в избранное
    const addToFavorites = (city: City) => {
        if (!favoriteCities.value.some(c => c.id === city.id)) {
            favoriteCities.value.push(city)
            saveToStorage()
        }
    }

    // Удаление из избранного
    const removeFromFavorites = (cityId: number) => {
        favoriteCities.value = favoriteCities.value.filter(c => c.id !== cityId)
        saveToStorage()
    }

    // Проверка, является ли город избранным
    const isFavorite = (cityId: number) => {
        return favoriteCities.value.some(c => c.id === cityId)
    }

    // Инициализация
    loadFromStorage()

    return {
        cities,
        favoriteCities,
        addCity,
        removeCity,
        addToFavorites,
        removeFromFavorites,
        isFavorite
    }
})