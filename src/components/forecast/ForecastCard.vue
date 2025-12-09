<template>
  <div class="forecast-card text-center p-3"
       :class="{ 'selected': isSelected }"
       @click="$emit('click')">
    <div class="forecast-date mb-2">
      <strong>{{ formatDate(forecast.date) }}</strong>
    </div>
    <WeatherIcon :condition="forecast.condition" size="lg" class="mb-2" />
    <div class="forecast-temp mb-2">
      <span class="temp-max me-2">{{ formatTemperature(forecast.temp_day || forecast.temp_max) }}</span>
      <span class="temp-min text-muted">{{ formatTemperature(forecast.temp_min) }}</span>
    </div>
    <div class="forecast-condition small text-muted mb-2">
      {{ getWeatherCondition(forecast.condition) }}
    </div>
    <div class="forecast-details d-flex justify-content-around small">
      <div class="humidity" :title="t('humidity')">
        <i class="bi bi-droplet me-1"></i>
        {{ forecast.humidity }}%
      </div>
      <div class="wind" :title="t('windSpeed')">
        <i class="bi bi-wind me-1"></i>
        {{ Math.round(forecast.wind_speed) }}
      </div>
      <div v-if="forecast.precipitation > 0" class="precipitation text-primary" :title="t('precipitation')">
        <i class="bi bi-cloud-rain me-1"></i>
        {{ Math.round(forecast.precipitation) }}%
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatTemperatureSimple, getWeatherConditionSimple } from '@/utils/weather-formatters'
import { useSettingsStore } from '@/store/settings'
import { useTranslation } from '@/composables/useTranslation'
import WeatherIcon from '@/components/weather/WeatherIcon.vue'
import type { DailyForecast } from '@/types/weather'

interface Props {
  forecast: DailyForecast
  isSelected?: boolean
}

defineProps<Props>()
defineEmits<{
  click: []
}>()

const settingsStore = useSettingsStore()
const { t } = useTranslation()

const formatDate = (date: Date): string => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) {
    return t('today')
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return t('tomorrow')
  } else {
    return t('weekDays')[date.getDay()]
  }
}

const formatTemperature = (temp: number) => {
  return formatTemperatureSimple(temp, settingsStore.temperatureUnit)
}

const getWeatherCondition = (condition: string) => {
  return getWeatherConditionSimple(condition, settingsStore.language)
}
</script>

<style scoped>
.forecast-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  height: 100%;
  transition: all 0.3s ease;
  cursor: pointer;
}

.forecast-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-3px);
}

.forecast-card.selected {
  background: rgba(67, 97, 238, 0.2);
  border-color: #4361ee;
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.2);
}

.theme-dark .forecast-card {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.theme-dark .forecast-card.selected {
  background: rgba(67, 97, 238, 0.3);
}

.forecast-date {
  font-size: 0.9em;
}

.temp-max {
  font-weight: bold;
}

.temp-min {
  font-size: 0.9em;
}

.forecast-details {
  font-size: 0.85em;
}
</style>