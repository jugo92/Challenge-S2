<template>
  <div class="top">
    <ul>
      <li v-for="category in categories" :key="category.id" class="font-bold relative category-item" @click="selectCategory(category)">
      {{ category.name }}
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
]);

const selectedCategory = ref<number | null>(null);

const selectCategory = (category: { id: number }) => {
  selectedCategory.value = category.id;
};
</script>

<style scoped>
.top {
  border: solid 1px rgb(255, 255, 255);
  background-color: rgb(248, 248, 248);
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0px 0px 8px 0px rgb(160, 160, 160);
  overflow-x: auto; 
  white-space: nowrap; 
  display: flex;
  text-align: center;
  height: 50px;
  margin-top: 6%;
}

li {
  position: relative;
  color: #000000;
  text-decoration: none;
  margin-right: 3.5rem; 
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 0.5rem 0.5rem 0.5rem;
  display: inline-block; 
  min-width: 50%; 
  margin-top: -1rem;
}

li:after {
  content: '';
  justify-content: center;
  display: block;
  position: absolute;
  bottom: 2px;
  width: 0%;
  left: 0px;
  height: 2px;
  transition: 0.50s cubic-bezier(0.72,-0.01, 0.19, 0.92);
  background: #050505;
  cursor: pointer;
}

li:hover:after {
  width: 100%;
  cursor: pointer;
  justify-content: center;
}

@media (max-width: 768px) {
  .top {
  border: solid 1px rgb(255, 255, 255);
  background-color: rgb(248, 248, 248);
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0px 0px 8px 0px rgb(160, 160, 160);
  overflow-x: auto; 
  white-space: nowrap; 
  display: flex;
  height: 50px;
  margin-top: 22%;

}

li {
  position: relative;
  color: #000000;
  text-decoration: none;
  margin-right: 0.5rem; 
  font-size: 1rem;
  cursor: pointer;
  padding: 0.3rem 0.3rem 0.3rem 0.3rem;
  display: inline-block; 
  overflow: hidden;
  margin-top: -1rem;
 
}

li:after {
  content: '';
  display: block;
  position: absolute;
  bottom: 2px;
  width: 0%;
  left: 0px;
  height: 2px;
  transition: 0.50s cubic-bezier(0.72,-0.01, 0.19, 0.92);
  background: #050505;
  cursor: pointer;
}

li:hover:after {
  width: 100%;
  cursor: pointer;
}
}

li {
  position: relative;
  color: #000000;
  text-decoration: none;
  margin-right: 0.5rem; 
  font-size: 1rem;
  cursor: pointer;
  padding: 0.3rem 0.3rem 0.3rem 0.3rem;
  display: inline-block; 
  overflow: hidden;
  margin-top: -1rem;
 
}

li:after {
  content: '';
  display: block;
  position: absolute;
  bottom: 2px;
  width: 0%;
  left: 0px;
  height: 2px;
  transition: 0.50s cubic-bezier(0.72,-0.01, 0.19, 0.92);
  background: #050505;
  cursor: pointer;
}

li:hover:after {
  width: 100%;
  cursor: pointer;
}
}
</style>