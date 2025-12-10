<template>
  <div class="weather-details">
    <div class="row g-3">
      <div class="col-6">
        <div class="detail-card p-3">
          <div class="d-flex align-items-center mb-2">
            <i class="bi bi-wind me-2"></i>
            <h6 class="mb-0">{{ t('wind') }}</h6>
          </div>
          <div class="wind-info">
            <div class="d-flex align-items-center mb-1">
              <span class="wind-arrow me-2" :style="{ transform: `rotate(${weather.wind.deg}deg)` }">
                ↑
              </span>
              <strong>{{ formatWindSpeed(weather.wind.speed) }}</strong>
            </div>
            <small class="text-muted">
              {{ getWindDirection(weather.wind.deg) }}
              <span v-if="weather.wind.gust">
                · {{ t('gust') }}: {{ formatWindSpeed(weather.wind.gust) }}
              </span>
            </small>
          </div>
        </div>
      </div>

      <div class="col-6">
        <div class="detail-card p-3">
          <div class="d-flex align-items-center mb-2">
            <i class="bi bi-droplet me-2"></i>
            <h6 class="mb-0">{{ t('humidity') }}</h6>
          </div>
          <div>
            <strong>{{ weather.main.humidity }}%</strong>
            <div class="humidity-indicator mt-2" :style="{ width: weather.main.humidity + '%' }"></div>
          </div>
        </div>
      </div>

      <div class="col-6">
        <div class="detail-card p-3">
          <div class="d-flex align-items-center mb-2">
            <i class="bi bi-speedometer2 me-2"></i>
            <h6 class="mb-0">{{ t('pressure') }}</h6>
          </div>
          <div>
            <strong>{{ formatPressure(weather.main.pressure) }}</strong>
            <div class="pressure-indicator mt-2">
              <div class="pressure-value" :style="{ width: getPressurePercentage(weather.main.pressure) + '%' }"></div>
            </div>
            <small class="text-muted d-block mt-1">
              {{ getPressureStatusText(weather.main.pressure) }}
            </small>
          </div>
        </div>
      </div>

      <div class="col-6">
        <div class="detail-card p-3">
          <div class="d-flex align-items-center mb-2">
            <i class="bi bi-eye me-2"></i>
            <h6 class="mb-0">{{ t('visibility') }}</h6>
          </div>
          <div>
            <strong>{{ formatVisibility(weather.visibility) }}</strong>
          </div>
        </div>
      </div>

      <div class="col-12">
        <div class="detail-card p-3">
          <div class="row">
            <div class="col-6">
              <div class="d-flex align-items-center mb-2">
                <i class="bi bi-sunrise me-2"></i>
                <h6 class="mb-0">{{ t('sunrise') }}</h6>
              </div>
              <strong>{{ formatTime(weather.sys.sunrise) }}</strong>
            </div>
            <div class="col-6">
              <div class="d-flex align-items-center mb-2">
                <i class="bi bi-sunset me-2"></i>
                <h6 class="mb-0">{{ t('sunset') }}</h6>
              </div>
              <strong>{{ formatTime(weather.sys.sunset) }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/store/settings'
import { useTranslation } from '@/composables/useTranslation'
import {
  formatWindSpeedSimple,
  formatPressureSimple,
  getWindDirectionSimple,
  getPressureStatusText as getPressureStatusTextFromUtils
} from '@/utils/weather-formatters'
import type { WeatherData } from '@/types/weather'

interface Props {
  weather: WeatherData
}

defineProps<Props>()

const settingsStore = useSettingsStore()
const { t } = useTranslation()

// Форматирование с использованием текущих настроек
const formatWindSpeed = (speed: number) => {
  return formatWindSpeedSimple(speed, settingsStore.windSpeedUnit)
}

const formatPressure = (pressure: number) => {
  return formatPressureSimple(pressure, settingsStore.pressureUnit)
}

const getWindDirection = (degrees: number) => {
  return getWindDirectionSimple(degrees, settingsStore.language)
}

// Используем импортированную функцию (переименованную)
const getPressureStatusText = (pressure: number): string => {
  return getPressureStatusTextFromUtils(pressure, settingsStore.language)
}

const formatVisibility = (meters: number): string => {
  const km = meters / 1000
  return km >= 1 ? `${km.toFixed(1)} km` : `${meters} m`
}

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const getPressurePercentage = (pressure: number): number => {
  // Нормальное давление 1013 hPa
  const min = 970
  const max = 1050
  const normalized = Math.min(Math.max(pressure, min), max)
  return ((normalized - min) / (max - min)) * 100
}
</script>

<style scoped>
.detail-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  height: 100%;
  transition: all 0.3s ease;
}

.detail-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.theme-dark .detail-card {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.wind-arrow {
  display: inline-block;
  font-size: 1.2em;
  transition: transform 0.3s ease;
}

.humidity-indicator {
  height: 6px;
  background: linear-gradient(to right, #4cc9f0, #4361ee);
  border-radius: 3px;
}

.pressure-indicator {
  position: relative;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.pressure-value {
  height: 100%;
  background: linear-gradient(to right, #ef233c, #f72585, #4cc9f0);
  border-radius: 4px;
}

.theme-dark .pressure-indicator {
  background: rgba(255, 255, 255, 0.1);
}
</style>