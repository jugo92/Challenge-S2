<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps(['product', 'addToCart']);
</script>


<template>
    <div class="relative overflow-hidden bg-white shadow rounded-xl">
      <RouterLink :to="{ name: 'ProductDetails', params: { id: product._id } }">
        <div class="relative overflow-hidden">
          <div class="mb-5 overflow-hidden">
            <img class="object-cover w-full mx-auto transition-all rounded h-72 hover:scale-110" :src="product.image" alt="">
          </div>
        </div>
      </RouterLink>
      <p class="px-5 mb-4 font-bold dark:text-black">{{ product.name }}</p>
      <div class="flex">
        <div class="w-1/2 px-5 pb-3">
          <p class="text-lg font-bold text-blue-500 dark:text-blue-300">
            {{ product.price }} €
          </p>
          <span class="block -mt-1 text-xs font-semibold text-gray-400">{{ product.state }}</span>
        </div>
        <button @click="addToCart(product)" class="flex-1 text-sm text-white transition-all bg-blue-500 rounded-r-none hover:bg-blue-600 rounded-t-xl text-center text-l">
          Ajouter au panier
        </button>
      </div>
    </div>
  </template>
  
