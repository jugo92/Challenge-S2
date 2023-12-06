<template>
  <div class="relative m-10 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
    <a class="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl" href="#">
      <img class="object-cover" :src="`http://localhost:3000/getImage/${product.image}`" />
      <span v-if="product.promotion > 0" class="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">{{ product.promotion }} %</span>  
      <!-- <div v-if="product.promotion" class="absolute top-0 right-0 bg-red-500 text-white py-1 px-2 rounded-bl-md rounded-tr-md">Promotion</div> -->
    </a>
    <div class="mt-4 px-5 pb-5">
      <a href="#">
        <h5 class="text-xl tracking-tight text-slate-900">{{ product.name }}</h5>
      </a>
      <div class="mt-2 mb-5 flex items-center justify-between">
        <div v-if="product.promotion > 0">
          <p>
            <span class="text-3xl font-bold text-slate-900">{{ product.price - ((product.promotion/100)*product.price) }}€</span>
            <span class="text-sm text-slate-900 line-through">{{ product.price }}€</span>
          </p>
        </div>
        <div v-else>
          <p>
            <span class="text-3xl font-bold text-slate-900">{{ product.price }}€</span>
          </p>
        </div>
    </div>
      <div v-if="product.stock > 0">
      <div @click="addToCart(product)">
        <span class="flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Ajouter au panier
        </span>
      </div>
      </div>
      <div v-else>
        <div>
        <span class="flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
          Rupture de Stock
        </span>
      </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps } from 'vue';
import {checkAndAddToBasket, basket} from "../services/basketService"

const { product } = defineProps(['product']);

const addToCart = () => {
  console.log(JSON.parse(localStorage.getItem("basket")))
  checkAndAddToBasket(product, 1)
  console.log(`Produit ajouté au panier : ${product.name}`);
};
</script>

<style scoped>
.container {
 display: flex;
 flex-wrap: wrap;
 gap: 16px;
 padding: 16px;
}

.card {
 background-color: #fff;
 border-radius: 4px;
 padding: 16px;
 box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
 width: 100%;
 max-width: 300px;
}

.card img {
 width: 100%;
 height: auto;
 object-fit: cover;
}


button {
 background-color: #1a73e8;
 color: #fff;
 border: none;
 border-radius: 4px;
 padding: 8px 16px;
 cursor: pointer;
 transition: background-color 0.3s;
}

button:hover {
 background-color: #0d5ecc;
}
</style>