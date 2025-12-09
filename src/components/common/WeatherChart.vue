<template>
  <div class="weather-chart">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useSettingsStore } from '@/store/settings'

Chart.register(...registerables)

interface Props {
  data: number[]
  labels: string[]
  type?: 'line' | 'bar'
  title?: string
  unit?: string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'line',
  title: '',
  unit: '',
  color: '#4361ee'
})

const settingsStore = useSettingsStore()
const chartCanvas = ref<HTMLCanvasElement>()
let chart: Chart | null = null

const createChart = () => {
  if (!chartCanvas.value) return

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  if (chart) {
    chart.destroy()
  }

  const isDark = settingsStore.computedTheme === 'dark'

  chart = new Chart(ctx, {
    type: props.type,
    data: {
      labels: props.labels,
      datasets: [{
        label: props.title,
        data: props.data,
        borderColor: props.color,
        backgroundColor: props.type === 'bar' ? `${props.color}80` : 'transparent',
        fill: props.type === 'line',
        tension: 0.4,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: !!props.title,
          labels: {
            color: isDark ? '#fff' : '#666'
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return `${context.dataset.label}: ${context.parsed.y}${props.unit}`
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            color: isDark ? '#fff' : '#666'
          }
        },
        y: {
          grid: {
            color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            color: isDark ? '#fff' : '#666',
            callback: (value) => `${value}${props.unit}`
          }
        }
      }
    }
  })
}

onMounted(() => {
  createChart()
})

watch(() => [props.data, props.labels, settingsStore.computedTheme], () => {
  createChart()
}, { deep: true })

onUnmounted(() => {
  if (chart) {
    chart.destroy()
  }
})
</script>

<style scoped>
.weather-chart {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>