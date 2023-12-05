
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRouter } from "vue-router";
import { z } from "zod";
import Button from "./Button.vue";
import { useToast } from "vue-toast-notification";


const router = useRouter();
const toast = useToast();

const api = 'http://localhost:3000/api';

const user = reactive({
  gender: 'Homme',
  firstname: '',
  lastname: '',
  email: '',
  confirm_email: '',
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
  const parsedEmail = emailSchema.safeParse(user.email);
  if (parsedEmail.success) {
    return "";
  }
  return parsedEmail.error.issues[0].message;
});

const emailConfirmationError = computed(() => {
  if (user.email !== user.confirm_email) {
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

const acceptTerms = ref(false);

const submitForm = async () => {
  try {
    const response = await fetch(api + '/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user.email,
        password: user.password,
        adress: user.address,
        name: user.firstname,
        lastname: user.lastname,
        gender: user.gender,
        city: user.city,
        zip: user.zip,
        phone: user.phone,
        birthdate: user.birthdate,
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




<template>
  <div class="bg-white">
    <div class="container mx-auto py-8">
      <div class="flex items-center justify-center">
        <!-- <img src="https://zupimages.net/up/23/43/1nb2.png" alt="Logo" class="w-12 h-12"> -->
      </div>

      <form class="rounded-lg p-4 sm:p-8 md:p-12 lg:p-16" @submit.prevent="submitForm" type="submit">
        <h2 class="text-center text-2xl mb-4">Inscription</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div class="mb-4">
            <label class="text-sm font-bold mb-1" for="firstname">Prénom <span class="text-red-600">*</span></label>
            <input class="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="firstname" type="text"  placeholder="votre prénom" v-model="user.firstname" required autofocus>
          </div>
          <div class="mb-4">
            <label class="text-sm font-bold mb-1" for="lastname">Nom <span class="text-red-600">*</span></label>
            <input class="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="lastname" type="text" placeholder="votre nom" v-model="user.lastname" required>
          </div>
          <div class="mb-3">
            <label class="text-sm font-bold mb-1" for="email">Email <span class="text-red-600">*</span></label>
            <input class="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="email" placeholder="exemple@echallenge.com" type="email" v-model="user.email" required>
            <p class="text-red-600 text-xs italic" v-if="emailError">{{ emailError }}</p>
          </div>
          <div class="mb-3">
            <label class="text-sm font-bold mb-1" for="email-confirmation">Confirmer l'email <span class="text-red-600">*</span></label>
            <input class="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="email-confirmation" placeholder="exemple@echallenge.com" type="email" v-model="user.confirm_email" required>
            <p class="text-red-600 text-xs italic" v-if="emailConfirmationError">{{ emailConfirmationError }}</p>
          </div>
          <div class="mb-3">
            <label class="text-sm font-bold mb-1" for="password">Mot de passe <span class="text-red-600">*</span></label>
            <input class="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="votre mot de passe" v-model="user.password" required>
            <p class="text-sm text-start" :class="passwordError ? 'text-red-500' : 'text-green-500'" v-if="passwordError">{{ passwordError ? 'Invalide ' + passwordError : 'Valide' }}</p>
          </div>
          <div class="mb-3">
            <label class="text-sm font-bold mb-1" for="password-confirmation">Confirmer le mot de passe <span class="text-red-600">*</span></label>
            <input class="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="password-confirmation" type="password" placeholder="confirmer votre mot de passe" v-model="user.confirm_password" required>
            <p class="text-red-600 text-xs italic" v-if="passwordConfirmationError">{{ passwordConfirmationError }}</p>
          </div>
          <div class="mb-3 relative">
            <label class="text-sm font-bold mb-1" for="gender">Civilité <span class="text-red-600">*</span></label>
            <div class="relative">
              <select class="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="gender" v-model="user.gender" required>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label class="text-sm font-bold mb-1" for="birthdate">Date de naissance</label>
            <input class="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="birthdate" type="date" v-model="user.birthdate">
          </div>
          <div class="mb-3">
            <label class="text-sm font-bold mb-1" for="phone">Téléphone <span class="text-red-600">*</span></label>
            <input class="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="phone" placeholder="Votre numéro de téléphone" type="tel" v-model="user.phone" required>
          </div>
          <div class="mb-3">
            <label class="text-sm font-bold mb-1" for="address">Adresse <span class="text-red-600">*</span></label>
            <input class="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="address" placeholder="ex. 00 avenue de l'exemple" type="text" v-model="user.address" required>
          </div>
          <div class="mb-3">
            <label class="text-sm font-bold mb-1" for="zip">Code postal <span class="text-red-600">*</span></label>
            <input class="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="zip" placeholder="ex. 75000" type="text" v-model="user.zip" required>
          </div>
          <div class="mb-3">
            <label class="text-sm font-bold mb-1" for="city">Ville <span class="text-red-600">*</span></label>
            <input class="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="city" placeholder="ex. Paris" type="text" v-model="user.city" required>
          </div>
          <div class="mb-3">
            <label class="text-sm font-bold mb-1" for="country">Pays <span class="text-red-600">*</span></label>
            <select class="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="country" v-model="user.country" disabled>
              <option value="France">France</option>
            </select>
          </div>
        </div>
        <div class="mb-4 flex items-center">
          <input id="link-checkbox" name="accept-terms" type="checkbox" value="" class="w-4 h-4 border border-gray-300 focus:ring-3 focus:ring-blue-300" v-model="acceptTerms">

          <label for="link-checkbox" class="ml-2 text-sm font-medium text-gray-900">
            J'accepte les <a href="#" class="text-blue-600 hover:underline">conditions générales d'utilisation</a> et la <a href="#" class="text-blue-600 hover:underline">politique de confidentialité</a>.
          </label>
        </div>
        <div class="text-center">
          <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" :disabled="!acceptTerms">VALIDER MON INSCRIPTION</button>
        </div>
        <div class="text-center mt-4">
          <p class="text-sm">Déjà un compte ?
              <router-link to="/login" class="text-blue-600 hover:underline">Se connecter</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>



