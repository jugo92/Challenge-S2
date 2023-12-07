<script setup lang="ts">
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { basket } from './services/basketService';

const store = useStore();
const router = useRouter();
const storedBasket = JSON.parse(localStorage.getItem('basket'));
console.log(storedBasket)
// Initialisez le panier avec la valeur du localStorage ou un objet par défaut
basket.value = storedBasket || { basketId: null, products: [] };

console.log(basket.value)
</script>

<template>
    <div id="app">
        <Navbar />
 <!--   <TopBar />-->
        <div class="min-w-fit my-20 md:mx-20 lg:mx-52 m-5">
            <router-view></router-view>
        </div>
    </div>
</template>

