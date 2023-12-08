<template>
    <div>
      <h1>Vérification du compte</h1>
      <div v-if="loading">Vérification en cours...</div>
      <div v-if="error">Une erreur est survenue</div>
      <div v-if="success">Votre compte est vérifié avec succès!</div>
    </div>
  </template>
  
  <script lang="ts">
  import { ref, onMounted } from 'vue';
  
  export default {
    setup() {
      const loading = ref(true);
      const error = ref(false);
      const success = ref(false);
  
      onMounted(async () => {
        // Récupérer le token à partir des query params
        const urlSearchParams = new URLSearchParams(window.location.search);
        const token = urlSearchParams.get('token');
  
        if (!token) {
          error.value = true;
          loading.value = false;
          return;
        }
  
        try {
          // Faire une requête en base de données pour vérifier le token
          const response = await fetch(`${import.meta.env.VITE_API_URL}/verify/${token}`)
  
          if (!response.ok) {
        error.value = true;
        loading.value = false;
        return;
        }

        const data = await response.json();
        if (data.length > 0) {
        success.value = true;
        } else {
            error.value = true;
        }
        } catch (e) {
          // Gérer les erreurs de la requête
          console.error(e);
          error.value = true;
        } finally {
          loading.value = false;
        }
      });
  
      return { loading, error, success };
    },
  };
  </script>
  