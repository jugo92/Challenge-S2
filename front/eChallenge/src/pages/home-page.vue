
<template>
  <div class="w-full">
    <Navbar />
    <div class="top">
      <SliderImage />
    </div>
    <div class="m-5 w-full flex">
      <section class="w-1/4 bg-gray-200 p-4 h-full col-span-1">
        <Filters @onFilterChange="applyFilters" :marquesList="marquesList" :categoriesList="categoryList" />
      </section>
      <section class="flex w-3/4 p-4">
        <ProductList :products="filteredProducts" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">

import SliderImage from '../components/carousel/SliderImage.vue';
import ProductList from "../views/ProductList.vue";
import Navbar from '../components/Navbar.vue';
import { ref } from 'vue';
import Filters from "../components/Filter.vue"

const filteredProducts = ref<Array<any>>()
const marquesList = ref<Array<any>>()
const categoryList = ref<Array<any>>()

const filters = ref({
  productName: '',
  minPrice: null,
  maxPrice: null,
  description: '',
  marque: [],
  category: [] ,
  promotions: null
});

const applyFilters = (newFilters) => {
  filters.value = { ...newFilters };
  loadAndSetFilteredProducts();
};

const loadFilteredProducts = async () => {
  try {
    console.log("FILTRE : ", filters.value.promotions)
    const response = await fetch(
      `http://localhost:3000/api/products?page=1&limit=10&name=${filters.value.productName}&minPrice=${filters.value.minPrice}&maxPrice=${filters.value.maxPrice}&description=${filters.value.description}&categories=${filters.value.category.join(",")}&marques=${filters.value.marque.join(",")}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch product details");
    }

    const filteredProducts = await response.json();
    return filteredProducts;
  } catch (error) {
    console.error("Error fetching product details:", error);
    return []; // Retourner une liste vide en cas d'erreur
  }
};

const loadAndSetFilteredProducts = async () => {
  filteredProducts.value = await loadFilteredProducts();
};

const loadMarqueAndCategory = async () => {
  const responseMarque = await fetch(
      `http://localhost:3000/api/brands`
  );
   marquesList.value = await responseMarque.json();
   const responseCategory = await fetch(
      `http://localhost:3000/api/categories`
  );
   categoryList.value = await responseCategory.json();
};

loadAndSetFilteredProducts();
loadMarqueAndCategory();
</script>

<style scoped>


.container {
 margin-left: auto;
 margin-right: auto;

}

.top{
  margin-top: 10%;
}

</style> 

