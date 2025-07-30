<script setup lang="ts">
import { ref } from 'vue';
import LocationSearch from './components/LocationSearch.vue';
import ForecastData from './components/ForecastData.vue';

interface Forecast {
  date: string;
  tempFahrenheit: number;
}

const selectedForecast = ref<{ name: string; country: string; weatherDays: Forecast[] }>();
const isLoading = ref(false);

async function fetchLocationData(id: string) {
  try {
    isLoading.value = true;
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URI}/location/${id}`,
      {
        method: "GET",
        headers: {
          ['Content-Type']: 'application/json',
        },
      }
    );
    const data = await response.json();
    selectedForecast.value = data;
  } catch(err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <main>
    <LocationSearch @location-id="fetchLocationData"/>
    <ForecastData
      v-if="selectedForecast && selectedForecast.weatherDays?.length > 0"
      :name="selectedForecast.name"
      :country="selectedForecast.country"
      :forecasts="selectedForecast.weatherDays.sort((a: Forecast, b: Forecast) => a.date < b.date ? -1 : 1)"
    />
    <div class="app-placeholder" v-else>Select a location to get started</div>
  </main>
</template>

<style scoped>
  main {
    display: flex;
    height: 100vh;
  }

  app-placeholder {
    margin: auto auto;
  }
</style>
