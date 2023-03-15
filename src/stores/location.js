import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useLocation = defineStore('currentLocation', () => {
  const currentLocation = ref();

  const setCurrentLocation = (value) => {
    currentLocation.value = value;
  }

  return { currentLocation, setCurrentLocation }
})
