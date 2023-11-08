<template>
  <div class="top">
    <ul>
      <li v-for="category in categories" :key="category.id" class="font-bold relative category-item" @click="selectCategory(category)">
        <div class="w-full h-full absolute inset-0 hover:bg-gray-600 hover:text-white transition-all duration-300">{{ category.name }}</div>
      </li>
    </ul>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';

const categories = ref([
  { id: 1, name: 'Bon plan' },
  { id: 2, name: 'reconditionné' },
  { id: 3, name: 'neuf' },
  { id: 4, name: 'occasion' },
  { id: 5, name: 'gratuit' },
]);

const selectedCategory = ref<number | null>(null);

const selectCategory = (category: { id: number }) => {
  selectedCategory.value = category.id;
};
</script>

<style scoped>
.top {
  background-color: #f3f4f6;
  border: solid 1px black;
  padding: 1rem;
}

ul {
  display: flex;
  justify-content: space-around;
  list-style: none;
  padding: 0;
  cursor: pointer;
}

.category-item {
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid transparent;
}

@media (max-width: 768px) {
  ul {
    flex-direction: column; 
    align-items: center;
  }

  .category-item {
    width: 100%;
    text-align: center; 
    margin-bottom: 5px; 
  }
}
</style>
