<script setup lang="ts">
// import { Icon } from '@iconify/vue';
import { onMounted, ref } from 'vue';

const isOpen = ref(false);
const menuItems = ref([]);

onMounted(async () => {
  try {
    const response = await fetch(process.env.API_SERVER_URL + '/menus');
    const data = await response.json();
    menuItems.value = data;
  } catch (error) {
    console.error(error);
  }
});

document.addEventListener('click', (e) => {
  const navbar = document.querySelector('nav');
  if (navbar && navbar.contains(e.target as Node)) {
    // Clic à l'intérieur de la navbar, ne rien faire
  } else {
    // Clic en dehors de la navbar, fermer la navbar
    navbar?.classList.remove('active');
  }
});

</script>


<template>
  <nav class="bg-blue-500 text-white">
    <div class="container mx-auto flex justify-between items-center py-4">
      <div class="flex items-center">
        <a href="#" class="text-2xl font-bold">Mon Logo</a>
      </div>
      <div class="hidden md:flex space-x-4">
        <a href="#" class="hover:text-blue-300">Accueil</a>
        <a href="#" class="hover:text-blue-300">Services</a>
        <a href="#" class="hover:text-blue-300">Produits</a>
        <a href="#" class="hover:text-blue-300">À propos</a>
        <a href="#" class="hover:text-blue-300">Contact</a>
      </div>
      <div class="md:hidden">
        <button @click="isOpen = !isOpen">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
    </div>
    <div class="md:hidden" :class="{ 'block': isOpen, 'hidden': !isOpen }">
      <a href="#" class="block p-4 hover:bg-blue-400">Accueil</a>
      <a href="#" class="block p-4 hover:bg-blue-400">Services</a>
      <a href="#" class="block p-4 hover:bg-blue-400">Produits</a>
      <a href="#" class="block p-4 hover:bg-blue-400">À propos</a>
      <a href="#" class="block p-4 hover:bg-blue-400">Contact</a>
    </div>
  </nav>
</template>


<style scoped>
.active {
  display: block; /* Ou tout autre style que vous préférez pour afficher la navbar */
}

</style>
