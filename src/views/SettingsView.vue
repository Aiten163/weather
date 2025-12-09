<template>
  <div class="settings-view container py-4">
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <div class="card">
          <div class="card-header">
            <h3 class="mb-0">
              <i class="bi bi-gear me-2"></i>
              {{ t('settings') }}
            </h3>
          </div>

          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h5 class="mb-3">
                  <i class="bi bi-translate me-2"></i>
                  {{ t('language') }}
                </h5>
                <LanguageSwitcher />
              </div>

              <div class="col-md-6">
                <h5 class="mb-3">
                  <i class="bi bi-palette me-2"></i>
                  {{ t('theme') }}
                </h5>
                <ThemeToggle />
              </div>
            </div>

            <hr class="my-4">

            <h5 class="mb-3">
              <i class="bi bi-rulers me-2"></i>
              {{ t('units') }}
            </h5>

            <div class="row g-4">
              <div class="col-md-4">
                <h6 class="mb-2">{{ t('temperature') }}</h6>
                <UnitSwitcher type="temperature" />
              </div>

              <div class="col-md-4">
                <h6 class="mb-2">{{ t('windSpeed') }}</h6>
                <UnitSwitcher type="wind" />
              </div>

              <div class="col-md-4">
                <h6 class="mb-2">{{ t('pressureUnit') }}</h6>
                <UnitSwitcher type="pressure" />
              </div>
            </div>

            <hr class="my-4">

            <h5 class="mb-3">
              <i class="bi bi-database me-2"></i>
              {{ t('dataManagement') }}
            </h5>

            <div class="alert alert-info">
              <i class="bi bi-info-circle me-2"></i>
              {{ t('settingsSaved') }}
            </div>

            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
              <button class="btn btn-outline-secondary" @click="clearCache">
                <i class="bi bi-trash me-1"></i>
                {{ t('clearCache') }}
              </button>
              <button class="btn btn-primary" @click="exportSettings">
                <i class="bi bi-download me-1"></i>
                {{ t('exportSettings') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTranslation } from '@/composables/useTranslation'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import UnitSwitcher from '@/components/common/UnitSwitcher.vue'

const { t } = useTranslation()

const clearCache = () => {
  if (confirm(t('confirmClearCache'))) {
    localStorage.clear()
    location.reload()
  }
}

const exportSettings = () => {
  const settings: Record<string, any> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('weather-dashboard-')) {
      const value = localStorage.getItem(key)
      if (value) {
        settings[key] = JSON.parse(value)
      }
    }
  }

  const dataStr = JSON.stringify(settings, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

  const exportFileDefaultName = 'weather-dashboard-settings.json'
  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}
</script>