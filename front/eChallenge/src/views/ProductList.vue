<template>
  <div class="w-full flex flex-wrap">
    <div v-for="product in products" :key="product.id">
      <ProductCard :product="product" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {  defineProps } from 'vue';
import ProductCard from '../components/formCard.vue';

const { products } = defineProps(['products']);
</script>
