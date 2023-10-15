<script setup lang="ts">
import {computed, reactive, ref} from 'vue';
import {useRouter} from "vue-router";
import { z } from "zod";
import Button from "./Button.vue";
import {useToast} from "vue-toast-notification";
const router = useRouter();
const toast = useToast();

// const api = import.meta.env.VITE_APP_API_URL;
const api = 'http://localhost:3000/api';
const user = reactive({
    gender: 'H',
    firstname: '',
    lastname: '',
    usermail: '',
    confirm_usermail: '',
    password: '',
    confirm_password: '',
    birthdate: '',
    phone: '',
    address: '',
    country: 'France',
    zip: '',
    city: ''
});

const emailSchema = z.string().email({
    message: "Email invalide"
});

const passwordSchema = z.string().regex(/[a-z]/, {
    message: "Lettre minuscule manquante "
}).regex(/[A-Z]/, {
    message: "Lettre majuscule manquante"
}).regex(/\d/, {
    message: "Nombre manquant"
}).regex(/[^a-zA-Z0-9]/, {
    message: "Symbole manquant"
}).min(8, {
    message: "Mot de passe trop court (8 caractères minimum)"
});

const emailError = computed(() => {
    const parsedEmail = emailSchema.safeParse(user.usermail);
    if (parsedEmail.success) {
        return "";
    }
    return parsedEmail.error.issues[0].message;
});

const emailConfirmationError = computed(() => {
    if (user.usermail !== user.confirm_usermail) {
        return "Les emails ne correspondent pas";
    }
    return "";
});

const passwordError = computed(() => {
    const parsedPassword = passwordSchema.safeParse(user.password);
    if (parsedPassword.success) {
        return "";
    }
    return parsedPassword.error.issues[0].message;
});

const passwordConfirmationError = computed(() => {
    if (user.password !== user.confirm_password) {
        return "Les mots de passe ne correspondent pas";
    }
    return "";
});

const submitForm = async () => {
    // Perform login form submission logic here
    try {
        const response = await fetch(api + '/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: user.usermail,
                password: user.password,
                adress: user.address,
                name: user.firstname,
                lastname: user.lastname,
                gender: user.gender,
                city: user.city,
                zip: user.zip,
                phone: user.phone,
                dateofbirth: user.birthdate,
            })
        }).then((res) => res.json())
            .then((data) => {
                if (!data.hasOwnProperty('error')) {
                    router.push('/login', );
                    toast.success('Un email de confirmation vous a été envoyé');
                } else {
                    toast.error('Une erreur est survenue');
                    console.log(data);
                }
            })
    } catch (error) {
        console.error(error);
    }
};


</script>

