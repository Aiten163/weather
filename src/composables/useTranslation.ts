import { ref } from 'vue'
import { translations } from '@/locales/index'

export const currentLocale = ref('en')

// Экспортируйте функцию useTranslation
export const useTranslation = () => {
    const t = (key: string): string => {
        const langTranslations = translations[currentLocale.value as keyof typeof translations]
        const typedTranslations = langTranslations as Record<string, string>
        return typedTranslations[key] || (translations.en as Record<string, string>)[key] || key
    }

    const setLocale = (locale: 'en' | 'ru') => {
        currentLocale.value = locale
    }

    return { t, currentLocale, setLocale }
}

// Или оставьте как было, но экспортируйте t отдельно
export const t = (key: string): string => {
    const langTranslations = translations[currentLocale.value as keyof typeof translations]
    const typedTranslations = langTranslations as Record<string, string>
    return typedTranslations[key] || (translations.en as Record<string, string>)[key] || key
}

export const setLocale = (locale: 'en' | 'ru') => {
    currentLocale.value = locale
}