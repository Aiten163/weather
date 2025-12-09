<template>
  <button class="btn btn-outline-secondary" @click="toggleTheme">
    <i :class="themeIcon"></i>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '@/store/settings'

const settingsStore = useSettingsStore()

const themeIcon = computed(() => {
  switch (settingsStore.computedTheme) {
    case 'light': return 'bi bi-sun'
    case 'dark': return 'bi bi-moon'
    default: return 'bi bi-circle-half'
  }
})

const toggleTheme = () => {
  const themes: ('light' | 'dark' | 'auto')[] = ['light', 'dark', 'auto']
  const currentIndex = themes.indexOf(settingsStore.theme)
  const nextIndex = (currentIndex + 1) % themes.length
  settingsStore.setTheme(themes[nextIndex])
}
</script>