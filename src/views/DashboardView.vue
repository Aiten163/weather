<template>
  <div class="dashboard">
    <div class="row">
      <div class="col-lg-8">
        <CurrentWeather />
        <div class="mt-4">
          <DailyForecast />
        </div>
        <div class="mt-4">
          <HourlyForecast />
        </div>
      </div>
      <div class="col-lg-4">
        <CityList />
        <div class="mt-4">
          <SettingsPanel />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CurrentWeather from '@/components/weather/CurrentWeather.vue'
import DailyForecast from '@/components/forecast/DailyForecast.vue'
import HourlyForecast from '@/components/forecast/HourlyForecast.vue'
import CityList from '@/components/city/CityList.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'
</script>