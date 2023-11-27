<script setup lang="ts">
defineProps<{
    name: string,
    content: string,
    color: string,
    action: string
    redirect: boolean
}>()

const colors = {
    "blue" : "bg-blue-600 hover:bg-blue-800 focus:ring-4",
    "red" : "bg-red-600 hover:bg-red-800 focus:ring-4",
    "green" : "bg-green-600 hover:bg-green-800 focus:ring-4",
    "yellow" : "bg-yellow-600 hover:bg-yellow-800 focus:ring-4",
    "orange" : "bg-orange-600 hover:bg-orange-800 focus:ring-4",
    "purple" : "bg-purple-600 hover:bg-purple-800 focus:ring-4",
}

const buttons = {
    // exemple de bouton
    // "buttonName" : {
    //   "content" : "Contenu du bouton",
    //   "color" : "Couleur du bouton (classe tailwindcss)",
    //   "action" : "Lien du bouton"
    // },
    "login" : {
        "content" : "SE CONNECTER",
        "color" : colors.blue,
        "action" : "/login"
    },
    "register" : {
        "content" : "VALIDER MON INSCRIPTION",
        "color" : "button-details",
        "action" : "/register"
    },
    "createProduct" : {
        "content" : "Créer un produit",
        "color" : colors.blue,
        "action" : "/products"
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
    <router-link v-if="redirect" :to="name ? buttons[name].action : action">
        <button
            :class="name ? buttons[name].color : colors[color]" class="text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 w-full">
            {{ name ? buttons[name].content : content }}
        </button>
    </router-link>
    <button
        v-else
        :class="name ? buttons[name].color : colors[color]"
        class="text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 w-full" type="button"
        >
        {{ name ? buttons[name].content : content }}
    </button>
</template>
<!--  Example of button:-->
<!--<Button content="Nouveau Produit" color="green" @click="goToLogin"/>-->
<!--<Button name="login"/>-->
<!--<Button name="login" redirect/>-->
<!--<Button content="Se Connecter" color="yellow" redirect action="/login"/>action="/route" />&ndash;&gt;-->

<style scoped>

</style>