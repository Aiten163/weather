import { computed } from 'vue'
import { useSettingsStore } from '@/store/settings'
import { translations } from '@/locales'

export const useTranslation = () => {
    const settingsStore = useSettingsStore()

    const t = (key: string): string => {
        const lang = settingsStore.language
        const langTranslations = translations[lang]

        // Возвращаем перевод или оригинальный ключ, если перевод не найден
        return langTranslations[key] || translations.en[key] || key
    }

    const currentLanguage = computed(() => settingsStore.language)

    return { t, currentLanguage }
}