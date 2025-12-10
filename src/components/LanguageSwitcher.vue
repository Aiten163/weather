<template>
  <div class="dropdown">
    <button class="btn btn-outline-secondary dropdown-toggle" type="button"
            data-bs-toggle="dropdown" aria-expanded="false">
      <i class="bi bi-translate me-1"></i>
      {{ currentLanguageText }}
    </button>
    <ul class="dropdown-menu dropdown-menu-end">
      <li>
        <button class="dropdown-item" @click="setLanguage('en')"
                :class="{ 'active': settingsStore.language === 'en' }">
          <i class="bi bi-flag me-2"></i> English
        </button>
      </li>
      <li>
        <button class="dropdown-item" @click="setLanguage('ru')"
                :class="{ 'active': settingsStore.language === 'ru' }">
          <i class="bi bi-flag-fill me-2"></i> Русский
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '@/store/settings'

const settingsStore = useSettingsStore()

const currentLanguageText = computed(() => {
  return settingsStore.language === 'en' ? 'English' : 'Русский'
})

const setLanguage = (lang: 'en' | 'ru') => {
  settingsStore.setLanguage(lang)
}
</script>