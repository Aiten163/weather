<template>
  <div class="settings-panel card">
    <div class="card-header">
      <h5 class="mb-0">
        <i class="bi bi-gear me-2"></i>
        {{ t('settings') }}
      </h5>
    </div>
    <div class="card-body">
      <div class="mb-4">
        <h6 class="mb-3">
          <i class="bi bi-thermometer-half me-2"></i>
          {{ t('temperature') }}
        </h6>
        <div class="btn-group w-100" role="group">
          <button class="btn btn-outline-primary"
                  :class="{ 'active': settingsStore.temperatureUnit === 'C' }"
                  @click="settingsStore.setTemperatureUnit('C')">
            {{ t('celsius') }}
          </button>
          <button class="btn btn-outline-primary"
                  :class="{ 'active': settingsStore.temperatureUnit === 'F' }"
                  @click="settingsStore.setTemperatureUnit('F')">
            {{ t('fahrenheit') }}
          </button>
        </div>
      </div>

      <div class="mb-4">
        <h6 class="mb-3">
          <i class="bi bi-wind me-2"></i>
          {{ t('windSpeed') }}
        </h6>
        <div class="btn-group w-100" role="group">
          <button class="btn btn-outline-primary"
                  :class="{ 'active': settingsStore.windSpeedUnit === 'kmh' }"
                  @click="settingsStore.setWindSpeedUnit('kmh')">
            {{ t('kmh') }}
          </button>
          <button class="btn btn-outline-primary"
                  :class="{ 'active': settingsStore.windSpeedUnit === 'mph' }"
                  @click="settingsStore.setWindSpeedUnit('mph')">
            {{ t('mph') }}
          </button>
          <button class="btn btn-outline-primary"
                  :class="{ 'active': settingsStore.windSpeedUnit === 'ms' }"
                  @click="settingsStore.setWindSpeedUnit('ms')">
            {{ t('ms') }}
          </button>
        </div>
      </div>

      <div class="mb-4">
        <h6 class="mb-3">
          <i class="bi bi-speedometer2 me-2"></i>
          {{ t('pressureUnit') }}
        </h6>
        <div class="btn-group w-100" role="group">
          <button class="btn btn-outline-primary"
                  :class="{ 'active': settingsStore.pressureUnit === 'mmHg' }"
                  @click="settingsStore.setPressureUnit('mmHg')">
            {{ t('mmHg') }}
          </button>
          <button class="btn btn-outline-primary"
                  :class="{ 'active': settingsStore.pressureUnit === 'hPa' }"
                  @click="settingsStore.setPressureUnit('hPa')">
            {{ t('hPa') }}
          </button>
        </div>
      </div>

      <div class="mb-3">
        <h6 class="mb-3">
          <i class="bi bi-palette me-2"></i>
          {{ t('theme') }}
        </h6>
        <div class="btn-group w-100" role="group">
          <button class="btn btn-outline-primary"
                  :class="{ 'active': settingsStore.theme === 'light' }"
                  @click="settingsStore.setTheme('light')">
            <i class="bi bi-sun me-1"></i> {{ t('light') }}
          </button>
          <button class="btn btn-outline-primary"
                  :class="{ 'active': settingsStore.theme === 'dark' }"
                  @click="settingsStore.setTheme('dark')">
            <i class="bi bi-moon me-1"></i> {{ t('dark') }}
          </button>
          <button class="btn btn-outline-primary"
                  :class="{ 'active': settingsStore.theme === 'auto' }"
                  @click="settingsStore.setTheme('auto')">
            <i class="bi bi-circle-half me-1"></i> {{ t('auto') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/store/settings'
import { useTranslation } from '@/composables/useTranslation'

const settingsStore = useSettingsStore()
const { t } = useTranslation()
</script>

<style scoped>
.settings-panel .btn-group .btn {
  flex: 1;
}

.settings-panel .btn.active {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
  color: white;
}
</style>