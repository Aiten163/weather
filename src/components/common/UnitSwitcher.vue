<template>
  <div class="unit-switcher">
    <div class="btn-group btn-group-sm" role="group">
      <button v-for="unit in units"
              :key="unit.value"
              class="btn btn-outline-secondary"
              :class="{ 'active': isActive(unit.value) }"
              @click="selectUnit(unit.value)"
              :title="unit.title">
        {{ unit.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '@/store/settings'

interface Props {
  type: 'temperature' | 'wind' | 'pressure'
}

const props = defineProps<Props>()
const settingsStore = useSettingsStore()

const units = computed(() => {
  switch (props.type) {
    case 'temperature':
      return [
        { value: 'C', label: '°C', title: 'Celsius' },
        { value: 'F', label: '°F', title: 'Fahrenheit' }
      ]
    case 'wind':
      return [
        { value: 'kmh', label: 'km/h', title: 'Kilometers per hour' },
        { value: 'mph', label: 'mph', title: 'Miles per hour' },
        { value: 'ms', label: 'm/s', title: 'Meters per second' }
      ]
    case 'pressure':
      return [
        { value: 'mmHg', label: 'mmHg', title: 'Millimeters of mercury' },
        { value: 'hPa', label: 'hPa', title: 'Hectopascals' }
      ]
    default:
      return []
  }
})

const currentValue = computed(() => {
  switch (props.type) {
    case 'temperature': return settingsStore.temperatureUnit
    case 'wind': return settingsStore.windSpeedUnit
    case 'pressure': return settingsStore.pressureUnit
  }
})

const isActive = (value: string) => {
  return currentValue.value === value
}

const selectUnit = (value: string) => {
  switch (props.type) {
    case 'temperature':
      settingsStore.setTemperatureUnit(value as 'C' | 'F')
      break
    case 'wind':
      settingsStore.setWindSpeedUnit(value as 'kmh' | 'mph' | 'ms')
      break
    case 'pressure':
      settingsStore.setPressureUnit(value as 'mmHg' | 'hPa')
      break
  }
}
</script>