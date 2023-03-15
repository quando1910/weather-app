<script setup>
import { ref } from 'vue'
import { ApiService } from '@/shared/services/api';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import { debounce } from 'lodash';
import { useLocation } from '@/stores/location';

const locationSuggestion = ref([]);
const showSuggestion = ref(false);
const locationSearchValue = ref('');
const store = useLocation();

const api = new ApiService();

const searchApi = async (e) => {
  locationSearchValue.value = e.target.value;
  if (e.target.value) {
    const res = await api.get(['geo', '1.0', 'direct'], {
      q: e.target.value,
      limit: 5,
      appid: import.meta.env.VITE_API_KEY
    })
    locationSuggestion.value = res;
    showSuggestion.value = true;
  }
}

const search = debounce(searchApi, 800);

const chooseItem = (location) => {
  locationSearchValue.value = `${location.name},${location.state},${location.country}`;
  store.setCurrentLocation(location);
  showSuggestion.value = false;
}

const onFocus = (e) => {
  if (locationSuggestion.value?.length) {
    showSuggestion.value = true;
  }
}

const onBlur = (e) => {
  const currentTarget = e.currentTarget;
  requestAnimationFrame(() => {
    if (!currentTarget.contains(document.activeElement)) {
      showSuggestion.value = false;
    }
  });
}

</script>

<template>
  <div>
    <label for="search" class="block text-sm font-medium leading-6 text-gray-900">Search location</label>
    <div class="relative pb-2" :tabindex="0" @click="(e) => e.preventDefault()" @blur="onBlur">
      <div class="relative mt-2 rounded-md shadow-sm">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
        </div>
        <input
          :value="locationSearchValue"
          type="text"
          name="search"
          class="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Input location"
          @input="search"
          @focus="onFocus" 
        />
      </div>
      <div v-if="locationSuggestion.length && showSuggestion" class="bg-white shadow-md w-full rounded-md absolute bottom-0 left-0 translate-y-full">
        <ul>
          <li v-for="(location, index) of locationSuggestion" class="py-3 px-5 text-sm py-2 hover:bg-gray-100 cursor-pointer" @click="chooseItem(location)" :key="index">{{location.name}}, {{location.state}}, {{location.country}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
