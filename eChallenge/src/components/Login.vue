<script setup lang="ts">
import { ref } from 'vue';
import {useRouter} from "vue-router";
import Button from "./Button.vue";

const router = useRouter();
const username = ref('');
const password = ref('');

const submitForm = async () => {
  // Perform login form submission logic here
  console.log(`Username: ${username.value}`);
  console.log(`Password: ${password.value}`);
  try {
    const response = await fetch(process.env.API_SERVER_URL + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: username.value,
        password: password.value
      })
    }).then((res) => res.json())
    .then((data) => {
      if (!data.hasOwnProperty('error')) {
        console.log(data);
        router.push('/dashboard', );
      } else {
        alert('Identifiant ou mot de passe incorrect');
      }
    })
  } catch (error) {
    console.error(error);
  }
};


</script>

<template>
  <div class="flex items-center justify-center">
    <form class="card" @submit.prevent="submitForm">
      <h2 class="mb-4 text-xl ">J'ai déjà un espace client</h2>
      <div class="mb-4">
        <input class="input" type="text" id="username" v-model="username" placeholder="Identifiant" required autofocus>
      </div>
      <div class="mb-4">
        <input class="input" type="password" id="password" v-model="password" placeholder="Mot de passe" required>
      </div>
      <small class="flex">Mot de passe oublié ?</small>
      <Button name="login" contant="" color="" action=""/>
      <small class="flex">Vous n'avez pas de compte ?&nbsp;<router-link to="/register" class="underline">Inscription</router-link></small>
    </form>
  </div>
</template>

<style scoped>

</style>