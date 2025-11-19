<script setup>
import { ref, onMounted, computed } from 'vue'
import Header from "./components/Header.vue";
import MainInformation from "./components/MainInformation.vue";
import ListDays from "./components/ListDays.vue";

const weatherData = ref(null)
const loading = ref(true)
const error = ref(null)
const selectedDayIndex = ref(0)

// получение координат по названию города
const getCoordinates = async (city) => {
  try {
    const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5&language=ru&format=json`
    )
    const data = await response.json()

    if (!data.results || data.results.length === 0) {
      throw new Error('Город не найден')
    }

    return {
      latitude: data.results[0].latitude,
      longitude: data.results[0].longitude,
      name: data.results[0].name,
      country: data.results[0].country
    }
  } catch (err) {
    throw new Error('Ошибка поиска города')
  }
}

// Функция для получения погоды
const fetchWeather = async (city = 'Москва') => {
  try {
    loading.value = true
    error.value = null

    // Получаем координаты города
    const coordinates = await getCoordinates(city)

    // Получаем погоду по координатам
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,relative_humidity_2m_max,wind_speed_10m_max&timezone=auto&forecast_days=14`
    )

    if (!response.ok) throw new Error('Ошибка получения погоды')

    const data = await response.json()

    weatherData.value = {
      current: {
        temperature: data.current.temperature_2m,
        feels_like: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        wind_speed: data.current.wind_speed_10m,
        weather_code: data.current.weather_code,
        time: data.current.time
      },
      daily: data.daily,
      location: {
        name: coordinates.name,
        country: coordinates.country
      }
    }

    // Сбрасываем выбор дня при смене города
    selectedDayIndex.value = 0

  } catch (err) {
    error.value = err.message
    console.error('Weather fetch error:', err)
  } finally {
    loading.value = false
  }
}

const handleSearch = (city) => {
  fetchWeather(city)
}

const handleDaySelect = (index) => {
  selectedDayIndex.value = index
}

const weatherType = computed(() => {
  if (!weatherData.value) return 'default'

  const code = selectedDayIndex.value === 0
      ? weatherData.value.current.weather_code
      : weatherData.value.daily.weather_code[selectedDayIndex.value]

  if (code === 0 || code === 1) return 'sunny'        // Ясно
  if (code === 2) return 'partly-cloudy'              // Переменная облачность
  if (code === 3) return 'cloudy'                     // Пасмурно
  if (code >= 45 && code <= 48) return 'foggy'        // Туман, иней
  if (code >= 51 && code <= 67) return 'rainy'        // Дождь
  if (code >= 80 && code <= 82) return 'heavy-rain'   // Ливень
  if (code >= 71 && code <= 77) return 'snowy'        // Снег
  if (code >= 95 && code <= 99) return 'stormy'       // Гроза

  return 'default'
})

onMounted(() => {
  fetchWeather()
})
</script>

