
  
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
       <div class="text-blue-500">
                <a href="/" class="flex items-center space-x-2 px-8 py-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 hover:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10.707 3.293a1 1 0 010 1.414L6.414 9H13a7 7 0 017 7v1a1 1 0 11-2 0v-1a5 5 0 00-5-5H6.414l4.293 4.293a1 1 0 01-1.414 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="text-sm text-gray-500 hover:text-gray-600">Retour vers la page d'accueil  </span>
                </a>
            </div>
        <div class=" mx-auto p-8">

          <div v-if="messageSuccess" class="modal">
            <div class="modal-content">
              <span class="close" @click="closeModal">&times;</span>
              <p>Paramètres de l'utilisateur mis à jour avec succès</p>
            </div>
          </div>
          <div class="cloche"> 
            <h4 class="text-center font-bold">Activez les notifications</h4>
        <div class="mb-4"> 
                <label class="container mt-12">
                  <input type="checkbox" checked="checked" v-model="user.notifications" @change="toggleNotification" id="notification">
          
                <svg class="bell-regular" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                <path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path>
                </svg>
                <svg class="bell-solid" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"></path>
                </svg>
            </label>
          </div>

            
         
        </div>
   
      <h1 class="text-2xl font-bold mb-4 flex"><Icon icon="ant-design:setting-outlined" class="text-3xl "/>Paramètres</h1>

      <form @submit.prevent="updateSettings">
       
        <div class="mb-4">
          <label for="nom" class="block text-sm font-medium text-gray-600">Nom</label>
          <input v-model="user.firstname" type="text" id="nom" name="nom" class="mt-1 p-2 w-full border rounded-md">
        </div>
  
        <div class="mb-4">
          <label for="prenom" class="block text-sm font-medium text-gray-600">Prénom</label>
          <input v-model="user.lastname" type="text" id="prenom" name="prenom" class="mt-1 p-2 w-full border rounded-md">
        </div>
  
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-600">Email</label>
          <input v-model="user.email" type="email" id="email" name="email" class="mt-1 p-2 w-full border rounded-md">
        </div>


        <div class="mb-4">
          <label for="phone" class="block text-sm font-medium text-gray-600">Téléphone</label>
          <input v-model="user.phone" type="tel" id="phone" name="phone" class="mt-1 p-2 w-full border rounded-md">
        </div>
  
       
  
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
    </div>
</div>


        </div>
        <div class="text-blue-500">
          <a href="#" class="text-sm hover:underline" @click="showResetPasswordPopup">Mot de passe oublié ?</a>
        </div>
  
  
        <button type="submit" class="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Enregistrer</button>
      </form>
  
    
    </div>
  </template>

  
  <style scoped>
/*------ Settings ------*/
.container {
  --color: crimson;
  --size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  font-size: var(--size);
  user-select: none;
  fill: var(--color);
  margin-left: auto;
  margin-right: auto;


}

.modal-conten{
  margin-left: auto;
  margin-right: auto;
  background-color: red;
}

.input_reset{
  color: red;
}

.container .bell-regular {
  position: absolute;
  animation: keyframes-fill .5s;
  width: 20%;

}

.container .bell-solid {
  position: absolute;
  display: none;
  animation: keyframes-fill .5s;
}

/* ------ On check event ------ */
.container input:checked ~ .bell-regular {
  display: none;
}

.container input:checked ~ .bell-solid {
  display: block;
}

/* ------ Hide the default checkbox ------ */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;

}
.cloche{
    border: 1px solid rgb(231, 226, 226);
    justify-content: center;
    background-color: rgb(247, 247, 247);
    border-radius: 20px;
    width: 10%;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}

.cloche:hover{
   cursor: pointer;
   background-color: white;
}

.modal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
  padding-top: 60px;
}

.modal-content {
  background-color: #fefefe;
  margin: 5% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

/* ------ Animation ------ */
@keyframes keyframes-fill {
  0% {
    opacity: 0;
  }

  25% {
    transform: rotate(25deg);


  }

  50% {
    transform: rotate(-20deg) scale(1.2);

  }

  75% {
    transform: rotate(15deg);

  }
}

@media screen and (max-width: 480px) {
    @keyframes keyframes-fill {
  0% {
    opacity: 0;
  }

  25% {
    transform: rotate(25deg);
  


  }

  50% {
    transform: rotate(-20deg) scale(1.2);


  }

  75% {
    transform: rotate(15deg);

  }
}
    
}
  </style>
  