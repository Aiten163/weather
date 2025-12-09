<template>
  <div class="temperature-display">
    <span class="temperature-value" :class="sizeClass">
      {{ displayValue }}
    </span>
    <span v-if="showUnit" class="temperature-unit ms-1">
      {{ unitSymbol }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '@/store/settings'
import { formatTemperature } from '@/utils/weather-formatters'

interface Props {
  value: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showUnit?: boolean
  unit?: 'C' | 'F'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showUnit: true,
  unit: undefined
})

const settingsStore = useSettingsStore()

const displayValue = computed(() => {
  const temp = formatTemperature(props.value, props.unit)
  return temp.replace(/[°CF]/g, '') // Убираем символы градусов
})

const unitSymbol = computed(() => {
  const unit = props.unit || settingsStore.temperatureUnit
  return unit === 'C' ? '°C' : '°F'
})

const sizeClass = computed(() => ({
  'display-1': props.size === 'xl',
  'display-2': props.size === 'lg',
  'display-3': props.size === 'md',
  'display-4': props.size === 'sm'
}))
</script>

<style scoped>
.temperature-display {
  display: inline-flex;
  align-items: baseline;
  line-height: 1;
}

.temperature-unit {
  font-size: 0.6em;
  opacity: 0.8;
  vertical-align: super;
}
</style>