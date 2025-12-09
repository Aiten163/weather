<template>
  <span class="weather-icon" :class="sizeClass" :style="iconStyle">
    {{ getIcon(condition, isDay) }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getWeatherIcon } from '@/utils/weather-formatters'

interface Props {
  condition: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isDay?: boolean
  rotate?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  isDay: true,
  rotate: 0
})

const sizeClass = computed(() => ({
  'weather-icon-sm': props.size === 'sm',
  'weather-icon-md': props.size === 'md',
  'weather-icon-lg': props.size === 'lg',
  'weather-icon-xl': props.size === 'xl'
}))

const iconStyle = computed(() => ({
  transform: `rotate(${props.rotate}deg)`
}))

const getIcon = (condition: string, isDay: boolean) => {
  return getWeatherIcon(condition, isDay)
}
</script>

<style scoped>
.weather-icon {
  display: inline-block;
  line-height: 1;
}

.weather-icon-sm {
  font-size: 1.2em;
}

.weather-icon-md {
  font-size: 1.8em;
}

.weather-icon-lg {
  font-size: 3em;
}

.weather-icon-xl {
  font-size: 5em;
}
</style>