<template>
  <div class="app-container" :class="weatherType">
    <div class="weather-background">
      <!-- Солнечные лучи -->
      <div class="sun-rays" v-if="weatherType === 'sunny'">
        <div class="ray ray-1"></div>
        <div class="ray ray-2"></div>
        <div class="ray ray-3"></div>
        <div class="ray ray-4"></div>
        <div class="ray ray-5"></div>
        <div class="ray ray-6"></div>
      </div>

      <!-- Облака -->
      <div class="clouds" v-if="['sunny', 'partly-cloudy', 'cloudy'].includes(weatherType)">
        <div class="cloud cloud-1">☁️</div>
        <div class="cloud cloud-2">☁️</div>
        <div class="cloud cloud-3">☁️</div>
        <div class="cloud cloud-4">☁️</div>
      </div>

      <!-- Дождь -->
      <div class="rain" v-if="['rainy', 'heavy-rain'].includes(weatherType)">
        <div class="raindrop" v-for="n in 30" :key="n" :style="{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${0.5 + Math.random() * 0.5}s`
        }"></div>
      </div>

      <!-- Снег -->
      <div class="snow" v-if="weatherType === 'snowy'">
        <div class="snowflake" v-for="n in 25" :key="n" :style="{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${3 + Math.random() * 5}s`
        }">❄️</div>
      </div>

      <!-- Туман -->
      <div class="fog" v-if="weatherType === 'foggy'">
        <div class="fog-layer fog-1"></div>
        <div class="fog-layer fog-2"></div>
        <div class="fog-layer fog-3"></div>
      </div>

      <!-- Молнии -->
      <div class="lightning" v-if="weatherType === 'stormy'">
        <div class="lightning-bolt" v-for="n in 3" :key="n" :style="{
          left: `${20 + n * 20}%`,
          animationDelay: `${n * 2 + Math.random() * 3}s`
        }">⚡</div>
      </div>
    </div>

    <div class="weather-widget-container">
      <Header @search="handleSearch" :loading="loading" />

      <div v-if="weatherData && !loading" class="widget-content">
        <MainInformation
            :weatherData="weatherData"
            :selectedDayIndex="selectedDayIndex"
        />
        <ListDays
            :weatherData="weatherData"
            :selectedDayIndex="selectedDayIndex"
            @day-select="handleDaySelect"
        />
      </div>

      <div v-else-if="loading" class="loading-state">
        <div class="loading-spinner">
          <div class="spinner-circle"></div>
        </div>
        <div class="loading-text">Загрузка...</div>
      </div>

      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <div class="error-text">{{ error }}</div>
        <button @click="fetchWeather()" class="retry-btn">Попробовать снова</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: all 0.5s ease;
}


