<script setup>
import { useStore } from 'vuex';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import FormBuilder from '../components/Form/FormBuilder.vue';
import { z } from 'zod';

const router = useRouter();
const store = useStore();
const submitButtonText = 'Réinitialiser le mot de passe';
const errorOccurred = ref(false); // Variable pour suivre si une erreur est survenue
// Fonction pour récupérer le token depuis les query params de l'URL
const getTokenFromQueryParams = () => {
  const token = router.currentRoute.value.query.token;
  return token || null;
};

const checkToken = async (token) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/checkToken/${token}`);
    if (response.ok) {
        return true;
    } else {
      errorOccurred.value = true;
      return false
    }
  } catch (error) {
    // Erreur lors de la vérification du token, afficher une erreur
    errorOccurred.value = true;
    console.error('Erreur lors de la vérification du token:', error);
  }
};

const onSubmit = async () => {
  try {
    const token = getTokenFromQueryParams();
    const password = resetPasswordForm.value.find(field => field.type === 'password').value;
    console.log(password)
        const response = await fetch(`${import.meta.env.VITE_API_URL}/updatePassword/${token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: password
          }),
        });  
    // router.push('/login');
  } catch (e) {
    console.error(e);
  }
};

const resetPasswordForm = ref([
  {
    label: 'Mot de passe',
    type: 'password',
    name: 'password',
    value: '',
    validationError: '',
    validationSchema: z.string()
      .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
      .max(255, { message: 'Le mot de passe doit contenir au maximum 255 caractères' }),
  },
  {
    label: 'Confirmation du mot de passe',
    type: 'password',
    name: 'password_confirmation',
    value: '',
    validationError: '',
    validationSchema: z.string()
      .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
      .max(255, { message: 'Le mot de passe doit contenir au maximum 255 caractères' }),
  },
  {
    type: 'button',
    label: 'Enregistrer',
    buttonType: 'button',
    buttonClass: 'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
    buttonClick: onSubmit,
  },
]);

// Hook onMounted pour vérifier le token lorsque le composant est monté
onMounted(() => {
  const token = getTokenFromQueryParams();
  if (token) {
    checkToken(token);
  } else {
    errorOccurred.value = true;
  }
});

</script>

<template>
    <div class="form">
      <div v-if="!errorOccurred" class="flex flex-col justify-center items-center card w-2/6">
        <FormBuilder :formFields="resetPasswordForm" />
      </div>
      <div v-else>
        <p>Une erreur est survenue. Veuillez réessayer plus tard.</p>
      </div>
    </div>
  </template>
