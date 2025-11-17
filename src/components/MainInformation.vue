<script setup lang="ts">
import { computed } from 'vue'

interface WeatherData {
  current: {
    temperature: number
    feels_like: number
    humidity: number
    wind_speed: number
    weather_code: number
    time: string
  }
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    apparent_temperature_max: number[]
    apparent_temperature_min: number[]
    relative_humidity_2m_max: number[]
    wind_speed_10m_max: number[]
  }
  location: {
    name: string
    country: string
  }
}

const props = defineProps<{
  weatherData: WeatherData
  selectedDayIndex: number
}>()

// Функция для получения описания погоды по коду
const getWeatherInfo = (code: number) => {
  const weatherMap: { [key: number]: { description: string, emoji: string } } = {
    0: { description: 'Ясно', emoji: '☀️' },
    1: { description: 'Преимущественно ясно', emoji: '🌤️' },
    2: { description: 'Переменная облачность', emoji: '⛅' },
    3: { description: 'Пасмурно', emoji: '☁️' },
    45: { description: 'Туман', emoji: '🌫️' },
    48: { description: 'Иней', emoji: '❄️' },
    51: { description: 'Морось', emoji: '🌦️' },
    53: { description: 'Морось', emoji: '🌦️' },
    55: { description: 'Сильная морось', emoji: '🌧️' },
    61: { description: 'Небольшой дождь', emoji: '🌦️' },
    63: { description: 'Дождь', emoji: '🌧️' },
    65: { description: 'Сильный дождь', emoji: '⛈️' },
    80: { description: 'Ливень', emoji: '🌧️' },
    81: { description: 'Ливень', emoji: '🌧️' },
    82: { description: 'Сильный ливень', emoji: '⛈️' },
    71: { description: 'Снег', emoji: '❄️' },
    73: { description: 'Снег', emoji: '🌨️' },
    75: { description: 'Сильный снег', emoji: '❄️' },
    77: { description: 'Град', emoji: '🌨️' },
    95: { description: 'Гроза', emoji: '⛈️' },
    96: { description: 'Гроза', emoji: '⛈️' },
    99: { description: 'Сильная гроза', emoji: '⛈️' }
  }

  return weatherMap[code] || { description: 'Неизвестно', emoji: '🌈' }
}

// Форматирование даты
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }
  return date.toLocaleDateString('ru-RU', options)
}

// Получаем данные для выбранного дня
const selectedDayData = computed(() => {
  if (props.selectedDayIndex === 0) {
    // Сегодня - используем текущие данные
    return {
      temperature: props.weatherData.current.temperature,
      feels_like: props.weatherData.current.feels_like,
      humidity: props.weatherData.current.humidity,
      wind_speed: props.weatherData.current.wind_speed,
      weather_code: props.weatherData.current.weather_code,
      time: props.weatherData.current.time,
      isToday: true
    }
  } else {
    // Будущие дни - используем дневные данные
    const index = props.selectedDayIndex
    return {
      temperature: (props.weatherData.daily.temperature_2m_max[index] + props.weatherData.daily.temperature_2m_min[index]) / 2,
      feels_like: (props.weatherData.daily.apparent_temperature_max[index] + props.weatherData.daily.apparent_temperature_min[index]) / 2,
      humidity: props.weatherData.daily.relative_humidity_2m_max[index],
      wind_speed: props.weatherData.daily.wind_speed_10m_max[index],
      weather_code: props.weatherData.daily.weather_code[index],
      time: props.weatherData.daily.time[index],
      isToday: false
    }
  }
})

const weatherInfo = computed(() => getWeatherInfo(selectedDayData.value.weather_code))
const currentDate = computed(() => formatDate(selectedDayData.value.time))
</script>

<template>
  <div class="main-info">
    <div class="location-section">
      <div class="location">{{ weatherData.location.name }}</div>
      <div class="date">{{ currentDate }}</div>
      <div v-if="selectedDayIndex === 0" class="today-badge">Сегодня</div>
    </div>

    <div class="weather-display">
      <div class="weather-emoji">{{ weatherInfo.emoji }}</div>
      <div class="temperature">{{ Math.round(selectedDayData.temperature) }}°</div>
      <div class="weather-desc">{{ weatherInfo.description }}</div>
    </div>

    <div class="weather-feels-like">
      Ощущается как {{ Math.round(selectedDayData.feels_like) }}°
    </div>

    <div class="weather-metrics">
      <div class="metric-item">
        <div class="metric-value">{{ Math.round(selectedDayData.humidity) }}%</div>
        <div class="metric-label">Влажность</div>
      </div>
      <div class="metric-divider"></div>
      <div class="metric-item">
        <div class="metric-value">{{ Math.round(selectedDayData.wind_speed) }} м/с</div>
        <div class="metric-label">Ветер</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-info {
  padding: 1.5rem;
  color: #4a4946;
}

.location-section {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
}

.location {
  font-size: 1.25rem;
  font-weight: 600;
  color: #4a4946;
  margin-bottom: 0.25rem;
}

.date {
  font-size: 0.9rem;
  color: #8a8986;
  font-weight: 400;
  margin-bottom: 0.5rem;
}

.today-badge {
  display: inline-block;
  background: #e8e6e1;
  color: #6c6b67;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.weather-display {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid #f0efec;
  border-top: 1px solid #f0efec;
}

.weather-emoji {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.temperature {
  font-size: 3.5rem;
  font-weight: 300;
  color: #4a4946;
  margin-bottom: 0.25rem;
  line-height: 1;
}

.weather-desc {
  font-size: 1rem;
  color: #8a8986;
  font-weight: 400;
}

.weather-feels-like {
  text-align: center;
  font-size: 0.9rem;
  color: #8a8986;
  margin-bottom: 1.5rem;
  font-style: italic;
}

.weather-metrics {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.metric-item {
  text-align: center;
}

.metric-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #4a4946;
  margin-bottom: 0.25rem;
}

.metric-label {
  font-size: 0.8rem;
  color: #8a8986;
  font-weight: 400;
}

.metric-divider {
  width: 1px;
  height: 30px;
  background: #e8e6e1;
}

@media (max-width: 480px) {
  .main-info {
    padding: 1.25rem;
  }

  .location {
    font-size: 1.1rem;
  }

  .weather-emoji {
    font-size: 2.5rem;
  }

  .temperature {
    font-size: 3rem;
  }

  .weather-metrics {
    gap: 1rem;
  }
}
</style>