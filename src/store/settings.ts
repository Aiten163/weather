import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref } from 'vue'

export interface SettingsState {
    temperatureUnit: 'C' | 'F'
    windSpeedUnit: 'kmh' | 'mph' | 'ms'
    pressureUnit: 'mmHg' | 'hPa'
    language: 'en' | 'ru'
    theme: 'light' | 'dark' | 'auto'
}

export const useSettingsStore = defineStore('settings', () => {
    // Инициализация из localStorage
    const loadFromStorage = <T>(key: string, defaultValue: T): T => {
        const stored = localStorage.getItem(`weather-dashboard-${key}`)
        return stored ? JSON.parse(stored) : defaultValue
    }

    const temperatureUnit: Ref<'C' | 'F'> = ref(loadFromStorage('temperatureUnit', 'C'))
    const windSpeedUnit: Ref<'kmh' | 'mph' | 'ms'> = ref(loadFromStorage('windSpeedUnit', 'kmh'))
    const pressureUnit: Ref<'mmHg' | 'hPa'> = ref(loadFromStorage('pressureUnit', 'mmHg'))
    const language: Ref<'en' | 'ru'> = ref(loadFromStorage('language', 'en'))
    const theme: Ref<'light' | 'dark' | 'auto'> = ref(loadFromStorage('theme', 'auto'))

    // Вычисляемая тема с учетом авторежима
    const computedTheme = computed(() => {
        if (theme.value === 'auto') {
            const hour = new Date().getHours()
            return hour >= 6 && hour < 18 ? 'light' : 'dark'
        }
        return theme.value
    })

    // Мутации
    const setTemperatureUnit = (unit: 'C' | 'F') => {
        temperatureUnit.value = unit
        localStorage.setItem('weather-dashboard-temperatureUnit', JSON.stringify(unit))
    }

    const setWindSpeedUnit = (unit: 'kmh' | 'mph' | 'ms') => {
        windSpeedUnit.value = unit
        localStorage.setItem('weather-dashboard-windSpeedUnit', JSON.stringify(unit))
    }

    const setPressureUnit = (unit: 'mmHg' | 'hPa') => {
        pressureUnit.value = unit
        localStorage.setItem('weather-dashboard-pressureUnit', JSON.stringify(unit))
    }

    const setLanguage = (lang: 'en' | 'ru') => {
        language.value = lang
        localStorage.setItem('weather-dashboard-language', JSON.stringify(lang))
    }

    const setTheme = (newTheme: 'light' | 'dark' | 'auto') => {
        theme.value = newTheme
        localStorage.setItem('weather-dashboard-theme', JSON.stringify(newTheme))
    }

    return {
        temperatureUnit,
        windSpeedUnit,
        pressureUnit,
        language,
        theme,
        computedTheme,
        setTemperatureUnit,
        setWindSpeedUnit,
        setPressureUnit,
        setLanguage,
        setTheme
    }
})