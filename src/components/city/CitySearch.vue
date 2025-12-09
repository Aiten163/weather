<template>
  <div class="city-search position-relative">
    <div class="input-group">
      <span class="input-group-text">
        <i class="bi bi-search"></i>
      </span>
      <input type="text" class="form-control"
             :placeholder="t('searchCity')"
             v-model="searchQuery"
             @input="onSearch"
             @focus="showSuggestions = true"
             @blur="onBlur">
    </div>

    <div v-if="showSuggestions && suggestions.length > 0"
         class="suggestions-dropdown position-absolute w-100 mt-1">
      <div class="list-group">
        <button v-for="city in suggestions"
                :key="city.id"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                @mousedown="selectCity(city)">
          <div>
            <strong>{{ city.name }}</strong>
            <small class="text-muted ms-2">{{ city.country }}</small>
          </div>
          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-sm btn-outline-primary"
                    @click.stop="toggleFavorite(city)"
                    :title="isFavorite(city.id) ? t('removeFromFavorites') : t('addToFavorites')">
              <i :class="isFavorite(city.id) ? 'bi bi-heart-fill text-danger' : 'bi bi-heart'"></i>
            </button>
            <i class="bi bi-plus-circle text-primary"></i>
          </div>
        </button>
      </div>
    </div>

    <div v-if="isSearching" class="position-absolute w-100 mt-1">
      <div class="list-group">
        <div class="list-group-item text-center py-3">
          <div class="spinner-border spinner-border-sm me-2" role="status"></div>
          {{ t('searching') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useWeatherStore } from '@/store/weather'
import { useCitiesStore } from '@/store/cities'
import { useTranslation } from '@/composables/useTranslation'
import type { City } from '@/types/weather'

const searchQuery = ref('')
const suggestions = ref<City[]>([])
const showSuggestions = ref(false)
const isSearching = ref(false)
let searchTimeout: NodeJS.Timeout | null = null

const weatherStore = useWeatherStore()
const citiesStore = useCitiesStore()
const { t } = useTranslation()

const onSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  if (searchQuery.value.trim().length < 2) {
    suggestions.value = []
    return
  }

  isSearching.value = true
  searchTimeout = setTimeout(async () => {
    try {
      const results = await weatherStore.searchCity(searchQuery.value)
      suggestions.value = results
    } catch (error) {
      console.error('Search error:', error)
      suggestions.value = []
    } finally {
      isSearching.value = false
    }
  }, 300)
}

const selectCity = async (city: City) => {
  console.log('Selecting city:', city)

  try {
    // Пробуем загрузить погоду по координатам
    if (city.coord?.lat && city.coord?.lon) {
      await weatherStore.loadWeatherByCoords(city.coord.lat, city.coord.lon)
    } else {
      // Или по названию
      await weatherStore.loadWeatherByName(city.name, city.country)
    }

    searchQuery.value = ''
    suggestions.value = []
    showSuggestions.value = false
  } catch (error) {
    console.error('Failed to load city:', error)
    alert(t('locationError'))
  }
}

const toggleFavorite = (city: City) => {
  if (citiesStore.isFavorite(city.id)) {
    citiesStore.removeFromFavorites(city.id)
  } else {
    citiesStore.addToFavorites(city)
  }
}

const isFavorite = (cityId: number) => {
  return citiesStore.isFavorite(cityId)
}

const onBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

watch(searchQuery, (newVal) => {
  if (newVal === '') {
    suggestions.value = []
  }
})
</script>

<style scoped>
.city-search {
  z-index: 1000;
}

.suggestions-dropdown {
  z-index: 1001;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}

.suggestions-dropdown .list-group-item {
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0;
  cursor: pointer;
}

.suggestions-dropdown .list-group-item:last-child {
  border-bottom: none;
}

.suggestions-dropdown .list-group-item:hover {
  background-color: rgba(67, 97, 238, 0.1);
}
</style>