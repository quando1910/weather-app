<script setup>
import { ref, watch, computed } from 'vue'
import { ApiService } from '@/shared/services/api';
import { useLocation } from '@/stores/location';
import { format } from 'date-fns';

const api = new ApiService();
const store = useLocation();

const currentLocation = computed(() => store.currentLocation);
const weatherResult = ref();

watch(currentLocation, (val) => {
  getWeatherApi(val);
});

const getWeatherApi = async (location) => {
  const res = await api.get(['data', '2.5', 'forecast'], {
    lat: location.lat,
    lon: location.lon,
    appid: import.meta.env.VITE_API_KEY,
  });
  const temp = {};
  res.list.forEach(obj => {
    const dateKey = format(new Date(obj.dt * 1000), 'ccc dd MMM yyyy');
    if (temp[dateKey]) {
      temp[dateKey].push(obj);
    } else {
      temp[dateKey] = [obj];
    }
  })
  res.list = temp;
  weatherResult.value = res;
}

const convertKtoC = (degree) => {
  return `${parseFloat(+degree - 273.15).toFixed(2)} ℃`;
}

</script>

<template>
  <div v-if="weatherResult">
    <h1 class="mt-5 text-lg font-bold">The Forecast of {{ weatherResult.city.name }}, {{ weatherResult.city.country }}</h1>
    <div class="py-3" v-for="(weatherDay, index) of Object.keys(weatherResult?.list)" :key="index">
      <h3 class="font-semibold text-indigo-800">{{ weatherDay }}</h3>
      <ul class="flex gap-5">
        <li class="pb-3" v-for="weatherHour of weatherResult?.list[weatherDay]">
          <p class="font-semibold">{{ format(new Date(weatherHour.dt * 1000), 'p') }}</p>
          <p>{{ weatherHour.weather?.[0]?.description }}</p>
          <p>{{ convertKtoC(weatherHour.main.temp_min) }} ~ {{ convertKtoC(weatherHour.main.temp_max) }}</p>
        </li>
      </ul>
    </div>
  </div>
  <div v-else>
    <h1 class="text-center font-bold mt-20 text-2xl">Welcome to our weather forecast!</h1>
    <p class="text-center">Please input city name into the search box</p>
  </div>
</template>

<style scoped>
</style>