<template>
    <div class="p-4 space-y-2 dark:bg-gray-800 dark:text-gray-100">
        <h3 class="text-base font-semibold">Étape 1: Saisissez votre email</h3>
        <h3 class="text-base font-semibold">Étape 2: Compléter votre profil</h3>
        <h3 class="text-base font-semibold">Étape 3: Confirmer votre email</h3>
        <div class="flex justify-center max-w-xs space-x-3">
            <span class="w-12 h-2 rounded-sm bg-green-500"></span>
            <span class="w-12 h-2 rounded-sm bg-green-500"></span>
            <span class="w-12 h-2 rounded-sm bg-gray-300"></span>
        </div>
    </div>
    <div class="flex items-center justify-center">
        <!--    <form>-->
        <form class="card" @submit.prevent="submitForm">
            <h2 class="mb-4 text-xl ">Créer mon espace client</h2>
            <!--          <small class="flex text-start mb-4">Commencez par saisir l'adresse email qui vous servira d'identifiant</small>-->
            <!--          <div class="mb-4">-->
            <!--            <input class="input" type="text" id="username" v-model="user.usermail" placeholder="Identifiant" required>-->
            <!--          </div>-->
            <!--      <div class="mb-4">-->
            <!--        <input class="input" type="password" id="password" v-model="password" placeholder="Mot de passe" required>-->
            <!--      </div>-->
            <!--          <button class="w-full p-2 mt-4 mb-4 text-white bg-blue-500 rounded-md hover:bg-blue-600" type="submit">VALIDER MON ADRESSE EMAIL</button>-->

            <div class="grid gap-6 mb-6 md:grid-cols-2">
                <div class="flex flex-col mb-3">
                    <small class="flex text-start mb-1">Civilité <span class="text-red-600">&nbsp;*</span></small>
                    <span class="flex justify-around">
          <span>
            <input type="radio" value="H" v-model="user.gender">&nbsp;
            <label for="H">Homme</label>
          </span>
          <span>
            <input type="radio" value="F" v-model="user.gender">&nbsp;
            <label for="F">Femme</label>
          </span>
        </span>
                </div>
                <div class="flex flex-col mb-3">
                    <small class="flex text-start mb-1">Date de naissance</small>
                    <input class="input" id="birthdate" type="date" v-model="user.birthdate">
                </div>
                <div class="flex flex-col mb-3">
                    <small class="flex text-start mb-1">Nom <span class="text-red-600">&nbsp;*</span></small>
                    <input class="input" id="lastname" type="lastname" v-model="user.lastname" required autofocus>
                </div>
                <div class="flex flex-col mb-3">
                    <small class="flex text-start mb-1">Prénom <span class="text-red-600">&nbsp;*</span></small>
                    <input class="input" id="firstname" type="firstname" v-model="user.firstname" required>
                </div>
                <div class="flex flex-col mb-3">
                    <small class="flex text-start mb-1">Email <span class="text-red-600">&nbsp;*</span></small>
                    <input class="input" id="email" type="email" v-model="user.usermail" required>
                    <small class="error text-start" v-if="emailError"> {{ emailError }} </small>
                </div>
                <div class="flex flex-col mb-3">
                    <small class="flex text-start mb-1">Confirmer l'email <span class="text-red-600">&nbsp;*</span></small>
                    <input class="input" id="email-confirmation" type="email" v-model="user.confirm_usermail" required >
                    <small class="error text-start" v-if="emailConfirmationError"> {{ emailConfirmationError }} </small>
                </div>
                <div class="flex flex-col mb-3">
                    <small class="flex text-start mb-1">Mot de passe <span class="text-red-600">&nbsp;*</span></small>
                    <input class="input" id="password" type="password" v-model="user.password" required>
                    <small class="text-start" :class="{['text-red-500'] : passwordError, ['text-green-500'] : !passwordError}" v-if="passwordError"> {{ passwordError ? "invalide " + passwordError : "vallide" }} </small>
                </div>
                <div class="flex flex-col mb-3">
                    <small class="flex text-start mb-1">Confirmer le mot de passe <span class="text-red-600">&nbsp;*</span></small>
                    <input class="input" id="password-confirmation" type="password" v-model="user.confirm_password" required>
                    <small class="error" v-if="passwordConfirmationError"> {{ passwordConfirmationError }} </small>
                </div>
                <div class="flex flex-col mb-3">
                    <small class="flex text-start mb-1">Téléphone <span class="text-red-600">&nbsp;*</span></small>
                    <input class="input" id="phone" type="tel" v-model="user.phone" required>
                </div>
                <div class="flex flex-col mb-3">
                    <small class="flex text-start mb-1">Adresse <span class="text-red-600">&nbsp;*</span></small>
                    <input class="input" id="address" type="text" v-model="user.address" required>
                </div>
                <div class="flex flex-col mb-3">
                    <small class="flex text-start mb-1">Code postal <span class="text-red-600">&nbsp;*</span></small>
                    <input class="input" id="zip" type="text" v-model="user.zip" required>
                </div>
                <div class="flex flex-col mb-3">
                    <small class="flex text-start mb-1">Ville <span class="text-red-600">&nbsp;*</span></small>
                    <input class="input" id="city" type="text" v-model="user.city" required>
                </div>
                <div class="flex flex-col mb-3">
                    <small class="flex text-start mb-1">Pays <span class="text-red-600">&nbsp;*</span></small>
                    <select class="input" id="country" v-model="user.country" disabled>
                        <option value="France">France</option>
                    </select>
                </div>
            </div>
            <small class="flex mb-4">Vous avez déjà un compte ?&nbsp;<router-link to="/login" class="underline">Connexion</router-link></small>
            <div class="flex items-start mb-6">
                <div class="flex items-center h-5">
                    <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required>
                </div>
                <label for="remember" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    J'accepte les <a href="#" class="text-blue-600 hover:underline dark:text-blue-500">conditions générales d'utilisation</a> et la <a href="#" class="text-blue-600 hover:underline dark:text-blue-500">politique de confidentialité</a>.</label>
            </div>
            <button class="button button-details text-white" type="submit">VALIDER MON INSCRIPTION</button>
        </form>

    </div>
</template>

<style scoped>
</style>