.app-container.sunny {
  background: linear-gradient(135deg, #87CEEB 0%, #98FB98 50%, #87CEEB 100%);
}

.app-container.partly-cloudy {
  background: linear-gradient(135deg, #B0C4DE 0%, #D3D3D3 50%, #B0C4DE 100%);
}

.app-container.cloudy {
  background: linear-gradient(135deg, #778899 0%, #696969 50%, #778899 100%);
}

.app-container.rainy {
  background: linear-gradient(135deg, #4682B4 0%, #708090 50%, #4682B4 100%);
}

.app-container.heavy-rain {
  background: linear-gradient(135deg, #2F4F4F 0%, #36454F 50%, #2F4F4F 100%);
}

.app-container.snowy {
  background: linear-gradient(135deg, #B0E0E6 0%, #F0F8FF 50%, #B0E0E6 100%);
}

.app-container.foggy {
  background: linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 50%, #C0C0C0 100%);
}

.app-container.stormy {
  background: linear-gradient(135deg, #2F4F4F 0%, #191970 50%, #2F4F4F 100%);
}

.app-container.default {
  background: linear-gradient(135deg, #f5f3f0 0%, #e8e6e1 50%, #f5f3f0 100%);
}

.weather-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

/* Анимация солнечных лучей */
.sun-rays {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
}

.ray {
  position: absolute;
  background: radial-gradient(circle, rgba(255,255,0,0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 3s ease-in-out infinite;
}

.ray-1 { width: 200px; height: 200px; top: -50px; left: -50px; animation-delay: 0s; }
.ray-2 { width: 250px; height: 250px; top: -75px; left: -75px; animation-delay: 0.5s; }
.ray-3 { width: 300px; height: 300px; top: -100px; left: -100px; animation-delay: 1s; }
.ray-4 { width: 350px; height: 350px; top: -125px; left: -125px; animation-delay: 1.5s; }
.ray-5 { width: 400px; height: 400px; top: -150px; left: -150px; animation-delay: 2s; }
.ray-6 { width: 450px; height: 450px; top: -175px; left: -175px; animation-delay: 2.5s; }

@keyframes pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}

/* Анимация облаков */
.clouds {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.cloud {
  position: absolute;
  font-size: 4rem;
  opacity: 0.4;
  animation: floatCloud 20s linear infinite;
}

.cloud-1 { top: 10%; left: -100px; animation-delay: 0s; animation-duration: 25s; }
.cloud-2 { top: 25%; left: -150px; animation-delay: 5s; animation-duration: 30s; }
.cloud-3 { top: 40%; left: -200px; animation-delay: 10s; animation-duration: 35s; }
.cloud-4 { top: 60%; left: -120px; animation-delay: 15s; animation-duration: 28s; }

@keyframes floatCloud {
  0% { transform: translateX(-100px) translateY(0px); }
  50% { transform: translateX(calc(100vw + 200px)) translateY(10px); }
  100% { transform: translateX(calc(100vw + 200px)) translateY(0px); }
}

/* Анимация дождя */
.rain {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.raindrop {
  position: absolute;
  width: 2px;
  height: 15px;
  background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.8));
  animation: fall linear infinite;
}

@keyframes fall {
  0% {
    transform: translateY(-20px) translateX(0px);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) translateX(10px);
    opacity: 0;
  }
}

/* Анимация снега */
.snow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.snowflake {
  position: absolute;
  font-size: 1.2rem;
  opacity: 0.7;
  animation: snowfall linear infinite;
}

@keyframes snowfall {
  0% {
    transform: translateY(-20px) translateX(0px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) translateX(20px) rotate(360deg);
    opacity: 0;
  }
}

/* Анимация тумана */
.fog {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.fog-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(90deg,
  transparent 0%,
  rgba(255,255,255,0.3) 20%,
  rgba(255,255,255,0.4) 50%,
  rgba(255,255,255,0.3) 80%,
  transparent 100%);
  animation: fogMove 15s linear infinite;
}

.fog-1 { animation-duration: 20s; opacity: 0.3; top: 20%; }
.fog-2 { animation-duration: 25s; opacity: 0.2; top: 50%; animation-delay: 5s; }
.fog-3 { animation-duration: 30s; opacity: 0.4; top: 70%; animation-delay: 10s; }

@keyframes fogMove {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Анимация молний */
.lightning {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.lightning-bolt {
  position: absolute;
  font-size: 8rem;
  opacity: 0;
  animation: lightningFlash 0.2s ease-out infinite;
}

@keyframes lightningFlash {
  0%, 95% { opacity: 0; }
  5%, 15% { opacity: 0.8; }
  10% { opacity: 1; }
}

.weather-widget-container {
  width: 100%;
  max-width: 480px;
  background: #f8f7f4;
  border-radius: 24px;
  border: 1px solid #e8e6e1;
  box-shadow:
      0 12px 40px rgba(0, 0, 0, 0.12),
      0 6px 20px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.widget-content {
  padding: 0;
}

.loading-state, .error-state {
  text-align: center;
  color: #6c6b67;
  font-size: 1rem;
  padding: 3rem 2rem;
  background: #f8f7f4;
  position: relative;
  overflow: hidden;
}

.loading-spinner {
  margin-bottom: 1.5rem;
}

.spinner-circle {
  width: 40px;
  height: 40px;
  border: 2px solid #d8d6d1;
  border-top: 2px solid #8a8986;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-weight: 500;
  color: #8a8986;
}

.error-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.error-text {
  margin-bottom: 1.5rem;
  color: #8a8986;
  font-weight: 500;
}

.retry-btn {
  padding: 0.6rem 1.2rem;
  background: #e8e6e1;
  border: 1px solid #d8d6d1;
  border-radius: 8px;
  color: #6c6b67;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.9rem;
}

.retry-btn:hover {
  background: #dfddd8;
  border-color: #c8c6c1;
}

@media (max-width: 520px) {
  .app-container {
    padding: 0.75rem;
  }

  .weather-widget-container {
    max-width: 100%;
    margin: 0 0.5rem;
  }

  .cloud {
    font-size: 3rem;
  }

  .lightning-bolt {
    font-size: 6rem;
  }

  .snowflake {
    font-size: 1rem;
  }
}

@media (max-width: 380px) {
  .app-container {
    padding: 0.5rem;
  }

  .weather-widget-container {
    margin: 0 0.25rem;
  }
}
</style>