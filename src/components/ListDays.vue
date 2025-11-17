<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface WeatherData {
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
  }
}

const props = defineProps<{
  weatherData: WeatherData
  selectedDayIndex: number
}>()

const emit = defineEmits(['day-select'])

const currentSlide = ref(0)
const slidesToShow = ref(7) // УВЕЛИЧИЛИ КОЛИЧЕСТВО ОДНОВРЕМЕННО ОТОБРАЖАЕМЫХ ДНЕЙ

// Подготавливаем данные для отображения
const dailyForecast = computed(() => {
  if (!props.weatherData?.daily?.time) return []
  return props.weatherData.daily.time.map((time, index) => ({
    date: new Date(time),
    weather_code: props.weatherData.daily.weather_code[index],
    maxTemp: Math.round(props.weatherData.daily.temperature_2m_max[index]),
    minTemp: Math.round(props.weatherData.daily.temperature_2m_min[index])
  }))
})

const visibleDays = computed(() => {
  const start = currentSlide.value
  const end = start + slidesToShow.value
  return dailyForecast.value.slice(start, end)
})

const canGoNext = computed(() => {
  return currentSlide.value < dailyForecast.value.length - slidesToShow.value
})

const canGoPrev = computed(() => {
  return currentSlide.value > 0
})

const nextSlide = () => {
  if (canGoNext.value) {
    currentSlide.value++
  }
}

const prevSlide = () => {
  if (canGoPrev.value) {
    currentSlide.value--
  }
}

// Функция для выбора дня
const selectDay = (index: number) => {
  const globalIndex = currentSlide.value + index
  emit('day-select', globalIndex)
}

// Функция для получения описания погоды по коду
const getWeatherInfo = (code: number) => {
  const weatherMap: { [key: number]: { emoji: string } } = {
    0: { emoji: '☀️' },
    1: { emoji: '🌤️' },
    2: { emoji: '⛅' },
    3: { emoji: '☁️' },
    45: { emoji: '🌫️' },
    48: { emoji: '❄️' },
    51: { emoji: '🌦️' },
    53: { emoji: '🌦️' },
    55: { emoji: '🌧️' },
    61: { emoji: '🌦️' },
    63: { emoji: '🌧️' },
    65: { emoji: '⛈️' },
    80: { emoji: '🌧️' },
    81: { emoji: '🌧️' },
    82: { emoji: '⛈️' },
    71: { emoji: '❄️' },
    73: { emoji: '🌨️' },
    75: { emoji: '❄️' },
    77: { emoji: '🌨️' },
    95: { emoji: '⛈️' },
    96: { emoji: '⛈️' },
    99: { emoji: '⛈️' }
  }

  return weatherMap[code] || { emoji: '🌈' }
}

// Форматирование даты
const formatDay = (date: Date) => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) {
    return 'Сег'
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Завт'
  } else {
    return date.toLocaleDateString('ru-RU', { weekday: 'short' }).slice(0, 3)
  }
}

const formatDate = (date: Date) => {
  return date.getDate() + ' ' + date.toLocaleDateString('ru-RU', { month: 'short' }).slice(0, 3)
}

// Проверяем, выбран ли день
const isDaySelected = (index: number) => {
  return props.selectedDayIndex === currentSlide.value + index
}

// Адаптивное количество слайдов
const updateSlidesToShow = () => {
  if (window.innerWidth < 520) {
    slidesToShow.value = 5 // УВЕЛИЧИЛИ ДЛЯ МОБИЛЬНЫХ
  } else {
    slidesToShow.value = 7 // УВЕЛИЧИЛИ ДЛЯ ДЕСКТОПА
  }
}

onMounted(() => {
  updateSlidesToShow()
  window.addEventListener('resize', updateSlidesToShow)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateSlidesToShow)
})
</script>

<template>
  <div class="days-section">
    <div class="days-header">
      <h4>Прогноз на 14 дней</h4> <!-- ОБНОВИЛИ ЗАГОЛОВОК -->
    </div>

    <div class="days-carousel">
      <button
          class="carousel-btn prev"
          @click="prevSlide"
          :disabled="!canGoPrev"
          aria-label="Предыдущие дни"
      >
        ‹
      </button>

      <div class="days-grid" :style="{ 'grid-template-columns': `repeat(${slidesToShow}, 1fr)` }">
        <div
            class="day-card"
            v-for="(day, index) in visibleDays"
            :key="index"
            :class="{
            'today': currentSlide + index === 0,
            'selected': isDaySelected(index)
          }"
            @click="selectDay(index)"
        >
          <div class="day-header">
            <div class="day-name">{{ formatDay(day.date) }}</div>
            <div class="day-date">{{ formatDate(day.date) }}</div>
          </div>
          <div class="day-emoji">{{ getWeatherInfo(day.weather_code).emoji }}</div>
          <div class="day-temp">
            <span class="temp-high">{{ day.maxTemp }}°</span>
            <span class="temp-low">{{ day.minTemp }}°</span>
          </div>
        </div>
      </div>

      <button
          class="carousel-btn next"
          @click="nextSlide"
          :disabled="!canGoNext"
          aria-label="Следующие дни"
      >
        ›
      </button>
    </div>

    <!-- Индикатор прогресса -->
    <div class="carousel-indicator" v-if="dailyForecast.length > slidesToShow">
      <div
          v-for="n in Math.max(1, dailyForecast.length - slidesToShow + 1)"
          :key="n"
          class="indicator-dot"
          :class="{ active: currentSlide === n - 1 }"
          @click="currentSlide = n - 1"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.days-section {
  padding: 1.25rem 1.75rem 1.75rem 1.75rem;
  border-top: 1px solid #f0efec;
  background: #fcfbf9;
}

