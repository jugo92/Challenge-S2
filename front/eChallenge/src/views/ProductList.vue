
  <script setup>
  import { RouterLink } from "vue-router";
  import { ref, onMounted } from 'vue';
  import { Icon } from '@iconify/vue';
  
  const posts = ref([]);
  
  onMounted(async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const data = await response.json();
      posts.value = data;
  });
  

  </script>
<template>
  <div>
    <section v-for="(post, index) in posts" :key="post.id" class="mt-12">
      <div class="px-4 mx-auto max-w-7xl">
        <div class="flex flex-wrap -mx-4">
          <div v-for="(post, index) in posts" :key="post.id" class="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/4 px-4 mb-4">
            <div class="relative overflow-hidden bg-white shadow rounded-xl dark:bg-gray-700">
              <RouterLink :to="`/products/${post.id}`">
                <div class="relative overflow-hidden">
                  <div class="mb-5 overflow-hidden">
                    <img class="object-cover w-full mx-auto transition-all rounded h-72 hover:scale-110" src="https://zupimages.net/up/23/46/fife.jpg" alt="">
                  </div>
                </div>
              </RouterLink>
              <p class="px-5 mb-4 font-bold dark:text-white">{{ post.title }}</p>
              <div class="flex">
                <div class="w-1/2 px-5 pb-3">
                  <p class="text-lg font-bold text-blue-500 dark:text-blue-300">
                    299.99€
                  </p>
                  <span class="block -mt-1 text-xs font-semibold text-gray-400 line-through">399.99€</span>
                </div>
                <button class="flex-1 text-sm text-white transition-all bg-blue-500 rounded-r-none hover:bg-blue-600 rounded-t-xl text-center text-l">
                  Ajouter au panier
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>



<style scoped>

</style>





