<template>
  <div class="city-card card">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h5 class="card-title mb-1">{{ city.name }}</h5>
          <p class="card-subtitle text-muted mb-0">{{ city.country }}</p>
        </div>
        <div class="btn-group">
          <button class="btn btn-sm btn-outline-primary"
                  @click="toggleFavorite"
                  :title="isFavorite ? 'Remove from favorites' : 'Add to favorites'">
            <i :class="isFavorite ? 'bi bi-star-fill' : 'bi bi-star'"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger"
                  @click="removeCity"
                  title="Remove city">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>

      <div v-if="weather" class="weather-preview">
        <div class="d-flex align-items-center mb-2">
          <WeatherIcon :condition="weather.weather[0].main" size="lg" class="me-3" />
          <div>
            <div class="display-6">{{ formatTemperature(weather.main.temp) }}</div>
            <small class="text-muted">
              {{ getWeatherCondition(weather.weather[0].main, settingsStore.language) }}
            </small>
          </div>
        </div>

        <div class="row g-2 small">
          <div class="col-6">
            <i class="bi bi-droplet me-1"></i>
            {{ weather.main.humidity }}%
          </div>
          <div class="col-6">
            <i class="bi bi-wind me-1"></i>
            {{ formatWindSpeed(weather.wind.speed) }}
          </div>
        </div>
      </div>

      <div v-else class="text-center py-3">
        <div class="spinner-border spinner-border-sm" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>

    <div class="card-footer bg-transparent border-top-0">
      <button class="btn btn-sm btn-outline-primary w-100" @click="selectCity">
        {{ t('viewDetails') || 'View Details' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWeatherStore } from '@/store/weather'
import { useCitiesStore } from '@/store/cities'
import { useSettingsStore } from '@/store/settings'
import { formatTemperature, formatWindSpeed, getWeatherCondition } from '@/utils/weather-formatters'
import { useTranslation } from '@/composables/useTranslation'
import WeatherIcon from '@/components/weather/WeatherIcon.vue'
import type { City, WeatherData } from '@/types/weather'

interface Props {
  city: City
}

const props = defineProps<Props>()
const weatherStore = useWeatherStore()
const citiesStore = useCitiesStore()
const settingsStore = useSettingsStore()
const { t } = useTranslation()

const weather = ref<WeatherData | null>(null)
const isFavorite = ref(false)

onMounted(async () => {
  await loadWeather()
  isFavorite.value = citiesStore.isFavorite(props.city.id)
})

const loadWeather = async () => {
  try {
    // Удалите присваивание переменной, если она не используется
    await weatherStore.loadWeatherData(props.city.id)
  } catch (error) {
    console.error('Error loading weather:', error)
  }
}

const toggleFavorite = () => {
  if (isFavorite.value) {
    citiesStore.removeFromFavorites(props.city.id)
  } else {
    citiesStore.addToFavorites(props.city)
  }
  isFavorite.value = !isFavorite.value
}

const removeCity = () => {
  if (confirm(t('confirmRemove') || 'Remove this city?')) {
    citiesStore.removeFromFavorites(props.city.id)
  }
}

const selectCity = async () => {
  await weatherStore.loadWeatherData(props.city.id)
}
</script>

<style scoped>
.city-card {
  transition: all 0.3s ease;
}

.city-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.weather-preview {
  min-height: 100px;
}
</style>