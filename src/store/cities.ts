// store/cities.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { City } from '@/types/weather'

export const useCitiesStore = defineStore('cities', () => {
    const favorites = ref<City[]>([])

    // Загружаем из localStorage при инициализации
    const loadFromStorage = () => {
        const saved = localStorage.getItem('weather-favorites')
        if (saved) {
            favorites.value = JSON.parse(saved)
        }
    }

    // Сохраняем в localStorage
    const saveToStorage = () => {
        localStorage.setItem('weather-favorites', JSON.stringify(favorites.value))
    }

    // Проверяем, есть ли город в избранном
    const isFavorite = (cityId: number): boolean => {
        return favorites.value.some(city => city.id === cityId)
    }

    // Добавляем город в избранное
    const addToFavorites = (city: City) => {
        // Проверяем, нет ли уже такого города
        if (!isFavorite(city.id)) {
            favorites.value.push(city)
            saveToStorage()
        } else {
            console.warn('Город уже в избранном:', city.name)
        }
    }

    // Удаляем город из избранного
    const removeFromFavorites = (cityId: number) => {
        const index = favorites.value.findIndex(city => city.id === cityId)
        if (index !== -1) {
            favorites.value.splice(index, 1)
            saveToStorage()
        }
    }

    // Переключаем статус избранного
    const toggleFavorite = (city: City) => {
        if (isFavorite(city.id)) {
            removeFromFavorites(city.id)
        } else {
            addToFavorites(city)
        }
    }

    // Очищаем все избранное
    const clearFavorites = () => {
        favorites.value = []
        saveToStorage()
    }

    // Загружаем при создании store
    loadFromStorage()

    return {
        favoriteCities: computed(() => favorites.value),
        isFavorite,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        clearFavorites
    }
})