<template>
  <div class="container mx-auto px-4">
    <form class="space-y-4 mt-8">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="marque" class="block text-sm font-medium text-gray-700">Marque</label>
          <select id="marque" name="marque" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option v-for="marque in marquesList" :key="marque.id" :value="marque.name">{{ marque.name }}</option>
          </select>
        </div>
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
          <select id="category" name="category" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option v-for="category in categoriesList" :key="category.id" :value="category.name">{{ category.name }}</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="minPrice" class="block text-sm font-medium text-gray-700">Prix min</label>
          <input type="number" @input="updateFilter" v-model="minPrice" id="minPrice" name="minPrice" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label for="maxPrice" class="block text-sm font-medium text-gray-700">Prix max</label>
          <input type="number"  @input="updateFilter" v-model="minPrice" id="maxPrice" name="maxPrice" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
      </div>
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea id="description" @input="updateFilter" v-model="description"  name="description" rows="4" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
      </div>
      <div>
        <label for="nom" class="block text-sm font-medium text-gray-700">Nom</label>
        <input type="text"  @input="updateFilter" v-model="productName" id="productName"  name="nom" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <!-- <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white py-2 px-4 rounded">
        Rechercher
      </button> -->
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

const emit = defineEmits();
const {marquesList, categoriesList } = defineProps(['marquesList', 'categoriesList']);

const productName = ref('');
const minPrice = ref<number | null>(null);
const maxPrice = ref<number | null>(null);
const description = ref("");
const selectedMarque = ref('');
const selectedCategory = ref('');

const updateFilter = () => {
  emit('onFilterChange', {
    productName: productName.value,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
    description: description.value,
    marque: selectedMarque.value,
    category: selectedCategory.value,
  });
};
</script>
