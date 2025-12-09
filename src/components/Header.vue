<template>
  <header class="navbar navbar-expand-lg" :class="headerClass">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">
        <span class="me-2">🌤️</span>
        {{ t('title') }}
      </router-link>

      <button class="navbar-toggler" type="button" @click="toggleNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div :class="['collapse navbar-collapse', { 'show': isNavOpen }]">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link">
              {{ t('dashboard') }}
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/settings" class="nav-link">
              {{ t('settings') }}
            </router-link>
          </li>
        </ul>

        <div class="d-flex align-items-center gap-3">
          <CitySearch />
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSettingsStore } from '@/store/settings'
import CitySearch from '@/components/city/CitySearch.vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()
const settingsStore = useSettingsStore()
const isNavOpen = ref(false)

const headerClass = computed(() => ({
  'navbar-light bg-light': settingsStore.computedTheme === 'light',
  'navbar-dark bg-dark': settingsStore.computedTheme === 'dark'
}))

const toggleNav = () => {
  isNavOpen.value = !isNavOpen.value
}
</script>