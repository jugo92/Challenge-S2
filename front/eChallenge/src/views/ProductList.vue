<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { RouterLink, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import ProductCard from '../components/ProductCard.vue';
import Filter from '../components/Filter.vue';

const store = useStore();
const posts = ref([]);
const itemsPerPage = 24;
const currentPage = ref(1);
const selectedState = ref(null);
const router = useRouter();
const triSelected = ref("default"); 
const isSearchResultsVisible = ref(false);
const isSearchActive = ref(false);
const filterPost = ref([]);


const performSearch = () => {
  store.commit('setFilterPost', filterPost.value);
};


onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    posts.value = await response.json();
 
    filteredPosts.value = [...posts.value];
  } catch (error) {
    console.error('Error fetching products:', error);
  }
});






const updateFilter = ({ property, values }) => {
  if (Array.isArray(values)) {
    filteredPosts.value = posts.value.filter(product => {
      if (property === 'state') {
        return values.includes(product[property]);
      } else {
        return values.includes(product[property].name);
      }
    });

    currentPage.value = 1;
  } else {
    console.error('Values is not an array:', values);
  }
};



const filteredPosts = computed(() => {
  
  return posts.value.filter(post =>
    selectedState.value ? post.state === selectedState.value : true
  );
});



const paginatedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredPosts = posts.value.filter(post =>
    selectedState.value ? post.state === selectedState.value : true
  );

  return filteredPosts.slice(startIndex, endIndex);
});

const totalPages = computed(() => Math.ceil(posts.value.length / itemsPerPage));

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const addToCart = (product) => {
  
    store.commit('addToCart', product);
}


</script>


<template>

<h2 class="text-2xl font-bold text-center text-black underline decoration-sky-500">Les produits</h2>

<Filter :filteredProperties="filteredProperties" @update-filter="updateFilter" />


      <section class="mt-12">
            <div class="px-4 mx-auto max-w-7xl">
              <div class="flex flex-wrap -mx-4">
                <ProductCard v-for="(post, index) in paginatedPosts" :key="post.id" :product="post" :addToCart="addToCart" />
              </div>
            </div>
      </section>


 
  <div class="flex flex-wrap justify-center">

    <div class="content">
      <ul class="flex items-center space-x-1 font-light">
      <li
        v-if="currentPage > 1"
        @click="changePage(currentPage - 1)"
        class="cursor-pointer border border-gray-300 rounded-full text-gray-500 hover:bg-gray-200 hover:border-gray-200 bg-white"
      >
        <a class="w-8 h-8 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </a>
      </li>
      <li
        v-for="page in totalPages"
        :key="page"
        @click="changePage(page)"
        :class="{ 'border rounded-full bg-indigo-100 border-indigo-500 text-black': currentPage === page, 'border border-gray-300 rounded-full text-gray-500 hover:bg-gray-200 hover:border-gray-200 bg-white': currentPage !== page }"
        class="cursor-pointer"
      >
        <a class="w-8 h-8 flex items-center justify-center">{{ page }}</a>
      </li>
      <li
        v-if="currentPage < totalPages"
        @click="changePage(currentPage + 1)"
        class="cursor-pointer border border-gray-300 rounded-full text-gray-500 hover:bg-gray-200 hover:border-gray-200 bg-white"
      >
        <a class="w-8 h-8 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </li>
    </ul>


  </div>
   
  </div>
</template>



<style scoped>
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  margin: 0 0.5rem;
}
.filtre{
margin-left: auto;
margin-right: auto;
}

@media screen and (max-width: 480px) {

  .content {
  display: flex;
margin-left: auto;
margin-right: auto;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  margin: 0 0.5rem;
}

.filtre{
  margin-block-end: auto;
  margin-left: 10px;
}

.mobile {
  width: 300px;
  margin-left: auto;
  margin-right: auto;

}
}

</style>