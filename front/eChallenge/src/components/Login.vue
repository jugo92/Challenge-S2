
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from './Button.vue';
import Footer from './Footer.vue';
import {useStore} from 'vuex';
import LoaderPc from "./loader/LoaderPc.vue";

const router = useRouter();
const email = ref('');
const password = ref('');
const store = useStore();
const loading = ref(false);



const submitForm = async () => {
  try {
    loading.value = true;
    await store.dispatch('login', { email: email.value, password: password.value });
    await new Promise(resolve => setTimeout(resolve, 2000));
    loading.value = false;
    console.log('Connexion réussie');
    router.push('/');
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    loading.value = false;
  }
};

</script>




<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 bg-white rounded overflow-hidden shadow-lg flex flex-col sm:flex-row">
      <div class="w-full sm:w-1/2 relative">
        <img src="https://zupimages.net/up/23/43/6rxn.png" alt="Image" class="w-full h-48rem sm:h-auto object-cover">
        <div class="absolute inset-0 bg-opacity-80 bg-gray-800"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <h2 class="text-2xl font-semibold text-white">Connexion</h2>
        </div>
      </div>
      <div class="w-full sm:w-1/2 p-8  sm:mt-0">
        <form @submit.prevent="submitForm" type="submit" class="mb-4 mt-12">
          <div class="mb-4">
            <label class="text-sm font-bold mb-1" for="username">Adresse mail <span class="text-red-600">*</span></label>
            <input class="w-full p-2 rounded bg-gray-100 text-black" type="text" id="email" v-model="email" placeholder="Adresse email" required autofocus>
          </div>
          <div v-if="loading" class="loader">
                   <LoaderPc />
              </div>
          <div class="mb-4">
            <label class="text-sm font-bold mb-1" for="password">Mot de passe <span class="text-red-600">*</span></label>
            <input class="w-full p-2 rounded bg-gray-100 text-black" type="password" id="password" v-model="password" placeholder="Mot de passe" required>
          </div>
          <button type="submit" class="w-full p-2 rounded bg-blue-600 text-white mb-4">Connexion</button>
        </form>
        <small class="mt-4">Pas encore de compte ? <router-link to="/register" class="text-blue-600 hover:underline">Inscription</router-link></small>
      </div>
    </div>

  </div>
  <Footer />
</template>








<style scoped>
/* Vous pouvez ajouter des styles spécifiques ici si nécessaire */
</style>
