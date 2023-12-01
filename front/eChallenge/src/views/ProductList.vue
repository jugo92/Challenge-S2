<script setup>
import { ref, onMounted, computed} from 'vue';
import { useStore } from 'vuex';
import { RouterLink } from "vue-router";
import Navbar from '../composable/store';

const posts = ref([]);
const itemsPerPage = 24;
const currentPage = ref(1);
const cart = ref([]);



onMounted(async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await response.json();
  posts.value = data;
});

const paginatedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return posts.value.slice(startIndex, endIndex);
});

const totalPages = computed(() => Math.ceil(posts.value.length / itemsPerPage));

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};


const store = useStore(); 
const addToCart = (product) => {
  if(store.state.isLoggedIn){
    store.commit('addToCart', product);
}else{
  router.push('/login');
}

};

</script>

<template>

<h2 class="text-2xl font-bold text-center text-black underline decoration-sky-500">Les produits</h2>
  <div>
    <div class="flex mt-8 filtre">
  <div class="relative flex items-center">
    <Icon icon="lets-icons:filter" class="text-2xl icon "/>
    <select v-model="triSelected" class="p-2 border rounded-md">
      <option v-for="option in optionTri" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
  </div>
</div>

    <section class="mt-12">
      <div class="px-4 mx-auto max-w-7xl">
        <div class="flex flex-wrap -mx-4">
          <div v-for="(post, index)  in paginatedPosts" :key="post.id" class="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/4 px-4 mb-4 mobile">
            <div class="relative overflow-hidden bg-white shadow rounded-xl ">
              <RouterLink :to="`/products/${post.id}`">
                <div class="relative overflow-hidden">
                  <div class="mb-5 overflow-hidden">
                    <img class="object-cover w-full mx-auto transition-all rounded h-72 hover:scale-110" src="https://zupimages.net/up/23/46/fife.jpg" alt="">
                  </div>
                </div>
              </RouterLink>
              <p class="px-5 mb-4 font-bold dark:text-black">{{ post.title }}</p>
              <div class="flex">
                <div class="w-1/2 px-5 pb-3">
                  <p class="text-lg font-bold text-blue-500 dark:text-blue-300">
                    299.99€
                  </p>
                  <span class="block -mt-1 text-xs font-semibold text-gray-400 line-through">399.99€</span>
                </div>

                <button  @click="addToCart(post)"  class="flex-1 text-sm text-white transition-all bg-blue-500 rounded-r-none hover:bg-blue-600 rounded-t-xl text-center text-l">
                 Ajouter au panier
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
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
h2{
  margin-top: 2%;
}
.filtre{
margin-left: auto;
margin-right: auto;
}

@media screen and (max-width: 480px) {

  .content {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  margin: 0 0.5rem;
  margin-inline-start:auto;
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