.days-header {
  margin-bottom: 1rem;
}

.days-header h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a4946;
  margin: 0;
  text-align: center;
}

.days-carousel {
  display: flex;
  align-items: center;
  gap: 0.75rem; /* УМЕНЬШИЛИ РАССТОЯНИЕ ДЛЯ БОЛЬШЕГО КОЛИЧЕСТВА ДНЕЙ */
}

.carousel-btn {
  width: 32px; /* НЕМНОГО УМЕНЬШИЛИ КНОПКИ ДЛЯ ЭКОНОМИИ МЕСТА */
  height: 32px;
  border: 1px solid #e8e6e1;
  background: #ffffff;
  color: #8a8986;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.1rem;
  font-weight: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 6px;
  outline: none;
}

.carousel-btn:hover:not(:disabled) {
  border-color: #c8c6c1;
  background: #f8f7f4;
  color: #4a4946;
}

.carousel-btn:active:not(:disabled) {
  background: #f0efec;
  transform: scale(0.95);
}

.carousel-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none;
}

.days-grid {
  display: grid;
  gap: 0.5rem; /* УМЕНЬШИЛИ РАССТОЯНИЕ МЕЖДУ КАРТОЧКАМИ */
  flex: 1;
}

.day-card {
  background: #ffffff;
  border: 1px solid #f0efec;
  border-radius: 8px;
  padding: 0.7rem 0.4rem; /* УМЕНЬШИЛИ ВНУТРЕННИЕ ОТСТУПЫ */
  text-align: center;
  transition: all 0.2s ease;
  color: #6c6b67;
  cursor: pointer;
  position: relative;
  min-width: 0;
}

.day-card:hover {
  border-color: #e8e6e1;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.day-card.today {
  background: #f8f7f4;
  border-color: #e8e6e1;
}

.day-card.selected {
  background: #e8e6e1;
  border-color: #c8c6c1;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.day-card.selected::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: #8a8986;
  border-radius: 1px;
}

.day-header {
  margin-bottom: 0.5rem;
}

.day-name {
  font-size: 0.75rem; /* НЕМНОГО УМЕНЬШИЛИ ШРИФТ */
  font-weight: 500;
  color: #4a4946;
  margin-bottom: 0.2rem;
}

.day-date {
  font-size: 0.7rem;
  color: #8a8986;
  font-weight: 400;
}

.day-emoji {
  font-size: 1.2rem; /* НЕМНОГО УМЕНЬШИЛИ ЭМОДЗИ */
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.day-temp {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  font-size: 0.8rem; /* НЕМНОГО УМЕНЬШИЛИ ШРИФТ ТЕМПЕРАТУРЫ */
}

.temp-high {
  font-weight: 500;
  color: #4a4946;
}

.temp-low {
  color: #8a8986;
}

.carousel-indicator {
  display: flex;
  justify-content: center;
  gap: 0.4rem;
  margin-top: 0.75rem;
}

.indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #e8e6e1;
  cursor: pointer;
  transition: all 0.2s ease;
}

.indicator-dot:hover {
  background: #c8c6c1;
}

.indicator-dot.active {
  background: #8a8986;
  transform: scale(1.2);
}

/* Адаптивность */
@media (max-width: 520px) {
  .days-section {
    padding: 1rem 1.25rem 1.5rem 1.25rem;
  }

  .days-grid {
    gap: 0.4rem;
  }

  .days-carousel {
    gap: 0.6rem;
  }

  .carousel-btn {
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }

  .day-card {
    padding: 0.6rem 0.3rem;
  }

  .day-emoji {
    font-size: 1.1rem;
  }

  .day-temp {
    font-size: 0.75rem;
  }
}

@media (max-width: 380px) {
  .days-section {
    padding: 0.75rem 1rem 1.25rem 1rem;
  }

  .days-grid {
    gap: 0.3rem;
  }

  .carousel-btn {
    width: 26px;
    height: 26px;
    font-size: 0.9rem;
  }

  .day-card {
    padding: 0.5rem 0.25rem;
  }
}
</style>