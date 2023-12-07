<template>

  <div class="w-full">
 
     <form class="space-y-6">
 
       <div>
 
         <label class="block text-lg font-semibold text-gray-700">Catégories</label>
 
         <div class="mt-2 grid grid-cols-2 gap-4">
 
           <div v-for="category in categoriesList" :key="category.id">
 
             <label :for="category.name" class="flex items-center">
 
               <input
 
                 type="checkbox"
 
                 :id="category.name"
 
                 :value="category.name"
 
                 v-model="selectedCategories"
 
                 @change="updateFilter"
 
                 class="mr-2"
 
               />
 
               <span class="text-sm">{{ category.name }}</span>
 
             </label>
 
           </div>
 
         </div>
 
       </div>
 
       
 
       <div>
 
         <label class="block text-lg font-semibold text-gray-700">Marques</label>
 
         <div class="mt-2 grid grid-cols-2 gap-4">
 
           <div v-for="marque in marquesList" :key="marque.id">
 
             <label :for="marque.name" class="flex items-center">
 
               <input
 
                 type="checkbox"
 
                 :id="marque.name"
 
                 :value="marque.name"
 
                 v-model="selectedMarques"
 
                 @change="updateFilter"
 
                 class="mr-2"
 
               />
 
               <span class="text-sm">{{ marque.name }}</span>
 
             </label>
 
           </div>
 
         </div>
 
       </div>
 
       <div class="grid grid-cols-2 gap-4">
 
         <div>
 
           <label for="minPrice" class="block text-sm font-medium text-gray-700">Prix min</label>
 
           <input type="text" @input="updateFilter" v-model="minPrice" id="minPrice" name="minPrice" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
 
         </div>
 
         <div>
 
           <label for="maxPrice" class="block text-sm font-medium text-gray-700">Prix max</label>
 
           <input type="text" @input="updateFilter" v-model="maxPrice" id="maxPrice" name="maxPrice" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
 
         </div>
 
       </div>
 
       <div>
 
         <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
 
         <textarea id="description" @input="updateFilter" v-model="description" name="description" rows="4" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
 
       </div>
 
       <div>
 
         <label for="nom" class="block text-sm font-medium text-gray-700">Nom</label>
 
         <input type="text" @input="updateFilter" v-model="productName" id="productName" name="nom" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
 
       </div>
 
       <div>
 
     <label for="promotions" class="block text-sm font-medium text-gray-700">Promotions</label>
 
     <input type="checkbox" @change="updateFilter" v-model="promotions" id="promotions" name="promotions" class="mt-1 block  py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
  </div>
     </form>
  </div>
 </template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

const emit = defineEmits();
const {marquesList, categoriesList } = defineProps(['marquesList', 'categoriesList']);

const productName = ref('');
const minPrice = ref("");
const maxPrice = ref("");
const description = ref("");
const selectedMarques = ref([]);
const selectedCategories = ref([]);
const promotions = ref(false);

const updateFilter = () => {
  emit('onFilterChange', {
    productName: productName.value,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
    description: description.value,
    marque: selectedMarques.value,
    category: selectedCategories.value,
    promotions: promotions.value
  });
};
</script>
