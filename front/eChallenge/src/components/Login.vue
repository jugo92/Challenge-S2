
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from './Button.vue';
import Footer from './Footer.vue';
import {useStore} from 'vuex';
import LoaderPc from "./loader/LoaderPc.vue";
import FormBuilder from "./Form/FormBuilder.vue";

const router = useRouter();
const email = ref('');
const password = ref('');
const store = useStore();
const loading = ref(false);

const submitForm = async () => {
    try {
        loading.value = true;
        const email = loginForm.value.find(field => field.type === 'email').value;
        const password = loginForm.value.find(field => field.type === 'password').value;
        await store.dispatch('login', { email: email, password: password });
        await new Promise(resolve => setTimeout(resolve, 2000));
        loading.value = false;
        console.log('Connexion réussie');
        router.push('/');
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        loading.value = false;
    }
};

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
        value: password.value,
        required: true,
    },
    {
        type: "button",
        name: "submit",
        label: "Envoyer",
        buttonClass: 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4',
        required: true,
        buttonClick: submitForm,
    },
]);
</script>

<template>
    <div class="min-w-fit md:mx-20 lg:mx-52 my-16 mx-5 min-h-full flex justify-center">
        <div class="flex flex-col justify-center items-center card">
            <span class="mt-8 text-2xl font-bold w-full text-center">Connectez-vous à votre compte</span>
            <FormBuilder :form-fields="loginForm" />
            <span class="w-full text-center mb-2">Pas encore de compte ? <router-link to="/register" class="underline text-blue-500 font-bold">S'inscrire </router-link> </span>
            <span>Mot de passe oublié ? <router-link to="/reset_password" class="underline text-blue-500 font-bold">Réinitialiser </router-link></span>
        </div>
    </div>
</template>

<style >
/* Vous pouvez ajouter des styles spécifiques ici si nécessaire */
</style>
