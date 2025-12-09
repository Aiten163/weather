<template>
  <div class="current-weather">
    <!-- Панель с кнопками дней (всегда сверху) -->
    <div class="day-selector-wrapper card">
      <div class="card-body">
        <div class="day-selector" v-if="dailyForecast">
          <!-- Кнопка для текущей погоды -->
          <button class="day-button"
                  :class="{ 'active': selectedDayIndex === -1 }"
                  @click="selectCurrentDay">
            <div class="day-button-inner">
              <div class="day-icon">
                <i class="bi bi-sun"></i>
              </div>
              <div class="day-name">{{ t('now') }}</div>
              <div class="day-date mobile-hidden">{{ getCurrentDate() }}</div>
              <div class="day-temp current">
                {{ formatTemperatureCompact(weatherStore.currentWeather?.main.temp || 0) }}°
              </div>
              <div class="day-extra">
                <div class="day-humidity">
                  <i class="bi bi-droplet"></i>
                  {{ getCurrentHumidity() }}%
                </div>
              </div>
            </div>
          </button>

          <!-- Кнопки для дней прогноза -->
          <button v-for="(day, index) in dailyForecast"
                  :key="day.date.getTime()"
                  class="day-button"
                  :class="{ 'active': selectedDayIndex === index }"
                  @click="selectForecastDay(index)">
            <div class="day-button-inner">
              <div class="day-icon">
                <WeatherIcon :condition="day.condition" size="xs" />
              </div>
              <div class="day-name">{{ getDayShortTitle(day.date) }}</div>
              <div class="day-date mobile-hidden">{{ getDayDate(day.date) }}</div>
              <div class="day-temp">
                <div class="temp-range">
                  <span class="temp-max">{{ formatTemperatureCompact(day.temp_max) }}°</span>
                  <span class="temp-min mobile-hidden">{{ formatTemperatureCompact(day.temp_min) }}°</span>
                </div>
              </div>
              <div class="day-extra">
                <div v-if="day.precipitation > 0" class="day-precipitation">
                  <i class="bi bi-cloud-rain mobile-hidden"></i>
                  <span>{{ Math.round(day.precipitation) }}%</span>
                </div>
                <div v-else class="day-precipitation empty">
                  —
                </div>
                <div class="day-humidity">
                  <i class="bi bi-droplet mobile-hidden"></i>
                  <span>{{ day.humidity }}%</span>
                </div>
              </div>
            </div>
          </button>
        </div>

        <!-- Индикатор загрузки для дней -->
        <div v-else class="text-center py-3">
          <div class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">{{ t('loading') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Основная информация о погоде -->
    <div class="main-weather-info card">
      <div class="card-body">
        <div v-if="weatherStore.isLoading" class="text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">{{ t('loading') }}</span>
          </div>
        </div>

        <div v-else-if="weatherStore.error" class="text-center py-5">
          <div class="alert alert-danger">
            <i class="bi bi-exclamation-triangle me-2"></i>
            {{ weatherStore.error }}
          </div>
          <button class="btn btn-outline-primary mt-3" @click="retry">
            <i class="bi bi-arrow-clockwise me-1"></i>
            {{ t('retry') }}
          </button>
        </div>

        <div v-else-if="selectedDayData || weatherStore.currentWeather" class="weather-content">
          <div class="row g-3">
            <!-- Левая колонка: Основная информация -->
            <div class="col-12 col-lg-5">
              <div class="weather-summary">
                <!-- Город и дата -->
                <div class="weather-header mb-4">
                  <h1 class="city-name h3 fw-bold mb-2">
                    {{ displayWeather.cityName }}
                    <span v-if="selectedDayIndex >= 0" class="day-badge">
                      {{ getDayTitle(displayWeather.date) }}
                    </span>
                  </h1>
                  <div class="date-time">
                    <div v-if="selectedDayIndex >= 0" class="date-info">
                      <i class="bi bi-calendar3 me-2"></i>
                      {{ formatDate(displayWeather.date) }}
                    </div>
                    <div v-else class="time-info">
                      <i class="bi bi-clock me-2"></i>
                      {{ formatTime(displayWeather.time) }}
                      <span class="date-text ms-3">
                        <i class="bi bi-calendar3 me-2"></i>
                        {{ formatDate(displayWeather.date) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Температура и состояние -->
                <div class="temperature-section mb-4">
                  <div class="main-temperature">
                    <h2 class="display-4 fw-bold">
                      {{ formatTemperature(displayWeather.temp) }}
                    </h2>
                    <div class="temperature-range mt-2">
                      <span class="temp-min">
                        <i class="bi bi-thermometer-low me-1"></i>
                        {{ t('min') }}: {{ formatTemperature(displayWeather.temp_min) }}
                      </span>
                      <span class="separator mx-2">•</span>
                      <span class="temp-max">
                        <i class="bi bi-thermometer-high me-1"></i>
                        {{ t('max') }}: {{ formatTemperature(displayWeather.temp_max) }}
                      </span>
                    </div>
                  </div>

                  <div class="weather-condition mt-4">
                    <div class="condition-icon">
                      <WeatherIcon :condition="displayWeather.condition" size="xl" />
                    </div>
                    <div class="condition-details">
                      <div class="condition-text fw-bold">
                        {{ getWeatherCondition(displayWeather.condition) }}
                      </div>
                      <div class="feels-like mt-1">
                        <i class="bi bi-thermometer-half me-1"></i>
                        {{ t('feelsLike') }} {{ formatTemperature(displayWeather.feels_like) }}
                      </div>
                      <div class="condition-description small text-muted mt-1">
                        {{ displayWeather.description }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Кнопка избранного -->
                <div class="favorite-section">
                  <button class="btn favorite-btn w-100"
                          :class="isCurrentFavorite ? 'btn-danger' : 'btn-outline-danger'"
                          @click="toggleFavorite">
                    <i :class="isCurrentFavorite ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
                    <span class="ms-2">
                      {{ isCurrentFavorite ? t('removeFromFavorites') : t('addToFavorites') }}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Правая колонка: Детали погоды -->
            <div class="col-12 col-lg-7">
              <div class="weather-details">
                <h3 class="details-title h5 mb-3">
                  <i class="bi bi-info-circle me-2"></i>
                  {{ t('weatherDetails') }}
                </h3>

                <div class="details-grid">
                  <div class="detail-item">
                    <div class="detail-icon">
                      <i class="bi bi-droplet"></i>
                    </div>
                    <div class="detail-content">
                      <div class="detail-label">{{ t('humidity') }}</div>
                      <div class="detail-value">{{ displayWeather.humidity }}%</div>
                    </div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-icon">
                      <i class="bi bi-wind"></i>
                    </div>
                    <div class="detail-content">
                      <div class="detail-label">{{ t('windSpeed') }}</div>
                      <div class="detail-value">{{ formatWindSpeed(displayWeather.wind_speed) }}</div>
                    </div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-icon">
                      <i class="bi bi-speedometer2"></i>
                    </div>
                    <div class="detail-content">
                      <div class="detail-label">{{ t('pressure') }}</div>
                      <div class="detail-value">{{ displayWeather.pressure }} hPa</div>
                    </div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-icon">
                      <i class="bi bi-cloud"></i>
                    </div>
                    <div class="detail-content">
                      <div class="detail-label">{{ t('cloudiness') }}</div>
                      <div class="detail-value">{{ displayWeather.cloudiness }}%</div>
                    </div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-icon">
                      <i class="bi bi-eye"></i>
                    </div>
                    <div class="detail-content">
                      <div class="detail-label">{{ t('visibility') }}</div>
                      <div class="detail-value">{{ formatVisibility(displayWeather.visibility) }}</div>
                    </div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-icon">
                      <i class="bi bi-cloud-rain"></i>
                    </div>
                    <div class="detail-content">
                      <div class="detail-label">{{ t('precipitation') }}</div>
                      <div class="detail-value">{{ Math.round(displayWeather.precipitation) }}%</div>
                    </div>
                  </div>
                </div>

                <!-- Восход/закат только для текущего дня -->
                <div v-if="selectedDayIndex === -1 && weatherStore.currentWeather"
                     class="sun-info mt-4">
                  <div class="row g-2">
                    <div class="col-6">
                      <div class="sun-card">
                        <div class="sun-icon sunrise">
                          <i class="bi bi-sunrise"></i>
                        </div>
                        <div class="sun-content">
                          <div class="sun-label">{{ t('sunrise') }}</div>
                          <div class="sun-time">
                            {{ formatTimeFromTimestamp(weatherStore.currentWeather.sys.sunrise) }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="sun-card">
                        <div class="sun-icon sunset">
                          <i class="bi bi-sunset"></i>
                        </div>
                        <div class="sun-content">
                          <div class="sun-label">{{ t('sunset') }}</div>
                          <div class="sun-time">
                            {{ formatTimeFromTimestamp(weatherStore.currentWeather.sys.sunset) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-5">
          <i class="bi bi-cloud-slash text-muted" style="font-size: 3em;"></i>
          <p class="text-muted mt-3">{{ t('noWeatherData') }}</p>
          <button class="btn btn-outline-primary mt-2" @click="useDefaultCity">
            <i class="bi bi-house me-1"></i>
            {{ t('loadDefault') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Почасовой прогноз -->
    <div v-if="hourlyData && hourlyData.length > 0" class="hourly-forecast card">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="hourly-title mb-0">
            <i class="bi bi-clock-history me-2"></i>
            {{ t('hourlyForecast') }}
          </h5>
          <div class="selected-day-info">
            <span v-if="selectedDayIndex === -1">{{ t('next24Hours') }}</span>
            <span v-else>{{ getDayTitle(displayWeather.date) }}</span>
          </div>
        </div>

        <div class="hourly-scroll-container">
          <div class="hourly-items">
            <div v-for="hour in hourlyData"
                 :key="hour.time.getTime()"
                 class="hourly-item">
              <div class="hour-time">{{ formatHour(hour.time) }}</div>
              <div class="hour-icon">
                <WeatherIcon :condition="hour.condition" size="md" />
              </div>
              <div class="hour-temp">{{ formatTemperature(hour.temp) }}</div>
              <div v-if="hour.precipitation > 0" class="hour-precipitation">
                <i class="bi bi-cloud-rain"></i>
                {{ Math.round(hour.precipitation) }}%
              </div>
              <div v-else class="hour-precipitation empty">
                —
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useWeatherStore } from '@/store/weather'
import { useCitiesStore } from '@/store/cities'
import { useSettingsStore } from '@/store/settings'
import { useTranslation } from '@/composables/useTranslation'
import WeatherIcon from '@/components/weather/WeatherIcon.vue'
import type { DailyForecast } from '@/types/weather'

const weatherStore = useWeatherStore()
const citiesStore = useCitiesStore()
const settingsStore = useSettingsStore()
const { t } = useTranslation()

const selectedDayIndex = ref<number>(-1)
const selectedDayData = ref<DailyForecast | null>(null)

// Получаем 10-дневный прогноз (7+3 дополнительных)
const dailyForecast = computed<DailyForecast[] | null>(() => {
  if (!weatherStore.forecast?.list) return null

  const dailyData: Record<string, any[]> = {}

  // Сортируем данные по времени
  const sortedList = [...weatherStore.forecast.list].sort((a, b) => a.dt - b.dt)

  // Собираем все доступные дни из прогноза (OpenWeather дает 5 дней по 3 часа = 40 записей)
  sortedList.forEach(item => {
    const date = new Date(item.dt * 1000)
    // Создаем ключ только по дню (без времени)
    const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

    if (!dailyData[dateKey]) {
      dailyData[dateKey] = []
    }
    dailyData[dateKey].push(item)
  })

  // Получаем все дни и сортируем их
  const days = Object.keys(dailyData).sort()

  // Берем 10 дней или все доступные
  const forecastDays = days.slice(0, 10)

  return forecastDays.map(dateKey => {
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

    // Рассчитываем среднюю влажность для дня
    const avgHumidity = Math.round(
        dayData.reduce((sum, d) => sum + (d.main.humidity || 0), 0) / dayData.length
    )

    // Максимальная вероятность осадков
    const maxPrecipitation = Math.max(...dayData.map(d => {
      // Проверяем разные возможные поля с вероятностью осадков
      const pop = d.pop || d.rain?.['3h'] || d.snow?.['3h'] || 0
      return Math.min(pop * 100, 100)
    }))

    // Средняя облачность
    const avgCloudiness = Math.round(
        dayData.reduce((sum, d) => sum + (d.clouds?.all || 0), 0) / dayData.length
    )

    // Среднее давление
    const avgPressure = Math.round(
        dayData.reduce((sum, d) => sum + (d.main.pressure || 1013), 0) / dayData.length
    )

    // Средняя скорость ветра
    const avgWindSpeed = Math.round(
        (dayData.reduce((sum, d) => sum + (d.wind?.speed || 0), 0) / dayData.length) * 10
    ) / 10

    // Получаем дату из ключа
    const [year, month, day] = dateKey.split('-').map(Number)
    const date = new Date(year, month - 1, day)

    return {
      date: date,
      temp: avgDayTemp,
      temp_min: Math.min(...temps),
      temp_max: Math.max(...temps),
      condition: dayItem.weather[0].main,
      description: dayItem.weather[0].description,
      humidity: avgHumidity,
      wind_speed: avgWindSpeed,
      precipitation: maxPrecipitation,
      cloudiness: avgCloudiness,
      pressure: avgPressure,
      hourly_data: dayData.map(item => ({
        time: new Date(item.dt * 1000),
        temp: item.main.temp,
        condition: item.weather[0].main,
        precipitation: (item.pop || 0) * 100
      })),
      feels_like: dayItem.main.feels_like
    }
  })
})

// Данные для отображения
const displayWeather = computed(() => {
  if (selectedDayIndex.value >= 0 && dailyForecast.value) {
    const day = dailyForecast.value[selectedDayIndex.value]
    return {
      cityName: weatherStore.selectedCity?.name || weatherStore.currentWeather?.name || '',
      temp: day.temp,
      temp_min: day.temp_min,
      temp_max: day.temp_max,
      feels_like: day.feels_like,
      condition: day.condition,
      description: day.description,
      humidity: day.humidity,
      wind_speed: day.wind_speed,
      precipitation: day.precipitation,
      cloudiness: day.cloudiness,
      pressure: day.pressure,
      date: day.date,
      time: new Date(),
      visibility: 10000
    }
  }

  if (weatherStore.currentWeather) {
    return {
      cityName: weatherStore.currentWeather.name,
      temp: weatherStore.currentWeather.main.temp,
      temp_min: weatherStore.currentWeather.main.temp_min,
      temp_max: weatherStore.currentWeather.main.temp_max,
      feels_like: weatherStore.currentWeather.main.feels_like,
      condition: weatherStore.currentWeather.weather[0].main,
      description: weatherStore.currentWeather.weather[0].description,
      humidity: weatherStore.currentWeather.main.humidity,
      wind_speed: weatherStore.currentWeather.wind.speed,
      precipitation: (weatherStore.currentWeather.pop || 0) * 100,
      cloudiness: weatherStore.currentWeather.clouds.all,
      pressure: weatherStore.currentWeather.main.pressure,
      visibility: weatherStore.currentWeather.visibility,
      date: new Date(),
      time: new Date()
    }
  }

  return {
    cityName: '',
    temp: 0,
    temp_min: 0,
    temp_max: 0,
    feels_like: 0,
    condition: 'clear',
    description: '',
    humidity: 0,
    wind_speed: 0,
    precipitation: 0,
    cloudiness: 0,
    pressure: 0,
    visibility: 0,
    date: new Date(),
    time: new Date()
  }
})

// Почасовые данные
const hourlyData = computed(() => {
  if (selectedDayIndex.value >= 0 && dailyForecast.value) {
    const day = dailyForecast.value[selectedDayIndex.value]
    return day.hourly_data?.slice(0, 8) || []
  }

  if (weatherStore.forecast?.list && selectedDayIndex.value === -1) {
    return weatherStore.forecast.list
        .slice(0, 8)
        .map(item => ({
          time: new Date(item.dt * 1000),
          temp: item.main.temp,
          condition: item.weather[0].main,
          precipitation: (item.pop || 0) * 100
        }))
  }

  return []
})

const isCurrentFavorite = computed(() => {
  if (!weatherStore.selectedCity) return false
  return citiesStore.isFavorite(weatherStore.selectedCity.id)
})

// Функции форматирования
const formatTemperature = (temp: number) => {
  const unit = settingsStore.temperatureUnit
  if (unit === 'F') {
    return `${Math.round((temp * 9/5) + 32)}°F`
  }
  return `${Math.round(temp)}°C`
}

const formatTemperatureCompact = (temp: number) => {
  const unit = settingsStore.temperatureUnit
  if (unit === 'F') {
    return `${Math.round((temp * 9/5) + 32)}`
  }
  return `${Math.round(temp)}`
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

const formatVisibility = (meters: number) => {
  if (settingsStore.language === 'en') {
    const km = meters / 1000
    return `${km.toFixed(1)} km`
  }
  return `${meters} m`
}

const getCurrentHumidity = () => {
  return weatherStore.currentWeather?.main.humidity || 0
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

const getDayShortTitle = (date: Date): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const daysRu = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) {
    return t('today')
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return t('tomorrow')
  }

  return settingsStore.language === 'ru'
      ? daysRu[date.getDay()]
      : days[date.getDay()]
}

const getCurrentDate = (): string => {
  const today = new Date()
  return today.toLocaleDateString([], {
    day: 'numeric',
    month: 'short'
  })
}

const getDayDate = (date: Date): string => {
  return date.toLocaleDateString([], {
    day: 'numeric',
    month: 'short'
  })
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString(settingsStore.language, {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  })
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString(settingsStore.language, {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatTimeFromTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleTimeString(settingsStore.language, {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatHour = (date: Date): string => {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    hourCycle: 'h23'
  }).replace(':00', '')
}

// Функции выбора дня
const selectCurrentDay = () => {
  selectedDayIndex.value = -1
}
const loadExtendedForecast = async () => {
  if (!weatherStore.selectedCity) return

  try {
    // Здесь можно добавить вызов другого API для расширенного прогноза
    // Например, использовать другой эндпоинт OpenWeather для 16-дневного прогноза
    console.log('Загрузка расширенного прогноза...')

    // Если используете API с ограничением в 5 дней,
    // возможно нужно перейти на платный тариф или другой сервис
  } catch (error) {
    console.error('Ошибка загрузки расширенного прогноза:', error)
  }
}

const selectForecastDay = (index: number) => {
  selectedDayIndex.value = index
}
watch(dailyForecast, (newForecast) => {
  if (newForecast) {
    console.log(`Получено дней прогноза: ${newForecast.length}`)
    console.log('Дни:', newForecast.map(d => d.date.toLocaleDateString()))
  }
}, { immediate: true })
// Сброс при смене города
watch(() => weatherStore.selectedCity, () => {
  selectedDayIndex.value = -1
})

const retry = async () => {
  if (weatherStore.selectedCity) {
    await weatherStore.loadWeatherData(weatherStore.selectedCity.id)
  }
}

const useDefaultCity = async () => {
  await weatherStore.loadWeatherData(524901)
}

const toggleFavorite = () => {
  if (!weatherStore.selectedCity) return

  if (isCurrentFavorite.value) {
    citiesStore.removeFromFavorites(weatherStore.selectedCity.id)
  } else {
    citiesStore.addToFavorites(weatherStore.selectedCity)
  }
}
</script>

<style scoped>
.current-weather {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Общие стили для карточек */
.card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  overflow: hidden;
}

.theme-dark .card {
  background: #2d3748;
  border: 1px solid #4a5568;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.card-body {
  padding: 1.5rem;
}

/* Стили для селектора дней - Увеличен для 10 дней */
.day-selector-wrapper {
  margin-bottom: 0;
}

.day-selector {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem 0;
  -webkit-overflow-scrolling: touch;
}

.day-button {
  flex: 0 0 auto;
  min-width: 90px; /* Увеличен для 10 дней */
  padding: 0.75rem 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  transition: all 0.2s ease;
  cursor: pointer;
}

.day-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
}

.day-button.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.theme-dark .day-button {
  background: #374151;
  border-color: #4b5563;
}

.theme-dark .day-button.active {
  background: #3b82f6;
  border-color: #3b82f6;
}

.day-button-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.day-icon {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

.day-button.active .day-icon {
  color: white;
}

.day-name {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.day-date {
  font-size: 0.7rem;
  opacity: 0.7;
}

.day-temp {
  margin-top: 0.25rem;
}

.day-temp.current {
  font-size: 1.25rem;
  font-weight: bold;
}

.temp-range {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
}

.temp-max {
  font-size: 0.95rem;
  font-weight: bold;
}

.temp-min {
  font-size: 0.75rem;
  opacity: 0.7;
}

.day-button.active .temp-max,
.day-button.active .temp-min {
  color: white;
}

/* Блок с дополнительной информацией (осадки и влажность) */
.day-extra {
  margin-top: 0.25rem;
  width: 100%;
}

.day-precipitation {
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.125rem;
  color: #3b82f6;
  margin-bottom: 0.125rem;
}

.day-precipitation.empty {
  opacity: 0.3;
}

.day-button.active .day-precipitation {
  color: rgba(255, 255, 255, 0.9);
}

.day-humidity {
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.125rem;
  color: #10b981;
  opacity: 0.8;
}

.day-button.active .day-humidity {
  color: rgba(255, 255, 255, 0.8);
}

/* Основная информация о погоде */
.weather-summary {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.weather-header {
  flex-shrink: 0;
}

.city-name {
  font-size: 1.5rem;
  line-height: 1.2;
}

.day-badge {
  font-size: 0.65rem;
  font-weight: 500;
  padding: 0.2rem 0.6rem;
  background: #3b82f6;
  color: white;
  border-radius: 12px;
  vertical-align: middle;
}

.date-time {
  font-size: 0.9rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.theme-dark .date-time {
  color: #9ca3af;
}

.date-text {
  display: inline-block;
}

.temperature-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.display-4 {
  font-size: 3rem;
  font-weight: 800;
  color: #1f2937;
  line-height: 1;
}

.theme-dark .display-4 {
  color: #f9fafb;
}

.temperature-range {
  font-size: 0.95rem;
  color: #6b7280;
}

.theme-dark .temperature-range {
  color: #9ca3af;
}

.temp-min {
  color: #3b82f6;
}

.temp-max {
  color: #ef4444;
}

.separator {
  color: #d1d5db;
}

.weather-condition {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.condition-icon {
  flex-shrink: 0;
}

.condition-details {
  flex: 1;
}

.condition-text {
  font-size: 1.25rem;
  color: #1f2937;
}

.theme-dark .condition-text {
  color: #f9fafb;
}

.feels-like {
  font-size: 0.95rem;
  color: #6b7280;
}

.theme-dark .feels-like {
  color: #9ca3af;
}

.condition-description {
  font-style: italic;
}

.favorite-section {
  margin-top: auto;
  padding-top: 1rem;
}

.favorite-btn {
  border-radius: 12px;
  padding: 0.75rem;
}

/* Детали погоды */
.weather-details {
  height: 100%;
}

.details-title {
  color: #1f2937;
  font-weight: 600;
}

.theme-dark .details-title {
  color: #f9fafb;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.detail-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.theme-dark .detail-item {
  background: #374151;
  border-color: #4b5563;
}

.detail-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
  color: #3b82f6;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: rgba(59, 130, 246, 0.1);
}

.detail-content {
  flex: 1;
}

.detail-label {
  font-size: 0.8rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
}

.theme-dark .detail-label {
  color: #9ca3af;
}

.detail-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
  line-height: 1.2;
}

.theme-dark .detail-value {
  color: #f9fafb;
}

/* Восход/закат */
.sun-info {
  margin-top: 1rem;
}

.sun-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  height: 100%;
}

.theme-dark .sun-card {
  background: #374151;
  border-color: #4b5563;
}

.sun-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.sun-icon.sunrise {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.sun-icon.sunset {
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
}

.sun-content {
  flex: 1;
}

.sun-label {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.theme-dark .sun-label {
  color: #9ca3af;
}

.sun-time {
  font-size: 1.1rem;
  font-weight: bold;
  color: #1f2937;
}

.theme-dark .sun-time {
  color: #f9fafb;
}

/* Почасовой прогноз */
.hourly-forecast {
  width: 100%;
}

.hourly-title {
  color: #1f2937;
  font-weight: 600;
}

.theme-dark .hourly-title {
  color: #f9fafb;
}

.selected-day-info {
  font-size: 0.85rem;
  color: #6b7280;
}

.theme-dark .selected-day-info {
  color: #9ca3af;
}

.hourly-scroll-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0.5rem 0;
}

.hourly-items {
  display: flex;
  gap: 0.75rem;
  min-width: min-content;
  padding: 0.25rem;
}

.hourly-item {
  flex: 0 0 auto;
  min-width: 100px;
  padding: 1rem;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  text-align: center;
  transition: all 0.2s ease;
}

.hourly-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.theme-dark .hourly-item {
  background: #374151;
  border-color: #4b5563;
}

.hour-time {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #1f2937;
}

.theme-dark .hour-time {
  color: #f9fafb;
}

.hour-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.hour-temp {
  font-size: 1.25rem;
  font-weight: bold;
  color: #3b82f6;
  margin-bottom: 0.5rem;
}

.hour-precipitation {
  font-size: 0.8rem;
  color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.hour-precipitation.empty {
  opacity: 0.3;
}

/* Медиа-запросы для адаптивности с 10 днями */

/* Мобильные устройства (до 576px) */
@media (max-width: 576px) {
  .card-body {
    padding: 1rem;
  }

  .day-button {
    min-width: 75px; /* Уменьшен для мобильных с 10 днями */
    padding: 0.5rem 0.25rem;
  }

  .day-name {
    font-size: 0.65rem;
  }

  .day-temp.current {
    font-size: 1rem;
  }

  .temp-max {
    font-size: 0.8rem;
  }

  .day-precipitation,
  .day-humidity {
    font-size: 0.65rem;
  }

  .display-4 {
    font-size: 2.5rem;
  }

  .city-name {
    font-size: 1.25rem;
  }

  .date-time {
    font-size: 0.8rem;
  }

  .date-text {
    display: block;
    margin-top: 0.25rem;
    margin-left: 0;
  }

  .details-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .detail-item {
    padding: 0.75rem;
  }

  .detail-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
    margin-right: 0.75rem;
  }

  .detail-value {
    font-size: 1.1rem;
  }

  .hourly-item {
    min-width: 85px;
    padding: 0.75rem;
  }

  .hour-icon {
    font-size: 1.75rem;
  }

  .hour-temp {
    font-size: 1.1rem;
  }

  /* Скрываем элементы на мобильных */
  .mobile-hidden {
    display: none !important;
  }
}

/* Планшеты (576px - 768px) */
@media (min-width: 576px) and (max-width: 768px) {
  .day-button {
    min-width: 85px; /* Увеличен для планшетов */
  }

  .details-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .hourly-item {
    min-width: 110px;
  }
}

/* Десктоп (768px и больше) */
@media (min-width: 768px) {
  .day-button {
    min-width: 95px; /* Увеличен для 10 дней */
  }

  .details-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Большие экраны (992px и больше) */
@media (min-width: 992px) {
  .display-4 {
    font-size: 3.5rem;
  }

  .city-name {
    font-size: 1.75rem;
  }

  .day-button {
    min-width: 100px; /* Достаточно места для 10 дней */
  }

  .details-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Очень большие экраны (1200px и больше) */
@media (min-width: 1200px) {
  .details-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .hourly-item {
    min-width: 120px;
  }

  .day-button {
    min-width: 110px; /* Больше места для 10 дней */
  }
}

/* Улучшаем скролл для 10 дней */
.day-selector::-webkit-scrollbar,
.hourly-scroll-container::-webkit-scrollbar {
  height: 4px;
}

.day-selector::-webkit-scrollbar-track,
.hourly-scroll-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.day-selector::-webkit-scrollbar-thumb,
.hourly-scroll-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.day-selector::-webkit-scrollbar-thumb:hover,
.hourly-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.theme-dark .day-selector::-webkit-scrollbar-track,
.theme-dark .hourly-scroll-container::-webkit-scrollbar-track {
  background: #374151;
}

.theme-dark .day-selector::-webkit-scrollbar-thumb,
.theme-dark .hourly-scroll-container::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.theme-dark .day-selector::-webkit-scrollbar-thumb:hover,
.theme-dark .hourly-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>