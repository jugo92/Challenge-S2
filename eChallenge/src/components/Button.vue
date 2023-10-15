<script setup lang="ts">
defineProps<{
  name: string,
  contant: string,
  color: string,
  action: string
}>()

const buttons = {
  // exemple de bouton
  // "buttonName" : {
  //   "content" : "Contenu du bouton",
  //   "color" : "Couleur du bouton (classe tailwindcss)",
  //   "action" : "Lien du bouton"
  // },
  "login" : {
    "content" : "SE CONNECTER",
    "color" : "button-details",
    "action" : "/login"
  },
  "register" : {
    "content" : "VALIDER MON INSCRIPTION",
    "color" : "button-details",
    "action" : "/register"
  },
  "getSocialButton" : {
    "content" : "Get Social",
    "color" : "button-invalid",
    "action" : "http://localhost:5173/"
  },
  "getHelpButton" : {
    "content" : "Get Help",
    "color" : "button-details",
    "action" : "http://localhost:5173/"
  },
}

</script>

<template>
  <router-link :to="name ? buttons[name].action : contant" class="mt-20">
    <button :class="name ? buttons[name].color : color" class="text-white">
      {{ name ? buttons[name].content : contant }}
    </button>
  </router-link>
</template>
<!--  Example of button:-->
<!--  <Button name="buttonName" />-->
<!--  <Button content="Contenu du bouton" color="Couleur du bouton (tailwindcss)" action="/route" />-->

<style scoped>

</style>