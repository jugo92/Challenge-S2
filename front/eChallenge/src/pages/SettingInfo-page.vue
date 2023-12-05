

  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { Icon } from '@iconify/vue';
  import {useStore} from 'vuex';
  import FormBuilder from '../components/FormBuilder.vue';

  const store = useStore();
  const messageSuccess = ref(false);
  const user = ref(store.state.user || {});

const fetchUserData = async ()=>{
  try{
    await store.dispatch('fetchUserData');
    user.data = { ...store.state.user };
  }catch(error){
    console.error(e);
  }
}

const fields = [

  {
    type: 'email',
    name: 'email',
    label: 'Email',
    placeholder: 'Votre adresse -mail',
    value: user.value.email,
  },
  
];

const submitButtonText = '';

const showResetPasswordPopup = () => {
    const resetPasswordPopup = document.getElementById('resetPasswordPopup');
    resetPasswordPopup.style.display = 'block';
};

const closeResetPasswordPopup = () => {
    const resetPasswordPopup = document.getElementById('resetPasswordPopup');
    resetPasswordPopup.style.display = 'none';
};


const updateSettings = async () => {
  try {
    await store.dispatch('updateSettings', user.value);
    messageSuccess.value = true;
  } catch (e) {
    console.error(e);
  }
};

const closeModal = () => {
  messageSuccess.value = false;
};

const toggleNotification = () => {
    showNotification(user.value.notifications);
  };

const showNotification = (isActive) => {
    const notificationMessage = isActive ? 'Notifications activées' : 'Notifications désactivées';
    console.log(notificationMessage);
  };

  const envoyerDemandeResetPassword = async () => {
    const resetPasswordEmail = document.getElementById('resetPasswordEmail').value;

    console.log('Demande de réinitialisation de mot de passe envoyée pour :', resetPasswordEmail);
    closeResetPasswordPopup();
};

  </script>



<template>

<div class="mb-4">
          <label for="oldPassword" class="block text-sm font-medium text-gray-600">Ancien mot de passe</label>
          <input v-model="user.password" type="password" id="oldPassword" name="oldPassword" class="mt-1 p-2 w-full border rounded-md">
        </div>
        <div class="mb-4">
          <label for="newPassword" class="block text-sm font-medium text-gray-600">Nouveau mot de passe</label>
          <input v-model="newPassword" type="password" id="newPassword" name="newPassword" class="mt-1 p-2 w-full border rounded-md">

          <div id="resetPasswordPopup" class="modal">
         <div class="modal-content p-8">
        <span class="close text-2xl font-bold" @click="closeResetPasswordPopup">&times;</span>
        <p class="text-lg font-semibold mb-4">Réinitialisation de mot de passe</p>

        <form @submit.prevent="envoyerDemandeResetPassword" class="space-y-4">
            <label for="resetPasswordEmail" class="block text-sm font-medium text-gray-600">Adresse e-mail</label>
            <input v-model="user.email" type="email" id="resetPasswordEmail" placeholder="Votre adresse e-mail" 
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-primary-500">

                <button type="submit" class="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
        Envoyer
       </button>
        </form>

        <div class="text-blue-500">
          <a href="#" class="text-sm hover:underline" @click="showResetPasswordPopup">Mot de passe oublié ?</a>
        </div>
  
    </div>
 .  </div>

        </div>
</template>