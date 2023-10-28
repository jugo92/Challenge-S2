<template>
  <h1 className="text-center text-2xl mt-4">eChallenge</h1>
  <div class="h-screen flex items-center justify-center bg-white">
    <div class="grid place-items-center">
      <div class="max-h-[80vh] ">
        <form class="shadow-md rounded-lg p-8 mb-4" @submit.prevent="submitForm">
          <h1 class="text-center text-2xl -mt-4">Inscription</h1>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="mb-3">
              <label class="text-sm font-bold mb-1" for="firstname">Prénom <span class="text-red-600">*</span></label>
              <input class="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="firstname" type="text" v-model="user.firstname" required autofocus>
            </div>
            <div class="mb-3">
              <label class="text-sm font-bold mb-1" for="lastname">Nom <span class="text-red-600">*</span></label>
              <input class="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="lastname" type="text" v-model="user.lastname" required>
            </div>
            <div class="mb-3">
              <label class="text-sm font-bold mb-1" for="email">Email <span class="text-red-600">*</span></label>
              <input class="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" v-model="user.usermail" required>
              <p class="text-red-600 text-xs italic" v-if="emailError">{{ emailError }}</p>
            </div>
            <div class="mb-3">
              <label class="text-sm font-bold mb-1" for="email-confirmation">Confirmer l'email <span class="text-red-600">*</span></label>
              <input class="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="email-confirmation" type="email" v-model="user.confirm_usermail" required>
              <p class="text-red-600 text-xs italic" v-if="emailConfirmationError">{{ emailConfirmationError }}</p>
            </div>
            <div class="mb-3">
              <label class="text-sm font-bold mb-1" for="password">Mot de passe <span class="text-red-600">*</span></label>
              <input class="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" v-model="user.password" required>
              <p class="text-sm text-start" :class="passwordError ? 'text-red-500' : 'text-green-500'" v-if="passwordError">{{ passwordError ? 'Invalide ' + passwordError : 'Valide' }}</p>
            </div>
            <div class="mb-3">
              <label class="text-sm font-bold mb-1" for="password-confirmation">Confirmer le mot de passe <span class="text-red-600">*</span></label>
              <input class="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="password-confirmation" type="password" v-model="user.confirm_password" required>
              <p class="text-red-600 text-xs italic" v-if="passwordConfirmationError">{{ passwordConfirmationError }}</p>
            </div>
            <div class="mb-3">
              <label class="text-sm font-bold mb-1" for="gender">Civilité <span class="text-red-600">*</span></label>
              <div class="flex space-x-4">
                <div>
                  <input type="radio" id="male" value="H" v-model="user.gender" class="mr-1">
                  <label for="male">Homme</label>
                </div>
                <div>
                  <input type="radio" id="female" value="F" v-model="user.gender" class="mr-1">
                  <label for="female">Femme</label>
                </div>
              </div>
            </div>
            <div class="mb-3">
              <label class="text-sm font-bold mb-1" for="birthdate">Date de naissance</label>
              <input class="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="birthdate" type="date" v-model="user.birthdate">
            </div>
            <div class="mb-3">
              <label class="text-sm font-bold mb-1" for="phone">Téléphone <span class="text-red-600">*</span></label>
              <input class="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="phone" type="tel" v-model="user.phone" required>
            </div>
            <div class="mb-3 col-span-2">
              <label class="text-sm font-bold mb-1" for="address">Adresse <span class="text-red-600">*</span></label>
              <input class="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="address" type="text" v-model="user.address" required>
            </div>
            <div class="mb-3">
              <label class="text-sm font-bold mb-1" for="zip">Code postal <span class="text-red-600">*</span></label>
              <input class="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="zip" type="text" v-model="user.zip" required>
            </div>
            <div class="mb-3">
              <label class="text-sm font-bold mb-1" for="city">Ville <span class="text-red-600">*</span></label>
              <input class="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="city" type="text" v-model="user.city" required>
            </div>
            <div class="mb-3 col-span-2">
              <label class="text-sm font-bold mb-1" for="country">Pays <span class="text-red-600">*</span></label>
              <select class="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="country" v-model="user.country" disabled>
                <option value="France">France</option>
              </select>
            </div>
          </div>
          <div class="mb-6 flex items-center">
          <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded focus:ring-3 focus:ring-blue-300 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800">
          <label for="remember" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            J'accepte les <a href="#" class="text-blue-600 hover:underline dark:text-blue-500">conditions générales d'utilisation</a> et la <a href="#" class="text-blue-600 hover:underline dark:text-blue-500">politique de confidentialité</a>.
          </label>
        </div>

        <!-- Bouton de soumission -->
        <div class="text-center">
          <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">VALIDER MON INSCRIPTION</button>
        </div>
        </form>
      </div>
    </div>
  </div>
</template>



<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useRouter } from "vue-router";
import { z } from "zod";
import Button from "./Button.vue";
import { useToast } from "vue-toast-notification";

const router = useRouter();
const toast = useToast();

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
  country:'France',
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
    });

    if (response.ok) {
      const data = await response.json();
      if (!data.hasOwnProperty('error')) {
        router.push('/login');
        toast.success('Un email de confirmation vous a été envoyé');
      } else {
        toast.error('Une erreur est survenue');
        console.error('Erreur côté serveur :', data.error);
      }
    } else {
      toast.error('Une erreur est survenue lors de la requête');
      console.error('Erreur HTTP :', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Erreur lors de la requête POST :', error);
  }
};
</script>
