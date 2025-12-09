

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWeatherStore } from '@/store/weather'
import { useSettingsStore } from '@/store/settings'
import { useTranslation } from '@/composables/useTranslation'
import WeatherIcon from '@/components/weather/WeatherIcon.vue'
import type { DailyForecast, HourlyForecast } from '@/types/weather'

const weatherStore = useWeatherStore()
const settingsStore = useSettingsStore()
const { t } = useTranslation()

const selectedDay = ref<DailyForecast | null>(null)

const dailyForecast = computed<DailyForecast[] | null>(() => {
  if (!weatherStore.forecast?.list) return null

  const dailyData: Record<string, any[]> = {}

  // Группируем по дням
  weatherStore.forecast.list.forEach(item => {
    const date = new Date(item.dt * 1000)
    const dateKey = date.toDateString()

    if (!dailyData[dateKey]) {
      dailyData[dateKey] = []
    }
    dailyData[dateKey].push(item)
  })

  // Берем первые 7 дней
  const days = Object.keys(dailyData).slice(0, 7)

  return days.map(dateKey => {
    const dayData = dailyData[dateKey]
    const temps = dayData.map(d => d.main.temp)

    // Находим дневной прогноз (12:00-15:00)
    const dayItem = dayData.find(d => {
      const hour = new Date(d.dt * 1000).getHours()
      return hour >= 12 && hour <= 15
    }) || dayData[0]

    // Средняя дневная температура (9:00-18:00)
    const daytimeTemps = dayData.filter(d => {
      const hour = new Date(d.dt * 1000).getHours()
      return hour >= 9 && hour <= 18
    }).map(d => d.main.temp)

    const avgDayTemp = daytimeTemps.length > 0
        ? daytimeTemps.reduce((a, b) => a + b, 0) / daytimeTemps.length
        : dayItem.main.temp

    return {
      date: new Date(dateKey),
      temp_day: avgDayTemp,
      temp_min: Math.min(...temps),
      temp_max: Math.max(...temps),
      condition: dayItem.weather[0].main,
      description: dayItem.weather[0].description,
      humidity: Math.round(dayData.reduce((sum, d) => sum + d.main.humidity, 0) / dayData.length),
      wind_speed: Math.round(dayData.reduce((sum, d) => sum + d.wind.speed, 0) / dayData.length * 10) / 10,
      precipitation: Math.max(...dayData.map(d => (d.pop || 0) * 100)),
      cloudiness: Math.round(dayData.reduce((sum, d) => sum + d.clouds.all, 0) / dayData.length),
      pressure: Math.round(dayData.reduce((sum, d) => sum + d.main.pressure, 0) / dayData.length),
      hourly_data: dayData.map(item => ({
        time: new Date(item.dt * 1000),
        temp: item.main.temp,
        condition: item.weather[0].main,
        precipitation: (item.pop || 0) * 100,
        humidity: item.main.humidity,
        wind_speed: item.wind.speed
      }))
    }
  })
})

// Детали погоды для выбранного дня
const weatherDetails = computed(() => {
  if (!selectedDay.value) return []

  return [
    {
      icon: 'bi bi-thermometer-low',
      label: t('min'),
      value: formatTemperature(selectedDay.value.temp_min)
    },
    {
      icon: 'bi bi-thermometer-high',
      label: t('max'),
      value: formatTemperature(selectedDay.value.temp_max)
    },
    {
      icon: 'bi bi-droplet',
      label: t('humidity'),
      value: `${selectedDay.value.humidity}%`
    },
    {
      icon: 'bi bi-wind',
      label: t('windSpeed'),
      value: formatWindSpeed(selectedDay.value.wind_speed)
    },
    {
      icon: 'bi bi-cloud-rain',
      label: t('precipitation'),
      value: `${Math.round(selectedDay.value.precipitation)}%`
    },
    {
      icon: 'bi bi-cloud',
      label: t('cloudiness'),
      value: `${selectedDay.value.cloudiness}%`
    }
  ]
})

// Функции форматирования
const formatTemperature = (temp: number) => {
  const unit = settingsStore.temperatureUnit
  if (unit === 'F') {
    return `${Math.round((temp * 9/5) + 32)}°F`
  }
  return `${Math.round(temp)}°C`
}

const formatWindSpeed = (speed: number) => {
  const unit = settingsStore.windSpeedUnit
  switch (unit) {
    case 'kmh':
      return `${Math.round(speed * 3.6)} km/h`
    case 'mph':
      return `${Math.round(speed * 2.237)} mph`
    case 'ms':
    default:
      return `${Math.round(speed * 10) / 10} m/s`
  }
}

const getWeatherCondition = (condition: string) => {
  const conditions = {
    en: {
      'clear': 'Clear',
      'clouds': 'Cloudy',
      'rain': 'Rain',
      'snow': 'Snow',
      'thunderstorm': 'Thunderstorm',
      'drizzle': 'Drizzle',
      'mist': 'Mist',
      'fog': 'Fog'
    },
    ru: {
      'clear': 'Ясно',
      'clouds': 'Облачно',
      'rain': 'Дождь',
      'snow': 'Снег',
      'thunderstorm': 'Гроза',
      'drizzle': 'Морось',
      'mist': 'Туман',
      'fog': 'Туман'
    }
  }

  const key = condition.toLowerCase()
  return conditions[settingsStore.language][key] || condition
}

const getDayTitle = (date: Date): string => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) {
    return t('today')
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return t('tomorrow')
  } else {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const daysRu = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
    return settingsStore.language === 'ru'
        ? daysRu[date.getDay()]
        : days[date.getDay()]
  }
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString([], {
    day: 'numeric',
    month: 'short'
  })
}

const formatDateFull = (date: Date): string => {
  return date.toLocaleDateString([], {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatHour = (date: Date): string => {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const selectDay = (day: DailyForecast) => {
  selectedDay.value = day
}

const isToday = (date: Date): boolean => {
  return date.toDateString() === new Date().toDateString()
}

const getHoursForSelectedDay = (): HourlyForecast[] => {
  if (!selectedDay.value?.hourly_data) return []
  // Берем каждые 3 часа для лучшей читаемости
  return selectedDay.value.hourly_data.filter((_, index) => index % 3 === 0).slice(0, 8)
}
</script>

<style scoped>
.daily-forecast {
  position: relative;
}

.forecast-days {
  transition: all 0.3s ease;
}

.day-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.day-card:hover {
  transform: translateY(-5px);
  border-color: var(--bs-primary);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.today-highlight {
  border-color: var(--bs-primary);
  background-color: rgba(var(--bs-primary-rgb), 0.05);
}

.weather-icon-large {
  font-size: 4rem;
}

.detail-card {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  height: 100%;
}

.detail-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.theme-dark .detail-card {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.detail-icon {
  font-size: 1.5rem;
  color: var(--bs-primary);
}

.detail-label {
  margin-bottom: 0.25rem;
}

.hourly-forecast-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 10px;
}

.hourly-items {
  display: inline-flex;
  gap: 1rem;
  min-width: 100%;
}

.hourly-item {
  min-width: 100px;
  padding: 1rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.hourly-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.theme-dark .hourly-item {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.hour-time {
  font-size: 0.9rem;
}

.hour-temp {
  font-size: 1.2rem;
}

.temp-max {
  font-size: 1.2rem;
  color: #ff6b6b;
}

.temp-min {
  font-size: 1rem;
  color: #4dabf7;
}

.clickable {
  cursor: pointer;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.selected-day-details {
  animation: fadeIn 0.3s ease;
}
</style>