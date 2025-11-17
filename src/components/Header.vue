<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['search'])

const searchQuery = ref('')
const suggestions = ref<any[]>([])
const showSuggestions = ref(false)
const loadingSuggestions = ref(false)

// Функция для поиска городов через API
const searchCities = async (query: string) => {
  if (query.length < 2) {
    suggestions.value = []
    return
  }

  try {
    loadingSuggestions.value = true
    const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=ru&format=json`
    )
    const data = await response.json()

    if (data.results) {
      suggestions.value = data.results.map((city: any) => ({
        name: city.name,
        country: city.country,
        admin1: city.admin1
      }))
    } else {
      suggestions.value = []
    }
  } catch (error) {
    console.error('Error searching cities:', error)
    suggestions.value = []
  } finally {
    loadingSuggestions.value = false
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value.trim())
    showSuggestions.value = false
  }
}

const handleInput = () => {
  if (searchQuery.value.length > 1) {
    searchCities(searchQuery.value)
    showSuggestions.value = true
  } else {
    suggestions.value = []
    showSuggestions.value = false
  }
}

const selectSuggestion = (city: any) => {
  searchQuery.value = city.name
  emit('search', city.name)
  showSuggestions.value = false
}

const closeSuggestions = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 150)
}

const getCityDisplayName = (city: any) => {
  if (city.admin1 && city.country) {
    return `${city.name}, ${city.admin1}`
  } else if (city.country) {
    return `${city.name}, ${city.country}`
  }
  return city.name
}
</script>

<template>
  <header class="header">
    <div class="search-container">
      <div class="search-box">
        <div class="search-icon">🔍</div>
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск города..."
            class="search-input"
            @keypress.enter="handleSearch"
            @input="handleInput"
            @blur="closeSuggestions"
        />
      </div>

      <div v-if="showSuggestions" class="suggestions-container">
        <div v-if="loadingSuggestions" class="loading-suggestions">
          <div class="mini-spinner"></div>
          Поиск...
        </div>
        <div v-else-if="suggestions.length > 0" class="suggestions">
          <div
              v-for="city in suggestions"
              :key="city.id"
              class="suggestion-item"
              @click="selectSuggestion(city)"
          >
            <span class="suggestion-text">{{ getCityDisplayName(city) }}</span>
          </div>
        </div>
        <div v-else-if="searchQuery.length > 1" class="no-suggestions">
          Город не найден
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid #e8e6e1;
}

.search-container {
  position: relative;
}

.search-box {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e8e6e1;
  border-radius: 12px;
  padding: 0.5rem 0.75rem;
  transition: all 0.2s ease;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.03);
}

.search-box:focus-within {
  border-color: #c8c6c1;
  box-shadow: 0 0 0 2px rgba(200, 198, 193, 0.1);
}

.search-icon {
  font-size: 1rem;
  opacity: 0.5;
  margin-right: 0.5rem;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.9rem;
  color: #4a4946;
  outline: none;
  font-family: inherit;
}

.search-input::placeholder {
  color: #a8a6a1;
}

.suggestions-container {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #ffffff;
  border: 1px solid #e8e6e1;
  border-radius: 8px;
  margin-top: 0.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  max-height: 200px;
  overflow-y: auto;
}

.loading-suggestions {
  padding: 0.75rem 1rem;
  text-align: center;
  color: #a8a6a1;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.mini-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #e8e6e1;
  border-top: 2px solid #8a8986;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.suggestions {
  background: white;
}

.suggestion-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.1s ease;
  color: #6c6b67;
  font-size: 0.9rem;
  border-bottom: 1px solid #f0efec;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background: #f8f7f4;
}

.no-suggestions {
  padding: 0.75rem 1rem;
  text-align: center;
  color: #a8a6a1;
  font-size: 0.85rem;
  font-style: italic;
}

@media (max-width: 480px) {
  .header {
    padding: 1.25rem 1.25rem 0.75rem 1.25rem;
  }
}
</style>