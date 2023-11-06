<script setup lang="ts">

import { onMounted } from 'vue';
import router from '../router'

onMounted(() => {
  setTimeout(() => {
    router.push('/login');
  }, 2000);
});

</script>

<template>
    <div class="flex items-center justify-center h-screen">
        <div class="text-center">
        <h1 class="text-4xl font-bold">Vous n'êtes pas autorisé à accéder à cette page</h1>
        <p>Vous allez être redirigé vers la page de connexion dans quelques secondes</p>
        </div>
    </div>
</template>