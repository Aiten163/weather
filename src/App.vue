<template>
  <div id="app" :class="themeClass">
    <Header />
    <main class="container-fluid mt-3">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue' // Добавляем импорт onMounted
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import { useSettingsStore } from '@/store/settings'
import { useWeatherStore } from '@/store/weather'

const settingsStore = useSettingsStore()
const weatherStore = useWeatherStore()

const themeClass = computed(() => ({
  'theme-light': settingsStore.theme === 'light',
  'theme-dark': settingsStore.theme === 'dark'
}))

// Загружаем город по умолчанию при старте
onMounted(async () => {
  // Проверяем есть ли сохраненный город
  const savedCity = weatherStore.loadSelectedCity()

  if (savedCity && savedCity.id) {
    try {
      await weatherStore.loadWeatherData(savedCity.id)
    } catch (error) {
      console.error('Failed to load saved city:', error)
      // Загружаем Москву по умолчанию
      await weatherStore.loadWeatherData(524901)
    }
  } else {
    // Загружаем Москву по умолчанию
    try {
      await weatherStore.loadWeatherData(524901)
    } catch (error) {
      console.error('Failed to load default city:', error)
    }
  }
})
</script>

<style>
#app {
  min-height: 100vh;
  transition: background-color 0.3s ease;
}

.theme-light {
  background-color: #f8f9fa;
  color: #212529;
}

.theme-dark {
  background-color: #212529;
  color: #f8f9fa;
}
</style>