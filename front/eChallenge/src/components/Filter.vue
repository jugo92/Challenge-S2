<template>
    <aside>
      <div class="mb-8">
        <select v-model="selectedCategory"  class="mb-2">
          <option value="" disabled selected>Filtrer par</option>
          <option v-for="(values, property) in filteredProperties" :key="property" :value="property">{{ property }}</option>
        </select>
        <transition name="fade" mode="out-in">
          <select v-if="selectedCategory !== null" v-model="selectedValues[selectedCategory]" :key="selectedCategory + '-select'" class="mb-2">
            <option value="" disabled>Sélectionner {{ selectedCategory }}</option>
            <option v-for="value in filteredProperties[selectedCategory]" :key="value" :value="value">{{ value }}</option>
          </select>
        </transition>
        <button @click="updateFilter()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
          Appliquer le filtre
        </button>
      </div>
    </aside>
  </template>
  
  <script setup>
  import { ref, onMounted, getCurrentInstance } from 'vue';
  import { useStore } from 'vuex';
  
  const store = useStore();
  const selectedCategory = ref(null);
  const selectedValues = ref({});
  const filteredProperties = ref({});
  const isSidebarOpen = ref(false);
  const { emit } = getCurrentInstance();
  
  onMounted(async () => {
    try {
      await store.dispatch('fetchProducts');
      filteredProperties.value = store.state.filteredProperties;
      initializeSelectedValues();
      console.log('filteredProperties:', filteredProperties.value);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  });
  
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  
  const toggleCategory = () => {
    initializeSelectedValues();
  };
  
  const initializeSelectedValues = () => {
    for (const property in filteredProperties.value) {
      selectedValues.value[property] = '';
    }
  };
  
  const updateFilter = () => {
    if (selectedCategory.value) {
      const property = selectedCategory.value;
      emit('update-filter', { property, value: selectedValues.value[property] });
    }
  };
  </script>
  