<!-- ProductList.vue -->

<template>
  <div>
    <div v-for="product in products" :key="product.id">
      <ProductCard :product="product" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';
import ProductCard from '../components/formCard.vue';

const { products } = defineProps(['products']);
</script>
