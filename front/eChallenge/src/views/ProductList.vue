<template>
  <div class="w-full flex flex-wrap">
    <div v-for="product in products" :key="product.id">
      <ProductCard :product="product" @addToCart="addCart" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {  defineProps, defineEmits } from 'vue';
import ProductCard from '../components/formCard.vue';
const emit = defineEmits();

const addCart = (res) => {
  emit('addCart', res);
}

const { products } = defineProps(['products']);
</script>
