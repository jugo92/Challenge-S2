
 <template>

  <div>

    <div class="top ">
      <SliderImage />
    </div>
      <div class="m-5 w-full flex">
      <section class="w-1/4 bg-gray-200 p-4 h-full col-span-1">
        <Filters @onFilterChange="applyFilters" :marquesList="marquesList" :categoriesList="categoryList" />
      </section>
      <section class="flex w-3/4 p-4">
        <ProductList :products="filteredProducts" @addCart="addCart" />
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
  promotions: false
});

const addCart = (test) => {
  console.log(test)
  console.log("event remotne")
}

const applyFilters = (newFilters) => {
  filters.value = { ...newFilters };
  loadAndSetFilteredProducts();
};

const loadFilteredProducts = async () => {
  try {
    const response = await fetch(
  `${import.meta.env.VITE_API_URL}/products?page=1&limit=100&name=${filters.value.productName}&promotions=${filters.value.promotions}&minPrice=${filters.value.minPrice}&maxPrice=${filters.value.maxPrice}&description=${filters.value.description}&categories=${filters.value.category.join(",")}&marques=${filters.value.marque.join(",")}`,
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
      `${import.meta.env.VITE_API_URL}/brands`
  );
   marquesList.value = await responseMarque.json();
   const responseCategory = await fetch(
      `${import.meta.env.VITE_API_URL}/categories`
  );
   categoryList.value = await responseCategory.json();
};

loadAndSetFilteredProducts();
loadMarqueAndCategory();
</script>

<style scoped>

.modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000; /* Ajustez la valeur si nécessaire */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
}

.container {
 margin-left: auto;
 margin-right: auto;

}

.top{
  margin-top: 10%;
}

</style> 

