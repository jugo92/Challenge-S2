<script setup>
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useRouter, RouterLink } from 'vue-router';
import {useStore} from 'vuex';


const router = useRouter();
const store = useStore();
const showDeleteConfirmation = ref(false);
const user = ref(store.state.user || {});



const deleteAccount = () => {
  showDeleteConfirmation.value = true;
};

const disconnect = () => {
  store.dispatch('logout');
  router.push('/login');
};

const confirmDelete = () => {
    console.log('Suppression du compte');
  showDeleteConfirmation.value = false;
};

const cancelDelete = () => {
  showDeleteConfirmation.value = false;
};

onMounted(() => {
  const token = localStorage.getItem('token');

  if (token) {
    store.commit('setToken', token);

  } else {
  }
});

</script>

<template>

    <div class="h-full bg-gray-200 p-8">
        <div class="bg-white rounded-lg shadow-xl pb-8">

            <div class="text-blue-500">
                <a href="/" class="flex items-center space-x-2 px-8 py-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 hover:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10.707 3.293a1 1 0 010 1.414L6.414 9H13a7 7 0 017 7v1a1 1 0 11-2 0v-1a5 5 0 00-5-5H6.414l4.293 4.293a1 1 0 01-1.414 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="text-sm text-gray-500 hover:text-gray-600">Retour vers la page d'accueil  </span>
                </a>
            </div>
            <div class="absolute right-12 mt-4 rounded w-full mobile">
                <div class="relative">

                    <div v-if="showDeleteConfirmation" class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                    <div class="bg-white p-4 rounded-lg shadow-xl">
                        <p class="text-lg">Voulez-vous vraiment supprimer votre compte ?</p>
                        <div class="flex mt-4 justify-center">
                        <button @click="cancelDelete" class="px-4 py-2 mr-2 bg-gray-300 hover:bg-gray-400 rounded">Non</button>
                        <button @click="confirmDelete" class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded">Oui</button>
                        </div>
                    </div>
                    </div>
                     <div  class="bg-white absolute right-0 w-40 py-2 mt-1 border border-gray-200 shadow-2xl w-48 option">
                        <RouterLink to="/setting">
                            <button class="w-full flex items-center py-1.5 px-6 space-x-2 hover:bg-gray-200 radius">
                            <Icon icon="lets-icons:setting-line"  class="text-3xl"/>                
                            <span class="text-sm text-black">Paramètres</span>
                        </button>
                        </RouterLink>

                        <button @click="disconnect" class="w-full flex items-center px-6 py-1.5 space-x-2 hover:bg-gray-200 radius">
                            <Icon icon="system-uicons:exit-right" class="text-3xl"/>
                            <span class="text-sm text-black">Se déconnecter</span>
                        </button>

                        <button @click="deleteAccount" class="w-full flex items-center py-1.5 px-6 space-x-2 hover:bg-red-500 radius">
                            <Icon icon="material-symbols-light:delete-outline" class="text-3xl text-red-700" />
                            <span class="text-sm text-black">Supprimer le compte</span>
                        </button>

                        </div>
                    </div>
            </div>

            <div class="w-full h-[250px]">
                <img src="https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg" class="w-full h-full rounded-tl-lg rounded-tr-lg">
            </div>
            <div class="flex flex-col items-center -mt-20">
                <div class="flex items-center space-x-2 mt-2">
                    <p class="text-2xl text-white">{{user.firstname}}</p>
                    <span class="bg-blue-500 rounded-full p-1" title="Verified">
                        <svg xmlns="http://www.w3.org/2000/svg" class="text-gray-100 h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </span>
                </div>
               
                <p class="text-sm text-white">{{ user.zip}}, {{ user.city }}</p>
            </div>
           
        </div>

        <div class="my-4 flex flex-col 2xl:flex-row space-y-4 2xl:space-y-0 2xl:space-x-4">
            <div class="w-full flex flex-col 2xl:w-1/3">
                <div class="flex-1 bg-white rounded-lg shadow-xl p-8">
                    <h4 class="text-xl text-gray-900 font-bold">Mes informations</h4>
                    <ul class="mt-2 text-gray-700">
                        <li class="flex border-y py-2">
                            <span class="font-bold w-24">Prénom:</span>
                            <span class="text-gray-700"> {{user.firstname}}</span>
                        </li>
                        <li class="flex border-y py-2">
                            <span class="font-bold w-24">Nom:</span>
                            <span class="text-gray-700"> {{ user.lastname }}</span>
                        </li>
                       
                        <li class="flex border-b py-2">
                            <span class="font-bold w-24">Teléphone:</span>
                            <span class="text-gray-700">{{ user.phone }}</span>
                        </li>
                        <li class="flex border-b py-2">
                            <span class="font-bold w-24">Email:</span>
                            <span class="text-gray-700">{{ user.email }}</span>
                        </li>
                       
                    </ul>
                </div>
                <div class="flex-1 bg-white rounded-lg shadow-xl mt-4 p-8">
                    <h4 class="text-xl text-gray-900 font-bold">les historique de mes commandes</h4>
                    <div class="relative px-4">
                        <div class="absolute h-full border  border-dashed border-opacity-20 border-secondary"></div>

                        <div class="flex items-center w-full my-6 -ml-1.5">
                            <div class="w-1/12 z-10">
                                <div class="w-3.5 h-3.5 bg-yellow-900 animate-ping rounded-full"></div>
                            </div>
                            <div class="w-11/12">
                                <p class="text-3xl text-gray-500">En contruction ...</p>
                                <p class="text-xs text-gray-500"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
        </div>
        
    </div>

   
</template>


<style scoped>

.option{
    top: 1.5rem;
    right: 0;
    z-index: 1000;
    border-radius: 0.5rem;
    box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
}

.radius{
    border-radius: 0.5rem;
}

@media screen and (max-width: 768px) {
    .mobile{
        margin-top: -7%;
        margin-left: 30px;
    }
    
}

</style>
