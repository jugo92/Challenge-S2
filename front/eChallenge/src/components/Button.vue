<script setup lang="ts">
import { defineProps } from 'vue';

interface Button {
  content: string;
  color: string;
  action: string;
}

const props = defineProps<{
  name: string;
  contant: string;
  color: string;
  action: string;
}>();


const buttons: Record<string, Button> = {
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
};

const name = props.name;
const contant = props.contant;
const color = props.color;

</script>

<template>
  <router-link :to="name ? buttons[name].action : contant" class="mt-20">
    <button :class="name ? buttons[name].color : color" class="text-white">
      {{ name ? buttons[name].content : contant }}
    </button>
  </router-link>
</template>

<style scoped>
</style>
