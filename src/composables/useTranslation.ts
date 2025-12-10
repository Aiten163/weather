// src/composables/useTranslation.ts
import { useSettingsStore } from '@/store/settings'
import { translations } from '@/locales/index'

export const useTranslation = () => {
    const settingsStore = useSettingsStore()

    const t = (key: string): string => {
        const lang = settingsStore.language || 'en'
        const langTranslations = translations[lang as keyof typeof translations]

        // Для простых строк
        if (typeof langTranslations === 'object' && key in langTranslations) {
            const value = langTranslations[key as keyof typeof langTranslations]
            if (typeof value === 'string') {
                return value
            }
        }

        // Для вложенных объектов (например, uvIndexCategory.low)
        const keys = key.split('.')
        let current: any = langTranslations

        for (const k of keys) {
            if (current && typeof current === 'object' && k in current) {
                current = current[k]
            } else {
                // Fallback to English
                const enTranslations = translations.en
                let enCurrent: any = enTranslations
                let found = true

                for (const enKey of keys) {
                    if (enCurrent && typeof enCurrent === 'object' && enKey in enCurrent) {
                        enCurrent = enCurrent[enKey]
                    } else {
                        found = false
                        break
                    }
                }

                if (found && typeof enCurrent === 'string') {
                    return enCurrent
                }

                return key
            }
        }

        return typeof current === 'string' ? current : key
    }

    return { t }
}