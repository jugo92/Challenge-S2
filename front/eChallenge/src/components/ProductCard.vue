<script setup>
   import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps(['product', 'addToCart']);
</script>


<template>
    <div class="flex-1 0 50% max-w-xs mx-2 mb-8">
      <span class="block -mt-1 text-xs font-semibold text-gray-400">{{ product.state }}</span>
      <RouterLink :to="{ name: 'ProductDetails', params: { id: product._id } }">
        <img src="https://www.dropbox.com/s/mlor33hzk73rh0c/x14423.png?dl=1" alt="" class="hover:scale-110 transition-all object-cover w-full" />
      </RouterLink>
      <h3 class="text-lg font-semibold">{{ product.name }}</h3>
      <p class="text-gray-700">{{ product.price }} €</p>
      <button @click="addToCart(product)" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full">Add to Cart</button>
    </div>
  </template>