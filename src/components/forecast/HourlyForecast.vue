
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useWeatherStore } from '@/store/weather'
import { useSettingsStore } from '@/store/settings'
import { useTranslation } from '@/composables/useTranslation'
import { formatTemperatureSimple, formatWindSpeedSimple } from '@/utils/weather-formatters'
import WeatherIcon from '@/components/weather/WeatherIcon.vue'
import type { HourlyForecast as HourlyForecastType } from '@/types/weather'

const weatherStore = useWeatherStore()
const settingsStore = useSettingsStore()
const { t } = useTranslation()
const scrollContainer = ref<HTMLElement>()

const hourlyForecast = computed<HourlyForecastType[] | null>(() => {
  if (!weatherStore.forecast) return null

  // Берем первые 24 часа прогноза
  return weatherStore.forecast.list.slice(0, 24).map(item => {
    const time = new Date(item.dt * 1000)

    return {
      time,
      temp: item.main.temp,
      condition: item.weather[0].main,
      icon: item.weather[0].icon,
      humidity: item.main.humidity,
      wind_speed: item.wind.speed,
      wind_direction: item.wind.deg,
      precipitation: item.pop * 100,
      pressure: item.main.pressure
    }
  })
})

const formatTemperature = (temp: number) => {
  return formatTemperatureSimple(temp, settingsStore.temperatureUnit)
}

const formatWindSpeed = (speed: number) => {
  return formatWindSpeedSimple(speed, settingsStore.windSpeedUnit)
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: -200, behavior: 'smooth' })
  }
}

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: 200, behavior: 'smooth' })
  }
}

onMounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollLeft = 0
  }
})
</script>

<style scoped>
.hourly-container {
  position: relative;
}

.hourly-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding: 10px 0;
  scrollbar-width: thin;
}

.hourly-scroll::-webkit-scrollbar {
  height: 6px;
}

.hourly-scroll::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.hourly-scroll::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.hourly-items {
  display: inline-flex;
  gap: 15px;
}

.hourly-item {
  min-width: 120px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  white-space: normal;
  transition: all 0.3s ease;
}

.hourly-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-3px);
}

.theme-dark .hourly-item {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.temperature {
  font-size: 1.2em;
  font-weight: bold;
}
</style>