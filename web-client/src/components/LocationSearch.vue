<script setup lang="ts">
import { ref } from 'vue';

interface Location {
  id: string;
  name: string;
  country: string;
}

const isLoading = ref(false);
const locations = ref<Location[]>([]);
const searchText = ref('');

async function fetchLocations(searchLocation: string) {
  try {
    isLoading.value = true;
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URI}/location/`,
      {
        method: "POST",
        headers: {
          ['Content-Type']: 'application/json',
        },
        body: JSON.stringify({ searchLocation })
      }
    );
    const data = await response.json();
    locations.value = data.results;
  } catch(err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}

const outId = defineEmits(['location-id']);
function setLocation(id: string) {
  outId('location-id', id);
}
</script>

<template>
  <div class="search">
    <label for="location">Location Search</label>
    <input v-model="searchText" placeholder="Search for location..." />
    <button @click="fetchLocations(searchText)">Search</button>
    <div class="results-container">
      <button v-for="(item, index) in locations" :key="item.id" @click="setLocation(item.id)">
        {{item.name}} - {{item.country}}
      </button>
    </div>
  </div>
</template>

<style scoped>
  .search {
    flex-grow: 0.25;
  }

  .results-container, .search {
    display: flex;
    flex-direction: column;
    margin: 1rem 0;
    gap: 1rem;
    height: 100vh;
  }
</style>
