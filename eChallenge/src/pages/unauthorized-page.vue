<script setup lang="ts">

import { onMounted } from 'vue';
import router from '../router'

onMounted(() => {
  setTimeout(() => {
    router.push('/login');
  }, 3000);
});

</script>

<template>
    <div class="flex items-center justify-center h-screen">
        <div class="text-center">
        <h4 class="text-4xl font-bold">Pour des raisons de sécurité, 
            votre session a expiré. Veuillez vous reconnecter pour continuer à utiliser l'application.</h4>
        <p>Vous allez être redirigé vers la page de connexion dans quelques secondes</p>
        </div>
    </div>
</template>