<script setup>
import FormBuilder from '../components/FormBuilder.vue';
import {useStore} from 'vuex';
import {ref} from 'vue';

const store = useStore();



const submitButtonText = 'Réinitialiser le mot de passe';

const fields = [
  {
    type: 'password',
    name: 'password',
    label: 'Mot de passe',
    placeholder: 'Votre nouveau mot de passe',
  },
    {
        type: 'password',
        name: 'passwordConfirm',
        label: 'Confirmation du mot de passe',
        placeholder: 'Confirmez votre nouveau mot de passe',
    },
  
];

const onSubmit = async (data) => {
  try {
    await store.dispatch('resetPassword', data);
    router.push('/login');
  } catch (e) {
    console.error(e);
  }
};


</script>

<template>

    <h1 class="text-center text-3xl">En cours...</h1>
</template>