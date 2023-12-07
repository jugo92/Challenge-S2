<script setup lang="ts">

import FormBuilder from "../components/Form/FormBuilder.vue";
import {ref} from "vue";

const loginForm = ref([
    {
        label: 'Adresse mail',
        type: 'email',
        placeholder: 'exemple@mail.fr',
        value: '',
        required: true,
        autofocus: true,
    },
    {
        label: 'Mot de passe',
        type: 'password',
        placeholder: '*******',
        value: "",
        required: true,
    },
    {
        type: "button",
        name: "submit",
        label: "Envoyer",
        buttonClass: 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4',
        required: true,
    },
]);
</script>

<template>
    <div class="min-w-fit md:mx-20 lg:mx-52 my-16 mx-5 min-h-full flex justify-center">
        <FormBuilder :formFields="loginForm" format="row"/>
    </div>
</template>

<style scoped>

</style>