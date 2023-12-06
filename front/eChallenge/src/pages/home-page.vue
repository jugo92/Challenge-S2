
 <template>
  <div>
   <Navbar />
    </div>
  <div>
    <div class="top ">
      <SliderImage />
    </div>
  </div>
  <section>
      <!-- Filtres -->
      <Filters @onFilterChange="applyFilters" :marquesList="marquesList" :categoriesList="categoryList" />
    </section>
    <section>
      <ProductList :products="filteredProducts" />
    </section>

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
  marque: '',
  category: "" ,
});

const applyFilters = (newFilters) => {
  console.log(newFilters)
  filters.value = { ...newFilters };
  loadAndSetFilteredProducts();};

const loadFilteredProducts = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/products?page=1&limit=10&productName=${filters.value.productName}&minPrice=${filters.value.minPrice}&maxPrice=${filters.value.maxPrice}&description=${filters.value.description}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch product details");
    }

    const filteredProducts = await response.json();
    console.log("DATA RECEIVED  : ", filteredProducts);
    return filteredProducts;
  } catch (error) {
    console.error("Error fetching product details:", error);
    return []; // Retourner une liste vide en cas d'erreur
  }
};

const loadAndSetFilteredProducts = async () => {
  filteredProducts.value = await loadFilteredProducts();
  console.log("FILTER PRODUCT : ", filteredProducts.value)
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

