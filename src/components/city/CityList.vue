<template>
  <div class="city-list card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5 class="mb-0">{{ t('favorites') }}</h5>
      <button class="btn btn-sm btn-outline-primary" @click="refreshAll" :title="t('refresh')">
        <i class="bi bi-arrow-clockwise"></i>
      </button>
    </div>

    <div class="card-body">
      <!-- ИСПРАВЛЕНА ПРОВЕРКА: Добавлена проверка на существование и Array.isArray -->
      <div v-if="!favoriteCities || !Array.isArray(favoriteCities) || favoriteCities.length === 0"
           class="text-center py-4">
        <i class="bi bi-heart text-muted mb-3" style="font-size: 2em;"></i>
        <p class="text-muted">{{ t('noCitiesAdded') }}</p>
        <small class="text-muted">{{ t('searchToAdd') }}</small>
      </div>

      <div v-else class="list-group">
        <!-- ИСПРАВЛЕНО: используем safeFavoriteCities -->
        <button v-for="city in safeFavoriteCities"
                :key="city.id"
                class="list-group-item list-group-item-action city-list-item"
                :class="{ '': isCurrentCity(city.id) }"
                @click="selectCity(city)">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <strong>{{ city.name }}</strong>
              <small class="text-muted ms-2">{{ city.country }}</small>
            </div>
            <div class="actions">
              <button class="btn btn-sm btn-outline-danger"
                      @click.stop="removeFromFavorites(city.id)"
                      :title="t('removeFromFavorites')">
                <i class="bi bi-heart-fill text-danger"></i>
              </button>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWeatherStore } from '@/store/weather'
import { useCitiesStore } from '@/store/cities'
import { useTranslation } from '@/composables/useTranslation'
import type { City } from '@/types/weather'
import { computed } from 'vue'

const weatherStore = useWeatherStore()
const citiesStore = useCitiesStore()
const { t } = useTranslation()

// ИСПРАВЛЕНО: Создаем безопасные computed свойства
const favoriteCities = computed(() => citiesStore.favoriteCities)

const safeFavoriteCities = computed(() => {
  const cities = favoriteCities.value
  if (!cities || !Array.isArray(cities)) {
    return []
  }
  return cities
})


const isCurrentCity = (cityId: number) => {
  return weatherStore.selectedCity?.id === cityId
}

const selectCity = async (city: City) => {
  try {
    if (city.coord?.lat && city.coord?.lon) {
      await weatherStore.loadWeatherByCoords(city.coord.lat, city.coord.lon)
    } else if (city.name && city.country) {
      await weatherStore.loadWeatherByName(city.name, city.country)
    } else if (city.id && city.id < 1000000000) {
      await weatherStore.loadWeatherData(city.id)
    }
  } catch (error) {
    console.error('Failed to select city:', error)
    alert(t('locationError'))
  }
}

const removeFromFavorites = (cityId: number) => {
  if (confirm(t('confirmRemove'))) {
    citiesStore.removeFromFavorites(cityId)
  }
}

const refreshAll = async () => {
  if (weatherStore.selectedCity) {
    try {
      await weatherStore.loadWeatherData(weatherStore.selectedCity.id)
    } catch (error) {
      console.error('Failed to refresh:', error)
    }
  }
}

</script>

<style scoped>
.city-list {
  max-height: 400px;
  overflow-y: auto;
}

.city-list-item {
  transition: all 0.2s ease;
}

.city-list-item .actions {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.city-list-item:hover .actions {
  opacity: 1;
}
</style>