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
            <label class="text-sm font-bold mb-1" for="username">Nom d'utilisateur <span class="text-red-600">*</span></label>
            <input class="w-full p-2 rounded bg-gray-100 text-black" type="text" id="username" v-model="username" placeholder="Identifiant" required autofocus>
          </div>
          <div class="mb-4">
            <label class="text-sm font-bold mb-1" for="password">Mot de passe <span class="text-red-600">*</span></label>
            <input class="w-full p-2 rounded bg-gray-100 text-black" type="password" id="password" v-model="password" placeholder="Mot de passe" required>
          </div>
          <button type="submit" class="w-full p-2 rounded bg-blue-600 text-white mb-4">Inscription</button>
        </form>
        <small class="mt-4">Pas encore de compte ? <router-link to="/register" class="text-blue-600 hover:underline">Inscription</router-link></small>
      </div>
    </div>

  </div>
  <Footer />
</template>






<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from './Button.vue';
import Footer from './Footer.vue';

const router = useRouter();
const username = ref('');
const password = ref('');

const submitForm = async () => {
  try {
    console.log(`Username: ${username.value}`);
    console.log(`Password: ${password.value}`);

    const response = await fetch(`${process.env.API_SERVER_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: username.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    if (!data.hasOwnProperty('error')) {
      console.log(data);
      router.push('/dashboard');
    } else {
      alert('Identifiant ou mot de passe incorrect');
    }
  } catch (error) {
    console.error(error);
  }
};
</script>


<style scoped>
/* Vous pouvez ajouter des styles spécifiques ici si nécessaire */
</style>
