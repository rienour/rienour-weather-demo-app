<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Forecast {
  date: string;
  tempFahrenheit: number;
}

const props = defineProps<{
  name: string,
  country: string,
  forecasts?: Forecast[],
}>();

const selectedForecast = ref<number>(0);
watch(() => props.forecasts, (newForecasts) => {
  if(newForecasts && newForecasts.length > 0)
    selectedForecast.value = 4;
});

const isCelsius = ref<boolean>(false);

const currentForecast = computed<Forecast | null>(() => {
  return props.forecasts && props.forecasts.length > 0
    ? props.forecasts[selectedForecast.value]
    : null;
});

function nextDate() {
  if (props.forecasts && selectedForecast.value < props.forecasts.length - 1) {
    selectedForecast.value++;
  }
}

function prevDate() {
  if (props.forecasts && selectedForecast.value > 0) {
    selectedForecast.value--;
  }
}

function toggleUnit() {
  isCelsius.value = !isCelsius.value;
}

function displayTemperature(tempF: number) {
  return isCelsius.value
    ? ((tempF - 32) * 5 / 9).toFixed(1)
    : tempF;
}

function formatDateString(date: string) {
  const inputDate = new Date(date);
  return inputDate.toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' });

}
</script>

<template>
  <div class="forecast-container" v-if="currentForecast">
    <h1>{{name}}, {{country}}</h1>
    <h3>{{displayTemperature(currentForecast.tempFahrenheit)}}</h3>
    <div>
      <button @click="prevDate" :disabled="selectedForecast === 0">Prev</button>
      <span>{{formatDateString(currentForecast.date)}}</span>
      <button @click="nextDate" :disabled="forecasts && selectedForecast === forecasts.length - 1">Next</button>
    </div>
    <button @click="toggleUnit">
      Convert to {{ isCelsius ? 'F' : 'C' }}
    </button>
  </div>
</template>

<style scoped>
  .forecast-container {
    margin: 2rem auto;
    display: flex;
    flex-grow: 2;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-items: center;
    width: 100%;
  }

  button {
    max-width: 10rem;
  }
</style>
